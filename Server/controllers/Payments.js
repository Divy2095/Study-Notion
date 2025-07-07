const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const mongoose = require("mongoose");
const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail");
const crypto = require("crypto");

// capture the payment and initiate the Razorpay order
exports.capturePayment = async (req, res) => {
  // get CourseId and UserId
  const { course_id } = req.body;
  const userId = req.user.id;

  // Validation
  if (!course_id) {
    return res.json({
      success: false,
      message: "Please provide valid course ID.",
    });
  }

  // valid CourseId

  // valid courseDetail
  let course;
  try {
    course = await Course.findById(course_id);
    if (!course) {
      return res.json({
        success: false,
        message: "Could not find the course.",
      });
    }

    // user already pay for the same course
    const uid = new mongoose.Types.ObjectId(userId);
    if (course.studentEnrolled.includes(uid)) {
      return res.status(200).json({
        success: false,
        message: "Student is already enrolled",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }

  // order create
  const amount = course.price;
  const currency = "INR";
  const options = {
    amount: amount * 100,
    currency,
    receipt: Math.random(Date.now()).toString(),
    notes: {
      courseId: course_id,
      userId,
    },
  };

  try {
    // initiate the payment using razorpay
    const paymentResponse = await instance.orders.create(options);
    console.log(paymentResponse);

    return res.status(200).json({
      success: true,
      courseName: course.courseName,
      courseDescription: course.courseDescription,
      thumbnail: course.thumbnail,
      orderId: paymentResponse.id,
      currency: paymentResponse.currency,
      amount: paymentResponse.amount,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Could not initiate order.",
    });
  }

  // return res
};

exports.verifyPayment = async (req, res) => {
  const razorpay_order_id = req.body?.razorpay_order_id;
  const razorpay_payment_id = req.body?.razorpay_payment_id;
  const razorpay_signature = req.body?.razorpay_signature;
  const courses = req.body?.courses;
  const userId = req.user.id;

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !courses ||
    !userId
  ) {
    return res.status(200).json({ success: false, message: "Payment Failed" });
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    await enrollStudents(courses, userId, res); //enroll karwao student ko
    return res.status(200).json({ success: true, message: "Payment Verified" }); //return res
  }
  return res.status(200).json({ success: "false", message: "Payment Failed" });
};

// verify Signature of Razorpay and server
exports.verifySignature = async (req, res) => {
  const webhookSecret = "12345678";
  const signature = req.headers("x-razorpay-signature");
  const shasum = crypto.createHmac("sha256", webhookSecret); // crypto is not imported
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  if (signature === digest) {
    console.log("Payment is Authorised");

    const { courseId, userId } = req.body.payload.payment.entity.notes;

    try {
      // Fullfill the action
      // Find the course and enroll the student in it
      const enrolledCourse = await Course.findByIdAndUpdate(
        { _id: courseId },
        { $push: { studentEnrolled: userId } },
        { new: true }
      );

      if (!enrolledCourse) {
        return res.status(500).json({
          success: false,
          message: "Course not found.",
        });
      }
      console.log(enrolledCourse);

      // Find the Student and add the course to their list enrolled course
      const enrolledStudent = await User.findOneAndUpdate(
        { _id: userId },
        { $push: { courses: courseId } },
        { new: true }
      );
      console.log(enrolledStudent);

      // Send mail
      const emailResponse = await mailSender(
        enrolledStudent.email,
        "Congratulations from codeDIV",
        "Congratulations, you are onboarded into new codeDIV course"
      );
      console.log(emailResponse);
      return res.status(200).json({
        success: true,
        message: "Signature Verified and Course Added.",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  } else {
    return res.status(400).json({
      success: false,
      message: "Invalid request.",
    });
  }
};


exports.sendPaymentSuccessEmail = async(req, res) => {
    const {orderId, paymentId, amount,courseId} = req.body;

    const userId = req.user.id;


    if(!orderId || !paymentId || !amount || !userId) {
        return res.status(400).json({success:false, message:"Please provide all the fields"});
    }

    try{
        //student ko dhundo
        const enrolledStudent = await User.findById(userId);
        await mailSender(
            enrolledStudent.email,
            `Payment Recieved`,
             paymentSuccessEmail(`${enrolledStudent.firstName}`,
             amount/100,orderId, paymentId)
        )
        //ad purchase history
        
        const purchasehistory=await PurchaseHistory.create({
            courseID:courseId,
            userId:userId,
            paymentId:paymentId,
            orderId:orderId
        })
        const purchase_history = await User.findByIdAndUpdate(userId,  {$push:{ purchaseHistory:purchasehistory._id, }},{new:true})
          console.log("purchasehistory",purchase_history);
    }
    catch(error) {
        console.log("error in sending mail", error)
        return res.status(500).json({success:false, message:"Could not send email"})
    }
}