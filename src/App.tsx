// App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InvitationList from './InvitationList'; // New invitation list component
import InviteePage from './InviteePage'; // Your existing invitee component
import Dresscode from './Dresscode';
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<InviteePage />} /> {/* Your existing component */}
                <Route path="/invitations" element={<InvitationList />} /> {/* New route to see all invitations */}
                <Route path="/dresscode" element={<Dresscode />} />
            </Routes>
        </Router>
    );
}

export default App;
