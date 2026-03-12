import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center w-full py-8">
      <div className="load-3" aria-label="Loading" role="status">
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>
    </div>
  );
};

export default Loader;

