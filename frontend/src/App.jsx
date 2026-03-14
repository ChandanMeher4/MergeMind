import { Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import TeamHealth from './pages/TeamHealth';
import Navbar from './components/Navbar';
import ReviewHistory from './pages/ReviewHistory';
import AnimatedBackground from './components/AnimatedBackground';
import PageTransition from './components/PageTransition';

function App() {
  return (
    <>
      <div className="min-h-screen flex flex-col items-stretch overflow-hidden">
        <div className="min-h-screen bg-background text-foreground relative z-10 w-full flex flex-col">
          <Navbar />
          <PageTransition>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/team" element={<TeamHealth />} />
              <Route path="/history" element={<ReviewHistory />} />
            </Routes>
          </PageTransition>
        </div>
        
        {/* Background elements — animated aurora orbs */}
        <AnimatedBackground />
      </div>
    </>
  );
}

export default App;
