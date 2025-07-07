const express = require("express")
const router = express.Router()


// Routes for deleteprofile , updateprofile ,getuserdetails , getEnrolledCourse , updateDisplayPicture;


const { auth, isInstructor } = require("../middlewares/auth")
const {deleteAccount, updateProfile, getAllUserDetails} = require("../controllers/Profile")
//    , updateDisplayPicture,  getEnrolledCourses, instructorDashboard,
    
// ********************************************************************************************************
//                                      Profile routes                                                    *
// ********************************************************************************************************
router.delete("/deleteProfile", auth, deleteAccount)                        // Delet User Account
router.put("/updateProfile", auth, updateProfile)
router.get("/getUserDetails", auth, getAllUserDetails)
// router.get("/getEnrolledCourses", auth, getEnrolledCourses)                  // Get Enrolled Courses
// router.put("/updateDisplayPicture", auth, updateDisplayPicture)
// router.get("/instructorDashboard", auth, isInstructor, instructorDashboard);


module.exports = router

 