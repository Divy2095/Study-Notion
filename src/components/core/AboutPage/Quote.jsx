import React from "react";
import HighlightText from "../HomePage/HighlightText";

const Quote = () => {
  return (
    <div className="text-2xl md:text-4xl font-semibold mx-auto py-12 text-center text-white">
      <div className="w-11/12 max-w-maxContent mx-auto">
        <div className="flex flex-col items-center justify-center">
          <p className="leading-[2.5rem] md:leading-[3.5rem]">
            We are passionate about revolutionizing the way we learn. Our
            innovation platform <HighlightText text={"combines technology"} />,{" "}
            <span className="bg-gradient-to-b from-[#FF512F] to-[#F09819] text-transparent bg-clip-text font-bold">
              expertise
            </span>
            , and community to create an{" "}
            <span className="bg-gradient-to-b from-[#FF512F] to-[#F09819] text-transparent bg-clip-text font-bold">
              unparalleled educational experience.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Quote;
