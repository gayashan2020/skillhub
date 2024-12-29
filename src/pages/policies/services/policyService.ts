import { apiRequest } from "@/lib/api";

export interface Policy {
    id: string;
    name: string;
    description?: string;
    conditions: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
}

export const getPolicies = async (): Promise<Policy[]> => {
    return apiRequest<Policy[]>("/policies");
};

export const createPolicy = async (policy: Omit<Policy, "id" | "createdAt" | "updatedAt">): Promise<Policy> => {
    return apiRequest<Policy>("/policies", "POST", policy);
};

export const deletePolicy = async (id: string): Promise<void> => {
    return apiRequest<void>(`/policies/${id}`, "DELETE");
};
