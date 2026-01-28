import { useState, useEffect } from 'react';
import { adoptionAPI } from '../services/api';
import { Link } from 'react-router-dom';

export default function AdminAdoptionRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const response = await adoptionAPI.getAllRequests();
            console.log("Admin requests fetched:", response.data);
            setRequests(response.data);
        } catch (err) {
            setError("Failed to fetch adoption requests.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await adoptionAPI.updateStatus(id, { status });
            // Update local state to reflect change immediately
            setRequests(prev => prev.map(req =>
                req._id === id ? { ...req, status } : req
            ));
            alert(`Request ${status} successfully!`);
        } catch (err) {
            console.error("Update status error:", err);
            alert("Failed to update status.");
        }
    };

    if (loading) return (
        <div className="min-h-screen pt-24 pb-12 flex justify-center items-center bg-gray-50">
            <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen pt-32 pb-12 px-6 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-black text-gray-900">
                        Manage <span className="text-pink-600">Adoption Requests</span>
                    </h1>
                    <Link to="/admin" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium">
                        Back to Dashboard
                    </Link>
                </div>

                {requests.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <p className="text-gray-600 text-lg">No adoption requests found.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-100 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 font-bold text-gray-700">Pet</th>
                                        <th className="px-6 py-4 font-bold text-gray-700">Applicant</th>
                                        <th className="px-6 py-4 font-bold text-gray-700">Message</th>
                                        <th className="px-6 py-4 font-bold text-gray-700">Status</th>
                                        <th className="px-6 py-4 font-bold text-gray-700">Payment</th>
                                        <th className="px-6 py-4 font-bold text-gray-700 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {requests.map((request) => (
                                        <tr key={request._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={request.petId?.image || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=100"}
                                                        alt={request.petId?.name}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                    <div>
                                                        <div className="font-bold text-gray-900">{request.petId?.name || "Unknown Pet"}</div>
                                                        <div className="text-xs text-gray-500">{request.petId?.type}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">{request.name}</div>
                                                <div className="text-sm text-gray-500">{request.email}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={request.message}>
                                                {request.message || "No message"}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${request.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                    request.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {request.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`font-bold text-sm ${request.paymentStatus === 'completed' ? 'text-green-600' : 'text-orange-500'
                                                    }`}>
                                                    {request.paymentStatus === 'completed' ? 'Paid' : 'Pending'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                {request.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusUpdate(request._id, 'approved')}
                                                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs font-bold transition-colors"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(request._id, 'rejected')}
                                                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs font-bold transition-colors"
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                                {request.status !== 'pending' && (
                                                    <button
                                                        disabled
                                                        className="px-3 py-1 bg-gray-100 text-gray-400 rounded cursor-not-allowed text-xs font-bold"
                                                    >
                                                        {request.status === 'approved' ? 'Approved' : 'Rejected'}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
