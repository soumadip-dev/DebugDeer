import LandingPage from './pages/LandingPage';
import { Navigate, Route, Routes } from 'react-router';
import DashBoard from './pages/DashBoard';
import { useSession } from './lib/auth-client';
import { LoadingSpinner } from './components/LoadingSpinner';
import NotFound from './pages/NotFound';
import DashboardLayout from './layouts/DashboardLayout';

function App() {
  const { data: currentSession, isPending: sessionPending } = useSession();

  if (sessionPending) return <LoadingSpinner />;

  return (
    <div
      className="min-h-screen w-full bg-background"
      style={{ overflow: 'hidden', position: 'relative' }}
    >
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={currentSession ? <DashboardLayout /> : <Navigate to="/" />}>
          <Route path="/dashboard" element={<DashBoard />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
