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
    <form onSubmit={handleSubmit(submitContactForm)} action="">
      <div className="flex gap-5">
        {/* firstName */}
        <div className="flex flex-col">
          <label htmlFor="firstname">First Name</label>
          <input
            type="text"
            name="firstname"
            id="firstname"
            placeholder="Enter first name"
            {...register("firstname", { required: true })}
          />
          {errors.firstname && <span>Please enter your name</span>}
        </div>

        {/* lastname */}
        <div className="flex flex-col">
          <label htmlFor="lastname">Last Name</label>
          <input
            type="text"
            name="lastname"
            id="lastname"
            placeholder="Enter last name"
            {...register("lastname")}
          />
        </div>
      </div>
      {/* email */}
      <div className="flex flex-col">
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter Email Address"
          {...register("email", { required: true })}
        />
        {errors.email && <span>Please enter your email address</span>}
      </div>

      {/* Phone Number */}
      <div className="flex flex-col gap-x-10">
        <label htmlFor="phonenumber">Phone Number</label>
        <div className="flex flex-row gap-5 m-7">
          {/* dropdown */}
          <div className="flex w-[25px] gap-5">
            <select
              name="dropdown"
              id="dropdown"
              className=""
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
          <div className="w-[85%]">
            <input
              type="number"
              name="phonenumber"
              id="phonenumber"
              placeholder="12345 67890"
              className="text-black"
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
      <div className="flex flex-col">
        <label htmlFor="message">Message</label>
        <textarea
          name="message"
          id="message"
          cols={30}
          rows={7}
          placeholder="Enter your message here"
          {...register("message", { required: true })}
        ></textarea>
        {errors.message && <span>Please enter your message</span>}
      </div>

      <button
        type="submit"
        className="rounded-md bg-yellow-50 text-center px-6 text-[16px] font-semibold text-black"
      >
        Send Message
      </button>
    </form>
  );
};

export default ContactUsForm;
