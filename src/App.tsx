/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './lib/firebase';
import PublicProfile from './views/PublicProfile';
import AuthView from './views/Auth';
import { BottomNav } from './components/layout/BottomNav';

// Placeholder views for now - will implement next
import Dashboard from './views/Dashboard';
import QRView from './views/QRView';
import JobTracker from './views/JobTracker';
import JobMap from './views/JobMap';
import ProfileSettings from './views/ProfileSettings';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen premium-gradient flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gold border-t-transparent" />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 pb-20 overflow-x-hidden">
        <Routes>
          {/* Public Profile - No Shell */}
          <Route path="/p/:uid" element={<PublicProfile />} />

          {/* Auth Pages */}
          <Route path="/auth" element={!user ? <AuthView /> : <Navigate to="/" />} />

          {/* Private Shell */}
          <Route
            path="*"
            element={
              user ? (
                <>
                  <main className="max-w-md mx-auto min-h-screen">
                    {activeTab === 'dashboard' && <Dashboard />}
                    {activeTab === 'qr' && <QRView />}
                    {activeTab === 'jobs' && <JobTracker />}
                    {activeTab === 'map' && <JobMap />}
                    {activeTab === 'profile' && <ProfileSettings />}
                  </main>
                  <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
                </>
              ) : (
                <Navigate to="/auth" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}


