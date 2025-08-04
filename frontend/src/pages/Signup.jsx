import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Link, useNavigate } from 'react-router-dom';

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const formRef = useRef(null);
  const titleRef = useRef(null);

  const API_BASE = `http://localhost:${import.meta.env.VITE_API_PORT || 5000}/api`;

  // Test backend connection
  const testConnection = async () => {
    try {
      const response = await fetch(`${API_BASE}/test`);
      const data = await response.json();
      console.log('Backend connection test:', data);
      return true;
    } catch (error) {
      console.error('Backend connection failed:', error);
      setError('Cannot connect to backend. Please make sure the server is running.');
      return false;
    }
  };

  useEffect(() => {
    // Check if already authenticated
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
      return;
    }

    // Test backend connection on component mount
    testConnection();

    // GSAP animations
    const ctx = gsap.context(() => {
      gsap.set([titleRef.current, formRef.current], { opacity: 0, y: 30 });
      
      gsap.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "back.out(1.7)"
      });

      gsap.to(formRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 0.2,
        ease: "back.out(1.7)"
      });
    }, containerRef);

    return () => ctx.revert();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      // Check if response is ok and has content
      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          localStorage.setItem('token', data.token);
          navigate('/dashboard');
        } else {
          setError('Registration successful but no token received');
        }
      } else {
        // Handle error response
        let errorMessage = 'Registration failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          console.error('Error parsing response:', parseError);
          errorMessage = `Registration failed (${response.status})`;
        }
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Signup error:', error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setError('Cannot connect to server. Please make sure the backend is running on port 5000.');
      } else {
        setError('Backend error or server crashed. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400 to-blue-500 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Title */}
        <div ref={titleRef} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Join Dressify</h1>
          <p className="text-gray-600">Create your account and start your fashion journey</p>
        </div>

        {/* Signup Form */}
        <div ref={formRef} className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="Create a password (min. 6 characters)"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="Confirm your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-green-600 hover:text-green-700 font-semibold">
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link to="/" className="text-gray-500 hover:text-gray-700 text-sm">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
