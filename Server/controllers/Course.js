const Course = require("../models/Course");
const Tag = require("../models/Tags");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// createCourse handler function
exports.createCourse = async (req, res) => {
  try {
    // Fetch data
    const { courseName, courseDescription, whatYouWillLearn, price, tag } =
      req.body;

    // get Thumbnail
    const thumbnail = req.files.thumbnailImage;

    // Validation
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag ||
      !thumbnail
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check for instructor
    const userId = req.user.id;
    const instructorDetails = await User.findById(userId);
    console.log("Instructor Details: ", instructorDetails);
    // TODO: Verify that userId and instructorDetails._id are same or different.

    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor details not found",
      });
    }

    // check given tag is valid or not
    const tagDetails = await Tag.findById(tag);
    if (!tagDetails) {
      return res.status(404).json({
        success: false,
        message: "Tag details not found",
      });
    }

    // Upload image to cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    // Create an entry for new course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn: whatYouWillLearn,
      price,
      tag: tagDetails._id,
      thumbnail: thumbnailImage.secure_url,
    });

    // Add the new course to the user schema of instructor
    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
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
    });
  }
};

// getAllCourses handler function
exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      {},
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentEnrolled: true,
      }
    )
      .populate("instructor")
      .exec();

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
};

// getCourseDetails
exports.getCourseDetails = async (req, res) => {
  try {
    // get Id
    const { courseId } = req.body;

    // find Course Details
    const courseDetails = await Course.find({ _id: courseId })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    // Validation
    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find the course with ${courseId}`,
      });
    }

    // return res
    return res.status(200).json({
      success: true,
      message: "Course Details fetched successfully.",
      data: courseDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Go Through from here 
exports.showAllCourses=async(req,res)=>{
    try{
          const allCourses=await Course.find({});
        

return res.status(200).json({
    success:true,
    message:'Data for all course fetch successfully',
    data:allCourses,
})
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
          success:false,
          message:'Failed to create new course',
          error:error.message,
        })
    }
}

exports.getInstructorCourses = async (req, res) => {
    try {
        const instructorId = req.user.id; // Get the instructor ID from the authenticated user or request body
  
        // Find all courses belonging to the instructor
        const instructorCourses = await Course.find({ instructor: instructorId }).sort({ createdAt: -1 });
        
        // Return the instructor's courses
        res.status(200).json({                     
            success: true,
            data: instructorCourses,
        });
    } catch (error) {
        // If an error occurs, send an error response
        res.status(500).json({
            success: false,
            message: "Failed to retrieve instructor courses",
            error: error.message,
        });
    }
};


exports.deleteCourse = async (req, res) => {
    try {
      const { courseId } = req.body
      
      const course = await Course.findById(courseId)                     // Find the course
      if(!course){
        return res.status(404).json({ message: "Course not found" })
      }
  
      const studentsEnrolled = course.studentsEnrolled                   // Unenroll students from the course
      for(const studentId of studentsEnrolled){
        await User.findByIdAndUpdate(studentId, {$pull: { courses: courseId },})
      }
  
      const courseSections = course.courseContent                   // Delete sections and sub-sections
      for(const sectionId of courseSections) {
        const section = await Section.findById(sectionId)             // Delete sub-sections of the section
        if(section) {
          const subSections = section.subSection
          for (const subSectionId of subSections) {
            await SubSection.findByIdAndDelete(subSectionId)
          }
        }
        await Section.findByIdAndDelete(sectionId)           // Delete the section
      }
  
      await Course.findByIdAndDelete(courseId)                  // Delete the course
  
      return res.status(200).json({
        success: true,
        message: "Course deleted successfully",
      })
    }
     catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      })
    }
  }  


  exports.getFullCourseDetails = async (req, res) => {
    try {
      const { courseId } = req.params
      const userId = req.user.id
      console.log("courseId",courseId);
      console.log("userId",userId);
      const courseDetails = await Course.findOne({ _id: courseId, })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();
                          console.log("courseDetails",courseDetails);
  
      let courseProgressCount = await CourseProgress.findOne({courseID: courseId,  userId: userId,})

      console.log("courseProgressCount",courseProgressCount);
  
      if(!courseDetails){
        return res.status(400).json({
          success: false,
          message: `Could not find course with id: ${courseId}`,
        })
      }
  
      let totalDurationInSeconds = 0
      courseDetails.courseContent.forEach((content) => {
        content.subSection.forEach((subSection) => {
          const timeDurationInSeconds = parseInt(subSection.timeDuration)
          totalDurationInSeconds += timeDurationInSeconds
        })
      })
  
      const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

      console.log("totalDuration:",totalDuration);
  
      return res.status(200).json({
        success: true,
        data: {
          courseDetails,
          totalDuration,
          completedVideos: courseProgressCount?.completedVideos ? courseProgressCount?.completedVideos : [], 
        },
      })
    } 
    catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }