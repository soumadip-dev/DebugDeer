export interface UserProfile {
  id: string;
  name: string;
  email: string;
  image: string | null;
  createdAt: string;
}

export interface UserProfileResponse {
  success: boolean;
  message: string;
  data: UserProfile;
}

export interface UpdateUserProfileParams {
  name?: string;
  email?: string;
}

export interface UpdateUserProfileResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
  };
}
