import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import './AnniversariesPage.css'; // Import the CSS file for styling

const AnniversariesPage = () => {
    const [anniversaries, setAnniversaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate(); // Initialize the useNavigate hook

    useEffect(() => {
        // Fetch the anniversaries data after the component mounts
        const fetchAnniversaries = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch('https://anniversary-reminder.onrender.com/api/anniversary/all', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch anniversaries');
                }

                const data = await response.json();
                setAnniversaries(data); // Assume the response is an array of anniversaries
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAnniversaries();
    }, []);

    if (loading) return <p>Loading anniversaries...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="anniversaries-container">
            <button
                className="create-anniversary-btn"
                onClick={() => navigate('/anniversary/add')} // Redirect to Create Anniversary page
            >
                Create Anniversary
            </button>

            <h2>All Anniversaries</h2>
            <div className="anniversaries-grid">
                {anniversaries.length > 0 ? (
                    anniversaries.map((anniversary) => (
                        <div key={anniversary.id} className="anniversary-item">
                            <h3>{anniversary.description}</h3>
                            <p>{new Date(anniversary.date).toLocaleDateString()}</p>
                        </div>
                    ))
                ) : (
                    <p>No anniversaries found</p>
                )}
            </div>
        </div>
    );
};

export default AnniversariesPage;
