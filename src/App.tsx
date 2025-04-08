// App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InvitationList from './InvitationList'; // New invitation list component
import Dresscode from './Dresscode';
import './App.css';
import MainPage from './MainPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainPage />} /> {/* Your existing component */}
                <Route path="/invitations" element={<InvitationList />} /> {/* New route to see all invitations */}
                <Route path="/dresscode" element={<Dresscode />} />
            </Routes>
        </Router>
    );
}

export default App;
