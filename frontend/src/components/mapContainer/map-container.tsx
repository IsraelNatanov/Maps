import { useState, useEffect, useMemo, useRef, MutableRefObject } from "react";
import { Map as OlMap } from "ol";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { SelectEvent } from "ol/interaction/Select";
import "ol/ol.css";
import Button from "@mui/material/Button";
import { styleButton, styleFunction } from "../../style/styleFunction";
import { Stack } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocationOffIcon from "@mui/icons-material/LocationOff";
import ExploreOffIcon from "@mui/icons-material/ExploreOff";
import ExploreIcon from "@mui/icons-material/Explore";
import { IFeatureCollection, selectFearure } from "../../typs/featuresType";
import polygonIcon from "../../images/polygonIcon.png"
import polygonNotIcon from "../../images/polygonNotIcon.png";
import SearchGeomtry from "../UI/searchGeometry/searchGeometry";
import DeleteIcon from "@mui/icons-material/Delete";
import { Geometry } from "ol/geom";
import SimpleBackdrop from "../UI/simpleBackdrop/simpleBackdrop";
import DeviderEvent from "../deviderEvent/deviderEvent";
import RenderButtons from "../UI/renderButtons/renderButtons";
import { ButtonsDataType } from "../../typs/buttonsDataType";
import { useAddFeature, useDeleteFeature, useGetFeatureCollectionData } from "../../hooks/useFeaturesData";
import { useMapSelect } from "../../hooks/useMapSelect";
import FormSelect from "../createFeature/createFeature";
import { isVectorLayers } from "../../utils/createOlGeometry";
import Map from "../map/map";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { createVectorLayer } from "../../utils/createVectorLayer";
import { useUpdateFeatures } from "../../hooks/useUpdateFeatures";

interface Options {
  label: string;
  id: number;
}

type DisplayFeaturesState = {
  [key: string]: boolean;
};
export type VectorLayersRef = MutableRefObject<{ [key: string]: VectorLayer<VectorSource<Geometry>> } | {}>;

