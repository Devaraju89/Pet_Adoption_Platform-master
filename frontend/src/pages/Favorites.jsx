import { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import { Link } from 'react-router-dom';

export default function Favorites() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            setLoading(true);
            const response = await userAPI.getFavorites();
            setFavorites(response.data);
        } catch (err) {
            console.error("Failed to fetch favorites:", err);
        } finally {
            setLoading(false);
        }
    };

    const removeFavorite = async (petId) => {
        try {
            await userAPI.toggleFavorite(petId);
            setFavorites(prev => prev.filter(pet => pet._id !== petId));
        } catch (err) {
            console.error("Error removing favorite:", err);
        }
    }

    if (loading) return (
        <div className="min-h-screen pt-24 pb-12 flex justify-center items-center bg-gray-50">
            <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen pt-32 pb-12 px-6 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-black text-gray-900 mb-8 text-center">
                    My <span className="text-pink-600">Favorites</span>
                </h1>

                {favorites.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <div className="text-6xl mb-4">❤️</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No Favorites Yet</h3>
                        <p className="text-gray-600 mb-6">Start browsing and save the pets you love!</p>
                        <Link to="/pets" className="inline-block px-8 py-3 bg-pink-600 text-white rounded-full font-bold hover:bg-pink-700 transition-colors">
                            Browse Pets
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {favorites.map((pet) => (
                            <div key={pet._id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group">
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={pet.image || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400"}
                                        alt={pet.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 right-4 z-10">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                removeFavorite(pet._id);
                                            }}
                                            className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:scale-110 transition-transform active:scale-95 group/btn"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 fill-current" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                                        <h3 className="text-2xl font-bold text-white mb-1">{pet.name}</h3>
                                        <p className="text-white/90 font-medium">{pet.breed}</p>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-sm font-bold">
                                            {pet.age} {pet.age === 1 ? 'Year' : 'Years'} Old
                                        </span>
                                        <span className="font-bold text-gray-500">{pet.gender}</span>
                                    </div>
                                    <Link to={`/pets/${pet._id}`} className="block w-full text-center py-3 rounded-xl border-2 border-pink-500 text-pink-600 font-bold hover:bg-pink-500 hover:text-white transition-all duration-300">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
