import { configureStore } from '@reduxjs/toolkit';
import fileUploadItemReducer from "@/app/feature/itemUploadsSlice.js"
import fileUploadBomReducer from "@/app/feature/bomUploadsSlice.js"

export const store = configureStore({
  reducer: {
    fileUploadItem: fileUploadItemReducer,
    fileUploadBom: fileUploadBomReducer,
  },
});
