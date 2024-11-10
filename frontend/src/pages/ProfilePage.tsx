import { useState } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  FormHelperText,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "../contexts/AuthContext";

const profileSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: yup.string().required("Phone number is required"),
  preferredNotification: yup.string().oneOf(["email", "sms"]).required(),
});

const passwordSchema = yup.object({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .required("Please confirm your password"),
});

export const ProfilePage = () => {
  const { user, updateProfile, updatePassword } = useAuth();
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfile,
    control,
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      preferredNotification: user?.preferredNotification || "email",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  const onProfileSubmit = async (data: any) => {
    try {
      await updateProfile(data);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  const onPasswordSubmit = async (data: any) => {
    try {
      await updatePassword(data.currentPassword, data.newPassword);
      resetPassword();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update password");
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Profile Settings
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={3}>
              <Typography variant="h6">Profile Information</Typography>
              <Button
                variant="outlined"
                onClick={() => {
                  if (isEditing) {
                    resetProfile();
                  }
                  setIsEditing(!isEditing);
                }}>
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </Box>

            <form onSubmit={handleProfileSubmit(onProfileSubmit)}>
              <Grid container spacing={2}>
                {/* Profile form fields */}
                <Grid item xs={12}>
                  <TextField
                    {...registerProfile("name")}
                    label="Name"
                    fullWidth
                    disabled={!isEditing}
                    error={!!profileErrors.name}
                    helperText={profileErrors.name?.message}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    {...registerProfile("email")}
                    label="Email"
                    fullWidth
                    disabled={!isEditing}
                    error={!!profileErrors.email}
                    helperText={profileErrors.email?.message}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    {...registerProfile("phoneNumber")}
                    label="Phone Number"
                    fullWidth
                    disabled={!isEditing}
                    error={!!profileErrors.phoneNumber}
                    helperText={profileErrors.phoneNumber?.message}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl
                    fullWidth
                    disabled={!isEditing}
                    error={!!profileErrors.preferredNotification}>
                    <InputLabel>Preferred Notification</InputLabel>
                    <Controller
                      name="preferredNotification"
                      control={control}
                      defaultValue="email"
                      render={({ field }) => (
                        <Select {...field} label="Preferred Notification">
                          <MenuItem value="email">Email</MenuItem>
                          <MenuItem value="sms">SMS</MenuItem>
                        </Select>
                      )}
                    />
                    {profileErrors.preferredNotification && (
                      <FormHelperText>
                        {profileErrors.preferredNotification.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                {isEditing && (
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth>
                      Save Changes
                    </Button>
                  </Grid>
                )}
              </Grid>
            </form>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Change Password
            </Typography>

            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    {...registerPassword("currentPassword")}
                    type="password"
                    label="Current Password"
                    fullWidth
                    error={!!passwordErrors.currentPassword}
                    helperText={passwordErrors.currentPassword?.message}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    {...registerPassword("newPassword")}
                    type="password"
                    label="New Password"
                    fullWidth
                    error={!!passwordErrors.newPassword}
                    helperText={passwordErrors.newPassword?.message}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    {...registerPassword("confirmPassword")}
                    type="password"
                    label="Confirm New Password"
                    fullWidth
                    error={!!passwordErrors.confirmPassword}
                    helperText={passwordErrors.confirmPassword?.message}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth>
                    Change Password
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};
