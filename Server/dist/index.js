"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const loadModel = () => __awaiter(void 0, void 0, void 0, function* () {
    const model = yield cocoSsd.load();
    return model;
});
const objectDetectionModel = loadModel();
io.on("connection", (socket) => {
    console.log("Client Connected");
    socket.on("frame", (frameData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const base64Data = frameData.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
            const imageBuffer = Buffer.from(base64Data, 'base64');
            console.log('Image Buffer is: ', imageBuffer);
            const decodedImage = tf.node.decodeImage(imageBuffer);
            console.log('Decoded image is: ', decodedImage);
            const model = yield objectDetectionModel;
            const predictions = yield model.detect(decodedImage);
            socket.emit("detection", predictions);
        }
        catch (error) {
            console.log('ERROR: ', error);
        }
    }));
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});
server.listen(3001, () => {
    console.log("server is running on port 3001");
});
