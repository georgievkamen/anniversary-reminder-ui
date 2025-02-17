import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import './LoginRegister.css';

const LoginRegister = () => {
    // States to manage form data, toggling between Login and Register, and error/loading states
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [timezone, setTimezone] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate(); // Initialize the useNavigate hook

    // Automatically get and set the user's timezone on component mount
    useEffect(() => {
        setTimezone(() => {
            try {
                return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
            } catch {
                return 'UTC';
            }
        });
    }, []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const url = isLogin
            ? 'https://anniversary-reminder.onrender.com/api/users/login'
            : 'https://anniversary-reminder.onrender.com/api/users/register';

        const headers = {
            'Content-Type': 'application/json',
            ...(isLogin ? {} : { timeZoneId: timezone }), // Include timezone only for registration
        };

        const body = JSON.stringify({ email, password });

        try {
            const response = await fetch(url, { method: 'POST', headers, body });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'An unexpected error occurred.');
            }

            if (isLogin) {
                // On successful login, get the token directly as a string
                const token = await response.text(); // Use .text() to get the plain token
                localStorage.setItem('token', token); // Save token for future API calls
                navigate('/api/anniversary/all'); // Redirect to the anniversaries page
            } else {
                setIsLogin(true); // Switch to login form after successful registration
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'email') setEmail(value);
        if (name === 'password') setPassword(value);
    };

    return (
        <div className="auth-container">
            {/* Slogan Section */}
            <div className="slogan">
                <h1>Welcome to Anniversary Reminder App</h1>
                <p>
                    Never miss an event or your friend's birthday again! Register, add an event,
                    and receive email reminders for your important dates.
                </p>
            </div>

    <div className="form-container">
        {/* Toggle between Login and Register */}
        <div className="form-toggle">
            <button
                onClick={() => setIsLogin(true)}
                className={`form-btn ${isLogin ? 'active' : ''}`}
            >
                Login
            </button>
            <button
                onClick={() => setIsLogin(false)}
                        className={`form-btn ${!isLogin ? 'active' : ''}`}
                    >
                        Register
                    </button>
                </div>

                {/* Form */}
                <form className="auth-form" onSubmit={handleSubmit}>
                    <h2>{isLogin ? 'Login' : 'Register'}</h2>

                    {/* Email Input */}
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={email}
                        onChange={handleInputChange}
                        placeholder="Email"
                        required
                        aria-label="Email"
                    />

                    {/* Password Input */}
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        value={password}
                        onChange={handleInputChange}
                        placeholder="Password"
                        required
                        aria-label="Password"
                    />

                    {/* Timezone Display (only for Registration) */}
                    {!isLogin && (
                        <>
                            <label htmlFor="timezone">Timezone</label>
                            <input
                                type="text"
                                id="timezone"
                                value={timezone}
                                placeholder="Timezone"
                                disabled
                                aria-label="Timezone"
                            />
                        </>
                    )}

                    {/* Error Message */}
                    {error && <p className="error">{error}</p>}

                    {/* Submit Button */}
                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading
                            ? isLogin
                                ? 'Logging in...'
                                : 'Registering...'
                            : isLogin
                                ? 'Login'
                                : 'Register'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginRegister;
