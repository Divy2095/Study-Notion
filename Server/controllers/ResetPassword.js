const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

exports.resetPasswordToken = async (req,res) => {
    try {
        // Get email from req body
        const email = req.body.email;

        // Check user for this email
        const user = await User.findOne({email: email});
        if(!user) {
            return res.json({
                success: false,
                message: "Your email is not registered with us.",
            });
        }

        // Generate token
        const token = crypto.randomUUID();

        // Update user by adding token and expiration time
        const updatedDetails = await User.findOneAndUpdate({email: email},{
            token: token,
            resetPasswordExpires: Date.now() + 5*60*1000,
        },{ new:true });

        // Create URL
        const url = `http://localhost:3000/update-password/${token}`;

        // Send mail containg URL
        await mailSender(email, "Password reset Link", `Password reset Link:${url}`);

        // return res
        return res.json({
            success: true,
            message: "Email sent successfully, Please check again and reset password.",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while sending the reset email.",
        });
    }
}


// resetPassword
exports.resetPassword = async (req,res) => {
    try {
        // Fetch data
        const {password, confirmPassword, token} = req.body;

        // Validation
        if(password !== confirmPassword) {
            return res.json({
                success: false,
                message: "Please enter valid password.",
            });
        }

        // Get userDetails from DB using token
        const userDetails = await User.findOne({token: token}); //user or User

        // if not entry => Invalid token
        if(!userDetails) {
            return res.json({
                success: false,
                message: "Token is invalid.",
            });
        }

        // Check token time
        if(userDetails.resetPasswordExpires < Date.now()) {
            return res.json({
                success: false,
                message: "Token is expired, please regenerate your token",
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update password
        await User.findOneAndUpdate(
            {token: token},
            {password:hashedPassword},
            {new:true},
        )

        // return response
        return res.status(200).json({
            success: true,
            message: "Password reset successfully.",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while resetting the password.",
        });
    }
}