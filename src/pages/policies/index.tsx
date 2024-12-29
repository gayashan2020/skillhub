import { useState, useEffect } from "react";
import { getPolicies, createPolicy, deletePolicy, Policy } from "./services/policyService";
import AdminLayout from "@/components/layout/AdminLayout/AdminLayout";

const PolicyManagementPage = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [newPolicy, setNewPolicy] = useState({
    name: "",
    description: "",
    conditions: "{}",
  });
  const [loading, setLoading] = useState(false);

  const fetchPolicies = async () => {
    setLoading(true);
    try {
      const response = await getPolicies();
      setPolicies(response);
    } catch (error) {
      console.error("Failed to fetch policies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePolicy = async () => {
    try {
      const parsedConditions = JSON.parse(newPolicy.conditions);
      const policy = await createPolicy({
        name: newPolicy.name,
        description: newPolicy.description,
        conditions: parsedConditions,
      });
      setPolicies((prev) => [...prev, policy]);
      setNewPolicy({ name: "", description: "", conditions: "{}" });
    } catch (error) {
      console.error("Failed to create policy:", error);
    }
  };

  const handleDeletePolicy = async (id: string) => {
    try {
      await deletePolicy(id);
      setPolicies((prev) => prev.filter((policy) => policy.id !== id));
    } catch (error) {
      console.error("Failed to delete policy:", error);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Policy Management</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Policy Name"
          value={newPolicy.name}
          onChange={(e) => setNewPolicy({ ...newPolicy, name: e.target.value })}
          className="border rounded p-2 w-full mb-2"
        />
        <textarea
          placeholder="Policy Description"
          value={newPolicy.description}
          onChange={(e) => setNewPolicy({ ...newPolicy, description: e.target.value })}
          className="border rounded p-2 w-full mb-2"
        />
        <textarea
          placeholder='Conditions (e.g., {"role": "admin", "resource.type": "sensitive"})'
          value={newPolicy.conditions}
          onChange={(e) => setNewPolicy({ ...newPolicy, conditions: e.target.value })}
          className="border rounded p-2 w-full mb-2"
        />
        <button
          onClick={handleCreatePolicy}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create Policy
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
              <th className="border border-gray-200 px-4 py-2 text-left">Conditions</th>
              <th className="border border-gray-200 px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {policies.map((policy) => (
              <tr key={policy.id} className="hover:bg-gray-50">
                <td className="border border-gray-200 px-4 py-2">{policy.id}</td>
                <td className="border border-gray-200 px-4 py-2">{policy.name}</td>
                <td className="border border-gray-200 px-4 py-2">{policy.description || "N/A"}</td>
                <td className="border border-gray-200 px-4 py-2">
                  <pre className="bg-gray-100 p-2 rounded">{JSON.stringify(policy.conditions, null, 2)}</pre>
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  <button
                    onClick={() => handleDeletePolicy(policy.id)}
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
PolicyManagementPage.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default PolicyManagementPage;
