import mongoose, { Schema, Document } from 'mongoose';

export interface IFeature {
  type: 'Feature';
  geometry: {
    type: string;
    coordinates: number[];
  };
  properties: {
    name: string;
    description?: string;
    typeStyle: string;
    [key: string]: any;
  };
}

export interface IFeatureCollection {
  type: 'FeatureCollection';
  id?: number;
  label?: string;
  date?: string,
  features: IFeature[];
}

export interface FeaturesState extends Document{
    features: IEventFeatures[]

  } 
  export interface IFeatures extends Document{
  
    type: string
    geometry: Geometry
    properties: Properties
     [key: string]: any;
  }

  
  export interface IEventFeatures extends Document{

    features: IFeatures[]
    type: string,
    id: number,
    label: string
    date: string
  }

 
   interface Properties {
    name: string,
    description?: string,
    typeStyle?: string,
    typeEvent?: string,

    
  }
  
  export interface Geometry {
    coordinates: [number, number]
    coordinatesLineString: Array<Array<number>>
    type: string
  }
  interface GeometryLine {
  
    coordinates: Array<Array<number>>
    type: string
  }

  export interface IFeaturePolygon {
    id:string
    _doc?: any;
    type: string;
    geometry: {
      type:string
      coordinates: [[[],[]]]
    }
    properties: {
      name: string;
      description: string;
      typeStyle: string;
      typeEvent: string; // Add the typeEvent property
      [key: string]: any;
    };
    [key: string]: any;
  }