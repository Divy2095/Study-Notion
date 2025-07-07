const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// create SubSection
exports.createSubSection = async (req, re) => {
  try {
    // Fetch data from req body
    const { sectionId, title, timeDuration, description } = req.body;

    // Extract file/video
    const video = req.files.videoFile;

    // Validation
    if (!sectionId || !title || !timeDuration || !description || !video) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Upload video to cloudinary
    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );

    // Create a SubSection
    const subSectionDetails = await SubSection.create({
      title: title,
      timeDuration: timeDuration,
      description: description,
      videoUrl: uploadDetails.secure_url,
    });

    // Update Section with this Subsection ObjectId
    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      { $push: { subSection: subSectionDetails._id } },
      { new: true }
    );
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
};

// HW: updateSubSection

// HW: deleteSubSection

// GoThrough

exports.updateSubsection = async (req, res) => {
  try {
    //get data
    const { sectionId, title, timeDuration, description } = req.body;
    //extract file/video
    const video = req.files.videoFile;
    //validation
    if (!sectionId || !title || !timeDuration || !description || !video) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    //find profile
    const sectionDetails = await SubSection.findById(sectionId);
    const subsectionId = sectionDetails.additionalDetails;
    const subsectionDetails = await SubSection.findById(subsectionId);

    //update profile
    subsectionDetails.title = title;
    subsectionDetails.timeDuration = timeDuration;
    subsectionDetails.description = description;
    subsectionDetails.video = video;
    await subsectionDetails.save();
    //return response
    return res.status(200).json({
      success: true,
      message: "subsection update success",
      subsectionDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "update subsection error",
      error: error.message,
    });
  }
};
//deleteSubsection

exports.deleteSubsection = async (req, res) => {
  // try{
  //     //get id
  //     const{subSectionId,sectionId}=req.body;
  //     console.log(sectionId);
  //     const sectionDetails=await SubSection.findById(sectionId);
  //     console.log("sectionDetail",sectionDetails);
  //  //   const subsectionId=sectionDetails.additionalDetails;
  //    // const id=subsectionId;
  //     //validation
  //     console.log("subsectionId",subSectionId);
  //     const id=subSectionId
  //     const SubsectionDetails=await SubSection.findById(id);
  //     console.log("subsectiondetail:",SubsectionDetails);
  //     if(!SubsectionDetails){
  //         return res.status(404).json({
  //             success:false,
  //             message:'subSection not Found',
  //         });
  //     }

  //     console.log("subsection.addition",SubsectionDetails.additionalDetails)
  //     //delete subsection
  //     await SubSection.findByIdAndDelete({_id:subSectionId});

  //     //delete susection
  //     await SubSection.findByIdAndDelete({_id:id});
  //     //return response
  //     return res.status(200).json({
  //         success:true,
  //         message:'subsection delete success',
  //     })

  // }
  try {
    const { subSectionId, sectionId } = req.body;
    console.log("subsectionid", subSectionId);
    console.log("sectionid", sectionId);
    await Section.findByIdAndUpdate(sectionId, {
      $pull: { subSection: subSectionId },
    });

    const subsection = await SubSection.findById(subSectionId);
    console.log("subsection", subsection);
    if (!subsection) {
      return res
        .status(404)
        .json({ success: false, message: "subSection not Found" });
    }

    //delete sub section

    await SubSection.findByIdAndDelete(subSectionId);

    //find the updated course and return
    const section = await Section.findById(sectionId)
      .populate({
        //here there is no use of const course , its only store updated course;
        path: "subSection",
      })
      .exec();

    res.status(200).json({
      success: true,
      message: "Subsection deleted",
      data: section,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Subsection cannot be deleted successfully",
    });
  }
};



exports.getsubSectionDetails=async(req,res)=>{
  console.log("hello from get sub Section data");
  try{
         //get id
         const {subSectionId}=req.params;
         console.log(subSectionId);
         //find course details
         const subSectionDetails=await SubSection.find(
          {_id:subSectionId})
          .populate("title")
        // .populate("ratingAndreviews")
        .populate("description")
        .populate("timeDuration")
        .populate("videoUrl")
          .exec();
console.log("sub section:",subSectionDetails);
          //validation
          if(!subSectionDetails){
              return res.status(400).json({
                  success:false,
                  message:`could not find the subSection with ${subSectionId}`,
              })
          }
          //return response
          return res.status(200).json({
              success:true,
              message:"subSection Details fetched Successfully",
              data:subSectionDetails,
          })
         
  }
  catch(error){
         console.log(error);
         return res.status(500).json({
          success:false,
          message:error.message,
         })
  }
}