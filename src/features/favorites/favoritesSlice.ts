import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: string[] = [];

export const favoriteSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addToFavorites: (state, action: PayloadAction<string>) => {
      if (state.includes(action.payload)) return;
      state.push(action.payload);
    },
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      const index = state.findIndex((f) => f === action.payload);
      if (index !== -1) state.splice(index, 1);
    },
  },
});

export const { addToFavorites, removeFromFavorites } = favoriteSlice.actions;

export default favoriteSlice.reducer;
