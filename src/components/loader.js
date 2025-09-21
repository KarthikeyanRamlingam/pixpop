import React from "react";
import { TailSpin } from "react-loader-spinner";

const Loader = () => {
  return (
    <div style={{ marginTop: "20px" }}>
      <TailSpin color="#00BFFF" height={80} width={80} />
      <p style={{ color: "#ccc" }}>Generating image...</p>
    </div>
  );
};

export default Loader;
