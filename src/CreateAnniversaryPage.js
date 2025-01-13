import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateAnniversary.css';

const CreateAnniversaryPage = () => {
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token'); // Get the token from localStorage
        const anniversaryData = {
            date,
            description,
        };

        try {
            const response = await fetch('https://anniversary-reminder.onrender.com/api/anniversary/add', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, // Attach token to the Authorization header
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(anniversaryData),
            });

            if (!response.ok) {
                throw new Error('Failed to create anniversary');
            }

            // Redirect to the anniversaries page after successful creation
            navigate('/api/anniversary/all');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-anniversary-container">
            <h2>Create Anniversary</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="date">Date:</label>
                    <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description">Description:</label>
                    <input
                        type="text"
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Anniversary'}
                </button>
            </form>
        </div>
    );
};

export default CreateAnniversaryPage;
