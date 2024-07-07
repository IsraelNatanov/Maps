import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { IFeatureCollection } from "../typs/featuresType";

export const format = new GeoJSON({ featureProjection: "EPSG:3857" });

 export const createVectorLayer = (source: IFeatureCollection, styleFunction: any, nameLayer: string) => {
    let vectorSource: VectorSource | null = null;

    // Create a new VectorSource instance
    vectorSource = new VectorSource({
      features: format.readFeatures(source),
    });

    // Set properties for each feature
    vectorSource.getFeatures().forEach((feature, indexLayer) => {
      const properties = feature.getProperties();
      const id = properties.id || feature.getId();
      feature.setProperties({
        ...properties,
        indexLayer: indexLayer,
        indexFeature: id,
        nameLayer: nameLayer,
        nameFeature: properties.name
      });
    });

    if (vectorSource) {
      return new VectorLayer({
        source: vectorSource,
        style: styleFunction,
        properties: {
          nameLayer: nameLayer,
        },
      });
    } else {
      return null;
    }
  };