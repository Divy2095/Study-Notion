const Profile = require("../models/Profile");
const User = require("../models/User");

exports.updateProfile = async (req, res) => {
  try {
    // get data
    const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;

    // get userId
    const id = req.user.id;

    // Validation
    if (!contactNumber || !gender || !id) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // find profile
    const userDetails = await User.findById(id);
    const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findById(profileId);

    // update profile
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.gender = gender;
    profileDetails.contactNumber = contactNumber;
    await profileDetails.save();

    // return res
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      profileDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while updating profile.",
      error: error.message,
    });
  }
};

// deleteAccount
exports.deleteAccount = async (req, res) => {
  try {
    // get Id
    const id = req.user.id;

    // validation
    const userDetails = await User.findById(id);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // delete user profile
    await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails });
    // TODO HW Unenroll user from all enrolled courses.

    // delete user
    await User.findByIdAndDelete({ _id: id });

    // return res
    return res.status(200).json({
      success: true,
      message: "Profile deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while deleting account.",
      error: error.message,
    });
  }
};

exports.getAllUserDetails = async (req, res) => {
  try {
    // get id
    const id = req.user.id;

    // Validation & get user details
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();

    // return res
    return res.status(200).json({
      success: true,
      message: "User data fetched successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
