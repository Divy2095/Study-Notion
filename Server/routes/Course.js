const express = require("express")
const router = express.Router()

//Route for :- createCourse , Section(add, update, delete) , Subsection(add, update, delete), getAllCourses, getCoursesDetails;
//Route for :- createCategory , showAllCategories , getCategoryPageDetails
//Route for :-  createRating , getAverageRating , getReviews
//Route for :- updateCourseProgress

 
const {createCourse,  getCourseDetails,showAllCourses ,editCourse,getInstructorCourses,deleteCourse,getFullCourseDetails} = require("../controllers/Course")               // Course Controllers Import
const {showAllcategory, createCategory, categoryPageDetails } = require("../controllers/Category")      // Categories Controllers Import
const {createSection, updateSection,  deleteSection,getSectionDetails } = require("../controllers/Section")                // Sections Controllers Import
const {createSubSection, updateSubsection,  deleteSubsection,getsubSectionDetails } = require("../controllers/SubSection")     // Sub-Sections Controllers Import
const {createRating,  getAverageRating, getAllRating, } = require("../controllers/RatingAndReview")        // Rating Controllers Import
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth")      
const {updateCourseProgress } = require("../controllers/courseProgress");                    // Importing Middlewares
// const {updateCourseProgress } = require("../controllers/CourseProgress");


// ********************************************************************************************************
//                                      Course routes (only by Instructors)                               *
// ********************************************************************************************************
router.post("/createCourse", auth, isInstructor, createCourse)                            // Courses can Only be Created by Instructors
router.post("/createSection", auth, isInstructor, createSection)                            //Add a Section to a Course
router.post("/updateSection", auth, isInstructor, updateSection)                         // Update a Section
router.post("/deleteSection", auth, isInstructor, deleteSection)                         // Delete a Section
router.post("/updateSubSection", auth, isInstructor, updateSubsection)                   // Edit Sub Section
router.post("/deleteSubSection", auth, isInstructor, deleteSubsection)
router.post("/addSubSection", auth, isInstructor, createSubSection)
router.get("/getSectionDetails/:sectionId",auth,isInstructor,getSectionDetails);
router.get("/getAllCourses", showAllCourses)                                               // Get all Registered Courses
router.get("/getCourseDetails/:courseId", getCourseDetails)  
router.get("/getsubSectionDetails/:subSectionId",auth,getsubSectionDetails); 
router.get("/getInstructorCourses",auth,isInstructor,getInstructorCourses);
router.delete("/deleteCourse",auth,isInstructor,deleteCourse)
router.post("/getFullCourseDetails/:courseId",auth,isInstructor,getFullCourseDetails);
//Add by me 
// router.post("/createCategory",auth,isAdmin,createCategory);  
// router.post("/editCourse",editCourse)

// router.get("/showAllcategory",auth,isInstructor,showAllcategory);                                    // Get Details for a Specific Courses

// router.post("/getFullCourseDetails", auth, showAllCourses)
// router.post("/editCourse", auth, isInstructor, editCourse)                              // Edit Course routes
// router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)           // Get all Courses Under a Specific Instructor
// router.delete("/deleteCourse", deleteCourse)                                            // Delete a Course
// router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);



// ********************************************************************************************************
//                                      Category routes (Only by Admin)                                   *
// ********************************************************************************************************
router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories", showAllcategory)
router.post("/getCategoryPageDetails", categoryPageDetails)
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);



// ********************************************************************************************************
//                                      Rating and Review (only by Student)                               *
// ********************************************************************************************************
router.post("/createRating", auth, isStudent, createRating)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRating)


module.exports = router