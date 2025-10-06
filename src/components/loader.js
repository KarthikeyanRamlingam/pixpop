import React from "react";
import { TailSpin } from "react-loader-spinner";

const Loader = () => {
  return (
    <div style={{ marginTop: "20px", textAlign: "center" }}>
      <TailSpin
        visible={true}
        height={80}
        width={80}
        color="#00BFFF"
        ariaLabel="tail-spin-loading"
      />
      <p style={{ color: "#ccc", marginTop: 10 }}>Generating image...</p>
    </div>
  );
};

export default Loader;
