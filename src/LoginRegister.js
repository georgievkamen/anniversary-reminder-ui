import React, { useState } from 'react';
import './LoginRegister.css';

const LoginRegister = () => {
    // States to manage form data and toggling between Login and Register
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [timezone, setTimezone] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Get the user's timezone automatically using Intl API
    const getUserTimezone = () => {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = {
            email,
            password,
            timezone,
        };

        try {
            if (isLogin) {
                // Login request
                const loginResponse = await fetch('https://anniversary-reminder.onrender.com/api/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                });

                if (!loginResponse.ok) {
                    throw new Error('Login failed. Please check your credentials.');
                }

                // Handle successful login (you can store the JWT or session here)
                alert('Login successful!');
                // Redirect to dashboard or another page after successful login
                // navigate("/dashboard"); // Uncomment if you are using react-router
            } else {
                // Register request
                const registerResponse = await fetch('https://anniversary-reminder.onrender.com/api/users/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'timeZoneId': timezone, // Send timezone in headers
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                });

                if (!registerResponse.ok) {
                    throw new Error('Registration failed. Please try again.');
                }

                alert('Registration successful! Redirecting to login...');
                // Redirect to login page after successful registration
                setIsLogin(true); // Switch to login form
                setLoading(false); // End loading state
            }
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'email') setEmail(value);
        if (name === 'password') setPassword(value);
    };

    // Set timezone automatically when Register form is shown
    if (!timezone && !isLogin) {
        setTimezone(getUserTimezone());
    }

    return (
        <div className="auth-container">
            <div className="form-container">
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

                {/* Login Form */}
                {isLogin ? (
                    <form className="auth-form" onSubmit={handleSubmit}>
                        <h2>Login</h2>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={handleInputChange}
                            placeholder="Email"
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={handleInputChange}
                            placeholder="Password"
                            required
                        />
                        {error && <p className="error">{error}</p>}
                        <button type="submit" className="auth-btn" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                ) : (
                    // Register Form
                    <form className="auth-form" onSubmit={handleSubmit}>
                        <h2>Register</h2>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={handleInputChange}
                            placeholder="Email"
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={handleInputChange}
                            placeholder="Password"
                            required
                        />
                        <input
                            type="text"
                            value={timezone}
                            placeholder="Timezone"
                            disabled
                        />
                        {error && <p className="error">{error}</p>}
                        <button type="submit" className="auth-btn" disabled={loading}>
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default LoginRegister;
