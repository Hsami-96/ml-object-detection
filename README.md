# Object Detection TensorFlow
Object detection model app using TensorFlow JS on a Node JS backend with socket IO on a React front end

## Running Server
Steps to run server locally. The server will run the pre-defined tensor flow model and listen out to emitted socket IO events from front end.

### `cd server && npm install` 

Installs all required packages.

### `npx tsc && node dist/index.js`

Compiles TS code and runs the server locally.\
Port runs on [http://localhost:3001](http://localhost:3001) 

## Running UI
Steps to run front end locally. The UI uses `react-webcam` and `socket IO` to continously emit webcam images to backend to detect objects. Once you stop capturing, the UI will then display which objects it detected i.e. Person, bottle. (Ofcourse, you need to allow your browser to use your device camera)

### `cd UI && npm install` 

Installs all required packages.

### `npm start` 

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.
