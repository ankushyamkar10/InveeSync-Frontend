import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  createBoM,
  updateBoM,
  deleteBoM,
  getBoM,
} from "../services/BillsOfMaterial";

export const useFetchBoM = () => {
  return useQuery("bom", getBoM, {});
};

export const useCreateBoMMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(createBoM, {
    onSuccess: () => {
      queryClient.invalidateQueries("bom");
    },
    onError: (error) => {
      console.error("Create BoM Error:", error);
    },
  });
};

export const useUpdateBoMMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(updateBoM, {
    onSuccess: () => {
      queryClient.invalidateQueries("bom");
    },
    onError: (error) => {
      console.error("Update BoM Error:", error);
    },
  });
};

export const useDeleteBoMMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteBoM, {
    onSuccess: () => {
      queryClient.invalidateQueries("bom");
    },
    onError: (error) => {
      console.error("Delete BoM Error:", error);
    },
  });
};
