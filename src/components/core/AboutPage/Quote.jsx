import React from "react";
import HighlightText from "../HomePage/HighlightText";

const Quote = () => {
  return (
    <div>
      We are passionate about revolutionizing the way we learn. Our innovation
      platform <HighlightText text={" combines technology "} /> ,{" "}
      <span className="text-orange-400 font-semibold"> expertise</span>, and
      community to create an{" "}
      <span className="text-orange-400 font-semibold">
        unparalleled educational experience.
      </span>
    </div>
  );
};

export default Quote;
