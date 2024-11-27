import { useMutation, useQuery, useQueryClient } from "react-query";
import { createItem, deleteItem, getItems, updateItem } from "../services/ItemsMaster";


export const useFetchItems = () => {

  return useQuery(
    "items", 
    getItems,
    {
      staleTime: 10000, // adjust as needed
    }
  );
};


export const useCreateItemMutation = () => {
    const queryClient = useQueryClient();
  
    return useMutation(createItem, {
      onSuccess: () => {
        queryClient.invalidateQueries("items"); // Invalidate to refetch items after mutation
      },
    });
  };

  export const useUpdateItemMutation = () => {
    const queryClient = useQueryClient();
  
    return useMutation(updateItem, {
      onSuccess: () => {
        queryClient.invalidateQueries("items"); // Invalidate to refetch items after mutation
      },
    });
  };

  export const useDeleteItemMutation = () => {
    const queryClient = useQueryClient();
  
    return useMutation(deleteItem, {
      onSuccess: () => {
        queryClient.invalidateQueries("items"); // Invalidate to refetch items after mutation
      },
    });
  };