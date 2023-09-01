const express = require("express");
const socketIO = require("socket.io");
const http = require("http");
const tf = require("@tensorflow/tfjs-node");
const cocoSsd = require("@tensorflow-models/coco-ssd");
const cors = require("cors");
const sharp = require("sharp");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(cors());
const loadModel = async () => {
  const model = await cocoSsd.load();
  return model;
};

const objectDetectionModel = loadModel();

io.on("connection", (socket: any) => {
  console.log("Client Connected");

  socket.on("frame", async (frameData: any) => {
    try {
        const base64Data = frameData.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''); 

        const imageBuffer = Buffer.from(base64Data, 'base64');
        console.log('Image Buffer is: ', imageBuffer)
        const decodedImage = tf.node.decodeImage(imageBuffer);
        console.log('Decoded image is: ', decodedImage)

        const model = await objectDetectionModel;
        const predictions = await model.detect(decodedImage);
        socket.emit("detection", predictions);
    } catch (error) {
        console.log('ERROR: ', error)
    }
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(3001, () => {
  console.log("server is running on port 3001");
});