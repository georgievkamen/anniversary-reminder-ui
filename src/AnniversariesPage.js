import React, { useState, useEffect } from 'react';
import './AnniversariesPage.css';

const AnniversariesPage = () => {
    const [anniversaries, setAnniversaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [formError, setFormError] = useState(null);

    useEffect(() => {
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
                setAnniversaries(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAnniversaries();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'date') setDate(value);
        if (name === 'description') setDescription(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);

        if (!date || !description) {
            setFormError('Both date and description are required.');
            return;
        }

        const anniversaryData = { date, description };
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('https://anniversary-reminder.onrender.com/api/anniversary/add', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(anniversaryData),
            });

            if (response.ok && response.status === 201) {
                const newAnniversary = await response.json();
                setAnniversaries((prevAnniversaries) => [...prevAnniversaries, newAnniversary]);
                setShowForm(false);
                setDate('');
                setDescription('');
            } else {
                throw new Error('Failed to create anniversary');
            }
        } catch (err) {
            setFormError(err.message);
        }
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`https://anniversary-reminder.onrender.com/api/anniversary/delete`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete anniversary');
            }

            setAnniversaries((prevAnniversaries) =>
                prevAnniversaries.filter((anniversary) => anniversary.id !== id)
            );
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <p>Loading anniversaries...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className={`anniversaries-container ${showForm ? 'show-form' : ''}`}>
            <h2>All Anniversaries</h2>

            <button onClick={() => setShowForm(!showForm)} className="create-anniversary-btn">
                {showForm ? 'Cancel' : 'Create Anniversary'}
            </button>

            {showForm && (
                <form onSubmit={handleSubmit} className="create-anniversary-form">
                    <div>
                        <label htmlFor="date">Anniversary Date:</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={date}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="description">Description:</label>
                        <input
                            type="text"
                            id="description"
                            name="description"
                            value={description}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {formError && <p className="error">{formError}</p>}

                    <button type="submit">Submit</button>
                </form>
            )}

            <div className="anniversaries-list">
                {anniversaries.length > 0 ? (
                    anniversaries.map((anniversary) => (
                        <div key={anniversary.id} className="anniversary-item">
                            <div className="content">
                                <div>
                                    <h3>{anniversary.description}</h3>
                                    <p>{new Date(anniversary.date).toLocaleDateString()}</p>
                                </div>
                                <button
                                    onClick={() => handleDelete(anniversary.id)}
                                    className="delete-anniversary-btn"
                                >
                                    Delete
                                </button>
                            </div>
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
