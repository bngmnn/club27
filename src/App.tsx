import './App.css'
// App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InviteePage from './InviteePage'; // The original invitee component
import InvitationList from './InvitationList'; // The new invitation list component

function App() {
    return (
        <>
        <Router>
            <Routes>
                <Route path="/" element={<InviteePage />} /> {/* Your existing component */}
                <Route path="/invitations" element={<InvitationList />} /> {/* New route to see all invitations */}
            </Routes>
        </Router>
        </>
    );
}

export default App;
