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
  const [leaderboard, setLeaderboard] = useState([]);
  const [activeTab, setActiveTab] = useState('daily'); // 'daily', 'achievements', 'leaderboard'

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
    },
    'color_master': {
      name: 'Color Master',
      description: 'Use 10 different colors in one design',
      icon: '🌈',
      rarity: 'epic'
    },
    'weekly_warrior': {
      name: 'Weekly Warrior',
      description: 'Complete all daily challenges in a week',
      icon: '👑',
      rarity: 'legendary'
    }
  };

  const dailyChallenges = [
    {
      id: 1,
      date: new Date().toISOString().split('T')[0],
      title: 'Diwali Diya Circle',
      description: 'Create a circular Kolam featuring traditional oil lamps',
      difficulty: 'Medium',
      xpReward: 100,
      timeLimit: 300, // 5 minutes
      requirements: ['Use circular patterns', 'Include diya motifs', 'Use warm colors'],
      image: '/api/placeholder/300/200',
      completed: false
    }
  ];

  const achievements = [
    {
      id: 'beginner_artist',
      name: 'Beginner Artist',
      description: 'Complete your first 5 Kolams',
      progress: user.totalKolams,
      target: 5,
      reward: 50,
      badge: 'first_kolam',
      completed: user.totalKolams >= 5
    },
    {
      id: 'streak_master',
      name: 'Streak Master',
      description: 'Maintain a 7-day drawing streak',
      progress: user.streak,
      target: 7,
      reward: 150,
      badge: 'weekly_warrior',
      completed: false
    },
    {
      id: 'pattern_explorer',
      name: 'Pattern Explorer',
      description: 'Try designs from 5 different regions',
      progress: 3,
      target: 5,
      reward: 100,
      badge: 'festival_expert',
      completed: false
    },
    {
      id: 'speed_demon',
      name: 'Speed Demon',
      description: 'Complete 3 Kolams in under 2 minutes each',
      progress: 1,
      target: 3,
      reward: 200,
      badge: 'speed_artist',
      completed: false
    }
  ];

  useEffect(() => {
    // Load daily challenge
    setDailyChallenge(dailyChallenges[0]);

    // Load leaderboard
    setLeaderboard([
      { rank: 1, name: 'Priya Sharma', xp: 2450, streak: 15, location: 'Chennai' },
      { rank: 2, name: 'Raj Patel', xp: 2380, streak: 12, location: 'Mumbai' },
      { rank: 3, name: 'Sneha Reddy', xp: 2200, streak: 8, location: 'Hyderabad' },
      { rank: 4, name: 'Amit Kumar', xp: 1950, streak: 10, location: 'Delhi' },
      { rank: 5, name: user.name, xp: user.xp, streak: user.streak, location: 'Your City' },
      { rank: 6, name: 'Maya Singh', xp: 1680, streak: 6, location: 'Bangalore' },
      { rank: 7, name: 'Arjun Nair', xp: 1520, streak: 4, location: 'Kochi' }
    ]);
  }, []);

  const startDailyChallenge = () => {
    // Logic to start the daily challenge
    console.log('Starting daily challenge:', dailyChallenge.title);
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return '#A0AEC0';
      case 'uncommon': return '#48BB78';
      case 'rare': return '#4299E1';
      case 'epic': return '#9F7AEA';
      case 'legendary': return '#F6AD55';
      default: return '#A0AEC0';
    }
  };

  const getLevelProgress = () => {
    return (user.xp / user.xpToNext) * 100;
  };

  const DailyChallenge = () => (
    <div className="daily-challenge-section">
      <h2>🌟 Today's Challenge</h2>
      {dailyChallenge && (
        <div className="challenge-card">
          <div className="challenge-header">
            <img src={dailyChallenge.image} alt={dailyChallenge.title} />
            <div className="challenge-info">
              <h3>{dailyChallenge.title}</h3>
              <p>{dailyChallenge.description}</p>
              <div className="challenge-meta">
                <span className={`difficulty ${dailyChallenge.difficulty.toLowerCase()}`}>
                  {dailyChallenge.difficulty}
                </span>
                <span className="reward">+{dailyChallenge.xpReward} XP</span>
                <span className="time-limit">⏱️ {Math.floor(dailyChallenge.timeLimit / 60)} min</span>
              </div>
            </div>
          </div>
          
          <div className="challenge-requirements">
            <h4>Requirements:</h4>
            <ul>
              {dailyChallenge.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>

          <button 
            className="start-challenge-btn"
            onClick={startDailyChallenge}
            disabled={dailyChallenge.completed}
          >
            {dailyChallenge.completed ? '✅ Completed' : '🎯 Start Challenge'}
          </button>
        </div>
      )}
    </div>
  );

  const Achievements = () => (
    <div className="achievements-section">
      <h2>🏆 Achievements</h2>
      <div className="achievements-grid">
        {achievements.map((achievement) => (
          <div key={achievement.id} className={`achievement-card ${achievement.completed ? 'completed' : ''}`}>
            <div className="achievement-icon">
              {achievement.completed ? '✅' : '🎯'}
            </div>
            <div className="achievement-info">
              <h4>{achievement.name}</h4>
              <p>{achievement.description}</p>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${Math.min((achievement.progress / achievement.target) * 100, 100)}%` }}
                ></div>
              </div>
              <span className="progress-text">
                {achievement.progress}/{achievement.target}
              </span>
              <div className="achievement-reward">
                Reward: +{achievement.reward} XP
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const Leaderboard = () => (
    <div className="leaderboard-section">
      <h2>🎖️ Global Leaderboard</h2>
      <div className="leaderboard-list">
        {leaderboard.map((player) => (
          <div key={player.rank} className={`leaderboard-item ${player.name === user.name ? 'current-user' : ''}`}>
            <div className="rank">
              {player.rank <= 3 ? (
                <span className={`medal rank-${player.rank}`}>
                  {player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : '🥉'}
                </span>
              ) : (
                <span className="rank-number">#{player.rank}</span>
              )}
            </div>
            <div className="player-info">
              <h4>{player.name}</h4>
              <p>{player.location}</p>
            </div>
            <div className="player-stats">
              <span className="xp">{player.xp} XP</span>
              <span className="streak">🔥 {player.streak}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="challenges-page">
      <header className="page-header">
        <h1>🏆 Kolam Challenges</h1>
        <p>Complete daily challenges, earn achievements, and climb the leaderboard!</p>
      </header>

      {/* User Profile Section */}
      <div className="user-profile-section">
        <div className="profile-card">
          <div className="profile-info">
            <div className="avatar">👤</div>
            <div className="user-details">
              <h3>{user.name}</h3>
              <p>Level {user.level} Kolam Artist</p>
            </div>
          </div>

          <div className="user-stats">
            <div className="stat">
              <span className="stat-value">{user.totalKolams}</span>
              <span className="stat-label">Kolams Created</span>
            </div>
            <div className="stat">
              <span className="stat-value">{user.streak}</span>
              <span className="stat-label">Day Streak</span>
            </div>
            <div className="stat">
              <span className="stat-value">{user.xp}</span>
              <span className="stat-label">Total XP</span>
            </div>
          </div>

          <div className="level-progress">
            <div className="level-info">
              <span>Level {user.level}</span>
              <span>{user.xp}/{user.xpToNext} XP</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${getLevelProgress()}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="badges-section">
          <h3>🎖️ Your Badges</h3>
          <div className="badges-grid">
            {user.badges.map((badgeId) => {
              const badge = badges[badgeId];
              return (
                <div key={badgeId} className="badge-item">
                  <span 
                    className="badge-icon"
                    style={{ color: getRarityColor(badge.rarity) }}
                  >
                    {badge.icon}
                  </span>
                  <div className="badge-info">
                    <h5>{badge.name}</h5>
                    <p>{badge.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="challenges-nav">
        <button 
          className={`nav-tab ${activeTab === 'daily' ? 'active' : ''}`}
          onClick={() => setActiveTab('daily')}
        >
          Daily Challenge
        </button>
        <button 
          className={`nav-tab ${activeTab === 'achievements' ? 'active' : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          Achievements
        </button>
        <button 
          className={`nav-tab ${activeTab === 'leaderboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('leaderboard')}
        >
          Leaderboard
        </button>
      </div>

      {/* Content Sections */}
      <div className="challenges-content">
        {activeTab === 'daily' && <DailyChallenge />}
        {activeTab === 'achievements' && <Achievements />}
        {activeTab === 'leaderboard' && <Leaderboard />}
      </div>

      <style jsx>{`
        .challenges-page {
          min-height: 100vh;
          background: var(--bg-primary);
          padding: var(--spacing-lg);
        }

        .user-profile-section {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-xl);
        }

        .profile-card {
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
        }

        .profile-info {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-lg);
        }

        .avatar {
          width: 60px;
          height: 60px;
          background: var(--accent-primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
        }

        .user-stats {
          display: flex;
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-lg);
        }

        .stat {
          text-align: center;
        }

        .stat-value {
          display: block;
          font-size: 1.5rem;
          font-weight: bold;
          color: var(--accent-primary);
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .level-progress {
          margin-top: var(--spacing-md);
        }

        .level-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: var(--spacing-sm);
          font-size: 0.875rem;
        }

        .progress-bar {
          height: 8px;
          background: var(--bg-tertiary);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent-primary), #F59E0B);
          transition: width 0.3s ease;
        }

        .badges-section {
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
        }

        .badges-grid {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .badge-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-md);
          background: var(--bg-tertiary);
          border-radius: var(--radius-md);
        }

        .badge-icon {
          font-size: 1.5rem;
        }

        .challenges-nav {
          display: flex;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-lg);
          border-bottom: 2px solid var(--border-subtle);
        }

        .nav-tab {
          padding: var(--spacing-md) var(--spacing-lg);
          border: none;
          background: none;
          color: var(--text-secondary);
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all var(--transition-normal);
        }

        .nav-tab.active {
          color: var(--accent-primary);
          border-bottom-color: var(--accent-primary);
        }

        .challenge-card {
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          margin-bottom: var(--spacing-lg);
        }

        .challenge-header {
          display: flex;
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-lg);
        }

        .challenge-header img {
          width: 150px;
          height: 100px;
          object-fit: cover;
          border-radius: var(--radius-md);
        }

        .challenge-meta {
          display: flex;
          gap: var(--spacing-md);
          margin-top: var(--spacing-sm);
        }

        .difficulty {
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: bold;
        }

        .difficulty.easy { background: #C6F6D5; color: #22543D; }
        .difficulty.medium { background: #FEEBC8; color: #C05621; }
        .difficulty.hard { background: #FED7D7; color: #C53030; }

        .start-challenge-btn {
          width: 100%;
          padding: var(--spacing-md);
          border: none;
          border-radius: var(--radius-lg);
          background: var(--accent-primary);
          color: white;
          font-weight: bold;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all var(--transition-normal);
        }

        .start-challenge-btn:hover:not(:disabled) {
          background: var(--accent-hover);
          transform: translateY(-2px);
        }

        .start-challenge-btn:disabled {
          background: var(--success);
          cursor: not-allowed;
        }

        .achievements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: var(--spacing-lg);
        }

        .achievement-card {
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          border: 2px solid transparent;
          transition: all var(--transition-normal);
        }

        .achievement-card.completed {
          border-color: var(--success);
          background: linear-gradient(135deg, var(--bg-secondary), rgba(72, 187, 120, 0.1));
        }

        .leaderboard-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .leaderboard-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-lg);
          padding: var(--spacing-lg);
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          transition: all var(--transition-normal);
        }

        .leaderboard-item.current-user {
          border: 2px solid var(--accent-primary);
          background: linear-gradient(135deg, var(--bg-secondary), rgba(255, 107, 53, 0.1));
        }

        .rank {
          width: 60px;
          text-align: center;
        }

        .medal {
          font-size: 1.5rem;
        }

        .rank-number {
          font-size: 1.2rem;
          font-weight: bold;
          color: var(--text-secondary);
        }

        .player-info {
          flex: 1;
        }

        .player-stats {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: var(--spacing-xs);
        }

        .xp {
          font-weight: bold;
          color: var(--accent-primary);
        }

        .streak {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
};

export default Challenges;