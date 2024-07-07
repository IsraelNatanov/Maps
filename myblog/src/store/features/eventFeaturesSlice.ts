import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Eventes, FeaturesOfList } from "../../typs/featuresType";


  const initialState: Eventes = {
    events: [],
  };
  export const fetchEvents = createAsyncThunk(
    "events/fetch",
    async (thunkAPI) => {
      const response = await fetch("http://localhost:5000/eventsLayer", {
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



