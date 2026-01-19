import { useState, useRef, useEffect } from "react";
import Upgrade from "./Upgrade";
import Free from "./Free";
import Intermediate from "./Intermediate";
import Premium from "./Premium";

const Bowel = () => {
  return (
    <div className="p-4">
      {/* <Free /> */}
      {/* <Intermediate /> */}
      <Premium />
      {/* <Upgrade /> */}
    </div>
  );
};

export default Bowel;
