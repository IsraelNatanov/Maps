interface IGeometryPoint {
  coordinates: [number, number];
  type: "Point";
}

interface IGeometryLineString {
  coordinates: [number, number][];
  type: "LineString";
}

type IGeometry = IGeometryPoint | IGeometryLineString;

export interface IProperties {
  name: string;
  description?: string;
  typeStyle: string;
  // Add any other properties here if necessary
}

export interface IFeature {
  geometry: IGeometry;
  properties: IProperties;
  _id?: string;
  type: string;
}

export interface IEventFeatures1 {
  features: IFeatures;
  name: string;
  type: string;
  id: number;
  label: string;
  date: string;
}
export interface IEventFeatures {
  features: IFeature[];
  name: string;
  type: string;
  id: number;
  label: string;
  date: string;
  _id?: number;
}

  export  interface IFeatures {
    features: IFeature[];

  }
  
  // Additional interface for clarity, assuming it's used for response format
  export interface IResponseData {
    type: string;
    features: IEventFeatures1;
  }
  

  