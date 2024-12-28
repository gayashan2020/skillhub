import axiosInstance from "./axiosInstance";
import { isAxiosError } from "axios";

/**
 * A reusable API utility for making requests.
 * @param endpoint - API endpoint to call (e.g., "/posts").
 * @param method - HTTP method (e.g., "GET", "POST", etc.).
 * @param body - Optional request body.
 * @param headers - Optional additional headers.
 */
export async function apiRequest<T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    body?: Record<string, unknown>, // Enforce stricter typing
    headers?: Record<string, string>
): Promise<T> {
    try {
        const response = await axiosInstance({
            url: endpoint,
            method,
            data: body,
            headers,
        });
        return response.data;
    } catch (error) {
        if (isAxiosError(error)) {
            // Handle Axios-specific error
            throw new Error(error.response?.data?.error || "API request failed");
        }
        throw new Error("An unknown error occurred");
    }
}
