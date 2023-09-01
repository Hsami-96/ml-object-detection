import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { io } from "socket.io-client";
import "./App.css";
import { Predictions } from "./models/Prediction";
import { PredictionsMapper } from "./utils/PredictionsMapper";
const socket = io("http://localhost:3001", {
  transports: ["websocket"],
});

const App = () => {
  const webCamRef = useRef<Webcam>(null);
  const [capturing, setCapturing] = useState(false);
  const [predictions, setPredictions] = useState<Predictions[]>([]);
  let predictionsArr: any = [];

  useEffect(() => {
    if (capturing) {
      const captureInterval = setInterval(() => {
        const imageSrc = webCamRef.current?.getScreenshot();
        socket.emit("frame", imageSrc);
      }, 1000); // Capture every 1 second

      return () => clearInterval(captureInterval);
    }
  }, [capturing]);

  socket.on("detection", (predictions) => {
    predictionsArr = [...predictionsArr, predictions];
  });

  const startCapturing = () => {
    setCapturing(true);
  };

  const stopCapturing = () => {
    if (predictionsArr.length > 0) {
      const mappedPredicitions = PredictionsMapper(predictionsArr);
      const test = [...predictions, ...mappedPredicitions];
      setPredictions(test);
    }
    setCapturing(false);
  }; 

  const displayClasses = () => {
    const uniquePredictions = new Set<string>();
    predictions.filter((obj) => {
      if (!uniquePredictions.has(obj.class)) {
        uniquePredictions.add(obj.class + ' ');
      }
    });
    return uniquePredictions;
  }

  return (
    <div className="mainContainer">
      <div className="videoContainer">
        <Webcam
          audio={false}
          mirrored={true}
          ref={webCamRef}
          screenshotFormat="image/jpeg"
        />
      </div>
      <div className="btnContainer">
        <button className="btn" onClick={startCapturing}>Start Capturing</button>
        <button className="btn" onClick={stopCapturing}>Stop Capturing</button>
      </div>
      <div className="infoContainer">
        {predictions.length > 0 && (
          <h2>
            I can see the following things: {displayClasses()}
          </h2>
        )}
      </div>
    </div>
  );
};

export default App;
