import { auth } from "../firebase";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchUserProfile = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No user logged in");

    const token = await user.getIdToken();

    const response = await fetch(`${API_URL}/users/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch profile");
    }

    return await response.json();
  } catch (error) {
    console.error("Service Error:", error);
    throw error;
  }
};

export const updateUserProfile = async (profileData) => {
  const user = auth.currentUser;
  const token = await user.getIdToken();

  const response = await fetch(`${API_URL}/users/update-profile`, {
    method: "PUT", // שימי לב שזה PUT לעדכון
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update profile");
  }

  return response.json();
};
