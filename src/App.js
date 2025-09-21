import React, { useState } from "react";
import axios from "axios";
import { TailSpin } from "react-loader-spinner";

function App() {
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [width, setWidth] = useState(1024); // default HD
  const [height, setHeight] = useState(1024);
  const [steps, setSteps] = useState(35);

  const generateImage = async () => {
    if (!prompt) return;
    setLoading(true);

    try {
      const response = await axios.post(
        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
        {
          inputs: prompt.toString(),
          parameters: {
            width: width,
            height: height,
            guidance_scale: 7.5,
            num_inference_steps: steps,
          },
          options: { wait_for_model: true },
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_HF_API_KEY}`,
            "Content-Type": "application/json",
            Accept: "image/png",
          },
          responseType: "arraybuffer",
        }
      );

      const base64 = btoa(
        new Uint8Array(response.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );
      const imageUrl = `data:image/png;base64,${base64}`;
      setImages([imageUrl, ...images]);
    } catch (error) {
      if (error.response) {
        const decoder = new TextDecoder();
        const message = decoder.decode(error.response.data);
        console.error("HF Error:", message);
        alert("Failed: " + message);
      } else {
        console.error("Error generating image:", error.message);
        alert("Failed: " + error.message);
      }
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        padding: "20px",
        textAlign: "center",
        minHeight: "100vh",
        color: "#ffffff",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
      }}
    >
      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 0,
        }}
      ></div>

      {/* Main content */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ marginBottom: "20px", fontSize: "clamp(22px, 5vw, 36px)" }}>
          Pixpop (AI Image Generator)
        </h1>

        {/* Input + Button */}
        <div
          style={{
            marginBottom: "15px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt..."
            style={{
              flex: "1 1 250px",
              minWidth: "200px",
              maxWidth: "500px",
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              outline: "none",
              fontSize: "16px",
            }}
          />
          <button
            onClick={generateImage}
            disabled={loading}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#00BFFF",
              color: "#ffffff",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>

        {/* Resolution + Steps */}
        <div
          style={{
            marginBottom: "20px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "20px",
            fontSize: "16px",
          }}
        >
          <label>
            Resolution:
            <select
              value={width}
              onChange={(e) => {
                setWidth(Number(e.target.value));
                setHeight(Number(e.target.value));
              }}
              style={{
                marginLeft: "10px",
                padding: "5px",
                borderRadius: "6px",
              }}
            >
              <option value={512}>512×512</option>
              <option value={768}>768×768</option>
              <option value={1024}>1024×1024</option>
            </select>
          </label>

          <label>
            Steps:
            <select
              value={steps}
              onChange={(e) => setSteps(Number(e.target.value))}
              style={{
                marginLeft: "10px",
                padding: "5px",
                borderRadius: "6px",
              }}
            >
              <option value={25}>25</option>
              <option value={30}>30</option>
              <option value={35}>35</option>
            </select>
          </label>
        </div>

        {/* Loader */}
        {loading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              marginTop: "30px",
            }}
          >
            <TailSpin color="#00BFFF" height={60} width={60} />
            <p style={{ marginTop: "10px" }}>Generating image, please wait...</p>
          </div>
        )}

        {/* Generated Images */}
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
          }}
        >
          {images.map((img, index) => (
            <div key={index} style={{ textAlign: "center" }}>
              <img
                src={img}
                alt="Generated"
                style={{
                  width: "100%",
                  maxWidth: "100%",
                  borderRadius: "8px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                }}
              />
              <a
                href={img}
                download={`ai_image_${width}x${height}_${index + 1}.png`}
              >
                <button
                  style={{
                    marginTop: "10px",
                    padding: "8px 18px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "#00BFFF",
                    color: "#ffffff",
                    cursor: "pointer",
                  }}
                >
                  Download
                </button>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
