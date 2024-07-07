import {  useEffect } from 'react'

import './App.css'
import { QueryClientProvider, QueryClient } from 'react-query'
import { fetchEvents } from "./store/features/eventFeaturesSlice";
import { useAppDispatch } from "./store/hooks";
import MapContainer from './components/mapContainer/map-container';




function App() {

  const queryClient = new QueryClient()
 
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchEvents());
  });
  return (
 

<QueryClientProvider client={queryClient}>
    <MapContainer/>
    </QueryClientProvider>
      
  )
}

export default App
