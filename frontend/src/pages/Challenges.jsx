import React, { useState, useEffect } from 'react';
import '../App.css';

const Challenges = () => {
  const [user, setUser] = useState({
    name: 'Kolam Artist',
    level: 5,
    xp: 750,
    xpToNext: 1000,
    streak: 3,
    totalKolams: 12,
    badges: ['first_kolam', 'festival_expert', 'three_day_streak']
  });

  const [dailyChallenge, setDailyChallenge] = useState(null);
  const [weeklyChallenge, setWeeklyChallenge] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [activeTab, setActiveTab] = useState('daily');
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [submissionModal, setSubmissionModal] = useState(false);
  const [uploadedDesign, setUploadedDesign] = useState(null);

  const badges = {
    'first_kolam': {
      name: 'First Steps',
      description: 'Create your first Kolam',
      icon: '🎨',
      rarity: 'common'
    },
    'festival_expert': {
      name: 'Festival Expert',
      description: 'Complete 5 festival-themed Kolams',
      icon: '🎉',
      rarity: 'rare'
    },
    'three_day_streak': {
      name: 'Dedicated Artist',
      description: 'Maintain a 3-day streak',
      icon: '🔥',
      rarity: 'uncommon'
    },
    'perfect_symmetry': {
      name: 'Perfect Symmetry',
      description: 'Create a perfectly symmetric design',
      icon: '⚖️',
      rarity: 'epic'
    },
    'speed_artist': {
      name: 'Speed Artist',
      description: 'Complete a Kolam in under 2 minutes',
      icon: '⚡',
      rarity: 'rare'
    }
  };

  useEffect(() => {
    // Generate daily challenge
    const challenges = [
      {
        id: 'daily_1',
        title: 'Lotus Mandala',
        description: 'Create a lotus-inspired Kolam with 8 petals',
        difficulty: 'Medium',
        xpReward: 150,
        timeLimit: '24 hours',
        requirements: ['Use circular patterns', 'Include lotus motifs', 'Minimum 8 petals'],
        type: 'daily'
      },
      {
        id: 'daily_2',
        title: 'Geometric Harmony',
        description: 'Design a Kolam using only triangles and squares',
        difficulty: 'Hard',
        xpReward: 200,
        timeLimit: '24 hours',
        requirements: ['Only geometric shapes', 'Symmetrical design', 'Use at least 3 colors'],
        type: 'daily'
      },
      {
        id: 'daily_3',
        title: 'Peacock Grace',
        description: 'Create a traditional peacock Kolam',
        difficulty: 'Easy',
        xpReward: 100,
        timeLimit: '24 hours',
        requirements: ['Include peacock motif', 'Use traditional colors', 'Flowing lines'],
        type: 'daily'
      }
    ];

    const weeklyChallenge = {
      id: 'weekly_1',
      title: 'Festival Celebration',
      description: 'Create a complete Diwali Kolam collection',
      difficulty: 'Epic',
      xpReward: 500,
      timeLimit: '7 days',
      requirements: ['Create 5 different designs', 'Use traditional motifs', 'Include Diya patterns'],
      type: 'weekly',
      progress: 2,
      total: 5
    };

    // Simulate challenge selection based on date
    const challengeIndex = new Date().getDate() % challenges.length;
    setDailyChallenge(challenges[challengeIndex]);
    setWeeklyChallenge(weeklyChallenge);

    // Generate leaderboard
    const mockLeaderboard = [
      { rank: 1, name: 'Priya Sharma', xp: 2500, level: 12, avatar: '👩‍🎨' },
      { rank: 2, name: 'Arjun Patel', xp: 2200, level: 11, avatar: '👨‍🎨' },
      { rank: 3, name: 'Meera Singh', xp: 1950, level: 10, avatar: '👩‍🎨' },
      { rank: 4, name: 'Vikram Kumar', xp: 1800, level: 9, avatar: '👨‍🎨' },
      { rank: 5, name: user.name, xp: user.xp, level: user.level, avatar: '🎨' },
      { rank: 6, name: 'Anjali Reddy', xp: 700, level: 4, avatar: '👩‍🎨' },
      { rank: 7, name: 'Ravi Iyer', xp: 650, level: 4, avatar: '👨‍🎨' },
      { rank: 8, name: 'Deepika Joshi', xp: 600, level: 3, avatar: '👩‍🎨' }
    ];
    setLeaderboard(mockLeaderboard);
  }, [user.name, user.xp, user.level]);

  const handleChallengeSubmit = (challengeId) => {
    setSelectedChallenge(challengeId);
    setSubmissionModal(true);
  };

  const handleDesignUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedDesign(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitChallenge = () => {
    if (!uploadedDesign) return;
    
    // Simulate challenge completion
    const challenge = selectedChallenge === 'weekly_1' ? weeklyChallenge : dailyChallenge;
    setUser(prev => ({
      ...prev,
      xp: prev.xp + challenge.xpReward,
      totalKolams: prev.totalKolams + 1,
      streak: prev.streak + 1
    }));

    setSubmissionModal(false);
    setUploadedDesign(null);
    setSelectedChallenge(null);
    
    // Show success message
    alert(`Challenge completed! You earned ${challenge.xpReward} XP!`);
  };

  const renderDailyChallenges = () => (
    <div className="challenges-section">
      <h2>📅 Daily Challenge</h2>
      {dailyChallenge && (
        <div className="challenge-card daily">
          <div className="challenge-header">
            <h3>{dailyChallenge.title}</h3>
            <span className={`difficulty ${dailyChallenge.difficulty.toLowerCase()}`}>
              {dailyChallenge.difficulty}
            </span>
          </div>
          <p className="challenge-description">{dailyChallenge.description}</p>
          <div className="challenge-requirements">
            <h4>Requirements:</h4>
            <ul>
              {dailyChallenge.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
          <div className="challenge-footer">
            <div className="challenge-reward">🎯 {dailyChallenge.xpReward} XP</div>
            <div className="challenge-time">⏰ {dailyChallenge.timeLimit}</div>
            <button 
              className="submit-challenge-btn"
              onClick={() => handleChallengeSubmit(dailyChallenge.id)}
            >
              📤 Submit Design
            </button>
          </div>
        </div>
      )}

      <h2>📆 Weekly Challenge</h2>
      {weeklyChallenge && (
        <div className="challenge-card weekly">
          <div className="challenge-header">
            <h3>{weeklyChallenge.title}</h3>
            <span className={`difficulty ${weeklyChallenge.difficulty.toLowerCase()}`}>
              {weeklyChallenge.difficulty}
            </span>
          </div>
          <p className="challenge-description">{weeklyChallenge.description}</p>
          <div className="challenge-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(weeklyChallenge.progress / weeklyChallenge.total) * 100}%` }}
              ></div>
            </div>
            <span className="progress-text">
              {weeklyChallenge.progress}/{weeklyChallenge.total} completed
            </span>
          </div>
          <div className="challenge-requirements">
            <h4>Requirements:</h4>
            <ul>
              {weeklyChallenge.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
          <div className="challenge-footer">
            <div className="challenge-reward">🎯 {weeklyChallenge.xpReward} XP</div>
            <div className="challenge-time">⏰ {weeklyChallenge.timeLimit}</div>
            <button 
              className="submit-challenge-btn"
              onClick={() => handleChallengeSubmit(weeklyChallenge.id)}
            >
              📤 Submit Design
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderAchievements = () => (
    <div className="achievements-section">
      <h2>🏆 Achievements & Badges</h2>
      <div className="badges-grid">
        {Object.entries(badges).map(([key, badge]) => (
          <div 
            key={key} 
            className={`badge-card ${user.badges.includes(key) ? 'earned' : 'locked'}`}
          >
            <div className="badge-icon">{badge.icon}</div>
            <h3 className="badge-name">{badge.name}</h3>
            <p className="badge-description">{badge.description}</p>
            <span className={`badge-rarity ${badge.rarity}`}>{badge.rarity}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLeaderboard = () => (
    <div className="leaderboard-section">
      <h2>🥇 Leaderboard</h2>
      <div className="leaderboard-list">
        {leaderboard.map((player) => (
          <div 
            key={player.rank} 
            className={`leaderboard-item ${player.name === user.name ? 'current-user' : ''}`}
          >
            <div className="rank">#{player.rank}</div>
            <div className="avatar">{player.avatar}</div>
            <div className="player-info">
              <div className="player-name">{player.name}</div>
              <div className="player-level">Level {player.level}</div>
            </div>
            <div className="player-xp">{player.xp} XP</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="challenges-container">
      {/* Header with User Stats */}
      <div className="challenges-header">
        <div className="user-profile">
          <div className="user-avatar">🎨</div>
          <div className="user-info">
            <h1>{user.name}</h1>
            <div className="user-stats">
              <span className="level">Level {user.level}</span>
              <span className="xp">{user.xp} / {user.xpToNext} XP</span>
              <span className="streak">🔥 {user.streak} day streak</span>
            </div>
          </div>
        </div>
        
        <div className="xp-bar">
          <div 
            className="xp-progress" 
            style={{ width: `${(user.xp / user.xpToNext) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="challenge-tabs">
        <button 
          className={`tab ${activeTab === 'daily' ? 'active' : ''}`}
          onClick={() => setActiveTab('daily')}
        >
          📅 Challenges
        </button>
        <button 
          className={`tab ${activeTab === 'achievements' ? 'active' : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          🏆 Achievements
        </button>
        <button 
          className={`tab ${activeTab === 'leaderboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('leaderboard')}
        >
          🥇 Leaderboard
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'daily' && renderDailyChallenges()}
        {activeTab === 'achievements' && renderAchievements()}
        {activeTab === 'leaderboard' && renderLeaderboard()}
      </div>

      {/* Submission Modal */}
      {submissionModal && (
        <div className="modal-overlay" onClick={() => setSubmissionModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📤 Submit Your Design</h2>
              <button className="modal-close" onClick={() => setSubmissionModal(false)}>✖️</button>
            </div>
            <div className="modal-body">
              <div className="upload-area">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleDesignUpload}
                  className="file-input"
                  id="design-upload"
                />
                <label htmlFor="design-upload" className="upload-label">
                  {uploadedDesign ? (
                    <img src={uploadedDesign} alt="Uploaded design" className="uploaded-preview" />
                  ) : (
                    <div className="upload-placeholder">
                      <div className="upload-icon">📷</div>
                      <p>Click to upload your Kolam design</p>
                    </div>
                  )}
                </label>
              </div>
              
              {uploadedDesign && (
                <div className="submission-actions">
                  <button className="submit-btn" onClick={submitChallenge}>
                    🎯 Submit Challenge
                  </button>
                  <button 
                    className="cancel-btn" 
                    onClick={() => {
                      setUploadedDesign(null);
                      setSubmissionModal(false);
                    }}
                  >
                    ❌ Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Challenges;