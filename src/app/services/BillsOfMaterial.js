import axiosnew from "../utils/axios";

// Fetch all BoM data
export const getBoM = async () => {
  const response = await axiosnew.get("/bom");
  return response.data;
};

// Fetch items data
export const getItems = async () => {
  const response = await axiosnew.get("/items");
  return response.data;
};

// Create BoM entry
export const createBoM = async (formData) => {
  const response = await axiosnew.post("/bom", formData);
  return response.data;
};

// Update BoM entry
export const updateBoM = async ({ bomId, formData }) => {
  const response = await axiosnew.put(`/bom/${bomId}`, formData);
  return response.data;
};

// Delete BoM entry
export const deleteBoM = async (bomId) => {
  const response = await axiosnew.delete(`/bom/${bomId}`);
  return response.data;
};
