const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");

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
        const result = await otp.findOne({otp: otp});
        while(result) {
            otp = otpGenerator(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            result = await otp.findOne({otp: otp});
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