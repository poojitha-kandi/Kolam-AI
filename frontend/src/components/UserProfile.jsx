import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './UserProfile.css';

const UserProfile = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  if (!user) return null;

  return (
    <div className="user-profile">
      <div className="user-avatar" onClick={toggleDropdown}>
        <div className="avatar-circle">
          {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
        </div>
        <span className="username">{user.username}</span>
        <i className={`fa-solid fa-chevron-down ${showDropdown ? 'rotated' : ''}`}></i>
      </div>

      {showDropdown && (
        <div className="user-dropdown">
          <div className="dropdown-header">
            <div className="user-info">
              <div className="avatar-large">
                {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <div className="username-large">{user.username}</div>
                <div className="user-email">{user.email || 'kolam.artist@example.com'}</div>
              </div>
            </div>
          </div>
          
          <div className="dropdown-divider"></div>
          
          <div className="dropdown-menu">
            <button 
              className="dropdown-item"
              onClick={() => setShowProfile(true)}
            >
              <i className="fa-solid fa-user"></i>
              My Profile
            </button>
            
            <button className="dropdown-item">
              <i className="fa-solid fa-palette"></i>
              My Kolams
            </button>
            
            <button className="dropdown-item">
              <i className="fa-solid fa-trophy"></i>
              Achievements
            </button>
            
            <button className="dropdown-item">
              <i className="fa-solid fa-cog"></i>
              Settings
            </button>
            
            <div className="dropdown-divider"></div>
            
            <button 
              className="dropdown-item logout"
              onClick={handleLogout}
            >
              <i className="fa-solid fa-sign-out-alt"></i>
              Logout
            </button>
          </div>
        </div>
      )}

      {showProfile && (
        <ProfileModal 
          user={user} 
          onClose={() => setShowProfile(false)} 
        />
      )}
    </div>
  );
};

const ProfileModal = ({ user, onClose }) => {
  const [stats] = useState({
    kolamCount: 12,
    streakDays: 7,
    achievements: 5,
    totalLikes: 89
  });

  return (
    <div className="profile-modal-overlay">
      <div className="profile-modal">
        <div className="modal-header">
          <h2>User Profile</h2>
          <button className="close-btn" onClick={onClose}>
            <i className="fa-solid fa-times"></i>
          </button>
        </div>
        
        <div className="modal-content">
          <div className="profile-section">
            <div className="profile-avatar">
              <div className="avatar-xl">
                {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
              </div>
              <button className="edit-avatar">
                <i className="fa-solid fa-camera"></i>
              </button>
            </div>
            
            <div className="profile-info">
              <h3>{user.username}</h3>
              <p className="user-title">Kolam Artist</p>
              <p className="join-date">Joined October 2025</p>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{stats.kolamCount}</div>
              <div className="stat-label">Kolams Created</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.streakDays}</div>
              <div className="stat-label">Day Streak</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.achievements}</div>
              <div className="stat-label">Achievements</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.totalLikes}</div>
              <div className="stat-label">Total Likes</div>
            </div>
          </div>

          <div className="recent-activity">
            <h4>Recent Activity</h4>
            <div className="activity-list">
              <div className="activity-item">
                <i className="fa-solid fa-palette"></i>
                <span>Created "Lotus Mandala" design</span>
                <span className="activity-time">2 hours ago</span>
              </div>
              <div className="activity-item">
                <i className="fa-solid fa-trophy"></i>
                <span>Earned "Speed Artist" achievement</span>
                <span className="activity-time">1 day ago</span>
              </div>
              <div className="activity-item">
                <i className="fa-solid fa-heart"></i>
                <span>Received 5 likes on "Festival Special"</span>
                <span className="activity-time">2 days ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;