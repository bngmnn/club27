// App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InvitationList from './InvitationList'; // New invitation list component
import Dresscode from './Dresscode';
import MainPage from './MainPage';
import { ToastContainer, Slide } from 'react-toastify';
import './App.css';

function App() {
    return (
        <>
            <ToastContainer
                position="bottom-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable={false}
                pauseOnHover
                theme="light"
                transition={Slide}
            />
            <Router>
                <Routes>
                    <Route path="/" element={<MainPage />} /> {/* Your existing component */}
                    <Route path="/invitations" element={<InvitationList />} /> {/* New route to see all invitations */}
                    <Route path="/dresscode" element={<Dresscode />} />
                </Routes>
            </Router>
        </>
    );
}

export default App;
