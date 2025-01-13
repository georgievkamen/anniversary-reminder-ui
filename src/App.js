import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginRegister from './LoginRegister';
import AnniversariesPage from './AnniversariesPage'; // Import the anniversaries page component

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginRegister />} />
                <Route path="/api/anniversary/all" element={<AnniversariesPage />} /> {/* New route */}
            </Routes>
        </Router>
    );
}

export default App;
