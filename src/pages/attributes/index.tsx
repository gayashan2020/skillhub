import { useState, useEffect } from "react";
import { fetchAttributes, createAttribute, deleteAttribute } from "@/pages/attributes/services/attributeService";
import AdminLayout from "@/components/layout/AdminLayout/AdminLayout";

interface AttributeEntity {
    id: string;
    name: string;
    description?: string;
}

const AttributeManagementPage = () => {
    const [attributes, setAttributes] = useState<AttributeEntity[]>([]);
    const [loading, setLoading] = useState(false);
    const [newAttribute, setNewAttribute] = useState({ name: "", description: "" });

    // Fetch attributes
    const loadAttributes = async () => {
        setLoading(true);
        try {
            const data = await fetchAttributes();
            setAttributes(data);
        } catch (error) {
            console.error("Failed to fetch attributes", error);
        } finally {
            setLoading(false);
        }
    };

    // Add a new attribute
    const handleAddAttribute = async () => {
        try {
            const createdAttribute = await createAttribute(newAttribute);
            setAttributes((prev) => [createdAttribute, ...prev]);
            setNewAttribute({ name: "", description: "" }); // Reset form
        } catch (error) {
            console.error("Failed to create attribute", error);
        }
    };

    // Delete an attribute
    const handleDeleteAttribute = async (id: string) => {
        try {
            await deleteAttribute(id);
            setAttributes((prev) => prev.filter((attr) => attr.id !== id));
        } catch (error) {
            console.error("Failed to delete attribute", error);
        }
    };

    useEffect(() => {
        loadAttributes();
    }, []);

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-4">Attribute Management</h1>
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Attribute Name"
                    value={newAttribute.name}
                    onChange={(e) => setNewAttribute({ ...newAttribute, name: e.target.value })}
                    className="border rounded p-2 w-full mb-2"
                />
                <textarea
                    placeholder="Description (optional)"
                    value={newAttribute.description}
                    onChange={(e) => setNewAttribute({ ...newAttribute, description: e.target.value })}
                    className="border rounded p-2 w-full mb-2"
                />
                <button
                    onClick={handleAddAttribute}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Add Attribute
                </button>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="w-full border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-200 px-4 py-2 text-left">ID</th>
                            <th className="border border-gray-200 px-4 py-2 text-left">Name</th>
                            <th className="border border-gray-200 px-4 py-2 text-left">Description</th>
                            <th className="border border-gray-200 px-4 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attributes.map((attribute) => (
                            <tr key={attribute.id} className="hover:bg-gray-50">
                                <td className="border border-gray-200 px-4 py-2">{attribute.id}</td>
                                <td className="border border-gray-200 px-4 py-2">{attribute.name}</td>
                                <td className="border border-gray-200 px-4 py-2">{attribute.description || "N/A"}</td>
                                <td className="border border-gray-200 px-4 py-2">
                                    <button
                                        onClick={() => handleDeleteAttribute(attribute.id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

// Integrate AdminLayout using getLayout
AttributeManagementPage.getLayout = function getLayout(page: React.ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};

export default AttributeManagementPage;
