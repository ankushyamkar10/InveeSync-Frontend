import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as XLSX from "xlsx";
import {
  loadFromLocalStorage,
  saveToLocalStorage,
  removeFromLocalStorage,
} from "../utils/localStorage";

export const FILE_UPLOAD_KEY_BOM = "fileUploadBomState_inveesync";

export const parseBomFile = createAsyncThunk(
  "fileUploadBom/parseBomFile",
  async (
    { file, validateFn, itemsTypes, boms, skipHeader = false },
    { rejectWithValue }
  ) => {
    try {

      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "buffer", raw:true });


      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];


      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        raw:true,
        header: skipHeader ? 1 : 0,
      });
      
      const processedData = jsonData.map((row) => {
        return Object.values(
          Object.fromEntries(
            Object.entries(row).map(([key, value]) => {
              if (typeof value === "string" && !isNaN(value)) {
                // Convert numeric strings to numbers
                return [key, parseFloat(value)];
              } else if (value === "TRUE" || value === "FALSE") {
                // Convert string booleans to actual booleans
                return [key, value === "TRUE"];
              }
              return [key, value];
            })
          )
        );
      });
      

      console.log(processedData,jsonData)

      const validatedData = validateFn(jsonData, true, itemsTypes, boms);
      
      return validatedData;
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

const initialState = {
  files: [],
  csvData: [],
  isLoading: false,
  error: null,
};

const fileUploadBomSlice = createSlice({
  name: "fileUploadBom",
  initialState: loadFromLocalStorage(FILE_UPLOAD_KEY_BOM, initialState),
  reducers: {
    setBomFiles: (state, action) => {
      // state.files = action.payload;
      // saveToLocalStorage(FILE_UPLOAD_KEY_BOM, state);
    },
    clearBomData: (state) => {
      state.files = [];
      state.csvData = [];
      state.isLoading = false;
      state.error = null;
      removeFromLocalStorage(FILE_UPLOAD_KEY_BOM);
    },
    editBomCsvCell: (state, action) => {
      const  newCsvData = action.payload;
      state.csvData = newCsvData;
      saveToLocalStorage(FILE_UPLOAD_KEY_BOM, state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(parseBomFile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        saveToLocalStorage(FILE_UPLOAD_KEY_BOM, state);
      })
      .addCase(parseBomFile.fulfilled, (state, action) => {
        state.csvData = action.payload;
        state.isLoading = false;
        saveToLocalStorage(FILE_UPLOAD_KEY_BOM, state);
      })
      .addCase(parseBomFile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = "Failed to parse file";
        saveToLocalStorage(FILE_UPLOAD_KEY_BOM, state);
      });
  },
});

export const { setBomFiles, clearBomData, editBomCsvCell } =
  fileUploadBomSlice.actions;
export default fileUploadBomSlice.reducer;
