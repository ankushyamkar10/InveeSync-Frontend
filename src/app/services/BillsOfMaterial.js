import axiosnew from "../utils/axios";

export const getBoM = async () => {
  const response = await axiosnew.get("/bom");
  return response.data;
};



export const createBoM = async (formData) => {
  const response = await axiosnew.post("/bom", formData);
  return response.data;
};

export const updateBoM = async ({ bomId, formData }) => {
  const response = await axiosnew.put(`/bom/${bomId}`, formData);
  return response.data;
};

export const deleteBoM = async (bomId) => {
  const response = await axiosnew.delete(`/bom/${bomId}`);
  return response.data;
};
