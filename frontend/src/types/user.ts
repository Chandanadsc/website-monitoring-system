export interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  preferredNotification: "email" | "sms";
  createdAt: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  phoneNumber?: string;
  preferredNotification?: "email" | "sms";
  currentPassword?: string;
  newPassword?: string;
}
