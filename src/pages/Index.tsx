
import React, { useState } from 'react';
import Login from '@/components/Login';
import Dashboard from '@/components/Dashboard';
import NewReportForm from '@/components/NewReportForm';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<'dashboard' | 'new-report'>('dashboard');

  const handleNewReport = () => {
    setCurrentView('new-report');
  };

  const handleReportSubmit = () => {
    setCurrentView('dashboard');
  };

  const handleReportCancel = () => {
    setCurrentView('dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
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
