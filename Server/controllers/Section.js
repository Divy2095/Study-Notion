const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async (req, res) => {
  try {
    // data fetch
    const { sectionName, courseId } = req.body;

    // Data Validation
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Missing propeties.",
      });
    }

    // Create Section
    const newSection = await Section.create({ sectionName });

    // Update course with section ObjectId
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: { courseContent: newSection._id },
      },
      { new: true }
    );
    // HW: Use populate to replace sections subsections both in the updatedCourseDetails

    // return response
    return res.status(200).json({
      success: true,
      message: "Section created successfully.",
      updatedCourseDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to create section, please try again.",
      error: error.message,
    });
  }
};

exports.updateSection = async (req, res) => {
  try {
    // Data input
    const { sectionName, sectionId } = req.body;

    // Data Validation
    if (!sectionName || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "Missing properties.",
      });
    }

    // Update Data
    const section = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );

    // return res
    return res.status(200).json({
      success: true,
      message: "Section updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to create section, please try again.",
      error: error.message,
    });
  }
};

exports.deleteSection = async (req, res) => {
  try {
    // Get id
    const { sectionId } = req.params;

    // use findByIdAndDelete
    await Section.findByIdAndDelete(sectionId);

    // return res
    return res.status(200).json({
      success: true,
      message: "Section deleted Successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to delete section, please try again.",
      error: error.message,
    });
  }
};


// GoThrough
exports.getSectionDetails = async (req, res) => {
  console.log("hello from get Section data");
  try {
    //get id
    const { sectionId } = req.params;
    console.log(sectionId);
    //find course details
    const sectionDetails = await Section.find({ _id: sectionId })
      .populate("sectionName")
      // .populate("ratingAndreviews")
      .populate({
        path: "subSection",
        model: "SubSection", // replace 'SubSection' with your actual SubSection model name
      })
      .exec();
    console.log(sectionDetails);
    //validation
    if (!sectionDetails) {
      return res.status(400).json({
        success: false,
        message: `could not find the section with ${sectionId}`,
      });
    }
    //return response
    return res.status(200).json({
      success: true,
      message: "Section Details fetched Successfully",
      data: sectionDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
