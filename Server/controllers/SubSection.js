const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// create SubSection
exports.createSubSection = async (req,re) => {
    try {
        // Fetch data from req body
        const {sectionId, title, timeDuration, description} = req.body;

        // Extract file/video
        const video = req.files.videoFile;

        // Validation
        if(!sectionId || !title || !timeDuration || !description || !video) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
        }

        // Upload video to cloudinary
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);

        // Create a SubSection
        const subSectionDetails = await SubSection.create({
            title: title,
            timeDuration: timeDuration,
            description: description,
            videoUrl: uploadDetails.secure_url,
        })

        // Update Section with this Subsection ObjectId
        const updatedSection = await Section.findByIdAndUpdate({_id:sectionId},
            {$push:{subSection:subSectionDetails._id}},
            {new:true},);
        // HW log updated section here, after adding populate quary

        // return res
        return res.status(200).json({
            success: true,
            message: "Sub Section created successfully.",
            updatedSection,
        });
    } catch (error) {
        return res.status(500).json({
            success: true,
            message: "Internal Server Error.",
            error: error.message,
        });
    }
} 


// HW: updateSubSection

// HW: deleteSubSection