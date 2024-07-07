import mongoose, { Schema, Document } from 'mongoose';
import { IFeature, IEventFeatures } from '../types/eventsType';



const EventsSchema = new mongoose.Schema<IFeature>({
    type: {
      type: String,
      enum: ['Feature'],
      required: true,
    },
    geometry: {
      type: {
        type: String,
        enum: ['Point', 'LineString'],
        required: true,
      },
      coordinates: {
        type: [],
        required: true,
      },
    },
    properties: {
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        // required: true,
      },
      typeStyle: {
        type: String,
        required: true,
      },
    },
  });
  
  const FeatureCollectionSchema = new mongoose.Schema<IEventFeatures>({
    type: {
      type: String,
      enum: ['FeatureCollection'],
      required: true,
    },
    id: {
      type: Number,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    date:{
      type: String,
      required: true,
    },
    features: {
      type: [EventsSchema],
      required: true,
    },
  });

export const EventsModel = mongoose.model<IEventFeatures>('fulleventfeatures', FeatureCollectionSchema);
