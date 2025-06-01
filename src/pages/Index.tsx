
import React, { useState } from 'react';
import Login from '@/components/Login';
import Dashboard from '@/components/Dashboard';
import NewReportForm from '@/components/NewReportForm';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'new-report'>('dashboard');

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleNewReport = () => {
    setCurrentView('new-report');
  };

  const handleReportSubmit = (report: any) => {
    console.log('Novo relato:', report);
    setCurrentView('dashboard');
  };

  const handleReportCancel = () => {
    setCurrentView('dashboard');
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  if (currentView === 'new-report') {
    return (
      <NewReportForm
        onSubmit={handleReportSubmit}
        onCancel={handleReportCancel}
      />
    );
  }

  return <Dashboard onNewReport={handleNewReport} />;
};

export default Index;
