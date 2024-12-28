import { apiRequest } from "@/lib/api";

interface UserEntity {
    id: string;
    name: string;
    email: string;
    roles: string[];
}

interface UserResponse {
    users: UserEntity[];
    total: number;
}

/**
 * Fetch all users from the API.
 * @returns Promise<UserResponse> - A list of users with a total count.
 */
export const fetchAllUsers = async (): Promise<UserResponse> => {
    try {
        const response = await apiRequest<UserResponse>("/users");
        return response;
    } catch (error) {
        console.error("Failed to fetch users:", error);
        throw error;
    }
};

/**
 * Update a user.
 * @param id - The ID of the user to update.
 * @param data - The updated user data.
 * @returns Promise<UserEntity> - The updated user.
 */
export const updateUser = async (id: string, data: { name: string; email: string }): Promise<UserEntity> => {
    try {
        const response = await apiRequest<UserEntity>(`/users/${id}`, "PUT", data);
        return response;
    } catch (error) {
        console.error("Failed to update user:", error);
        throw error;
    }
};
