import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getPasswordResetToken } from "../services/operations/authAPI";

const ForgotPassword = () => {
  const { emailSent, setEmailSent } = useState(false);
  const { email, setEmail } = useState("");
  const { loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleOnSubmit = (e) => {
    e.preventDefault();
    dispatch(getPasswordResetToken(email, setEmailSent));
  };
  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="max-w-[500px] p-4 lg:p-8">
          <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
            {!emailSent ? "Reset Your Password" : "Check Your Email"}
          </h1>
          <p className="my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100">
            {!emailSent
              ? "Have no fear, We'll email you instructions to reset your password. If you don't have access to your email we can try account recovery"
              : `We have sent the reset email to ${email}`}
          </p>
          <form
            onSubmit={handleOnSubmit}
            className="mt-6 flex flex-col gap-y-4"
          >
            {!emailSent && (
              <label className="w-full">
                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                  Email Address <sup className="text-pink-200">*</sup>
                </p>
                <input
                  required
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="form-style w-full rounded-lg bg-richblack-800 p-3 text-[16px] leading-[24px] text-richblack-5 shadow-[0_1px_0_0] shadow-white/50 placeholder:text-richblack-400"
                  style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                  }}
                />
              </label>
            )}
            <button
              type="submit"
              className="mt-6 rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900 transition-all duration-200 hover:scale-95"
            >
              {!emailSent ? "Reset Password" : "Resend Email"}
            </button>
          </form>
          <div className="mt-6 flex items-center justify-between">
            <Link to="/login">
              <p className="flex items-center gap-x-2 text-richblack-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
                Back to Login
              </p>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;