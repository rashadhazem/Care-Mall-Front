import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Star, Trash2, Edit2, User, Send, X } from 'lucide-react';
import { reviewsApi } from '../../lib/api';
import Button from '../ui/Button';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';

const ProductReviews = ({ productId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, token } = useSelector((state) => state.auth);

    // Form State
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Edit State
    const [editingReviewId, setEditingReviewId] = useState(null);

    useEffect(() => {
        if (productId) {
            fetchReviews();
        }
    }, [productId]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const res = await reviewsApi.getReviews(productId);
            setReviews(res.data.data || []);
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            Swal.fire('Login Required', 'Please login to write a review', 'info');
            return;
        }

        if (comment.trim().length < 3) {
            Swal.fire('Error', 'Comment must be at least 3 characters long', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            if (editingReviewId) {
                // Update
                await reviewsApi.updateReview(editingReviewId, { ratings: rating, title: comment });
                Swal.fire({ icon: 'success', title: 'Review Updated', toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
                setEditingReviewId(null);
            } else {
                // Create
                await reviewsApi.createReview(productId, { ratings: rating, title: comment });
                Swal.fire({ icon: 'success', title: 'Review Submitted', toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
            }

            // Reset form
            setRating(5);
            setComment('');
            fetchReviews();
        } catch (error) {
            console.error("Error submitting review:", error);
            Swal.fire('Error', error.response?.data?.message || 'Failed to submit review', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (reviewId) => {
        const result = await Swal.fire({
            title: 'Delete Review?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await reviewsApi.deleteReview(reviewId);
                Swal.fire('Deleted!', 'Review has been deleted.', 'success');
                fetchReviews();
            } catch (error) {
                console.error("Error deleting review:", error);
                Swal.fire('Error', 'Failed to delete review', 'error');
            }
        }
    };

    const startEdit = (review) => {
        setEditingReviewId(review._id);
        setRating(review.ratings);
        setComment(review.title || review.comment || ''); // Handle variable naming from API
        // Scroll to form if needed
        document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingReviewId(null);
        setRating(5);
        setComment('');
    };

    const isOwner = (reviewUser) => {
        return user && (reviewUser?._id === user._id || reviewUser === user._id);
    };

    const isAdminOrVendor = () => {
        return user && (user.role === 'admin' || user.role === 'vendor'); // Add vendor logic if specific permissions exist
    };

    return (
        <div className="mt-16 border-t border-gray-100 dark:border-gray-700 pt-10">
            <h2 className="text-2xl font-bold mb-8 dark:text-white">Customer Reviews ({reviews.length})</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Reviews List */}
                <div className="lg:col-span-2 space-y-6">
                    {reviews.length === 0 ? (
                        <div className="text-center py-10 bg-gray-50 dark:bg-gray-800 rounded-xl">
                            <p className="text-gray-500">No reviews yet. Be the first to write one!</p>
                        </div>
                    ) : (
                        reviews.map((review) => (
                            <motion.div
                                key={review._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-bold">
                                            {review.user?.name?.[0]?.toUpperCase() || <User size={18} />}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white">{review.user?.name || 'Anonymous'}</h4>
                                            <div className="flex items-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={14}
                                                        className={i < review.ratings ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"}
                                                    />
                                                ))}
                                                <span className="text-xs text-gray-400 ml-2">
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {(isOwner(review.user) || isAdminOrVendor()) && (
                                        <div className="flex gap-2">
                                            {isOwner(review.user) && (
                                                <button onClick={() => startEdit(review)} className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                                                    <Edit2 size={16} />
                                                </button>
                                            )}
                                            <button onClick={() => handleDelete(review._id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {review.title || review.comment}
                                </p>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Write Review Form */}
                <div className="lg:col-span-1">
                    {user ? (
                        <div id="review-form" className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl sticky top-24">
                            <h3 className="text-lg font-bold mb-4 dark:text-white">
                                {editingReviewId ? 'Edit Your Review' : 'Write a Review'}
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rating</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                className="focus:outline-none transition-transform hover:scale-110"
                                            >
                                                <Star
                                                    size={24}
                                                    className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Review</label>
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Share your experience..."
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-white transition-all resize-none"
                                        required
                                    ></textarea>
                                </div>

                                <div className="flex gap-3">
                                    {editingReviewId && (
                                        <Button type="button" variant="ghost" onClick={cancelEdit} className="flex-1">
                                            Cancel
                                        </Button>
                                    )}
                                    <Button type="submit" isLoading={isSubmitting} className="flex-1 flex items-center justify-center gap-2">
                                        <Send size={16} />
                                        {editingReviewId ? 'Update Review' : 'Submit Review'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl text-center">
                            <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300 mb-2">Share your thoughts</h3>
                            <p className="text-blue-600 dark:text-blue-400 text-sm mb-4">
                                Please sign in to write a review.
                            </p>
                            <Button href="/login" variant="outline" className="w-full">
                                Sign In
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductReviews;
