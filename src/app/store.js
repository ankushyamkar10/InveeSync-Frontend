import { configureStore } from '@reduxjs/toolkit';
import fileUploadItemReducer from "@/app/feature/fileUploadItemSlice.js"
import fileUploadBomReducer from "@/app/feature/fileUploadBomSlice.js"

export const store = configureStore({
  reducer: {
    fileUploadItem: fileUploadItemReducer,
    fileUploadBom: fileUploadBomReducer,
  },
});
