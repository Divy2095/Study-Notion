const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
require("dotenv").config();
const { passwordUpdated} = require("../mail/templates/passwordUpdate");
const Profile = require("../models/Profile");

// Send OTP
exports.sendOTP = async (req,res) => {
    try {
        // fetch email from req body
        const { email } = req.body;

        // check if user already exist
        const checkUserPresent = await User.findOne({email});
        if(checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: "User already registered.",
            });
        }

        // Generate OTP
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        console.log("OTP generated: ", otp);

        // Check Unique OTP or not
        const result = await OTP.findOne({otp: otp});
        while(result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            result = await OTP.findOne({otp: otp});
        }

        const otpPayload = {email, otp};
        // create an entry for OTP
        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);

        // return response
        res.status(200).json({
            success: true,
            message: "OTP sent successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}


// Sign Up
exports.signUp = async (req,res) => {
    try {
        // Fetch data from req body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp,    
        } = req.body;

        // Validate data
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(403).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Match both password
        if(password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match. Please check again!",
            });
        }

        // Check user already exist or not
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists. Please login.",
            });
        }

        // Find most recent OTP for user
        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log("Recent OTP: ", recentOtp);

        // Validate OTP
        if(recentOtp.length == 0) {
            // OTP not found
            return res.status(400).json({
                success: false,
                message: "OTP not found",
            });
        } else if(otp !== recentOtp.otp) {
            // Invalid OTP
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create entry in DB
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        });

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType,
            additionalDetails: profileDetails,
            image: `https://api.dicebear.com/9.x/initials/svg?seed=${firstName} ${lastName}`,
        })

        // return res
        return res.status(200).json({
            success: true,
            message: "User is registered successfull",
            user,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "User can't be registered. Please try again.",
        })
    }
}


// Login
exports.login = async (req,res) => {
    try {
        // Get data from req body
        const { email, password } = req.body;

        // Validation of Data
        if(!email || !password) {
            return res.status(403).json({
                success: false,
                message: "All fields are required.",
            });
        }

        // Check User exist or not
        const user = await User.findOne({ email }).populate("additionalDetails");
        if(!user) {
            return res.status(401).json({
                success: false,
                message: "User is not registered, Please Sign Up first.",
            });
        }

        // Generate JWT token , after matching password
        if(await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
            });
            user.token = token;
            user.password = undefined;

            // Create cookie and send res
            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly: true,
            }
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "Logged in Successfully",
            });
        } else {
            return res.status(401).json({
                success: false,
                message: "Password is incorrect",
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Login failure, Please try again!",
        });
    }
}


// change Password
// TODO: HomeWork -------------------------------------------------------------
exports.changePassword = async (req,res) => {
    try {
        // Get data from req body
        const {password , newPassword, confirmPassword} = req.body;
        
        // Get user
        const user = await User.findById(req.user.id);

        // Validation
        if(!password || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the fields",
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Password is incorrect.",
            });
        }

        if(newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "New and Confirm password do not match",
            });
        }

        // Update Password in DB
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();

        // Send mail - Password Updated
        await mailSender(user.email, "Password Changed!", "Your Password Changed successfully.");

        // return response
        return res.status(200).json({
            success: true,
            message: "Password Changed Successfully.",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error while changing password.",
        });
    }
}