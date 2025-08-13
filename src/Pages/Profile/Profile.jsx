import React from 'react';
import useAppStore from '../../store/store'; // Adjust the import path as needed
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Profile.css';

// --- SVG Icon Components ---
const UserIcon = () => (
    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);
const MailIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>);
const PhoneIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>);


export default function ProfilePage() {
    const { user, logout } = useAppStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        localStorage.removeItem('isAuthenticated');
        toast.info("You have been logged out.");
        navigate('/login');
    };

    if (!user) {
        // This can be a loading spinner or a redirect
        return (
            <div className="profile-container">
                <div className="profile-card">
                    <p>Loading user data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-header">
                    <div className="profile-avatar">
                        <UserIcon />
                    </div>
                    <h1 className="profile-name">{user.name || 'User Name'}</h1>
                    <p className="profile-subtitle">Account Details</p>
                </div>

                <div className="profile-details">
                    <div className="detail-item">
                        <MailIcon />
                        <span>{user.email || 'No email provided'}</span>
                    </div>
                    <div className="detail-item">
                        <PhoneIcon />
                        <span>{`${user.dialCode || ''} ${user.phoneNumber || 'No phone provided'}`}</span>
                    </div>
                </div>

                <div className="profile-footer">
                    <button onClick={handleLogout} className="logout-btn">
                        Log Out
                    </button>
                    <button onClick={() => navigate('/')} className="back-btn">
                        Back to Chat
                    </button>
                </div>
            </div>
        </div>
    );
}