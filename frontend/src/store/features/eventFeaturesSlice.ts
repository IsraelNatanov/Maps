import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Eventes, FeaturesOfList } from "../../typs/featuresType";
import { apiUrl } from "../../utils/axios-utils";


  const initialState: Eventes = {
    events: [],
  };
  export const fetchEvents = createAsyncThunk(
    "events/fetch",
    async () => {
      const response = await fetch(`${apiUrl}/eventsLayer`, {
        method: "GET",
      });
      const data = response.json();
      console.log('datas', data);
      
      return data;
    },
  );
  

  export const eventsSlice = createSlice({
    name: "events",
    initialState,
    reducers: {
      addEvent: (state, action: PayloadAction<FeaturesOfList>) => {
        state.events.push(action.payload);
      },
  
    },
    extraReducers: (builder) => {
      builder.addCase(fetchEvents.fulfilled, (state, action) => {
        state.events = action.payload;
      });
  
    
    },
  });
  
  export const { addEvent } = eventsSlice.actions;
  export default eventsSlice.reducer;



