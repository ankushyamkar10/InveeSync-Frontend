'use client'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as XLSX from 'xlsx';
import { 
  loadFromLocalStorage, 
  saveToLocalStorage, 
  removeFromLocalStorage 
} from '../utils/localStorageUtils';

export const FILE_UPLOAD_KEY_ITEMS = 'fileUploadItemState';

export const parseItemFile = createAsyncThunk(
  'fileUploadItem/parseFile',
  async ({ file, validateFn, itemsTypes, items, skipHeader = false }, { rejectWithValue }) => {
    try {
      // Read the file
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'buffer' });
      
      // Get the first sheet
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to JSON, optionally skipping header
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
        header: skipHeader ? 1 : 0 
      });
      const validatedData = validateFn(jsonData, true, itemsTypes, items);

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
  error: null
};

const fileUploadItemSlice = createSlice({
  name: 'fileUpload',
  initialState: loadFromLocalStorage(FILE_UPLOAD_KEY_ITEMS, initialState),
  reducers: {
    setItemFiles: (state, action) => {
      state.files = action.payload;
      saveToLocalStorage(FILE_UPLOAD_KEY_ITEMS, state);
    },
    clearItemData: (state) => {
      state.files = [];
      state.csvData = [];
      state.isLoading = false;
      state.error = null;
      removeFromLocalStorage(FILE_UPLOAD_KEY_ITEMS);
    },
    editItemsCsvCell: (state, action) => {
      const  newCsvData = action.payload;
      state.csvData = newCsvData;
      saveToLocalStorage(FILE_UPLOAD_KEY_ITEMS, state);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(parseItemFile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        saveToLocalStorage(FILE_UPLOAD_KEY_ITEMS, state);
      })
      .addCase(parseItemFile.fulfilled, (state, action) => {
        state.csvData = action.payload;
        state.isLoading = false;
        saveToLocalStorage(FILE_UPLOAD_KEY_ITEMS, state);
      })
      .addCase(parseItemFile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to parse file';
        saveToLocalStorage(FILE_UPLOAD_KEY_ITEMS, state);
      });
  }
});

export const { setItemFiles, clearItemData, editItemsCsvCell } = fileUploadItemSlice.actions;
export default fileUploadItemSlice.reducer;

// Example usage in a component