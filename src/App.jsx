import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/SupabaseAuthContext.jsx';
import LandingPage from '@/pages/LandingPage.jsx';
import LoginPage from '@/pages/LoginPage.jsx';
import SignupPage from '@/pages/SignupPage.jsx';
import Dashboard from '@/pages/Dashboard.jsx';
import CreateStory from '@/pages/CreateStory.jsx';
import BookViewer from '@/pages/BookViewer.jsx';
import CreditsPage from '@/pages/CreditsPage.jsx';
import StickerBookPage from '@/pages/StickerBookPage.jsx';
import CommunityGardenPage from '@/pages/CommunityGardenPage.jsx';
import MyCastPage from '@/pages/MyCastPage.jsx';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/create" element={
              <ProtectedRoute>
                <CreateStory />
              </ProtectedRoute>
            } />
            <Route path="/book/:id" element={
              <ProtectedRoute>
                <BookViewer />
              </ProtectedRoute>
            } />
            <Route path="/credits" element={
              <ProtectedRoute>
                <CreditsPage />
              </ProtectedRoute>
            } />
            <Route path="/sticker-book" element={
              <ProtectedRoute>
                <StickerBookPage />
              </ProtectedRoute>
            } />
            <Route path="/community" element={
              <ProtectedRoute>
                <CommunityGardenPage />
              </ProtectedRoute>
            } />
            <Route path="/my-cast" element={
              <ProtectedRoute>
                <MyCastPage />
              </ProtectedRoute>
            } />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;