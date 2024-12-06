import axiosnew from "../utils/axios";

export const createItem = async ( formData ) => {
  const response = await axiosnew.post(`/items`, formData, );
  return response.data;
};

export const getItems = async () => {
  const response = await axiosnew.get(`/items`);
  return response.data;
};

export const updateItem = async ({ itemId, formData }) => {

  const response = await axiosnew.put(`/items/${itemId}`, formData, );
  return response.data;
};

export const deleteItem = async (itemId) => {
  const response = await axiosnew.delete(`/items/${itemId}`, );
  return response.data;
};
