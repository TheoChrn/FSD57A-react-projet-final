import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FavoritesState {
  watchList: string[];
}

const initialState: FavoritesState = {
  watchList: [],
};

export const watchListSlice = createSlice({
  name: "watchList",
  initialState,
  reducers: {
    addToWatchList: (state, action: PayloadAction<string>) => {
      if (state.watchList.includes(action.payload)) return;
      state.watchList.push(action.payload);
    },
    removeFromWatchList: (state, action: PayloadAction<string>) => {
      const index = state.watchList.findIndex((f) => f === action.payload);
      console.log(index);
      if (index !== -1) state.watchList.splice(index, 1);
    },
  },
});

export const { addToWatchList, removeFromWatchList } = watchListSlice.actions;

export default watchListSlice.reducer;
