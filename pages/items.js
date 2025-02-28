import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Package, Search, Plus, Edit, Trash2, Loader2, CheckCircle, ArrowLeft } from "lucide-react";

export async function getServerSideProps() {
    try {
        const res = await axios.get("https://next-app-git-main-jay-unjiyas-projects.vercel.app/api/items");
        return { props: { items: res.data } };
    } catch (error) {
        console.error("Error fetching items:", error);
        return { props: { items: [] } };
    }
}

export default function Item({ items }) {
    const router = useRouter();
    const { data: session } = useSession();
    const [editFormIndex, setEditFormIndex] = useState(null);
    const [loading, setLoading] = useState(false);
    const [editData, setEditData] = useState({ name: "", price: "", _id: "" });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredItems, setFilteredItems] = useState(items);
    const [mounted, setMounted] = useState(false);
    const [focused, setFocused] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        setFilteredItems(
            items.filter(item =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, items]);

    const handleRemove = async (id) => {
        try {
            setLoading(true);
            await axios.delete(`https://next-app-git-main-jay-unjiyas-projects.vercel.app/api/items/?id=${id}`);
            setSuccess(true);
            setTimeout(() => {
                router.replace(router.asPath);
                setLoading(false);
                setShowDeleteConfirm(false);
                setSuccess(false);
            }, 1500);
        } catch (err) {
            console.error("Error removing item:", err);
            setLoading(false);
        }
    };

    const confirmDelete = (id) => {
        setItemToDelete(id);
        setShowDeleteConfirm(true);
    };

    const handleEditClick = (item, index) => {
        setEditFormIndex(index);
        setEditData({ name: item.name, price: item.price, _id: item._id });
    };

    const handleEditDataChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSubmitted(true);

        try {
            // Send the PUT request to update the item in the database
            await axios.put(`https://next-app-git-main-jay-unjiyas-projects.vercel.app/api/items`, editData);

            // Re-fetch the data from the API after the update
            const res = await axios.get("https://next-app-git-main-jay-unjiyas-projects.vercel.app/api/items");
            setFilteredItems(res.data);  // Update the filteredItems with the new data

            setSuccess(true);

            setTimeout(() => {
                setLoading(false);  // Reset loading state after success
                setEditFormIndex(null);
                setSuccess(false);
                setSubmitted(false);
            }, 1500);
        } catch (err) {
            console.error("Error updating item:", err);
            setLoading(false);
            setSubmitted(false);
        }
    };



    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6 overflow-hidden">
            {/* Background elements */}
            <div
                className="absolute w-16 h-16 rounded-full bg-blue-400 opacity-20"
                style={{
                    top: '10%',
                    left: '15%',
                    animation: 'float 12s ease-in-out infinite'
                }}
            ></div>
            <div
                className="absolute w-12 h-12 rounded-full bg-indigo-500 opacity-20"
                style={{
                    top: '20%',
                    right: '10%',
                    animation: 'float 10s ease-in-out infinite'
                }}
            ></div>
            <div
                className="absolute w-20 h-20 rounded-full bg-purple-400 opacity-20"
                style={{
                    bottom: '15%',
                    right: '20%',
                    animation: 'float 15s ease-in-out infinite'
                }}
            ></div>
            <div
                className="absolute w-10 h-10 rounded-full bg-pink-400 opacity-20"
                style={{
                    bottom: '30%',
                    left: '8%',
                    animation: 'float 8s ease-in-out infinite'
                }}
            ></div>

            <div className={`max-w-5xl mx-auto transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row justify-between items-center">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-4 md:mb-0">Inventory Manager</h1>
                    <div className="flex space-x-3">
                        <button
                            className="bg-white shadow-md text-indigo-600 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-indigo-50 hover:shadow-lg flex items-center"
                            onClick={() => router.replace('/')}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Home
                        </button>
                        <button
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-lg flex items-center"
                            onClick={() => router.replace('/additem')}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Item
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className={`mb-6 transition-all duration-300 transform ${focused === 'search' ? '-translate-y-1' : ''}`}>
                    <div className="relative">
                        <input
                            type="text"
                            className={`w-full pl-12 pr-4 py-3 rounded-xl bg-white border-none shadow-md transition-all duration-300 ${focused === 'search' ? 'ring-2 ring-indigo-300 shadow-lg' : 'hover:shadow-lg'}`}
                            placeholder="Search items..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={() => setFocused('search')}
                            onBlur={() => setFocused(null)}
                        />
                        <div className={`absolute left-4 top-3.5 transition-all duration-300 ${focused === 'search' ? 'text-indigo-600' : 'text-gray-400'}`}>
                            <Search className="h-5 w-5" />
                        </div>
                        <div className={`absolute bottom-0 left-0 h-0.5 bg-indigo-500 transition-all duration-700 ease-out rounded-b-lg ${focused === 'search' ? 'w-full' : 'w-0'}`}></div>
                    </div>
                </div>

                {/* Items List */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                                    <th className="px-6 py-4 text-left font-semibold">Product Name</th>
                                    <th className="px-6 py-4 text-left font-semibold">Price</th>
                                    <th className="px-6 py-4 text-right font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.length > 0 ? (
                                    filteredItems.map((item, index) => (
                                        <tr key={item._id} className="border-b border-gray-100 hover:bg-indigo-50 transition-all duration-200">
                                            <td className="px-6 py-4 font-medium text-gray-800">
                                                <div className="flex items-center">
                                                    <Package className="h-4 w-4 mr-2 text-indigo-500" />
                                                    {item.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-medium text-indigo-600">${item.price}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end space-x-3">
                                                    <button
                                                        className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-all duration-200 flex items-center"
                                                        onClick={() => handleEditClick(item, index)}
                                                    >
                                                        <Edit className="h-3.5 w-3.5 mr-1" />
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all duration-200 flex items-center"
                                                        onClick={() => confirmDelete(item._id)}
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                                                        Remove
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                                            <div className="flex flex-col items-center">
                                                <div className="h-16 w-16 text-gray-300 mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                                                    <Package className="h-8 w-8" />
                                                </div>
                                                <p className="text-lg">No items found</p>
                                                <p className="text-sm text-gray-400 mt-1">Try adding a new item or adjusting your search</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer with item count */}
                <div className="mt-4 text-right text-sm text-indigo-600 font-medium">
                    {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} found
                </div>
            </div>

            {/* Edit Modal */}
            {editFormIndex !== null && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div
                        className={`bg-white rounded-xl shadow-xl p-8 w-full max-w-md backdrop-blur-md backdrop-filter border border-indigo-100
                                    transition-all duration-500
                                    ${success ? 'scale-105' : submitted ? 'scale-95' : 'scale-100'}`}
                        style={{ boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)' }}
                    >
                        <div className="text-center mb-8 relative">
                            <h2 className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-500 
                                          ${success ? 'scale-110' : ''}`}>
                                Edit Item
                            </h2>
                            <div className={`w-20 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto mt-3 rounded-full transition-all duration-500 
                                          ${success ? 'w-28' : focused ? 'w-24' : 'w-20'}`}></div>
                        </div>
                        <form onSubmit={handleUpdate}>
                            <div className={`mb-6 transition-all duration-300 transform ${focused === 'name' ? 'translate-y-1' : ''}`}>
                                <label
                                    htmlFor="name"
                                    className="flex items-center mb-2 text-sm font-medium text-gray-700 transition-all duration-300"
                                >
                                    <Package className={`w-4 h-4 mr-2 transition-all duration-300 ${focused === 'name' ? 'text-indigo-600' : 'text-indigo-500'}`} />
                                    <span className={`transition-all duration-300 ${focused === 'name' ? 'text-indigo-600' : ''}`}>Item Name</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        value={editData.name}
                                        onChange={handleEditDataChange}
                                        onFocus={() => setFocused('name')}
                                        onBlur={() => setFocused(null)}
                                        disabled={loading || success}
                                        className={`bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-3 pl-4
                                                  transition-all duration-300 
                                                  ${focused === 'name' ? 'border-indigo-500 ring-2 ring-indigo-200 shadow-md' : 'border-gray-300 hover:shadow-sm'}`}
                                        placeholder="Name"
                                        required
                                    />
                                    <div className={`absolute bottom-0 left-0 h-0.5 bg-indigo-500 transition-all duration-700 ease-out rounded-b-lg
                                                  ${focused === 'name' ? 'w-full' : 'w-0'}`}></div>
                                </div>
                            </div>
                            <div className={`mb-6 transition-all duration-300 transform ${focused === 'price' ? 'translate-y-1' : ''}`}>
                                <label
                                    htmlFor="price"
                                    className="flex items-center mb-2 text-sm font-medium text-gray-700 transition-all duration-300"
                                >
                                    <div className={`w-4 h-4 mr-2 transition-all duration-300 text-center font-bold ${focused === 'price' ? 'text-indigo-600' : 'text-indigo-500'}`}>$</div>
                                    <span className={`transition-all duration-300 ${focused === 'price' ? 'text-indigo-600' : ''}`}>Price</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="price"
                                        id="price"
                                        value={editData.price}
                                        onChange={handleEditDataChange}
                                        onFocus={() => setFocused('price')}
                                        onBlur={() => setFocused(null)}
                                        disabled={loading || success}
                                        className={`bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-3 pl-4
                                                  transition-all duration-300 
                                                  ${focused === 'price' ? 'border-indigo-500 ring-2 ring-indigo-200 shadow-md' : 'border-gray-300 hover:shadow-sm'}`}
                                        placeholder="Price"
                                        required
                                    />
                                    <div className={`absolute bottom-0 left-0 h-0.5 bg-indigo-500 transition-all duration-700 ease-out rounded-b-lg
                                                  ${focused === 'price' ? 'w-full' : 'w-0'}`}></div>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-all duration-200"
                                    onClick={() => setEditFormIndex(null)}
                                    disabled={loading || success}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || success}
                                    className={`relative text-white font-medium rounded-lg text-sm py-2 px-10 overflow-hidden
                                              transition-all duration-500`}
                                    style={{
                                        background: success ? 'linear-gradient(to right, #10B981, #059669)' :
                                            loading ? '#9CA3AF' : 'linear-gradient(to right, #4F46E5, #7C3AED)',
                                        height: '40px'
                                    }}
                                >
                                    <div className="absolute inset-0 overflow-hidden">
                                        <div
                                            className="absolute inset-0 bg-white opacity-20"
                                            style={{
                                                transform: 'skewX(-45deg) translateX(-100%)',
                                                animation: loading || success ? 'none' : 'shine-button 3s infinite'
                                            }}
                                        ></div>
                                    </div>

                                    <span className={`absolute inset-0 flex items-center justify-center transition-all duration-500 
                                                    ${success ? 'opacity-100' : 'opacity-0'}`}>
                                        <CheckCircle className="w-5 h-5 mr-2" />
                                        Updated!
                                    </span>

                                    <span className={`absolute inset-0 flex items-center justify-center transition-all duration-500 
                                                    ${loading && !success ? 'opacity-100' : 'opacity-0'}`}>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Updating...
                                    </span>

                                    <span className={`absolute inset-0 flex items-center justify-center transition-all duration-500 
                                                    ${!loading && !success ? 'opacity-100' : 'opacity-0'}`}>
                                        Update
                                    </span>
                                </button>
                            </div>
                        </form>

                        {success && (
                            <div className="absolute inset-0 pointer-events-none">
                                <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <div className="confetti-container"></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div
                        className={`bg-white rounded-xl shadow-xl p-8 w-full max-w-md backdrop-blur-md backdrop-filter border border-red-100
                                    transition-all duration-500
                                    ${success ? 'scale-105' : submitted ? 'scale-95' : 'scale-100'}`}
                        style={{ boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)' }}
                    >
                        <div className="text-center mb-6">
                            <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4 transition-all duration-500 ${success ? 'bg-green-100' : ''}`}>
                                {success ? (
                                    <CheckCircle className="h-8 w-8 text-green-600" />
                                ) : (
                                    <Trash2 className="h-8 w-8 text-red-600" />
                                )}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">{success ? 'Item Deleted' : 'Delete Item'}</h3>
                            {!success && (
                                <p className="text-sm text-gray-500 mt-2">
                                    Are you sure you want to delete this item? This action cannot be undone.
                                </p>
                            )}
                        </div>

                        {!success && (
                            <div className="flex justify-center space-x-3">
                                <button
                                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-all duration-200"
                                    onClick={() => setShowDeleteConfirm(false)}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="relative bg-red-600 text-white px-4 py-2 rounded-lg overflow-hidden"
                                    onClick={() => {
                                        setSubmitted(true);
                                        handleRemove(itemToDelete);
                                    }}
                                    disabled={loading}
                                >
                                    <div className="absolute inset-0 overflow-hidden">
                                        <div
                                            className="absolute inset-0 bg-white opacity-20"
                                            style={{
                                                transform: 'skewX(-45deg) translateX(-100%)',
                                                animation: loading ? 'none' : 'shine-button 3s infinite'
                                            }}
                                        ></div>
                                    </div>

                                    <span className={`flex items-center justify-center transition-all duration-300 ${loading ? 'opacity-100' : 'opacity-100'}`}>
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Deleting...
                                            </>
                                        ) : (
                                            'Delete'
                                        )}
                                    </span>
                                </button>
                            </div>
                        )}

                        {success && (
                            <div className="absolute inset-0 pointer-events-none">
                                <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <div className="confetti-container"></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <style jsx global>{`
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0) rotate(0deg);
                    }
                    50% {
                        transform: translateY(-20px) rotate(10deg);
                    }
                }
                
                @keyframes shine-button {
                    0% {
                        transform: skewX(-45deg) translateX(-150%);
                    }
                    50%, 100% {
                        transform: skewX(-45deg) translateX(150%);
                    }
                }
                
                @keyframes pulse-subtle {
                    0%, 100% {
                        opacity: 0.5;
                    }
                    50% {
                        opacity: 0.3;
                    }
                }
                
                @keyframes confetti {
                    0% {
                        transform: translateY(0) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100px) rotate(720deg);
                        opacity: 0;
                    }
                }
                
                .animate-pulse-subtle {
                    animation: pulse-subtle 2s ease-in-out infinite;
                }
                
                .confetti-container {
                    position: relative;
                    width: 100%;
                    height: 100%;
                }
                
                .confetti-container::before,
                .confetti-container::after {
                    content: '';
                    position: absolute;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    animation: confetti 1s ease-out forwards;
                }
                
                .confetti-container::before {
                    background-color: #3B82F6;
                    left: -20px;
                    top: 0;
                }
                
                .confetti-container::after {
                    background-color: #8B5CF6;
                    left: 20px;
                    top: -10px;
                    animation-delay: 0.2s;
                }
            `}</style>
        </div>
    );
}