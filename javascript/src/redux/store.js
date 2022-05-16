import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit"
import storage from "redux-persist/lib/storage";

import { profile } from "./reducers/profile"
import thunk from "redux-thunk";

import {
    persistStore,
    persistReducer,
} from "redux-persist"

const persistConfig = {
    key: 'storage',
    storage
}

const reducers = combineReducers({
    profile,
})
const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
    reducer: reducers,
    devTools: process.env.NODE_ENV !== "production",
    middleware: [thunk]
})


export const persistor = persistStore(store)