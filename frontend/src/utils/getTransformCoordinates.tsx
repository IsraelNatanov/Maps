
import { Feature } from "ol";
import { IFeatures } from "../typs/featuresType";
import { Geometry, Point, Polygon } from "ol/geom";
import { transform } from "ol/proj";

export const getTransformCoordinates = (
    typeGeometry: string,
    currentFeature: Feature<Geometry>,
    nameFeature: string,
    idFeature: string,
    nameLayer:string
): IFeatures => {
    const geometryFeature = currentFeature.getGeometry();

    if (!geometryFeature) {
        throw new Error('Geometry feature is undefined');
    }

    let geoJson: IFeatures;

    if (typeGeometry === 'Polygon' && geometryFeature instanceof Polygon) {
        const coordinates = geometryFeature.getCoordinates()[0];
        const convertedCoordinates = coordinates.map((coord: number[]) => {
            const [lon, lat] = transform(coord, 'EPSG:3857', 'EPSG:4326');
            return [Number(lon), Number(lat)];
        });

        geoJson = {
            type: 'Feature',
            geometry: {
                type: 'Polygon',
                coordinates: [convertedCoordinates]
            },
            id: idFeature,
            properties: {
                description: "vv",
                name: nameFeature,
                typeStyle: "style1"
            }
        };
    } else if (typeGeometry === 'Point' && geometryFeature instanceof Point) {
        const coordinates = geometryFeature.getCoordinates() as number[];
        const olTargetCoordinate = transform(coordinates, 'EPSG:3857', 'EPSG:4326');

        geoJson = {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: olTargetCoordinate as [number, number],
            },
            id: idFeature,
            properties: {
                description: "vv",
                name: nameFeature,
                typeStyle: nameLayer === 'pointsLayer' ? 'value1' : "style1"
            }
        };
    } else {
        throw new Error('Unsupported geometry type or geometry does not match type');
    }

    return geoJson;
};