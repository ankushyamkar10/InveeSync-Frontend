import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as XLSX from "xlsx";
import {
  loadFromLocalStorage,
  saveToLocalStorage,
  removeFromLocalStorage,
} from "../utils/localStorageUtils";

export const FILE_UPLOAD_KEY_BOM = "fileUploadBomState";

export const parseBomFile = createAsyncThunk(
  "fileUploadBom/parseBomFile",
  async (
    { file, validateFn, itemsTypes, boms, skipHeader = false },
    { rejectWithValue }
  ) => {
    try {
      // Read the file
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "buffer" });

      // Get the first sheet
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convert to JSON, optionally skipping header
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: skipHeader ? 1 : 0,
      });
      const validatedData = validateFn(jsonData, true, itemsTypes, boms);
      // Transform data to match your validation requirements
      // const processedData = jsonData.map((row, index) => ({
      //   row: Object.values(row),
      //   rowNumber: index + 2, // +2 because Excel rows start at 1 and we might skip header
      //   isValid: false, // You'll set this after validation
      //   reason: '' // Placeholder for validation reason
      // }));

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
