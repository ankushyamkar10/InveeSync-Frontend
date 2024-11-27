import axiosnew from "../utils/axios";

export const createProcess = async ({ formData }) => {
  const response = await axiosnew.post(`/process`, formData, );
  return response.data;
};

export const getProcess = async (processId) => {
  const response = await axiosnew.get(`/process?id=${processId}` );
  return response.data;
};

export const getProcesses = async () => {
  const response = await axiosnew.get(`/process`);
  return response.data;
}

export const updateProcess = async ({ processId, formData }) => {
  const response = await axiosnew.put(`/process/${processId}`, formData, );
  return response.data;
};

export const deleteProcess = async ({ processId }) => {
  const response = await axiosnew.delete(`/process/${processId}`, );
  return response.data;
};
