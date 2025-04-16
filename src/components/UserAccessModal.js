import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const UserAccessModal = ({
  user,
  availableDomains,
  token,
  onClose,
  onUpdate,
}) => {
  const [selectedAccess, setSelectedAccess] = useState(user.access || []);

  const handleAccessChange = (e) => {
    const selectedDomains = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectedAccess(selectedDomains);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/update-access`,
        {
          userId: user._id,
          access: selectedAccess,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        onUpdate(user._id, selectedAccess);
        toast.success("Access permissions updated successfully!");
        onClose();
      }
    } catch (error) {
      console.error("Error updating access:", error);
      toast.error(
        error.response?.data?.error || "Failed to update access permissions"
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">
          Update Access Permissions
        </h2>
        <p className="text-gray-600 mb-4">
          Managing access for:{" "}
          <span className="font-semibold">{user.email}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Access Domains
            </label>
            <select
              multiple
              value={selectedAccess}
              onChange={handleAccessChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              size={6}
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
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Update Access
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserAccessModal;
