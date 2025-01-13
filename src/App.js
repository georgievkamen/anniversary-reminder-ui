import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginRegister from './LoginRegister'; // Import the LoginRegister component
import AnniversariesPage from './AnniversariesPage'; // Import your anniversaries page
import CreateAnniversaryPage from './CreateAnniversaryPage'; // Import the create anniversary page

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginRegister />} />
                <Route path="/api/anniversary/all" element={<AnniversariesPage />} />
                <Route path="/api/anniversary/add" element={<CreateAnniversaryPage />} />
            </Routes>
        </Router>
    );
}

export default App;
