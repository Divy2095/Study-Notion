import React from "react";

const Stats = [
  { count: "5K+", label: "Active Students" },
  { count: "10+", label: "Mentors" },
  { count: "200+", label: "Courses" },
  { count: "50+", label: "Awards" },
];

const StatsComponent = () => {
  return (
    <section className="bg-richblack-700 border-b border-richblack-600 rounded-lg">
      <div className="w-11/12 max-w-maxContent mx-auto">
        <div className="flex justify-center items-center">
          <div className="flex flex-wrap md:flex-nowrap items-center justify-evenly w-full py-4 gap-8 md:gap-12">
            {Stats.map((data, index) => (
              <div
                key={index}
                className="flex items-center gap-3 px-5 py-3 group rounded-md hover:bg-richblack-800 transition-all duration-200"
              >
                <span className="text-lg md:text-2xl font-bold text-yellow-50">
                  {data.count}
                </span>
                <p className="text-xs md:text-sm font-medium text-richblack-200 group-hover:text-richblack-50 transition-all duration-200">
                  {data.label}
                </p>
                {index !== Stats.length - 1 && (
                  <div className="hidden md:block w-[2px] h-10 bg-richblack-600 ml-6" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsComponent;
