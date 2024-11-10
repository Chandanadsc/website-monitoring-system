import { useQuery, useMutation, useQueryClient } from "react-query";
import api from "../api/client";
import { Website } from "../types";
import { useSnackbar } from "notistack";

export const useWebsites = () => {
  return useQuery<Website[]>(
    "websites",
    async () => {
      const { data } = await api.get("/websites");
      return data;
    },
    {
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );
};

export const useAddWebsite = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation(
    async (website: Partial<Website>) => {
      const { data } = await api.post("/websites", website);
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("websites");
        enqueueSnackbar("Website added successfully", { variant: "success" });
      },
      onError: (error: any) => {
        enqueueSnackbar(
          error.response?.data?.message || "Failed to add website",
          {
            variant: "error",
          }
        );
      },
    }
  );
};

export const useUpdateWebsite = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation(
    async ({ id, data }: { id: string; data: Partial<Website> }) => {
      const response = await api.put(`/websites/${id}`, data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("websites");
        enqueueSnackbar("Website updated successfully", { variant: "success" });
      },
      onError: (error: any) => {
        enqueueSnackbar(
          error.response?.data?.message || "Failed to update website",
          {
            variant: "error",
          }
        );
      },
    }
  );
};

export const useToggleAlerts = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (websiteId: string) => {
      const { data } = await api.post(`/websites/${websiteId}/toggle-alerts`);
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("websites");
      },
    }
  );
};

export const useDeleteWebsite = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation(
    async (websiteId: string) => {
      await api.delete(`/websites/${websiteId}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("websites");
        enqueueSnackbar("Website deleted successfully", { variant: "success" });
      },
      onError: (error: any) => {
        enqueueSnackbar(
          error.response?.data?.message || "Failed to delete website",
          { variant: "error" }
        );
      },
    }
  );
};
