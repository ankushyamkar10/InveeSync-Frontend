import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  createBoM,
  updateBoM,
  deleteBoM,
  getBoM,
  getItems,
} from "../services/BillsOfMaterial";

// Fetch BoM Data
export const useFetchBoM = () => {
  return useQuery("bom", getBoM, {});
};

// Fetch Items Data
export const useFetchItems = () => {
  return useQuery("items", getItems, {});
};

// Create BoM Mutation
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

// Update BoM Mutation
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

// Delete BoM Mutation
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
