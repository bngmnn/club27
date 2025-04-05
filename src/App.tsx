import './App.css'
// App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InviteePage from './InviteePage'; // The original invitee component
import InvitationList from './InvitationList'; // The new invitation list component

function App() {
    return (
        <>
        <head>
            <title>White Stag Party</title>
            <meta name="description" content="White Stag Party" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/stag.png" />
        </head>
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
