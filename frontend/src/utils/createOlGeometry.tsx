import { transform } from 'ol/proj';
import { Point, Polygon, Geometry} from 'ol/geom';
import { Feature } from 'ol';
import VectorLayer from "ol/layer/Vector";
import VectorSource from 'ol/source/Vector';


export interface MapFeature {
    id: string;
    type: string;
    geometry: IGeoJson;
    properties: Properties;
}

export interface IGeoJson {
    type: string;
    coordinates: any;
}

export interface Properties {
    name: string;
    typeStyle: string;
    typeEvent: string;
    description: string
}


const createGeoJson = (olGeometry: Geometry): IGeoJson => {
    if (olGeometry instanceof Point) {
        const transformedCoordinates = transform(olGeometry.getCoordinates(), 'EPSG:3857', 'EPSG:4326');
        return {
            type: 'Point',
            coordinates: transformedCoordinates as [number, number],
        };
    } else if (olGeometry instanceof Polygon) {
        const transformedCoordinates = olGeometry.getCoordinates().map(ring =>
            ring.map(coord => transform(coord, 'EPSG:3857', 'EPSG:4326'))
        );
        return {
            type: 'Polygon',
            coordinates: transformedCoordinates as [number, number][][],
        };
    } else {
        throw new Error('Unsupported geometry type');
    }
};
export const convertToMapFeature = (olFeature: Feature<Geometry>, idFeature: string, nameFeature: string): MapFeature => {
    const geometry = olFeature.getGeometry();
    if (!geometry) {
        throw new Error('Geometry is missing from the feature');
    }

    const geoJson = createGeoJson(geometry);

    return {
        id: idFeature,
        type: 'Feature',
        geometry: geoJson,
        properties: {
            name: nameFeature,
            typeEvent: "",
            typeStyle: "style1",
            description: "vv"
        } as Properties,
    };
};
export interface IGeoJsonGeometry {
    type: 'Point' | 'Polygon';
    coordinates: any;
  }
export const createOlGeometry = (geometry: IGeoJsonGeometry): Geometry => {
    switch (geometry.type) {
      case 'Point':
        return new Point(geometry.coordinates as [number, number]);
      case 'Polygon':
        return new Polygon(geometry.coordinates as number[][][]);
      default:
        throw new Error('Unsupported geometry type');
    }
  }; 

type VectorLayers = {
    pointsLayer: VectorLayer<VectorSource<Geometry>>;
    polygonsLayer: VectorLayer<VectorSource<Geometry>>;
  };
  
export const isVectorLayers=(obj: any):obj is VectorLayers => {
    return (
      obj &&
      typeof obj === 'object' &&
      obj.pointsLayer instanceof VectorLayer &&
      obj.polygonsLayer instanceof VectorLayer
    );
  }