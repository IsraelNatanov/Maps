import express, { Request, Response } from "express";
import { PointsModel } from "../models/pointsModel";
import { IEventFeatures, IFeature } from "../types/eventsType";
import { Server, Socket } from "socket.io";
import { featuresSetting } from "../util/settingEvents";
import { formatDistance, haversineDistance } from '../util/distanceCalculation'
import { EventsModel } from "../models/eventsModel";


const router = express.Router();

const getDistance = (x1: number, y1: number, x2: number, y2: number) => {
  const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  return distance;
};

let io: Server;
export function attachSocketEvents(socketIO: Server) {
  io = socketIO;
  return router;
}

router.post("/", async (req: Request, res: Response) => {

  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1; 
  const year = currentDate.getFullYear();

  // Format the date as "DD/MM/YYYY"
  const formattedDate = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
  let getAllEvents: IEventFeatures[] = await EventsModel.find({});
  try {

    const { properties, geometry } = req.body;

    featuresSetting[0].geometry = geometry
    featuresSetting[0].properties.name = properties.name


    const getAllPoint = await PointsModel.find();
    const eventsArr: IFeature[] = featuresSetting;
    let distanceArr: number[] = new Array(getAllPoint.length).fill(100);

    if (eventsArr[0].geometry.type === "Point") {
      let lowestCoordinates: [number, number] = [80.83253, 15.16293];

      for (let i = 0; i < getAllPoint.length; i++) {
        let feature = getAllPoint[i];

        if (feature.geometry.type === "Point") {

          const distance = getDistance(
            eventsArr[0].geometry.coordinates[0],
            eventsArr[0].geometry.coordinates[1],
            feature.geometry.coordinates[0],
            feature.geometry.coordinates[1]
          );

          let distanceNumber = Number(distance.toFixed(5));
          distanceArr[i] = distanceNumber;
        }
      }
      for (let i = 0; i < 3; i++) {
        let minDistance = 200;
        let saveIndex: number = 0;
        for (let j = 0; j < distanceArr.length; j++) {
          if (distanceArr[j] < minDistance) {
            saveIndex = j;
            minDistance = distanceArr[j];
          }
        }
        distanceArr[saveIndex] = 200;
        lowestCoordinates = getAllPoint[saveIndex].geometry.coordinates;
        let index = i + 1
        featuresSetting[index].geometry.coordinates[0] = lowestCoordinates
        featuresSetting[index].geometry.coordinates[1] = geometry.coordinates

        const distanceInMeters = haversineDistance(lowestCoordinates, geometry.coordinates);
        const formattedDistance = formatDistance(distanceInMeters);
        featuresSetting[index].properties.name = formattedDistance

      }

    }

    const data: IEventFeatures = {
      features: featuresSetting,
      name: properties.name,
      type: "FeatureCollection",
      id: getAllEvents.length + 1,
      label: properties.name,
      date: formattedDate
    }
    const events = new EventsModel(data);
    await events.save();
    io.emit("newEvent", data);

    res.status(200).json({ message: 'Event data saved successfully' });
  } catch (err) {
    res.status(500).json({ msg: "There is a problem, try again later" });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    let features: IEventFeatures[] = await EventsModel.find({});

    res.json(features);
  } catch (err) {
    res.status(500).json({ msg: "There is a problem, try again later" });
  }
});

export default router;
