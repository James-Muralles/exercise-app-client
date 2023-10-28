import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import authReducer from "./state";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { PersistGate } from "redux-persist/integration/react";
import { api } from "@/state/api";
import { combineReducers } from 'redux';

const persistConfig = { key: "root", storage, version: 1 };
const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const rootReducer = combineReducers({
  auth: persistedAuthReducer, // Your auth reducer
  [api.reducerPath]: api.reducer, // The API reducer
});
const store = configureStore({
  reducer: persistedAuthReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api.middleware),
});


const rootElement = document.getElementById("root");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistStore(store)}>
          <App />
        </PersistGate>
      </Provider>
    </React.StrictMode>
  );
} else {
  console.error("Root element with ID 'root' not found.");
}
