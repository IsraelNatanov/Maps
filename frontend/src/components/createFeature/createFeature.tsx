import React, { useState, useEffect, useRef, useMemo } from "react";
import { Vector as VectorLayer } from "ol/layer";
import { Draw, Modify, Snap } from "ol/interaction";
import "ol/ol.css";
import { Feature, Map as OlMap } from "ol";
import Geometry, { Type } from "ol/geom/Geometry";
import MessageCartoon from "../UI/message/messageCartoon";
import { DrawEvent } from "ol/interaction/Draw";
import { getMessageContent } from "../../utils/getMessageContent";
import { DrawInteractionType } from "../../typs/buttonsDataType";
import { AddFeatureParams} from "../../hooks/useFeaturesData";
import VectorSource from "ol/source/Vector";
import AlertDialog from "../UI/alert/alertDialog";
import { IFeatures } from "../../typs/featuresType";
import { getTransformCoordinates } from "../../utils/getTransformCoordinates";

interface MapComponentProps {
    setMap: React.Dispatch<React.SetStateAction<OlMap | null>>;
    map: OlMap | null;
    addFeatureMutate: (params: AddFeatureParams) => void
}

const CreateFeature: React.FC<MapComponentProps> = ({ map, setMap, addFeatureMutate }) => {

    const drawInteractionRef = useRef<Draw | null>(null);
    const modifyInteractionRef = useRef<Modify | null>(null);
    const snapInteractionRef = useRef<Snap | null>(null);
    const vectorSourceRef = useRef<VectorSource<Geometry> | null>(null);
    const [openAlertDialog, setOpenAlertDialog] = useState<boolean>(false);
    const [openMessage, setOpenMessage] = useState<boolean>(false);
   const [drawInteractionType, setDrawInteractionType] = useState<DrawInteractionType>('None');
    const [nameFeature, setNameFeature] = useState('שם הגזרה');
    const [currentFeature, setCurrentFeature] = useState<Feature<Geometry>>();
    const [nameLayer, setNameLayer] = useState<string>('')
    const selectRef = useRef<HTMLSelectElement>(null);

    useEffect(() => {
        if (map && !modifyInteractionRef.current && !snapInteractionRef.current) {
            const vectorSource = new VectorSource<Geometry>();
            const vectorLayer = new VectorLayer<VectorSource<Geometry>>({
                source: vectorSource,
                style: {
                    "fill-color": "rgba(255, 255, 255, 0.2)",
                    "stroke-color": "#ffcc33",
                    "stroke-width": 2,
                    "circle-radius": 7,
                    "circle-fill-color": "#ffcc33",
                },
            });

            const modifyInteraction = new Modify({ source: vectorSource });
            modifyInteractionRef.current = modifyInteraction;

            const snapInteraction = new Snap({ source: vectorSource });
            snapInteractionRef.current = snapInteraction;

            map.addLayer(vectorLayer);
            vectorSourceRef.current = vectorSource;

            map.addInteraction(modifyInteraction);
            map.addInteraction(snapInteraction);

            return () => {
                if (modifyInteractionRef.current && snapInteractionRef.current) {
                    // map.removeInteraction(modifyInteractionRef.current);
                    // map.removeInteraction(snapInteractionRef.current);
                }
            };
        }
    }, [map, setMap]);

    const { subjectText, descriptionText } = useMemo(() => getMessageContent(drawInteractionType), [drawInteractionType]);
    console.log('subjectText', subjectText);

    const handleStartDrawing = async (e: string) => {

        if (e != 'None' && map && vectorSourceRef.current) {
            console.log('e', e);
            setNameLayer(e)
            const typeDraw = e === 'polygonsLayer' ? 'Polygon' : 'Point'
            setDrawInteractionType(typeDraw as DrawInteractionType)
            setOpenMessage(true)


            const drawInteraction = new Draw({
                source: vectorSourceRef.current,
                type: typeDraw as Type,
            });

            drawInteractionRef.current = drawInteraction;
            drawInteractionRef.current.on("drawend", (event: DrawEvent) => {
                const feature = event.feature;
                setCurrentFeature(feature);

                map!.removeInteraction(drawInteractionRef.current!);

            });
            map.addInteraction(drawInteraction);
        }
        else if (e === 'None') {
            map!.removeInteraction(drawInteractionRef.current!);
            setOpenMessage(false)
        }
    };

    const closeButtonMessage = () => {
        setOpenMessage(false)
        vectorSourceRef.current!.removeFeature(currentFeature!);
        if (selectRef.current !== null) {
            selectRef.current.value = 'None';

        }
        map!.removeInteraction(drawInteractionRef.current!);
    }

    const handleClose = () => {
        if (selectRef.current !== null) {
            selectRef.current.value = 'None';
        }
        if (currentFeature) {

            vectorSourceRef.current!.removeFeature(currentFeature);
            setOpenMessage(false)

        }
        setOpenAlertDialog(false);
    };


    const handleSave = async () => {
        setOpenAlertDialog(false)
        const idFeature = Date.now().toString();
        if (nameFeature && currentFeature) {

            const geoJson: IFeatures = getTransformCoordinates(drawInteractionType, currentFeature, nameFeature, idFeature, nameLayer)
            addFeatureMutate({ layer: nameLayer, feature: geoJson });

            handleClose()
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNameFeature(event.target.value);
    };

    return (
        <div className="create-polygon">

            <div className="row-box">
                <button
                disabled = {selectRef.current?.value === "None" || !selectRef}
                    className="form-control"
                    onClick={() => setOpenAlertDialog(true)}
                >
                    שמור
                </button>
                <select
                    className="form-select"
                    id="type"
                    ref={selectRef}
                    onChange={(e) => handleStartDrawing(e.target.value)}
                >
                    <option value="None">None</option>
                    <option value="pointsLayer">אתר-קשר</option>
                    <option value="polygonsLayer">גזרות</option>
                    <option value="eventsLayer">אירוע</option>

                </select>
                <label className="inpu-text" htmlFor="type">
                    :סוג גאומטרי
                </label>

            </div>

            <AlertDialog openAlertDialog={openAlertDialog} setOpenAlertDialog={setOpenAlertDialog} handleSave={handleSave} handleClose={handleClose} handleChange={handleChange} subjectText="אנה הזן שם לאתר/פוליגון" labelText="שם האתר/הפוליגון" />
            {openMessage && <MessageCartoon closeButtonMessage={closeButtonMessage} subjectText={subjectText} descriptionText={descriptionText} />}
           
        </div>
    )
}
export default CreateFeature;