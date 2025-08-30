import React from "react";
import HighlightText from "../components/core/HomePage/HighlightText";
import BannerImage1 from "../assets/Images/aboutus1.webp";
import BannerImage2 from "../assets/Images/aboutus2.webp";
import BannerImage3 from "../assets/Images/aboutus3.webp";
import Quote from "../components/core/AboutPage/Quote";
import FoundingStory from "../assets/Images/FoundingStory.png";
import StatsComponent from "../components/core/AboutPage/Stats";
import LearningGrid from "../components/core/AboutPage/LearningGrid";
import ContectFormSection from "../components/core/AboutPage/ContectFormSection";
import Footer from "../components/common/Footer";

const About = () => {
  return (
    <div className="mx-auto text-white mt-[100px] w-11/12 max-w-maxContent">
      {/* section 1 */}
      {/* section 1 */}
      <section className="bg-richblack-900">
        <div className="relative mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-center text-white">
          <header className="mx-auto py-20 text-4xl font-semibold lg:w-[70%]">
            <h1 className="text-center font-semibold">
              Driving Innovation in Online Education for a
              <HighlightText text={" Brighter Future"} />
            </h1>
            <p className="mx-auto mt-4 text-center text-base font-medium text-richblack-300 lg:w-[95%]">
              StudyNotion is at the forefront of driving innovation in online
              education. We're passionate about creating a brighter future by
              offering cutting-edge courses, leveraging emerging technologies,
              and nurturing a vibrant learning community.
            </p>
          </header>
          <div className="sm:gap-x-3 mx-auto grid grid-cols-1 md:grid-cols-3 gap-3 mb-12">
            <img
              src={BannerImage1}
              alt="banner image 1"
              className="shadow-[0_0_20px_0] shadow-[#67adfc] object-cover h-[200px] md:h-[300px] rounded-lg w-full"
            />
            <img
              src={BannerImage2}
              alt="banner image 2"
              className="shadow-[0_0_20px_0] shadow-[#67adfc] object-cover h-[200px] md:h-[300px] rounded-lg w-full"
            />
            <img
              src={BannerImage3}
              alt="banner image 3"
              className="shadow-[0_0_20px_0] shadow-[#67adfc] object-cover h-[200px] md:h-[300px] rounded-lg w-full"
            />
          </div>
        </div>
      </section>

      {/* section 2 */}
      <section>
        <div>
          <Quote />
        </div>
      </section>

      {/* section 3 */}
      <section className="w-11/12 max-w-maxContent mx-auto mt-20 mb-8">
        <div className="flex flex-col gap-10">
          {/* Founding Story Section */}
          <div className="flex flex-col lg:flex-row gap-12 items-center justify-between">
            <div className="lg:w-[45%] flex flex-col gap-8">
              <h1 className="bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCB045] bg-clip-text text-4xl font-semibold text-transparent">
                Our Founding Story
              </h1>
              <p className="text-base font-medium text-richblack-300">
                Our E-learning platform was born out of a shared vision and
                passion for transforming education. It all began with a group of
                educators, technologists, and lifelong learners who recognized
                the need for accessible, flexible, and high-quality learning
                opportunities in a rapidly evoloving digital world.
              </p>
              <p className="text-base font-medium text-richblack-300">
                As experienced educators ourselves, we witnessed firsthand the
                limitations and challenges of traditional education systems. We
                believed that education should not be confined to the walls of a
                classroom or restricted by geographical boundaries. We
                envisioned a platform that could bridge these gaps and empower
                individuals from all walks of life to unlock their full
                potential.
              </p>
            </div>
            <div className="lg:w-[45%] h-fit">
              <img
                src={FoundingStory}
                alt="Founding Story"
                className="shadow-[0_0_20px_0] shadow-[#67adfc] object-cover rounded-lg w-full"
              />
            </div>
          </div>

          {/* Vision and Mission Section */}
          <div className="flex flex-col lg:flex-row gap-12 justify-between mt-8">
            <div className="lg:w-[45%] flex flex-col gap-8">
              <h1 className="bg-gradient-to-b from-[#FF512F] to-[#F09819] bg-clip-text text-4xl font-semibold text-transparent">
                Our Vision
              </h1>
              <p className="text-base font-medium text-richblack-300">
                With this vision in mind, we set out on a journey to create an
                e-learning platform that would revolutionize the way people
                learn. Our team of dedicated experts worked tirelessly to
                develop a robust and intutive platform that combines
                cutting-edge technolog with engaging content, fostering a
                dynamic and interactive learning experience.
              </p>
            </div>
            <div className="lg:w-[45%] flex flex-col gap-8">
              <h1 className="bg-gradient-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-transparent bg-clip-text text-4xl font-semibold">
                Our Mission
              </h1>
              <p className="text-base font-medium text-richblack-300">
                Our mission goes beyond just delivering courses online. We
                wanted to create a vibrant community of learners, where
                individuales can connect, collaborate, and learn from one
                another. We believe that knowledge thrives in an environment of
                sharing and dialogue, and we foster this spirit of collaboration
                through forums, live sessions, and networking opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* section 4 */}
      <StatsComponent />

      {/* section 5 */}
      <section className="mx-auto flex flex-col items-center justify-between gap-5 mb-[150px] mt-4">
        <LearningGrid />
        <ContectFormSection />
      </section>

      <section>
        <div>Reviews from other learners</div>
        {/* <ReviewSlider /> */}
      </section>

      <Footer />
    </div>
  );
};

export default About;
