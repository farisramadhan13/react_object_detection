import React, { useState, useEffect } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as cocoModel from "@tensorflow-models/coco-ssd";
import './App.css'; // Ensure Tailwind CSS is imported in your App.css

function App() {
  const [model, setModel] = useState();
  const [objectName, setObjectName] = useState("");
  const [objectScore, setObjectScore] = useState("");
  const [isCameraOn, setIsCameraOn] = useState(false); // State to control camera

  async function loadModel() {
    try {
      const dataset = await cocoModel.load();
      setModel(dataset);
      console.log("Model loaded successfully.");
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    tf.ready().then(() => {
      loadModel();
    });
  }, []);

  async function predict() {
    const detection = await model.detect(document.getElementById("videoSource"));
    if (detection.length > 0) {
      detection.forEach((result) => {
        setObjectName(result.class);
        setObjectScore(result.score.toFixed(2)); // Rounded to two decimal places
      });
    }
    console.log(detection);
  }

  const videoOption = {
    width: 720,
    height: 480,
    facingMode: "environment"
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'url(https://source.unsplash.com/random/1600x900?technology)' }}>
      <h1 className="text-5xl text-white font-extrabold mb-10 text-center shadow-lg">
        <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
          ML WITH FARIS
        </span>
      </h1>
      <div className="bg-white bg-opacity-80 p-8 rounded-2xl shadow-xl w-11/12 max-w-lg text-center">
        <h3 className="text-3xl font-semibold text-gray-900 mb-4">
          {objectName ? `Object: ${objectName}` : "No Object Detected"}
        </h3>
        <h3 className="text-2xl text-gray-700 mb-6">
          {objectScore ? `Confidence: ${objectScore}` : ""}
        </h3>
        <button
          onClick={predict}
          className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-full mb-4 text-xl transition duration-300 transform hover:scale-105"
        >
          Tebak Objek
        </button>
        <button
          onClick={() => setIsCameraOn(!isCameraOn)}
          className="bg-green-600 hover:bg-green-800 text-white font-bold py-3 px-6 rounded-full mb-6 text-xl transition duration-300 transform hover:scale-105"
        >
          {isCameraOn ? "Matikan Kamera" : "Nyalakan Kamera"}
        </button>
        <div className="border-4 border-indigo-500 rounded-lg overflow-hidden">
          {isCameraOn && (
            <Webcam
              id="videoSource"
              audio={false}
              videoConstraints={videoOption}
              className="mirrored-video w-full"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
