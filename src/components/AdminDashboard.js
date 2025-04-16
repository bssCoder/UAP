import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.user);
    const token = useSelector((state) => state.user.token);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || user.role !== "admin") {
            navigate("/login");
        }
    }, [user, navigate]);

    useEffect(() => {
        const fetchData = async () => {
            if (!token || !user?.organization) return;

            try {
                const usersResponse = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}/api/admin/get-users`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                        data: { orgId: user.organization._id },
                    }
                );

                if (usersResponse.data.success) {
                    setUsers(usersResponse.data.data);
                }

                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
                if (error.response?.status === 401 || error.response?.status === 403) {
                    navigate("/login");
                }
            }
        };

        fetchData();
    }, [token, user, navigate]);

    const handleRoleChange = async (userId, newRole) => {
        try {
            const response = await axios.put(
                `${process.env.REACT_APP_BACKEND_URL}/api/user/update`,
                {
                    userId,
                    role: newRole,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data.success) {
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user._id === userId ? { ...user, role: newRole } : user
                    )
                );
            }
        } catch (error) {
            console.error("Error updating role:", error);
            if (error.response?.status === 401) {
                navigate("/login");
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-xl font-semibold text-gray-600">Loading...</div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

            {/* Organization Information */}
            {user?.organization && (
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">
                        Organization Information
                    </h2>
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <p className="text-xl font-semibold mb-4">
                            {user.organization.name}
                        </p>
                        <h3 className="text-lg font-semibold mb-4">Organization Domains</h3>
                        {Object.entries(user.organization.domains).length > 0 ? (
                            <div className="space-y-4">
                                {Object.entries(user.organization.domains).map(
                                    ([name, domain]) => (
                                        <div
                                            key={name}
                                            className="flex items-center justify-between p-4 bg-blue-50 rounded-lg"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <svg
                                                    className="h-6 w-6 text-blue-600"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9-3-9m-9 9a9 9 0 019-9"
                                                    />
                                                </svg>
                                                <div>
                                                    <span className="text-gray-700 font-medium">
                                                        {domain}
                                                    </span>
                                                    <p className="text-sm text-gray-500">{name}</p>
                                                </div>
                                            </div>
                                            <a
                                                href={`https://${domain}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                                            >
                                                Visit Website →
                                            </a>
                                        </div>
                                    )
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-500">
                                No domains configured for this organization.
                            </p>
                        )}
                    </div>
                </section>
            )}

            {/* User Management */}
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">User Management</h2>
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Access
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {user.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">
                                            {user.access.join(", ")}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <select
                                            value={user.role}
                                            onChange={(e) =>
                                                handleRoleChange(user._id, e.target.value)
                                            }
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                        >
                                            <option value="user">User</option>
                                            <option value="developer">Developer</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Login History */}
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Recent Logins</h2>
                <div className="bg-white shadow-md rounded-lg p-4 max-h-64 overflow-y-auto">
                    <div className="flow-root">
                        <ul className="space-y-4">
                            {users
                                .map((user) =>
                                    user.loginHistory?.slice(0, 5).map((login, idx) => (
                                        <li key={`${user._id}-${idx}`} className="pb-4">
                                            <div className="relative">
                                                <span className="text-sm text-gray-500">
                                                    {new Date(login.timestamp).toLocaleString()}
                                                </span>
                                                <p className="mt-1 text-sm text-gray-900">
                                                    {user.email} logged in
                                                </p>
                                            </div>
                                        </li>
                                    ))
                                )
                                .flat()}
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AdminDashboard;
