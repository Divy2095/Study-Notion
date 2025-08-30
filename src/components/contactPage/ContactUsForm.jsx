import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { apiConnector } from "../../services/apiconnector";
import { contactusEndpoint } from "../../services/apis";
import CountryCode from "../../data/countrycode.json";

const ContactUsForm = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm();

  const submitContactForm = async (data) => {
    console.log("logging Data", data);
    try {
      setLoading(true);
      // const response = await apiConnector("POST", contactusEndpoint.CONTACT_US_API, data);
      const response = { status: "OK" };
      console.log("Logging response", response);
      setLoading(false);
    } catch (error) {
      console.log("Error:", error.message);
      setLoading(false);
    }
  };
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        email: "",
        firstname: "",
        lastname: "",
        message: "",
        phoneNo: "",
      });
    }
  }, [reset, isSubmitSuccessful]);
  return (
    <form
      onSubmit={handleSubmit(submitContactForm)}
      action=""
      className="flex flex-col gap-7 w-full"
    >
      <div className="flex flex-col gap-5 lg:flex-row">
        {/* firstName */}
        <div className="flex flex-col gap-2 lg:w-[48%]">
          <label
            htmlFor="firstname"
            className="text-richblack-5 text-[0.875rem]"
          >
            First Name<sup className="text-pink-200">*</sup>
          </label>
          <input
            type="text"
            name="firstname"
            id="firstname"
            placeholder="Enter first name"
            {...register("firstname", { required: true })}
            style={{
              boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
            }}
            className="form-style w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
          />
          {errors.firstname && <span>Please enter your name</span>}
        </div>

        {/* lastname */}
        <div className="flex flex-col gap-2 lg:w-[48%]">
          <label
            htmlFor="lastname"
            className="text-richblack-5 text-[0.875rem]"
          >
            Last Name<sup className="text-pink-200">*</sup>
          </label>
          <input
            type="text"
            name="lastname"
            id="lastname"
            placeholder="Enter last name"
            style={{
              boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
            }}
            className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
            {...register("lastname")}
          />
        </div>
      </div>
      {/* email */}
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-richblack-5 text-[0.875rem]">
          Email Address<sup className="text-pink-200">*</sup>
        </label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter Email Address"
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
          className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
          {...register("email", { required: true })}
        />
        {errors.email && <span>Please enter your email address</span>}
      </div>

      {/* Phone Number */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="phonenumber"
          className="text-richblack-5 text-[0.875rem]"
        >
          Phone Number<sup className="text-pink-200">*</sup>
        </label>
        <div className="flex gap-5">
          {/* dropdown */}
          <div className="flex w-[81px] flex-col gap-2">
            <select
              name="dropdown"
              id="dropdown"
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
              {...register("countrycode", { required: true })}
            >
              {CountryCode.map((element, index) => {
                return (
                  <option value={element} key={index}>
                    {element.code} - {element.country}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex w-full flex-col gap-2">
            <input
              type="number"
              name="phonenumber"
              id="phonenumber"
              placeholder="12345 67890"
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
              {...register("phoneNo", {
                required: { value: true, message: "Please enter Phone number" },
                maxLength: { value: 10, message: "Invalid Phone number" },
                minLength: { value: 10, message: "Invlaid Phone number" },
              })}
            />
          </div>
        </div>
        {errors.phoneNo && <span>{errors.phoneNo.message}</span>}
      </div>

      {/* message */}
      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-richblack-5 text-[0.875rem]">
          Message<sup className="text-pink-200">*</sup>
        </label>
        <textarea
          name="message"
          id="message"
          cols={30}
          rows={7}
          placeholder="Enter your message here"
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
          className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
          {...register("message", { required: true })}
        />
        {errors.message && <span>Please enter your message</span>}
      </div>

      <button
        disabled={loading}
        type="submit"
        className={`rounded-md bg-yellow-50 px-6 py-3 text-center text-[16px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] 
          ${
            !loading &&
            "transition-all duration-200 hover:scale-95 hover:shadow-none"
          }
          disabled:bg-richblack-500 disabled:text-richblack-300
          sm:text-[16px] sm:px-6
        `}
      >
        Send Message
      </button>
    </form>
  );
};

export default ContactUsForm;
