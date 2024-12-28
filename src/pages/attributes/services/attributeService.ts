import { apiRequest } from "@/lib/api";

interface AttributeEntity {
    id: string;
    name: string;
    description?: string;
}

/**
 * Fetch all attributes.
 * @returns Promise<AttributeEntity[]>
 */
export const fetchAttributes = async (): Promise<AttributeEntity[]> => {
    try {
        const response = await apiRequest<AttributeEntity[]>("/attributes");
        return response;
    } catch (error) {
        console.error("Failed to fetch attributes:", error);
        throw error;
    }
};

/**
 * Create a new attribute.
 * @param data - Attribute data.
 * @returns Promise<AttributeEntity>
 */
export const createAttribute = async (data: { name: string; description?: string }): Promise<AttributeEntity> => {
    try {
        const response = await apiRequest<AttributeEntity>("/attributes", "POST", data);
        return response;
    } catch (error) {
        console.error("Failed to create attribute:", error);
        throw error;
    }
};

/**
 * Delete an attribute by ID.
 * @param id - Attribute ID.
 * @returns Promise<void>
 */
export const deleteAttribute = async (id: string): Promise<void> => {
    try {
        await apiRequest<void>(`/attributes/${id}`, "DELETE");
    } catch (error) {
        console.error("Failed to delete attribute:", error);
        throw error;
    }
};
