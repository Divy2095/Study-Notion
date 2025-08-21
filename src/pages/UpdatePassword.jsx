import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../services/operations/authAPI";
import { useLocation } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link } from "react-router-dom";

const UpdatePassword = () => {
  const { formData, setFormData } = useState({
    password: "",
    confirmPassword: "",
  });
  const dispatch = useDispatch();
  const { showPassword, setShowPassword } = useState(false);
  const { showConfirmPassword, setShowConfirmPassword } = useState(false);
  const { loading } = useSelector((state) => state.auth);
  const { password, confirmPassword } = formData;
  const location = useLocation();

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const token = location.pathname.split("/").at(-1);
    dispatch(resetPassword(password, confirmPassword, token));
  };
  return (
    <div className="text-white">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <h1>Choose new passowrd</h1>
          <p>Almost done. Enter your new password and your all set.</p>
          <form action="" onSubmit={handleOnSubmit}>
            <label htmlFor="">
              <p>New Password*</p>
              <input
                required
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                placeholder="Password"
                onChange={handleOnChange}
                className="w-full p-6 bg-richblack-600 text-richblack-5"
              />
              <span onClick={() => setShowPassword((prev) => !prev)}>
                {showPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} />
                ) : (
                  <AiOutlineEye fontSize={24} />
                )}
              </span>
            </label>

            <label htmlFor="">
              <p>Confirm New Password*</p>
              <input
                required
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                placeholder="Confirm Password"
                onChange={handleOnChange}
                className="w-full p-6 bg-richblack-600 text-richblack-5"
              />
              <span onClick={() => setShowConfirmPassword((prev) => !prev)}>
                {showConfirmPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} />
                ) : (
                  <AiOutlineEye fontSize={24} />
                )}
              </span>
            </label>
            <button type="submit">Reset Password</button>
          </form>
          <div>
            <Link to="/login">
              <p>Back to Login</p>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdatePassword;
