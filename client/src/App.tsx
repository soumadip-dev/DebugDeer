import LandingPage from './pages/LandingPage';
import { Route, Routes } from 'react-router';
import DashBoard from './pages/DashBoard';

function App() {
  return (
    <div
      className="min-h-screen w-full bg-background"
      style={{ overflow: 'hidden', position: 'relative' }}
    >
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/dashboard" element={<DashBoard />} />
      </Routes>
    </div>
  );
}

export default App;
