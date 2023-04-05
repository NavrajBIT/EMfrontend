import { configureStore, getDefaultMiddleware} from "@reduxjs/toolkit";
import { persistedReducer } from "./persistedReducer";
import { FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER, autoRehydrate} from 'redux-persist'
import persistStore from "redux-persist/lib/persistStore";


export const store = configureStore({
    reducer:{
        persistedReducer
    },
    middleware: getDefaultMiddleware({
    serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
    autoRehydrate
})

export const persistor = persistStore(store)