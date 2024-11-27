import { useQuery, useMutation, useQueryClient } from "react-query";

import {
  createProcess,
  deleteProcess,
  getProcess,
  getProcesses,
  updateProcess,
} from "../services/Process";
import {
  createProcessSteps,
  deleteProcessSteps,
  getProcessSteps,
  updateProcessSteps,
} from "../services/ProcessSteps";

export const useFetchProcess = (itemId) => {
  return useQuery(["process", itemId], () => getProcess(itemId), {
    staleTime: 10000, // adjust as needed
  });
};

export const useFetchProcesses = () => {
  return useQuery("process", () => getProcesses(), {
    staleTime: 10000, // adjust as needed
  });
};

export const useCreateProcessMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(createProcess, {
    onSuccess: () => {
      queryClient.invalidateQueries("process"); // Invalidate to refetch process after mutation
    },
  });
};

export const useUpdateProcessMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(updateProcess, {
    onSuccess: () => {
      queryClient.invalidateQueries("process"); // Invalidate to refetch process after mutation
    },
  });
};

export const useDeleteProcessMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteProcess, {
    onSuccess: () => {
      queryClient.invalidateQueries("process"); // Invalidate to refetch process after mutation
    },
  });
};

export const useFetchProcessSteps = (itemId, processId) => {
  return useQuery("process-steps", () => getProcessSteps(itemId, processId), {
    staleTime: 10000, // adjust as needed
    enabled: !!itemId && !!processId,
  });
};

export const useCreateProcessStepsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(createProcessSteps, {
    onSuccess: () => {
      queryClient.invalidateQueries("process-steps"); // Invalidate to refetch process after mutation
    },
  });
};

export const useUpdateProcessStepsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(updateProcessSteps, {
    onSuccess: () => {
      queryClient.invalidateQueries("process-steps"); // Invalidate to refetch process after mutation
    },
  });
};

export const useDeleteProcessStepsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteProcessSteps, {
    onSuccess: () => {
      queryClient.invalidateQueries("process-steps"); // Invalidate to refetch process after mutation
    },
  });
};
