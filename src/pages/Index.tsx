
import React, { useState } from 'react';
import Login from '@/components/Login';
import Dashboard from '@/components/Dashboard';
import AdminDashboard from '@/components/AdminDashboard';
import UserProblemsPage from '@/components/UserProblemsPage';
import NewReportForm from '@/components/NewReportForm';
import ProfilePage from '@/components/ProfilePage';
import { useAuth } from '@/hooks/useAuth';

type ViewType = 'dashboard' | 'new-report' | 'user-problems' | 'admin-panel' | 'profile';

const Index = () => {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');

  const handleNewReport = () => {
    setCurrentView('new-report');
  };

  const handleReportSubmit = () => {
    setCurrentView('dashboard');
  };

  const handleReportCancel = () => {
    setCurrentView('dashboard');
  };

  const handleShowUserProblems = () => {
    setCurrentView('user-problems');
  };

  const handleShowAdminPanel = () => {
    setCurrentView('admin-panel');
  };

  const handleShowProfile = () => {
    setCurrentView('profile');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-500">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  switch (currentView) {
    case 'new-report':
      return (
        <NewReportForm
          onSubmit={handleReportSubmit}
          onCancel={handleReportCancel}
        />
      );
      
    case 'user-problems':
      return (
        <UserProblemsPage
          onNewReport={handleNewReport}
          onBackToDashboard={handleBackToDashboard}
        />
      );
      
    case 'admin-panel':
      return (
        <AdminDashboard
          onNewReport={handleNewReport}
          onBackToDashboard={handleBackToDashboard}
        />
      );

    case 'profile':
      return (
        <ProfilePage
          onNewReport={handleNewReport}
          onBackToDashboard={handleBackToDashboard}
        />
      );
      
    default:
      return (
        <Dashboard
          onNewReport={handleNewReport}
          onShowUserProblems={handleShowUserProblems}
          onShowAdminPanel={handleShowAdminPanel}
          onShowProfile={handleShowProfile}
        />
      );
  }
};

export default Index;
