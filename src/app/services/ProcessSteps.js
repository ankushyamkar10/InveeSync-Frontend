import axiosnew from "../utils/axios";

export const createProcessSteps = async ({ formData }) => {
  const response = await axiosnew.post(`/process-step`, formData);
  return response.data;
};

export const getProcessSteps = async (itemId, processId) => {
  const response = await axiosnew.get(
    `/process-step?item_id=${itemId}&process_id=${processId}`,
  );
  return response.data;
};

export const updateProcessSteps = async ({ itemId, formData }) => {
  const response = await axiosnew.put(`/process-step/${itemId}`, formData);
  return response.data;
};

export const deleteProcessSteps = async ({ itemId }) => {
  const response = await axiosnew.delete(`/process-step/${itemId}`);
  return response.data;
};
