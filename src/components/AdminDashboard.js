import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [organization, setOrganization] = useState(null); // State for organization info
    const [users, setUsers] = useState([]);
    const [auditLogs, setAuditLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch organization info, users, and audit logs from the backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch organization info
                const orgResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/organization`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                });
                setOrganization(orgResponse.data);

                // Fetch users
                const usersResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                });
                setUsers(usersResponse.data);

                // Fetch audit logs
                const logsResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/audit-logs`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                });
                setAuditLogs(logsResponse.data);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Handle role change
    const handleRoleChange = async (userId, newRole) => {
        try {
            // Update role in the backend
            const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}/role`, {
                role: newRole,
            }, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });

            if (response.status === 200) {
                // Update role locally
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user.id === userId ? { ...user, role: newRole } : user
                    )
                );

                // Add to audit logs
                setAuditLogs((prevLogs) => [
                    ...prevLogs,
                    {
                        id: prevLogs.length + 1,
                        action: `Role changed for User ID ${userId} to ${newRole}`,
                        timestamp: new Date().toISOString(),
                    },
                ]);
            } else {
                console.error('Failed to update role');
            }
        } catch (error) {
            console.error('Error updating role:', error);
        }
    };

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

            {/* Organization Information */}
            {organization && (
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Organization Information</h2>
                    <div className="bg-white shadow-md rounded-lg p-4">
                        <p><strong>Name:</strong> {organization.name}</p>
                        <p><strong>Domain:</strong> {organization.domain}</p>
                    </div>
                </section>
            )}

            {/* User Role Management */}
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">User Role Management</h2>
                <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="p-4 text-left">User ID</th>
                            <th className="p-4 text-left">Name</th>
                            <th className="p-4 text-left">Role</th>
                            <th className="p-4 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-b">
                                <td className="p-4">{user.id}</td>
                                <td className="p-4">{user.name}</td>
                                <td className="p-4">{user.role}</td>
                                <td className="p-4">
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                        className="border rounded p-2"
                                    >
                                        <option value="Admin">Admin</option>
                                        <option value="Editor">Editor</option>
                                        <option value="Viewer">Viewer</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {/* Security Audit Logs */}
            <section>
                <h2 className="text-2xl font-semibold mb-4">Security Audit Logs</h2>
                <div className="bg-white shadow-md rounded-lg p-4">
                    <ul>
                        {auditLogs.map((log) => (
                            <li key={log.id} className="border-b py-2">
                                <span className="font-semibold">{log.action}</span> -{' '}
                                <span className="text-gray-600">{log.timestamp}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </div>
    );
};

export default AdminDashboard;