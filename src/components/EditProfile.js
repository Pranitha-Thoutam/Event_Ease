// src/components/EditProfile.js
import React, { useState, useEffect } from 'react';
import './EditProfile.css';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';

const EditProfile = ({ isAuthenticated, handleAuthChange }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
        phone: '',
        address: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        console.log("EditProfile useEffect: isAuthenticated =", isAuthenticated);
        if (!isAuthenticated) {
            console.log("EditProfile: Not authenticated, navigating to login.");
            navigate('/login');
            return;
        }

        const fetchUserData = async () => {
            console.log("fetchUserData: Starting...");
            try {
                setLoading(true);
                setError(null); // Clear previous errors
                console.log("fetchUserData: Calling authService.getCurrentUser()");
                const user = await authService.getCurrentUser();
                console.log("fetchUserData: User data received:", user);
                setFormData(prev => ({
                    ...prev,
                    name: user.name || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    address: user.address || ''
                }));
                setSuccess(null); // Clear success message on data load
            } catch (err) {
                console.error('fetchUserData: Error fetching user data:', err);
                setError(err.response?.data?.message || 'Failed to load user data. Please try again.');
            } finally {
                console.log("fetchUserData: Setting loading to false.");
                setLoading(false);
            }
        };
        fetchUserData();
    }, [isAuthenticated, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        // Validate required fields
        if (!formData.name || !formData.email) {
            setError('Name and email are required fields.');
            setLoading(false);
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address.');
            setLoading(false);
            return;
        }

        // Check if user is authenticated
        const token = localStorage.getItem('authToken');
        if (!token) {
            setError('You must be logged in to update your profile.');
            setLoading(false);
            navigate('/login');
            return;
        }

        if (formData.newPassword && formData.newPassword !== formData.confirmNewPassword) {
            setError('New password and confirm new password do not match.');
            setLoading(false);
            return;
        }

        try {
            const updateData = {
                name: formData.name.trim(),
                email: formData.email.trim(),
                phone: formData.phone?.trim() || '',
                address: formData.address?.trim() || ''
            };

            if (formData.newPassword) {
                if (!formData.currentPassword) {
                    setError('Current password is required to set a new password.');
                    setLoading(false);
                    return;
                }
                updateData.currentPassword = formData.currentPassword;
                updateData.newPassword = formData.newPassword;
            }
            
            console.log('Sending update request with data:', updateData);
            const response = await authService.updateProfile(updateData);
            console.log('Update response:', response);
            
            setSuccess('Profile updated successfully!');
            
            // Update local storage with new user data if needed
            if (response.user) {
                localStorage.setItem('user', JSON.stringify(response.user));
            }
            
            handleAuthChange(true); // Trigger re-render of Navbar if user data changes
            
            // Clear password fields after successful update
            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: ''
            }));
        } catch (err) {
            console.error('Error updating profile:', err);
            if (err.response?.status === 401) {
                setError('Your session has expired. Please log in again.');
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
                setTimeout(() => navigate('/login'), 2000);
            } else if (err.response?.status === 400) {
                setError(err.response.data.message || 'Invalid data provided. Please check your input.');
            } else if (err.response?.status === 409) {
                setError('This email is already in use. Please use a different email address.');
            } else {
                setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading && !formData.email) {
        console.log("Rendering: Loading profile...");
        return <div className="edit-profile-loading">Loading profile...</div>;
    }

    console.log("Rendering: Edit Profile Form. Loading =", loading, "formData.email =", formData.email);
    return (
        <div className="edit-profile-container">
            <h1>Edit Your Profile</h1>
            <form onSubmit={handleSubmit} className="edit-profile-form">
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
                
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group full-width">
                    <label htmlFor="phone">Phone</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group full-width">
                    <label htmlFor="address">Address</label>
                    <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group password-group">
                    <h2>Change Password (Optional)</h2>
                    <label htmlFor="currentPassword">Current Password</label>
                    <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        placeholder="Required if changing password"
                    />
                </div>

                <div className="form-group password-group">
                    <label htmlFor="newPassword">New Password</label>
                    <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        placeholder="Leave blank to keep current password"
                    />
                </div>

                <div className="form-group password-group">
                    <label htmlFor="confirmNewPassword">Confirm New Password</label>
                    <input
                        type="password"
                        id="confirmNewPassword"
                        name="confirmNewPassword"
                        value={formData.confirmNewPassword}
                        onChange={handleInputChange}
                    />
                </div>

                <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? 'Updating Profile...' : 'Update Profile'}
                </button>
            </form>
            <div className="button-group">
                <Link to="/" className="home-button">Home</Link>
            </div>
        </div>
    );
};

export default EditProfile;