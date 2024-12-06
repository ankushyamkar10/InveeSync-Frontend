import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  createItem,
  deleteItem,
  getItems,
  updateItem,
} from "../services/ItemsMaster";

export const useFetchItems = () => {
  return useQuery("items", getItems);
};

export const useCreateItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(createItem, {
    onSuccess: () => {
      queryClient.invalidateQueries("items"); 
    },
  });
};

export const useUpdateItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(updateItem, {
    onSuccess: () => {
      queryClient.invalidateQueries("items"); 
    },
  });
};

export const useDeleteItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteItem, {
    onSuccess: () => {
      queryClient.invalidateQueries("items"); 
    },
  });
};
