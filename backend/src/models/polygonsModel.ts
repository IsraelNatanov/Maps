import mongoose, { Schema, Document, Error } from 'mongoose';
import { IFeatures } from '../types/FeatureType';

interface IPolygonsModel extends IFeatures, Document {}

const PolygonsSchema: Schema = new mongoose.Schema({
    id:{ type: String, required: true },
  type: { type: String, required: true },
  geometry: {
    coordinates: { type: Array, required: true },
    type: { type: String, required: true },
  },
  properties: {
    name: { type: String, required: true },
    description: { type: String },
    typeStyle: { type: String, required: true },
  },
});



export const PolygonsModel = mongoose.model<IPolygonsModel>('polygonfeatures', PolygonsSchema);
