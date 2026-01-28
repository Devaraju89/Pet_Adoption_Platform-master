import { useState, useEffect } from 'react';
import { petsAPI } from '../services/api';
import { Link } from 'react-router-dom';

export default function AdminAdoptedPets() {
    const [adoptedPets, setAdoptedPets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdoptedPets = async () => {
            try {
                // Fetch all pets and filter by status 'adopted'
                // Ideally, backend should support filtering by status in query params
                const response = await petsAPI.getAllPets({ adoptionStatus: 'adopted' });
                setAdoptedPets(response.data);
            } catch (err) {
                console.error("Error fetching adopted pets:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAdoptedPets();
    }, []);

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
                        Adopted <span className="text-pink-600">History</span>
                    </h1>
                    <Link to="/admin" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium">
                        Back to Dashboard
                    </Link>
                </div>

                {adoptedPets.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <div className="text-6xl mb-4">🏠</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No Adoptions Yet</h3>
                        <p className="text-gray-600">Once pets are adopted, they will appear here.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {adoptedPets.map(pet => (
                            <div key={pet._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="h-48 overflow-hidden relative">
                                    <img
                                        src={pet.image}
                                        alt={pet.name}
                                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                    />
                                    <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                        ADOPTED
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold text-gray-900">{pet.name}</h3>
                                        <span className="text-sm text-gray-500">{pet.type}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{pet.description}</p>

                                    <div className="border-t pt-4 mt-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Adoption Fee</span>
                                            <span className="font-bold text-green-600">₹{pet.adoptionFee} (Paid)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
