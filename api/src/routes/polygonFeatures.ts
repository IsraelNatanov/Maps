import express, { Request, Response } from "express";
import bodyParser from 'body-parser';
import { Server, Socket } from "socket.io";
import { PolygonsModel } from "../models/polygonsModel";

const router = express.Router();
router.use(bodyParser.json());

// Create a socket.io server instance
let io: Server;

// Attach the socket.io server instance to the router
export function attachSocketPolygons(socketIO: Server) {
  io = socketIO;
  return router;
}

export interface Geometry {
  coordinates: [number, number] | [number, number][];
  type: "Point" | "MultiPoint" | "LineString" | "MultiLineString" | "Polygon" | "MultiPolygon";


}


router.get("/", async (req: Request, res: Response) => {
  try {
    const type = "FeatureCollection";
    const features = await PolygonsModel.find();


    res.json({ type, features: features });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {


    const polygon = new PolygonsModel( req.body);
    await polygon.save();

    io.emit("newFeature",  {layer:'polygonsLayer' ,feature:req.body});
    
    res.status(200).json({ message: 'Polygon data saved successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const deletedPolygon = await PolygonsModel.findOneAndDelete({ id: req.params.id });

    io.emit("deleteFeature", {layer:'polygonsLayer', featureId: req.params.id});

    res.json(deletedPolygon);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "There is a problem, try again later" });
  }
});

export default router;
