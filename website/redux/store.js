"use client";

import { configureStore } from "@reduxjs/toolkit";
import pushSlice from "@/redux/slice/pushSlice";

import { persistStore, persistReducer } from "redux-persist";
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';

const createNoopStorage = () => {
   return {
      getItem(_key) {
         return Promise.resolve(null);
      },
      setItem(_key, value) {
         return Promise.resolve(value);
      },
      removeItem(_key) {
         return Promise.resolve();
      },
   };
};
const storage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage();

// Create persist configuration
const persistConfig = {
    key: "root",
    storage,
};
// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, pushSlice);

export const store = configureStore({
    reducer: {
        push: persistedReducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

// Create persistor
export const persistor = persistStore(store);