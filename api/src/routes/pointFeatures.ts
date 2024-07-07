import express, { Request, Response } from "express";
import { PointsModel } from "../models/pointsModel";
import { Server, Socket } from "socket.io";

const router = express.Router();

let io: Server;

// Attach the socket.io server instance to the router
export function attachSocketPoints(socketIO: Server) {
  io = socketIO;
  return router;
}

router.post("/", async (req: Request, res: Response) => {

  try {
    const point = new PointsModel(req.body);
    await point.save();

    io.emit("newFeature", { layer: 'pointsLayer', feature: req.body });

    res.status(200).json({ message: 'Point data saved successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: err });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const type = "FeatureCollection";
    const pointsData = await PointsModel.find();

    res.json({ type, features: pointsData });
  } catch (err) {
    res.status(500).json({ msg: "There is a problem, try again later" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    console.log(req.params.id);

    const deletedPoint = await PointsModel.findOneAndDelete({ id: req.params.id });

    io.emit("deleteFeature", { layer: 'pointsLayer', featureId: req.params.id });

    res.json(deletedPoint);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "There is a problem, try again later" });
  }
});

export default router;
