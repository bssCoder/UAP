import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const DomainModal = ({ token, orgId, onClose, onDomainAdded, currentDomains }) => {
    const [domainData, setDomainData] = useState({
        name: "",
        domain: ""
    });
    const [selectedDomain, setSelectedDomain] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/api/organization/domain/add`,
                {
                    ...domainData,
                    orgId
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data.success) {
                onDomainAdded(response.data.data);
                toast.success("Domain added successfully!");
                onClose();
            }
        } catch (error) {
            console.error("Error adding domain:", error);
            toast.error(error.response?.data?.error || "Failed to add domain");
        }
    };

    const handleRemoveDomain = async () => {
        if (!selectedDomain) {
            toast.error("Please select a domain to remove");
            return;
        }

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/api/organization/domain/remove`,
                {
                    orgId,
                    name: selectedDomain
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data.success) {
                onDomainAdded(response.data.data);
                toast.success("Domain removed successfully!");
                setSelectedDomain("");
            }
        } catch (error) {
            console.error("Error removing domain:", error);
            toast.error(error.response?.data?.error || "Failed to remove domain");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-4">Manage Domains</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Domain Name (Label)
                        </label>
                        <input
                            type="text"
                            value={domainData.name}
                            onChange={(e) => setDomainData({ ...domainData, name: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g., Production, Development"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Domain URL
                        </label>
                        <input
                            type="text"
                            value={domainData.domain}
                            onChange={(e) => setDomainData({ ...domainData, domain: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g., example.com"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white rounded-lg hover:bg-blue-700 py-2 px-4"
                    >
                        Add Domain
                    </button>
                </form>

                <div className="mt-6 border-t pt-6">
                    <h3 className="text-lg font-medium mb-3">Remove Domain</h3>
                    <div className="space-y-4">
                        <select
                            value={selectedDomain}
                            onChange={(e) => setSelectedDomain(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="">Select domain to remove</option>
                            {currentDomains && Object.entries(currentDomains).map(([name]) => (
                                <option key={name} value={name}>
                                    {name}
                                </option>
                            ))}
                        </select>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={handleRemoveDomain}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                disabled={!selectedDomain}
                            >
                                Remove Domain
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DomainModal;