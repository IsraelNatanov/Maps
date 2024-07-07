import React from "react";
import List from "@mui/material/List";
import { Box, Button } from "@mui/material";
import {  styleFunction } from "../../style/styleFunction";
import { useEffect, useState, useRef } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import Paper from "@mui/material/Paper";
import Vector from "ol/layer/Vector";
import Vectors from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { Geometry } from "ol/geom";
import { Feature, Map as OlMap, View } from 'ol';
import { io } from "socket.io-client";
import NewEventMessage from "../UI/alert/newEventMessage";
import { fromLonLat } from "ol/proj";
import ListItemVertical from "../UI/itemButton/itemButton";
import { Coordinate } from "ol/coordinate";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useDispatch } from "react-redux";
import { addEvent } from "../../store/features/eventFeaturesSlice";
import RenderButtons from "../UI/renderButtons/renderButtons";
import { ButtonsDataType } from "../../typs/buttonsDataType";
import { NotificationsOff } from "@mui/icons-material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { apiUrl } from "../../utils/axios-utils";


const theme = createTheme({
  direction: "rtl", // Both here and <body dir="rtl">
});

// Create rtl cache
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

const format = new GeoJSON({ featureProjection: "EPSG:3857" });

type MapProps = {

  map: OlMap | null
  isPoint: boolean
  handleAddLayerPoint: (nameLayer: string) => void

};

export default function DeviderEvent({ map, isPoint, handleAddLayerPoint }: MapProps) {
  const [isBell, setIsBell] = useState<boolean>(false);
  const [dataNewEvent, setDataNewEvent] = useState<string>('')
  const [isNewEvent, setIsNewEvent] = useState<boolean>(false);
  const featureIndexRef = useRef<Vector<Vectors<Geometry>> | null>(null);
  const eventSourceRef = useRef<Vectors<Geometry> | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const dispatch = useDispatch();

  const handleDisplayPaper = () => {
    setIsOpen(!isOpen)
    if(featureIndexRef.current){
      map!.removeLayer(featureIndexRef.current);
    }
  }
  const socket = io(apiUrl)
  //     , { extraHeaders:{
  // ['Authorzation']: 'Brear '+ ""
  //     }});

  useEffect(() => {

    socket.on("newEvent", (newEvent) => {
      console.log(
        newEvent
      );
      dispatch(addEvent(newEvent));
      setIsNewEvent(true)
      setDataNewEvent(newEvent.name)
    });
    return () => {
      socket.disconnect();
    };

  }, [])

  const listEventsDta = useSelector((state: RootState) => state.events.events);


  const eventSource = new Vectors();
  let featureOfIndex: Feature[];

  const featureIndex = new Vector({
    source: eventSource,
    style: styleFunction,
  });

  const playEvent = async (index: number = listEventsDta.length - 1) => {
    if (index == null) {
      map!.removeLayer(featureIndexRef.current!);
      return;
    }
    map!.removeLayer(featureIndexRef.current!);
    if (!isPoint) {
      handleAddLayerPoint('pointsLayer')
    }

    eventSourceRef.current?.clear();
    featureOfIndex = format.readFeatures(listEventsDta[index])
    featureIndexRef.current = featureIndex
    eventSource.addFeatures(featureOfIndex);
    setIsNewEvent(false)
    const point = listEventsDta[index].features[0].geometry.coordinates as Coordinate;

    map!.setView(
      new View({
        projection: "EPSG:3857",
        center: fromLonLat(point),
        zoom: 10,
      })
    );

    if (index >= 0) {
      map!.addLayer(featureIndex);

    }
    eventSourceRef.current = eventSource
  };
  const buttonsData: ButtonsDataType[] = [
    {
      id: '0',
      text: isOpen ? 'הסתר התראות' : 'הצג התראות',
      icon: isOpen ? <NotificationsOff /> : <NotificationsIcon />,
      onClick: () => handleDisplayPaper()
    },

  ];

  return (
    <React.Fragment >
      {isNewEvent && <NewEventMessage setIsNewEvent={setIsNewEvent} playEvent={playEvent} dataNewEvent={dataNewEvent} />}
      <RenderButtons buttonsData={buttonsData} />
      {isOpen && <CacheProvider value={cacheRtl}>
        <ThemeProvider theme={theme}>

          <Box sx={{ position: 'absolute', right: 0, zIndex: 7, top: 65, width: '150px', height: '500px', direction: "ltr", backgroundColor: 'white', borderBottom: '3px' }} >

            <Paper elevation={3} sx={{
              overflow: "hidden", height: 467, overflowY: 'auto', scrollbarWidth: 'thin', '&::-webkit-scrollbar': {
                width: '0.4em',
              },
              '&::-webkit-scrollbar-track': {
                'backgroundColor': '#f1f1f1'
              },
              '&::-webkit-scrollbar-thumb': {
                'backgroundColor': '#888'
              },
              '&::-webkit-scrollbar-thumb:hover': {
                'backgroundColor': '#555'
              },
            }}>
              <List sx={{ padding: 0 }}>
                {listEventsDta?.map((item, index) => {
                  if (!isBell && (index >= listEventsDta.length - 5)) {
                    return (
                      <ListItemVertical
                        key={item.id || index}
                        item={item}
                        onAction={playEvent}
                      />
                    );
                  }
                  if (isBell) {
                    return (
                      <ListItemVertical
                        key={item.id || index}
                        item={item}
                        onAction={playEvent}
                      />
                    );
                  }
                  return null;
                })}
              </List>


            </Paper>
            <Button
              sx={{
                display: "flex",
                width: '100%',
             
              }}
              variant="contained"
              onClick={() => setIsBell(!isBell)}
            >
              {isBell ? <> ראה פחות</> : <> כל האירועים</>}
            </Button>
          </Box>

        </ThemeProvider>
      </CacheProvider>}
    </React.Fragment>
  );
}
