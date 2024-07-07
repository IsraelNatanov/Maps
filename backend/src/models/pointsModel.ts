import mongoose, { Schema, Document } from 'mongoose';
import { IFeatures } from '../types/FeatureType';



const pointsSchema: Schema = new mongoose.Schema({
    type: { type: String, required: true },
    id:{type: String, required: true},
    geometry: { 
        coordinates: { type: Array, required: true },
        type: {type: String, required: true },
    },
    properties:{
        name: { type: String, required: true },
        description: { type: String, required: true },
        typeStyle: { type: String, required: true },

    }
    
});




export const PointsModel = mongoose.model<IFeatures>('geojsons', pointsSchema);
