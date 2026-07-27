import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { StudentDashboard } from './components/StudentDashboard';
import { AiTutor } from './components/AiTutor';
import { CourseLibrary } from './components/CourseLibrary';
import { AiToolsSuite } from './components/AiToolsSuite';
import { TestsAndQuizzes } from './components/TestsAndQuizzes';
import { Gamification } from './components/Gamification';
import { TeacherDashboard } from './components/TeacherDashboard';
import { ParentDashboard } from './components/ParentDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { VoiceClassroom } from './components/VoiceClassroom';
import { StudyMaterials } from './components/StudyMaterials';
import { NotificationCenter } from './components/NotificationCenter';
import { OfflineVault } from './components/OfflineVault';
import { CommunityForum } from './components/CommunityForum';
import { AdminPanel } from './components/AdminPanel';
import { SettingsComponent } from './components/Settings';
import { AuthModal } from './components/AuthModal';
import { PremiumUpgradeModal } from './components/PremiumUpgradeModal';

const AppContent: React.FC = () => {
  const { activeTab, role } = useAuth();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'admin_panel':
        return <AdminPanel />;
      case 'teacher-dashboard':
        return <TeacherDashboard />;
      case 'parent-dashboard':
        return <ParentDashboard />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'ai-tutor':
        return <AiTutor />;
      case 'voice-classes':
        return <VoiceClassroom />;
      case 'courses':
        return <CourseLibrary />;
      case 'study-materials':
        return <StudyMaterials />;
      case 'community':
        return <CommunityForum />;
      case 'offline-vault':
        return <OfflineVault />;
      case 'notifications':
        return <NotificationCenter />;
      case 'ai-tools':
        return <AiToolsSuite />;
      case 'tests':
        return <TestsAndQuizzes />;
      case 'gamification':
        return <Gamification />;
      case 'settings':
        return <SettingsComponent />;
      case 'dashboard':
      default:
        if (role === 'teacher') return <TeacherDashboard />;
        if (role === 'parent') return <ParentDashboard />;
        if (role === 'admin') return <AdminDashboard />;
        return <StudentDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      <Navbar />

      <div className="max-w-7xl mx-auto flex">
        <Sidebar />

        <main className="flex-1 p-4 md:p-6 lg:p-8 min-w-0">
          {renderTabContent()}
        </main>
      </div>

      <MobileBottomNav />
      <AuthModal />
      <PremiumUpgradeModal />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
