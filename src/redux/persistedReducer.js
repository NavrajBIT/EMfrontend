import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import categorySlice from "../features/categorySlice";

const persistConfig ={
    storage:AsyncStorage,
    key:'root'
}

const reducers = combineReducers({
    category:categorySlice
})

export const persistedReducer = persistReducer(persistConfig,  reducers);
