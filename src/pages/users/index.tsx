import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout/AdminLayout";
import { fetchAllUsers, updateUser } from "@/pages/users/services/userService";

interface UserEntity {
    id: string;
    name: string;
    email: string;
    roles: string[];
}

const UserManagementPage = () => {
    const [users, setUsers] = useState<UserEntity[]>([]);
    const [loading, setLoading] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserEntity | null>(null);
    const [formData, setFormData] = useState({ name: "", email: "" });

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetchAllUsers();
            setUsers(response.users);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateUser = async () => {
        if (!selectedUser) return;
        try {
            const updatedUser = await updateUser(selectedUser.id, formData);
            setUsers((prev) =>
                prev.map((user) => (user.id === updatedUser.id ? updatedUser : user))
            );
            setShowDialog(false);
            setSelectedUser(null);
        } catch (error) {
            console.error("Failed to update user", error);
        }
    };

    const openDialog = (user: UserEntity) => {
        setSelectedUser(user);
        setFormData({ name: user.name, email: user.email });
        setShowDialog(true);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-4">User Management</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="w-full border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-200 px-4 py-2 text-left">ID</th>
                            <th className="border border-gray-200 px-4 py-2 text-left">Name</th>
                            <th className="border border-gray-200 px-4 py-2 text-left">Email</th>
                            <th className="border border-gray-200 px-4 py-2 text-left">Roles</th>
                            <th className="border border-gray-200 px-4 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="border border-gray-200 px-4 py-2">{user.id}</td>
                                <td className="border border-gray-200 px-4 py-2">{user.name}</td>
                                <td className="border border-gray-200 px-4 py-2">{user.email}</td>
                                <td className="border border-gray-200 px-4 py-2">
                                    {user.roles.length > 0 ? user.roles.join(", ") : "No Roles"}
                                </td>
                                <td className="border border-gray-200 px-4 py-2">
                                    <button
                                        onClick={() => openDialog(user)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded"
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {showDialog && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Update User</h2>
                        <div className="mb-4">
                            <label className="block mb-2">Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="border rounded p-2 w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="border rounded p-2 w-full"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowDialog(false)}
                                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateUser}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Integrate AdminLayout using getLayout
UserManagementPage.getLayout = function getLayout(page: React.ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};

export default UserManagementPage;
