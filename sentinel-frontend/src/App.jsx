import React, { useContext, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';

import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';

import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { AlertsPage } from './pages/AlertsPage';
import { AssetsPage } from './pages/AssetsPage';
import { IncidentsPage } from './pages/IncidentsPage';
import { VulnerabilitiesPage } from './pages/VulnerabilitiesPage';
import { MetricsPage } from './pages/MetricsPage';

import './App.css';

const AppRoutes = () => {
  const { user } = useContext(AuthContext);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [initialLoginMode, setInitialLoginMode] = useState(true);

  if (!user) {
    if (showAuthModal) {
      return (
        <AuthPage 
          defaultLoginMode={initialLoginMode} 
          onCancel={() => setShowAuthModal(false)} 
        />
      );
    }
    return (
      <LandingPage 
        onOpenAuth={(isLogin) => {
          setInitialLoginMode(isLogin);
          setShowAuthModal(true);
        }} 
      />
    );
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content-area">
        <Navbar />
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/assets" element={<AssetsPage />} />
          <Route path="/incidents" element={<IncidentsPage />} />
          <Route path="/vulnerabilities" element={<VulnerabilitiesPage />} />
          <Route path="/metrics" element={<MetricsPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}