import React, { useState } from 'react';
import Login from '@/components/Login';
import Dashboard from '@/components/Dashboard';
import AdminDashboard from '@/components/AdminDashboard';
import UserProblemsPage from '@/components/UserProblemsPage';
import NewReportForm from '@/components/NewReportForm';
import ProfilePage from '@/components/ProfilePage';
import ManageUsersPage from '@/components/ManageUsersPage'; // Importa a nova página
import { useAuth } from '@/hooks/useAuth';

// Adiciona a nova 'view' para o gerenciamento de usuários
type ViewType = 'dashboard' | 'new-report' | 'user-problems' | 'admin-panel' | 'profile' | 'manage-users';

const Index = () => {
  const { user, loading, isVisitor } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');

  const handleNewReport = () => setCurrentView('new-report');
  const handleReportSubmit = () => setCurrentView('dashboard');
  const handleReportCancel = () => setCurrentView('dashboard');
  const handleShowUserProblems = () => setCurrentView('user-problems');
  const handleShowAdminPanel = () => setCurrentView('admin-panel');
  const handleShowProfile = () => setCurrentView('profile');
  const handleBackToDashboard = () => setCurrentView('dashboard');
  const handleShowManageUsers = () => setCurrentView('manage-users'); // Handler para a nova página

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (!user && !isVisitor) {
    return <Login />;
  }

  switch (currentView) {
    case 'new-report':
      return <NewReportForm onSubmit={handleReportSubmit} onCancel={handleReportCancel} />;
    case 'user-problems':
      return <UserProblemsPage onNewReport={handleNewReport} onBackToDashboard={handleBackToDashboard} />;
    case 'admin-panel':
      // Passa a nova função para o AdminDashboard
      return <AdminDashboard onNewReport={handleNewReport} onBackToDashboard={handleBackToDashboard} onManageUsers={handleShowManageUsers} />;
    case 'profile':
      return <ProfilePage onNewReport={handleNewReport} onBackToDashboard={handleBackToDashboard} />;
    case 'manage-users':
      // Renderiza a nova página
      return <ManageUsersPage onNewReport={handleNewReport} onBackToDashboard={() => setCurrentView('admin-panel')} />;
    default:
      return <Dashboard onNewReport={handleNewReport} onShowUserProblems={handleShowUserProblems} onShowAdminPanel={handleShowAdminPanel} onShowProfile={handleShowProfile} />;
  }
};

export default Index;
