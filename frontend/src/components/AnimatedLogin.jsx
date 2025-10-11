import React, { useState } from 'react';
import './AnimatedLogin.css';

const AnimatedLogin = ({ onLogin, onClose }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: ''
  });
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

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
    setError('');

    try {
      // Simulate API call - replace with actual authentication logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (formData.username && formData.password) {
        // Mock successful login
        onLogin({
          username: formData.username,
          isAuthenticated: true
        });
      } else {
        setError('Please fill in all fields');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setShowForgotPassword(false);
    setFormData({ username: '', password: '', email: '' });
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
    setError('');
  };

  const handleSocialLogin = (provider) => {
    setLoading(true);
    setError('');
    
    // Simulate social login
    setTimeout(() => {
      setLoading(false);
      // Mock successful social login
      onLogin({
        username: `${provider}User`,
        email: `user@${provider.toLowerCase()}.com`,
        provider: provider,
        isAuthenticated: true
      });
    }, 1500);
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      setError('Please enter your email address');
      return;
    }
    
    setLoading(true);
    try {
      // Simulate forgot password API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setError('');
      alert('Password reset link sent to your email!');
      setShowForgotPassword(false);
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-overlay">
      <div className="animated-login-container">
        <button className="close-button" onClick={onClose}>
          <i className="fa-solid fa-times"></i>
        </button>
        
        <div className="animated-box">
          <div className="login-form">
            <div className="login-content">
              <h2>
                <i className="fa-solid fa-palette"></i>
                {showForgotPassword ? 'Reset Password' : isSignUp ? 'Join Kolam AI' : 'Welcome Back'}
                <i className="fa-solid fa-heart"></i>
              </h2>
              
              {error && (
                <div className="error-message">
                  <i className="fa-solid fa-exclamation-triangle"></i>
                  {error}
                </div>
              )}

              {showForgotPassword ? (
                // Forgot Password Form
                <form onSubmit={handleForgotPasswordSubmit}>
                  <div className="input-group">
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="submit-button"
                    disabled={loading}
                  >
                    {loading ? (
                      <i className="fa-solid fa-spinner fa-spin"></i>
                    ) : (
                      'Send Reset Link'
                    )}
                  </button>

                  <div className="form-links">
                    <a 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); setShowForgotPassword(false); }}
                      className="toggle-mode"
                    >
                      ← Back to Login
                    </a>
                  </div>
                </form>
              ) : (
                // Regular Login/Signup Form
                <>
                  <form onSubmit={handleSubmit}>
                    <div className="input-group">
                      <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="input-group">
                      <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {isSignUp && (
                      <div className="input-group">
                        <input
                          type="email"
                          name="email"
                          placeholder="Email Address"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    )}

                    <button 
                      type="submit" 
                      className="submit-button"
                      disabled={loading}
                    >
                      {loading ? (
                        <i className="fa-solid fa-spinner fa-spin"></i>
                      ) : (
                        isSignUp ? 'Create Account' : 'Sign In'
                      )}
                    </button>

                    <div className="form-links">
                      <a 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); handleForgotPassword(); }}
                      >
                        Forgot Password?
                      </a>
                      <a 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); toggleMode(); }}
                        className="toggle-mode"
                      >
                        {isSignUp ? 'Already have an account?' : 'Create Account'}
                      </a>
                    </div>
                  </form>

                  <div className="divider">
                    <span>or continue with</span>
                  </div>

                  <div className="social-login">
                    <button 
                      className="social-button google"
                      onClick={() => handleSocialLogin('Google')}
                      disabled={loading}
                    >
                      <i className="fa-brands fa-google"></i>
                      Google
                    </button>
                    <button 
                      className="social-button github"
                      onClick={() => handleSocialLogin('GitHub')}
                      disabled={loading}
                    >
                      <i className="fa-brands fa-github"></i>
                      GitHub
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedLogin;