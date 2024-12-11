import { configureStore } from "@reduxjs/toolkit";
import favoritesReducer from "@/features/favorites/favoritesSlice";
import watchListReducer from "@/features/watchList/watchListSlice";

export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
    watchList: watchListReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
