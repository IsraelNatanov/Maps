import { Feature } from "ol"
import { Coordinate } from "ol/coordinate"
import { Polygon } from "ol/geom"
import { ReactNode } from "react"

export interface Eventes {
  events: FeaturesOfList[]

}
export interface FeatureObject {
  type: string
  geometry: GeometryType
  properties: Properties
}



export interface FeaturesOfList {
  time: ReactNode,
  features: FeatureObject[]
  type: string,
  id: number,
  label: string
  date: string,
}




export interface GeometryType {
  coordinates: [number] | [[number], [number]];
  type: string
}

export interface GeometryTypePolygon {
  coordinates: [[number], [number]][];
  type: string
}
export interface SelectedPolygonType {
  geometry: Feature<Polygon>[];
  indexLayer: number;
  indexFeature: number;
  nameLayer: string;
  nameFeature: string

};
export interface selectFearure {
  indexFeature:string
  indexLayer:number
  name:string
  nameFeature:string
  nameLayer:string
  typeStyle:string
  [key: string]: any; 

}

export interface IGeoJson{

  type:string
 coordinates: Coordinate
 }

 interface Properties {
  name: string;
  typeStyle: string;
  typeEvent?: string;
  description?: string
}
export interface IGeoJsonGeometry {
  type: 'Point' | 'Polygon';
  coordinates: any;
}

export interface IFeatures {
  id?: string;
  type: string;
  geometry: IGeoJsonGeometry;
  properties: Properties;
}

export interface IFeatureCollection {
  type: 'FeatureCollection';
  features: IFeatures[];
}
