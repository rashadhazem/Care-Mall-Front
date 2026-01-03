import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usersApi } from '../lib/api';
import PageWrapper from '../components/ui/PageWrapper';
import Button from '../components/ui/Button';
import { User, Mail, Phone, Calendar, Shield, Edit, Save, X } from 'lucide-react';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { checkAuth } from '../store/slices/authSlice';

const ProfilePage = () => {
    const { t } = useTranslation();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: ''
    });
    const dispatch = useDispatch();

    const fetchUserProfile = async () => {
        try {
            const res = await usersApi.loggedInUser();
            const userData = res.data.data;
            console.log("userData",userData);
            setUser(userData);
            setFormData({
                name: userData.name || '',
                phone: userData.phone || '',
                address: userData.address || ''
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load profile data',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        try {
            setLoading(true);
            await usersApi.updateMe(formData);

            Swal.fire({
                icon: 'success',
                title: t('success') || 'Success',
                text: t('profileUpdated') || 'Profile updated successfully',
                timer: 2000,
                showConfirmButton: false
            });

            setIsEditing(false);
            fetchUserProfile(); // Refresh data
            dispatch(checkAuth()); // Update redux state if needed
        } catch (error) {
            console.error('Error updating profile:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Failed to update profile',
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading && !user) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <PageWrapper className="py-10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">

                    {/* Header Background */}
                    <div className="h-32 bg-gradient-to-r from-primary-600 to-purple-600"></div>

                    {/* Profile Header */}
                    <div className="px-8 pb-8">
                        <div className="relative flex justify-between items-end -mt-12 mb-6">
                            <div className="relative">
                                <div className="h-24 w-24 rounded-full border-4 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-4xl font-bold text-gray-400">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                            </div>

                            {!isEditing && (
                                <Button
                                    variant="outline"
                                    onClick={() => setIsEditing(true)}
                                    className="gap-2"
                                >
                                    <Edit size={16} />
                                    {t('editProfile') || 'Edit Profile'}
                                </Button>
                            )}
                        </div>

                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                {user?.name}
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                <Shield size={16} className="text-primary-500" />
                                <span className="capitalize">{user?.role}</span>
                            </p>
                        </div>

                        {/* Profile Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                            {/* Personal Info */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">
                                    {t('personalInfo') || 'Personal Information'}
                                </h3>

                                <div className="space-y-4">
                                    {/* Name Field */}
                                    <div className="group">
                                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
                                            <User size={16} /> {t('fullName') || 'Full Name'}
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 transition-all"
                                            />
                                        ) : (
                                            <p className="text-gray-900 dark:text-gray-200 font-medium pl-6">
                                                {user?.name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Email Field (Read Only) */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
                                            <Mail size={16} /> {t('email') || 'Email'}
                                        </label>
                                        <p className="text-gray-900 dark:text-gray-200 font-medium pl-6">
                                            {user?.email}
                                        </p>
                                    </div>

                                    {/* Phone Field */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
                                            <Phone size={16} /> {t('phone') || 'Phone'}
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="Add your phone number"
                                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 transition-all"
                                            />
                                        ) : (
                                            <p className="text-gray-900 dark:text-gray-200 font-medium pl-6">
                                                {user?.phone || 'Not provided'}
                                            </p>
                                        )}
                                    </div>

                                    {/* Joined Date */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
                                            <Calendar size={16} /> {t('joinedDate') || 'Joined Date'}
                                        </label>
                                        <p className="text-gray-900 dark:text-gray-200 font-medium pl-6">
                                            {new Date(user?.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Contact/Address Info */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">
                                    {t('address') || 'Address'}
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        {isEditing ? (
                                            <textarea
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                rows="4"
                                                placeholder="Enter your full address"
                                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 transition-all resize-none"
                                            />
                                        ) : (
                                            <p className="text-gray-900 dark:text-gray-200 font-medium leading-relaxed">
                                                {user?.address || 'No address provided'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {isEditing && (
                            <div className="mt-8 flex justify-end gap-4 border-t border-gray-200 dark:border-gray-700 pt-6">
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setFormData({
                                            name: user.name || '',
                                            phone: user.phone || '',
                                            address: user.address || ''
                                        });
                                    }}
                                    className="gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                    <X size={18} />
                                    {t('cancel') || 'Cancel'}
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={handleUpdate}
                                    className="gap-2"
                                    disabled={loading}
                                >
                                    <Save size={18} />
                                    {loading ? 'Saving...' : (t('saveChanges') || 'Save Changes')}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

export default ProfilePage;
