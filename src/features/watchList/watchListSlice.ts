import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: string[] = [];

export const watchListSlice = createSlice({
  name: "watchList",
  initialState,
  reducers: {
    addToWatchList: (state, action: PayloadAction<string>) => {
      if (state.includes(action.payload)) return;
      state.push(action.payload);
    },
    removeFromWatchList: (state, action: PayloadAction<string>) => {
      const index = state.findIndex((f) => f === action.payload);
      console.log(index);
      if (index !== -1) state.splice(index, 1);
    },
  },
});

export const { addToWatchList, removeFromWatchList } = watchListSlice.actions;

export default watchListSlice.reducer;
