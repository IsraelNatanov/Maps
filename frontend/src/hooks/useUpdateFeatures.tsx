
import { io } from "socket.io-client";
import {  useEffect } from "react";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Geometry } from "ol/geom";
import { apiUrl } from "../utils/axios-utils";
import { format } from "../utils/createVectorLayer";

type UseUpdateFeaturesProps = {
    vectorLayers :{ [key: string]: VectorLayer<VectorSource<Geometry>> };
}


export const useUpdateFeatures = ({ vectorLayers }: UseUpdateFeaturesProps) => {
useEffect(() => {

    if (vectorLayers) {

      const socket = io(apiUrl)
      socket.on("newFeature", (newFeature) => {
        const mapLayer = vectorLayers[newFeature.layer];
        console.log("newFeature", newFeature);

        const source = mapLayer.getSource();
        const feature = format.readFeature(newFeature.feature);
        source!.addFeature(feature);
        feature.getProperties();
        const properties = feature.getProperties();
        const id = properties.id || feature.getId();
        feature.setProperties({
          ...properties,
          indexLayer: newFeature.layer === 'pointsLayer' ? 0 : 1,
          indexFeature: id,
          nameLayer: newFeature.layer,
          nameFeature: properties.name
        });
      });

      socket.on("deleteFeature", (deleteFeature) => {
        const mapLayer = vectorLayers[deleteFeature.layer];
        const source = mapLayer.getSource();
        const feature = source?.getFeatureById(deleteFeature.featureId);
        if (feature) {
          source?.removeFeature(feature);
        }

      });

      return () => {
        socket.disconnect();
      };
    }
  }, [vectorLayers])
}
