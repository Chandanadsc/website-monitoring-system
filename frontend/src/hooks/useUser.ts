import { useQuery, useMutation, useQueryClient } from "react-query";
import { useSnackbar } from "notistack";
import api from "../api/client";
import { User, UpdateUserDto } from "../types/user";

export const useUser = () => {
  return useQuery<User>("user", async () => {
    const { data } = await api.get("/users/me");
    return data;
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation(
    async (updateData: UpdateUserDto) => {
      const { data } = await api.put("/users/me", updateData);
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("user");
        enqueueSnackbar("Profile updated successfully", { variant: "success" });
      },
      onError: (error: any) => {
        enqueueSnackbar(
          error.response?.data?.message || "Failed to update profile",
          {
            variant: "error",
          }
        );
      },
    }
  );
};

export const useChangePassword = () => {
  const { enqueueSnackbar } = useSnackbar();

  return useMutation(
    async ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string;
      newPassword: string;
    }) => {
      const { data } = await api.put("/users/me/password", {
        currentPassword,
        newPassword,
      });
      return data;
    },
    {
      onSuccess: () => {
        enqueueSnackbar("Password changed successfully", {
          variant: "success",
        });
      },
      onError: (error: any) => {
        enqueueSnackbar(
          error.response?.data?.message || "Failed to change password",
          {
            variant: "error",
          }
        );
      },
    }
  );
};
