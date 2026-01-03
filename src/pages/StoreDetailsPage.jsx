import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageWrapper from '../components/ui/PageWrapper';
import { storesApi, productsApi, chatApi } from '../lib/api';
import { showToast } from '../lib/toast';
import ProductCard from '../components/products/ProductCard';
import { MapPin, Star, MessageCircle, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';
// Optional: import { setActiveConversation ... } if needed to open chat window programmatically via Redux
// But for now we rely on the ChatWindow component polling or user opening it.

const StoreDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [store, setStore] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chatLoading, setChatLoading] = useState(false);

    const { isAuthenticated, user } = useSelector(state => state.auth);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch Store Details
                const storeRes = await storesApi.getStoreById(id);
                setStore(storeRes.data.data || storeRes.data);

                // Fetch Store Products - Assuming we can filter by store name or ID?
                // The API definition shows getProducts accepts query params.
                // Usually filters are by keyword/category etc. 
                // We need to check if backend supports filtering by store name or ID.
                // Based on `StoresPage` code: `/products?store=${encodeURIComponent(store.name)}`
                // So we likely filter by store Name or ID. Let's try passing 'store' param.

                // If the backend expects 'store' param to be ID or Name is varying. 
                // Let's assume it accepts the store ID or we can pass the store Name if we have it from storeRes.
                // Let's wait for storeRes to get the name first.

            } catch (error) {
                console.error("Error fetching store details:", error);
                showToast("error", "Failed to load store details");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    useEffect(() => {
        // Fetch products once store is loaded (to use store name/id for filter if needed)
        const fetchStoreProducts = async () => {
            if (!store) return;
            try {
                // Try passing store ID first? Or Name? 
                // StoresPage used name: store=${encodeURIComponent(store.name)}
                // So we will use store name.
                const productsRes = await productsApi.getProducts({ store: store.name });
                setProducts(productsRes.data.data || []);
            } catch (error) {
                console.error("Error fetching store products:", error);
            }
        };

        if (store) {
            fetchStoreProducts();
        }
    }, [store]);


    const handleChatWithStore = async () => {
        if (!isAuthenticated) {
            showToast("error", "Please login to chat with the seller");
            navigate('/login', { state: { from: `/stores/${id}` } });
            return;
        }

        // If user is the store owner (unlikely scenario in this app structure but good check)
        // if (user._id === store.owner) ...

        try {
            setChatLoading(true);
            // Create or get existing chat
            // Backend endpoint: createChat({ storeId: ... })
            // It presumably returns the chat object (either new or existing)
            await chatApi.createChat({ storeId: id });

            showToast("success", "Chat started! Check your messages.");
            // Ideally we should open the ChatWindow here.
            // For now, the user has to click the chat button.
            // Feature improvement: Dispatch action to open ChatWindow.

        } catch (error) {
            console.error("Error starting chat:", error);
            showToast("error", "Failed to start chat. Try again.");
        } finally {
            setChatLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!store) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Store not found</h2>
                <Button variant="outline" className="mt-4" onClick={() => navigate('/stores')}>
                    Back to Stores
                </Button>
            </div>
        );
    }

    return (
        <PageWrapper className="pb-12">
            <Helmet>
                <title>{store.name} | Mall App</title>
            </Helmet>

            {/* Store Header / Banner */}
            <div className="relative h-64 md:h-80 bg-gray-200 dark:bg-gray-800 w-full object-cover">
                <img
                    src={store.image || store.logo || '/placeholder-store.jpg'}
                    alt={store.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = '/placeholder-store.jpg'; }}
                />
                <div className="absolute inset-0 bg-black/40"></div>

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white flex flex-col md:flex-row items-end md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <img
                            src={store.logo || store.image || '/placeholder-logo.jpg'}
                            alt={store.name}
                            className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white dark:border-gray-700 bg-white object-cover"
                            onError={(e) => { e.target.src = '/placeholder-logo.jpg'; }}
                        />
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold">{store.name}</h1>
                            {store.location && (
                                <p className="flex items-center text-gray-200 mt-1">
                                    <MapPin size={16} className="mr-1" /> {store.location}
                                </p>
                            )}
                            <div className="flex items-center mt-2 gap-2">
                                <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                                    <Star size={12} className="fill-current" />
                                    {store.rating || '4.5'}
                                </span>
                                <span className="text-sm text-gray-300">{store.category?.name || 'General Store'}</span>
                            </div>
                        </div>
                    </div>

                    <Button
                        onClick={handleChatWithStore}
                        isLoading={chatLoading}
                        className="bg-primary-600 hover:bg-primary-700 text-white shadow-lg flex items-center gap-2"
                    >
                        <MessageCircle size={20} />
                        Chat with Seller
                    </Button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Description */}
                {store.description && (
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-10">
                        <h2 className="text-xl font-semibold mb-2">About Us</h2>
                        <p className="text-gray-600 dark:text-gray-300">{store.description}</p>
                    </div>
                )}

                {/* Store Products */}
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    Products from {store.name}
                    <span className="text-sm font-normal text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                        {products.length}
                    </span>
                </h2>

                {products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                        <p className="text-gray-500">This store hasn't added any products yet.</p>
                    </div>
                )}
            </div>
        </PageWrapper>
    );
};

export default StoreDetailsPage;
