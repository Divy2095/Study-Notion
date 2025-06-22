const Course = require("../models/Course");
const Tag = require("../models/Tags");
const User = require("../models/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader");

// createCourse handler function
exports.createCourse = async (req,res) => {
    try {
        // Fetch data
        const {courseName, courseDescription, whatYouWillLearn, price, tag} = req.body;

        // get Thumbnail
        const thumbnail = req.files.thumbnailImage;

        // Validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !thumbnail) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Check for instructor
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        console.log("Instructor Details: ",instructorDetails);
        // TODO: Verify that userId and instructorDetails._id are same or different.

        if(!instructorDetails) {
            return res.status(404).json({
                success: false,
                message: "Instructor details not found",
            });
        }

        // check given tag is valid or not
        const tagDetails = await Tag.findById(tag);
        if(!tagDetails) {
            return res.status(404).json({
                success: false,
                message: "Tag details not found",
            });
        }

        // Upload image to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail , process.env.FOLDER_NAME);
        
        // Create an entry for new course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            price,
            tag: tagDetails._id,
            thumbnail: thumbnailImage.secure_url,
        })

        // Add the new course to the user schema of instructor
        await User.findByIdAndUpdate(
            {_id: instructorDetails._id},
            {
                $push: {
                    courses: newCourse._id,
                }
            },{new: true},
        );

        // Update the tag schema
        // Homework

        // Return res
        return res.status(200).json({
            success: true,
            message: "Course created successfully.",
            data: newCourse,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to create course",
            error: error.message,
        })
    }
}

// getAllCourses handler function
exports.showAllCourses = async (req,res) => {
    try {
        const allCourses = await Course.find({} , 
            {
                courseName:true, 
                price:true, 
                thumbnail:true, 
                instructor:true, 
                ratingAndReviews:true, 
                studentEnrolled:true
            }).populate("instructor").exec();

        return res.status(200).json({
            success: true,
            message: "Data for all courses fetched successfully",
            data: allCourses,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Can't fetch data.",
            error: error.message,
        });
    }
}