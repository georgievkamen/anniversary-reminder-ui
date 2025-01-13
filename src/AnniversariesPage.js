import React, { useState, useEffect } from 'react';
import './AnniversariesPage.css'; // Import the CSS file for styling

const AnniversariesPage = () => {
    const [anniversaries, setAnniversaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false); // State to toggle the form visibility
    const [date, setDate] = useState(''); // Date state
    const [description, setDescription] = useState(''); // Description state
    const [formError, setFormError] = useState(null); // Form error state

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
                setAnniversaries(data); // Assume the response is an array of anniversaries
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAnniversaries();
    }, []);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'date') setDate(value);
        if (name === 'description') setDescription(value);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);

        if (!date || !description) {
            setFormError("Both date and description are required.");
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
                // The server has successfully created the resource and returned a 201 status
                // Optionally, you can handle a successful creation here (e.g., show a success message or update the UI)
                setAnniversaries(prevAnniversaries => [...prevAnniversaries, anniversaryData]);

                // Hide the form after successful submission
                setShowForm(false);
                // Clear the form fields
                setDate('');
                setDescription('');
            } else {
                throw new Error('Failed to create anniversary');
            }
        } catch (err) {
            setFormError(err.message);
        }
    };

    if (loading) return <p>Loading anniversaries...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="anniversaries-container">
            <h2>All Anniversaries</h2>

            {/* Button to toggle form visibility */}
            <button onClick={() => setShowForm(!showForm)} className="create-anniversary-btn">
                {showForm ? 'Cancel' : 'Create Anniversary'}
            </button>

            {/* Show form when showForm is true */}
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

                    {/* Display form error */}
                    {formError && <p className="error">{formError}</p>}

                    <button type="submit">Submit</button>
                </form>
            )}

            {/* Anniversaries list */}
            <div className="anniversaries-list">
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
