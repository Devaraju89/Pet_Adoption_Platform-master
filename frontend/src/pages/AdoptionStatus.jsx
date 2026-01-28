import { useState, useEffect } from 'react';
import { adoptionAPI, paymentAPI } from '../services/api';
import { Link } from 'react-router-dom';
import RazorpayDemoModal from '../components/RazorpayDemoModal';

export default function AdoptionStatus() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const response = await adoptionAPI.getMyRequests();
            setRequests(response.data);
        } catch (err) {
            setError("Failed to fetch adoption requests.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const [showRazorpayModal, setShowRazorpayModal] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [currentRequest, setCurrentRequest] = useState(null); // Track which request is being paid for

    const handlePayment = async (request) => {
        try {
            // 1. Create Order
            const orderResponse = await paymentAPI.createOrder({
                amount: request.petId.adoptionFee,
                currency: "INR",
                notes: {
                    adoptionRequestId: request._id,
                    petId: request.petId._id
                }
            });

            if (!orderResponse.data.success) {
                throw new Error("Failed to create payment order");
            }

            // Set state for modal
            setCurrentOrder(orderResponse.data.order);
            setCurrentRequest(request);
            setShowRazorpayModal(true);

        } catch (err) {
            console.error("Payment initiation error:", err);
            alert("Failed to initiate payment. Please try again.");
        }
    };

    const handlePaymentSuccess = async (response) => {
        try {
            // 2. Verify Payment
            const verifyResponse = await paymentAPI.verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                donation_details: {
                    adoptionRequestId: currentRequest._id
                }
            });

            if (verifyResponse.data.success) {
                alert("Payment Successful!");
                // 3. Update Status in Backend
                await adoptionAPI.updateStatus(currentRequest._id, { paymentStatus: 'completed' });
                fetchRequests(); // Refresh list
            } else {
                alert("Payment Verification Failed");
            }
        } catch (err) {
            console.error("Payment verification error:", err);
            alert("Payment failed during verification.");
        } finally {
            setShowRazorpayModal(false);
            setCurrentRequest(null);
            setCurrentOrder(null);
        }
    };

    const handlePaymentFailure = async (response) => {
        try {
            await paymentAPI.handlePaymentFailure({
                error_code: response.error.code,
                error_description: response.error.description,
                order_id: response.error.metadata?.order_id,
                payment_id: response.error.metadata?.payment_id
            });
            alert(response.error.description);
        } catch (err) {
            console.error("Error logging failure:", err);
        } finally {
            setShowRazorpayModal(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen pt-24 pb-12 flex justify-center items-center bg-gray-50">
            <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen pt-32 pb-12 px-6 bg-gray-50">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-black text-gray-900 mb-8 text-center">
                    My Adoption <span className="text-pink-600">Requests</span>
                </h1>

                {requests.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <div className="text-6xl mb-4">🐾</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No Requests Yet</h3>
                        <p className="text-gray-600 mb-6">You haven't submitted any adoption requests yet.</p>
                        <Link to="/pets" className="inline-block px-8 py-3 bg-pink-600 text-white rounded-full font-bold hover:bg-pink-700 transition-colors">
                            Browse Pets
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {requests.map((request) => (
                            <div key={request._id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                <div className="md:flex">
                                    <div className="md:w-1/3 h-48 md:h-auto relative">
                                        <img
                                            src={request.petId?.image || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400"}
                                            alt={request.petId?.name || "Unknown Pet"}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-900">
                                            {request.petId?.type || "Unknown"}
                                        </div>
                                    </div>
                                    <div className="p-6 md:w-2/3 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{request.petId?.name || "Unknown"}</h3>
                                                    <p className="text-sm text-gray-500">Request ID: {request._id.slice(-8).toUpperCase()}</p>
                                                </div>
                                                <div className={`px-4 py-2 rounded-full text-sm font-bold capitalize ${request.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                    request.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {request.status}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                                <div className="bg-gray-50 p-3 rounded-lg">
                                                    <span className="block text-gray-500 text-xs uppercase tracking-wider mb-1">Date Submitted</span>
                                                    <span className="font-medium">{new Date(request.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <div className="bg-gray-50 p-3 rounded-lg">
                                                    <span className="block text-gray-500 text-xs uppercase tracking-wider mb-1">Adoption Fee</span>
                                                    <span className="font-bold text-pink-600">₹{request.petId?.adoptionFee || 0}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                                            <div>
                                                <span className="text-sm text-gray-600 mr-2">Payment Status:</span>
                                                <span className={`font-bold ${request.paymentStatus === 'completed' ? 'text-green-600' : 'text-orange-500'
                                                    }`}>
                                                    {request.paymentStatus === 'completed' ? 'Paid ✓' : 'Pending'}
                                                </span>
                                            </div>

                                            {request.status === 'approved' && request.paymentStatus !== 'completed' && (
                                                <button
                                                    onClick={() => handlePayment(request)}
                                                    className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
                                                >
                                                    <span>Pay Now</span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            )}

                                            {request.paymentStatus === 'completed' && (
                                                <div className="text-green-600 font-bold flex items-center gap-2">
                                                    <span>Start Adoption Process</span>
                                                    <span className="text-xl">🏠</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {/* Custom Razorpay Demo Modal */}
            <RazorpayDemoModal
                isOpen={showRazorpayModal}
                onClose={() => setShowRazorpayModal(false)}
                orderDetails={currentOrder}
                onSuccess={handlePaymentSuccess}
                onFailure={handlePaymentFailure}
            />
        </div>
    );
}
