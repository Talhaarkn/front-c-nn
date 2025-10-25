import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreateProfile from './pages/CreateProfile';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';

function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateProfile />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/edit/:id" element={<EditProfile />} />
      </Routes>
    </div>
  );
}

export default App;

