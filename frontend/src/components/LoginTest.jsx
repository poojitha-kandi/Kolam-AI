import React, { useState } from 'react';
import AnimatedLogin from './AnimatedLogin';

const LoginTest = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setShowLogin(false);
    console.log('User logged in:', userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>🧪 Login System Test</h1>
      
      {user ? (
        <div style={{ backgroundColor: '#f0f8ff', padding: '20px', borderRadius: '10px', margin: '20px 0' }}>
          <h2>✅ User Logged In Successfully!</h2>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email || 'Not provided'}</p>
          <p><strong>Provider:</strong> {user.provider || 'Manual'}</p>
          <button 
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              backgroundColor: '#ff4757',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '10px', margin: '20px 0' }}>
          <h2>🔐 Test Login System</h2>
          <p>Click the button below to test all login functionality</p>
          <button 
            onClick={() => setShowLogin(true)}
            style={{
              padding: '15px 30px',
              backgroundColor: '#f56b35',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            🔐 Open Login Modal
          </button>
        </div>
      )}

      <div style={{ backgroundColor: '#f1f3f4', padding: '20px', borderRadius: '10px', margin: '20px 0', textAlign: 'left' }}>
        <h3>🧪 Test Scenarios:</h3>
        <ol>
          <li><strong>Close Button:</strong> Click the X to close modal</li>
          <li><strong>Login Form:</strong> Enter username/password and click "Sign In"</li>
          <li><strong>Toggle Mode:</strong> Click "Create Account" to switch to signup</li>
          <li><strong>Forgot Password:</strong> Click "Forgot Password?" to test reset flow</li>
          <li><strong>Google Login:</strong> Click Google button (simulated)</li>
          <li><strong>GitHub Login:</strong> Click GitHub button (simulated)</li>
          <li><strong>Form Validation:</strong> Try submitting empty forms</li>
          <li><strong>Loading States:</strong> Watch spinner animations</li>
        </ol>
      </div>

      <div style={{ backgroundColor: '#e8f5e8', padding: '20px', borderRadius: '10px', margin: '20px 0', textAlign: 'left' }}>
        <h3>✅ Button Status:</h3>
        <ul>
          <li>✅ <strong>Close Button:</strong> Fully functional</li>
          <li>✅ <strong>Sign In/Create Account:</strong> Fully functional with validation</li>
          <li>✅ <strong>Toggle Mode Links:</strong> Fully functional</li>
          <li>✅ <strong>Forgot Password:</strong> Now fully functional with reset form</li>
          <li>✅ <strong>Google Login:</strong> Now fully functional (simulated)</li>
          <li>✅ <strong>GitHub Login:</strong> Now fully functional (simulated)</li>
          <li>✅ <strong>Loading States:</strong> All buttons show loading when processing</li>
          <li>✅ <strong>Error Handling:</strong> Proper error messages for all scenarios</li>
        </ul>
      </div>

      {showLogin && (
        <AnimatedLogin 
          onLogin={handleLogin}
          onClose={() => setShowLogin(false)}
        />
      )}
    </div>
  );
};

export default LoginTest;