import express from "express";
import dotenv from "dotenv";
import "./db/mongoConnect";
import pointFeaturesR, { attachSocketPoints } from "./routes/pointFeatures";
import polygonFeaturesR, { attachSocketPolygons } from "./routes/polygonFeatures";
import eventsR, { attachSocketEvents } from "./routes/eventFeatures";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

dotenv.config();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:5173'],
    credentials: true,
  },
});

const pointsFeaturesRouter = attachSocketPoints(io);
const polygonsFeaturesRouter = attachSocketPolygons(io);
const eventsFeaturesRouter = attachSocketEvents(io);

app.use(cors({
  origin: ['http://localhost:5173'], 
  credentials: true,
}));
app.use(express.json());

app.use("/pointsLayer", pointsFeaturesRouter);
app.use("/eventsLayer", eventsFeaturesRouter);
app.use("/polygonsLayer", polygonsFeaturesRouter);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);
});
