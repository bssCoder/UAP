import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import UserAccessModal from "./UserAccessModal";
import DomainModal from "./DomainModal";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    access: [],
  });
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDomainModal, setShowDomainModal] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "admin" || !user.organization) {
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
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/update-role`,
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
        // Show success notification
        toast.success(`Role updated successfully to ${newRole}`);
      }
    } catch (error) {
      console.error("Error updating role:", error);
      // Show error notification
      toast.error(error.response?.data?.error || "Failed to update role");
      if (error.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  const handleMfaToggle = async (userId, currentStatus) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/toggle-mfa`,
        {
          userId,
          enabled: !currentStatus,
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
            user._id === userId ? { ...user, mfaEnabled: !currentStatus } : user
          )
        );
      }
    } catch (error) {
      console.error("Error toggling MFA:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/create-users`,
        {
          ...newUser,
          orgId: user.organization._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setUsers([...users, response.data.user]);
        setShowCreateModal(false);
        setNewUser({
          name: "",
          email: "",
          password: "",
          role: "user",
          access: [],
        });
        toast.success("User created successfully!");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error(error.response?.data?.error || "Failed to create user");
    }
  };

  const handleAccessChange = (e) => {
    const selectedDomains = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setNewUser({ ...newUser, access: selectedDomains });
  };

  const handleUpdateAccess = (userId, newAccess) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === userId ? { ...user, access: newAccess } : user
      )
    );
  };

  const handleDomainAdded = (updatedOrg) => {
    user.organization.domains = updatedOrg.domains;
  };

  const handleDeleteUser = async (userId) => {
    // Prevent admin from deleting themselves
    if (userId === user._id) {
      toast.error("You cannot delete your own account");
      return;
    }

    // Show a confirmation dialog with the user's email
    const userToDelete = users.find((u) => u._id === userId);
    if (
      !window.confirm(
        `Are you sure you want to delete user ${userToDelete.email}? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/delete-users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setUsers(users.filter((user) => user._id !== userId));
        toast.success("User deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      if (error.response?.status === 401) {
        toast.error("Your session has expired. Please login again.");
        navigate("/admin-login");
      } else if (error.response?.status === 403) {
        toast.error("You don't have permission to delete this user");
      } else {
        toast.error(error.response?.data?.error || "Failed to delete user");
      }
    }
  };

  const availableDomains = user?.organization?.domains
    ? Object.entries(user.organization.domains).map(([name, domain]) => domain)
    : [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Create New User
        </button>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-4">Create New User</h2>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                  placeholder="Enter user's name"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  placeholder="Enter user's email"
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={newUser.password}
                  placeholder="Enter user's password"
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                  minLength={6}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="user">User</option>
                  <option value="developer">Developer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Access Domains
                </label>
                <select
                  multiple
                  value={newUser.access}
                  onChange={handleAccessChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  size={4}
                >
                  {availableDomains.map((domain) => (
                    <option key={domain} value={domain} className="my-1">
                      {domain}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  Hold Ctrl/Cmd to select multiple domains
                </p>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Organization Information */}
      {user?.organization && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Organization Information
          </h2>
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <p className="text-xl font-semibold">{user.organization.name}</p>
              <button
                onClick={() => setShowDomainModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Add Domain
              </button>
            </div>
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
            {showDomainModal && (
              <DomainModal
                token={token}
                orgId={user.organization._id}
                onClose={() => setShowDomainModal(false)}
                onDomainAdded={handleDomainAdded}
                currentDomains={user.organization.domains}
              />
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
                  MFA Status
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
                      {(user.access || []).join(", ")}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.mfaEnabled
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.mfaEnabled ? "Enabled" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-4">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user._id, e.target.value)
                        }
                        className="block w-32 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        <option value="user">User</option>
                        <option value="developer">Developer</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button
                        onClick={() =>
                          handleMfaToggle(user._id, user.mfaEnabled)
                        }
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                          user.mfaEnabled
                            ? "bg-red-100 text-red-700 hover:bg-red-200"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                        }`}
                      >
                        {user.mfaEnabled ? "Disable MFA" : "Enable MFA"}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowAccessModal(true);
                        }}
                        className="px-4 py-2 rounded-md text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200"
                      >
                        Manage Access
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="px-4 py-2 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
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

      {showAccessModal && selectedUser && (
        <UserAccessModal
          user={selectedUser}
          availableDomains={availableDomains}
          token={token}
          onClose={() => {
            setShowAccessModal(false);
            setSelectedUser(null);
          }}
          onUpdate={handleUpdateAccess}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