function MapContainer() {
  const prevVectorLayersRef = useRef<{ [key: string]: VectorLayer<VectorSource<Geometry>> }>({});
  const [map, setMap] = useState<OlMap | null>(null);
  const [isCraetedVectorLayers, setIsCraetedVectorLayers] = useState<boolean>(false)
  const [isDeletePolygon, setIsDeletePolygon] = useState<boolean>(false);
  const [selectedFeature, setSelectedFeature] = useState<selectFearure | null>(null);
  const [isDisplayFeatures, setIsDisplayFeatures] = useState<DisplayFeaturesState>({
    'pointsLayer': false,
    'polygonsLayer': false,
    'createGeomtry': false,

  })


  const onSuccess = (data: IFeatureCollection | undefined) => {
    console.log({ data })
  }

  const onError = (error: unknown) => {
    console.log({ error })
    return <h2>{(error as Error)?.message}</h2>
  }


  const { data: pointsData, isLoading: isLoadingPoints } = useGetFeatureCollectionData('pointsLayer', onSuccess, onError);
  const { data: polygonsData, isLoading: isLoadingPolygons } = useGetFeatureCollectionData('polygonsLayer', onSuccess, onError);


  const listVectores = useMemo(() => [
    {
      key: '0',
      nameLayer: 'pointsLayer',
      data: pointsData
    },
    {
      key: '1',
      nameLayer: 'polygonsLayer',
      data: polygonsData
    },
  ], [pointsData, polygonsData]);

  let vectorLayers = useMemo(() => {

    const layers = listVectores
      .filter(obj => obj.data !== undefined)
      .map(obj => {
        const layer = createVectorLayer(obj.data!, styleFunction, obj.nameLayer);
        if (layer) {
          return layer;
        } else {
          return new VectorLayer({
            source: undefined
          });
        }
      })
      .reduce<{ [key: string]: VectorLayer<VectorSource<Geometry>> }>((acc, layer) => {
        if (layer) {
          acc[layer.get('nameLayer')] = layer;
        }
        return acc;
      }, {});
    if (isCraetedVectorLayers) {
      return prevVectorLayersRef.current
    }
    return layers
  }, [listVectores, styleFunction]);

  useUpdateFeatures({vectorLayers})

  useEffect(() => {
    const indexLayer1 = map?.getLayers().getArray()[1]
    prevVectorLayersRef.current = vectorLayers
    if (isVectorLayers(vectorLayers) && (indexLayer1 === undefined)) {
      console.log(1111);
      setIsCraetedVectorLayers(true)
      Object.values(vectorLayers).forEach((layer) => {
        map?.addLayer(layer);
        layer.setVisible(false);
      });
    }
    console.log(map?.getLayers());

  }, [vectorLayers]);

  console.log('successDeleteFeature',);
  const { mutate: addFeatureMutate } = useAddFeature();
  const { mutate: deleteFeatureMutate } = useDeleteFeature();
  
  const getAllFeatureNames = useMemo(() => {
    const allFeatureNames: Options[] = [];
    let index = 0;
    Object.entries(vectorLayers).forEach(([layerKey, layer]) => {
      if (isDisplayFeatures[layerKey]) {
        layer.getSource()?.forEachFeature((feature) => {
          const name = feature.getProperties().name;
          allFeatureNames.push({ label: name, id: ++index });
        });
      }
    });
    return allFeatureNames;
  }, [vectorLayers, isDisplayFeatures]); // Include vectorLayers as a dependency

  const handleDisplayLayers = (nameLayer: string) => {
    const isVisible = vectorLayers[nameLayer].getVisible()
    vectorLayers[nameLayer].setVisible(!isVisible)
    handleDisplayFeatures(nameLayer)
  }

  const handleDisplayFeatures = (nameLayer: string) => {
    setIsDisplayFeatures(prevState => ({
      ...prevState, // Preserve other properties in the state object
      [nameLayer]: !prevState[nameLayer], // Toggle the display state for the specific layer
    }));
  };

  const handleSelectFeatures = (event: SelectEvent) => {
    const selected = event.selected;
    if (selected.length > 0 && selected[0].getId() !== undefined) {
      const selectedProperties = selected[0].getProperties()
      const selectedFeatures: selectFearure = {
        indexFeature: selectedProperties.indexFeature,
        indexLayer: selectedProperties.indexLayer,
        name: selectedProperties.name,
        nameFeature: selectedProperties.selectedProperties,
        nameLayer: selectedProperties.nameLayer,
        typeStyle: selectedProperties.nameLayer

      }
      setSelectedFeature(selectedFeatures);
      setIsDeletePolygon(true);
    }
    else {
      setSelectedFeature(null);
      setIsDeletePolygon(false);
    }
  };

  const deleteFeature = () => {
    if (selectedFeature) {
      deleteFeatureMutate({ layer: selectedFeature.nameLayer, idFeature: selectedFeature.indexFeature })
      setSelectedFeature(null);
      setIsDeletePolygon(false);
    }

  }

  const selectInteractions = useMapSelect(handleSelectFeatures);
  useEffect(() => {
    if (map) map.addInteraction(selectInteractions);
  }, [map]);


  const buttonsData: ButtonsDataType[] = [
    {
      id: '0',
      text: isDisplayFeatures['pointsLayer'] ? 'הסתר אתרים' : 'הצג אתרים',
      icon: isDisplayFeatures['pointsLayer'] ? <LocationOffIcon /> : <LocationOnIcon />,
      onClick: () => handleDisplayLayers('pointsLayer')
    },
    {
      id: '1',
      text: isDisplayFeatures['polygonsLayer'] ? 'הסתר גיזרות' : 'הצג גיזרות',
      icon: isDisplayFeatures['polygonsLayer'] ? <ExploreOffIcon /> : <ExploreIcon />,
      onClick: () => handleDisplayLayers('polygonsLayer')
    },
    {
      id: '2',
      text: isDisplayFeatures['createGeomtry'] ? 'הסתרת כלי סירטוט' : 'הוספת גזרות ואתרים',
      icon: isDisplayFeatures['createGeomtry'] ? <img src={polygonNotIcon} alt="not geomtry" /> : <img src={polygonIcon} alt="geomtry" />,
      onClick: () => handleDisplayFeatures('createGeomtry')
    }
  ];


  return (
    <div style={{ position: 'relative' }}>

      <SimpleBackdrop openLoading={isLoadingPoints || isLoadingPolygons} />
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        spacing={2}
      >
        <Stack direction="row">
          <DeviderEvent map={map} isPoint={isDisplayFeatures['pointsLayer']} handleAddLayerPoint={handleDisplayLayers} />
          <RenderButtons buttonsData={buttonsData} />

          {isDisplayFeatures['createGeomtry'] && (
            <FormSelect
              setMap={setMap}
              map={map}
              addFeatureMutate={addFeatureMutate}
            />
          )}

          {isDeletePolygon && (
            <Button style={styleButton} variant="text" onClick={deleteFeature}>
              מחק
              <DeleteIcon />
            </Button>
          )}

        </Stack>

        {(isDisplayFeatures['pointsLayer'] || isDisplayFeatures['polygonsLayer']) && (
          <SearchGeomtry setMap={setMap} map={map} options={getAllFeatureNames} />
        )}

      </Stack>
      <Map onMapCreated={setMap} />
      <ToastContainer />
    </div>
  );
}

export default MapContainer;
