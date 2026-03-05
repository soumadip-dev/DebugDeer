import LandingPage from './pages/LandingPage';
import { Navigate, Route, Routes } from 'react-router';
import DashBoard from './pages/DashBoard';
import { useSession } from './lib/auth-client';
import { LoadingSpinner } from './components/LoadingSpinner';
import NotFound from './pages/NotFound';
import DashboardLayout from './layouts/DashboardLayout';
import Repositories from './pages/Repositories';
import { Toaster } from 'react-hot-toast';
import { useTheme } from './components/theme-provider';
import Settings from './pages/Settings';

function App() {
  const { data: currentSession, isPending: sessionPending } = useSession();
  const { theme } = useTheme();

  if (sessionPending) return <LoadingSpinner />;

  const toastOptions =
    theme === 'dark'
      ? {
          style: {
            background: '#0A0A0A',
            color: '#fff',
          },
        }
      : {
          style: {
            background: '#ffffff',
            color: '#000',
          },
        };

  return (
    <div
      className="min-h-screen w-full bg-background"
      style={{ overflow: 'hidden', position: 'relative' }}
    >
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route element={currentSession ? <DashboardLayout /> : <Navigate to="/" />}>
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/repositories" element={<Repositories />} />
          <Route path="/reviews" element={<div>Reviews</div>} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Toaster position="bottom-right" toastOptions={toastOptions} />
    </div>
  );
}

export default App;
