import { combineReducers} from "redux";
import { configureStore } from '@reduxjs/toolkit';

import fileReducer from "./file";
import userReducer from "./user";
import notificationReducer from "./notification";

const rootReducer = combineReducers({
  user: userReducer,
  file: fileReducer,
  notification: notificationReducer
});

export const store = configureStore({reducer: rootReducer});