import React, { useRef } from "react";
import VariableProximity from "../Bits/VariableProximity/VariableProximity";
import "./Banner.scss";

const Banner = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} style={{ position: "relative" }} className="banner">
      <VariableProximity
        label={"Maintain plant diversity with Flora Lib"}
        className={"variable-proximity-demo"}
        fromFontVariationSettings="'wght' 400, 'opsz' 9"
        toFontVariationSettings="'wght' 1000, 'opsz' 40"
        containerRef={containerRef as React.RefObject<HTMLElement>}
        radius={100}
        falloff="linear"
      />
    </div>
  );
};

export default Banner;
