import express from "express";
import dotenv from "dotenv";
import "./db/mongoConnect";
import pointFeaturesR, { attachSocketPoints } from "./routes/pointFeatures";
import polygonFeaturesR, { attachSocketPolygons } from "./routes/polygonFeatures";
import eventsR, { attachSocketEvents } from "./routes/eventFeatures";
import { createServer } from "http";
import { Server } from "socket.io";
import cors, { CorsOptions } from "cors";

dotenv.config();

const app = express();
const httpServer = createServer(app);

let corsOptions: CorsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    if (
      !origin ||
      ['http://localhost:5173', 'https://maps-iota-seven.vercel.app', ].includes(origin) ||
      origin.endsWith('maps-iota-seven.vercel.app') ||
      origin.endsWith('localhost:5173') ||
      origin.endsWith('.localhost:5173')
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH', 'OPTION'],
  exposedHeaders: 'Content-Disposition,X-Suggested-Filename',
};
const io = new Server(httpServer, {
  cors: corsOptions
  
});

const pointsFeaturesRouter = attachSocketPoints(io);
const polygonsFeaturesRouter = attachSocketPolygons(io);
const eventsFeaturesRouter = attachSocketEvents(io);

app.use(cors(corsOptions))
app.use(express.json());

app.use("/pointsLayer", pointsFeaturesRouter);
app.use("/eventsLayer", eventsFeaturesRouter);
app.use("/polygonsLayer", polygonsFeaturesRouter);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);
});
