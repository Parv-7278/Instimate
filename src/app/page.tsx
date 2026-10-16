'use client';

import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from '@/lib/storeContext';
import { Institution, UserRole } from '@/types';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { InstitutionGateway } from '@/components/gateway/InstitutionGateway';
import { SuperAdminDashboard } from '@/components/superadmin/SuperAdminDashboard';
import { CorporateDashboard } from '@/components/dashboards/CorporateDashboard';
import { GovernmentDashboard } from '@/components/dashboards/GovernmentDashboard';
import { OverviewDashboard } from '@/components/dashboard/OverviewDashboard';
import { StudentDashboardView, FacultyDashboardView } from '@/components/dashboard/RoleViews';
import { StudentDirectory } from '@/components/students/StudentDirectory';
import { AttendanceModule } from '@/components/attendance/AttendanceModule';
import { TimetableModule } from '@/components/timetable/TimetableModule';
import { FinanceModule } from '@/components/finance/FinanceModule';
import { ExamsModule } from '@/components/exams/ExamsModule';
import { AssignmentsModule } from '@/components/assignments/AssignmentsModule';
import { AnnouncementsModule } from '@/components/announcements/AnnouncementsModule';
import { ClassroomsModule } from '@/components/academics/ClassroomsModule';
import { FacultyModule } from '@/components/academics/FacultyModule';
import { LeaveManagement } from '@/components/modules/LeaveManagement';
import { LibraryModule } from '@/components/modules/LibraryModule';
import { IntegrationsModule } from '@/components/integrations/IntegrationsModule';
import { SettingsModule } from '@/components/settings/SettingsModule';
import { EventRouteModule } from '@/components/eventroute/EventRouteModule';
import { LandingPage } from '@/components/landing/LandingPage';
import { GlobalSearchModal } from '@/components/layout/GlobalSearchModal';
import { Globe, ShieldAlert, ArrowLeft, Building2 } from 'lucide-react';

type AppView = 'gateway' | 'superadmin' | 'workspace' | 'landing';

function MainAppContent() {
  const { currentUser, switchRole, currentInstitution, setCurrentInstitution } = useStore();

  // First screen visitors MUST see is the Institution Gateway
  const [currentView, setCurrentView] = useState<AppView>('gateway');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [paymentInvoiceTarget, setPaymentInvoiceTarget] = useState<string | undefined>(undefined);

  // Keyboard shortcut for Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenPayment = (invoiceId?: string) => {
    setPaymentInvoiceTarget(invoiceId);
    setActiveTab('finance');
  };

  const handleEnterInstitutionWorkspace = (inst: Institution, role?: UserRole) => {
    setCurrentInstitution(inst);
    if (role) {
      switchRole(role);
    } else {
      // Default appropriate role per institution type
      if (inst.type === 'corporate' || inst.type === 'public_sector') {
        switchRole('institution_admin');
      } else if (inst.type === 'government') {
        switchRole('govt_officer');
      } else {
        switchRole('institution_admin');
      }
    }
    setCurrentView('workspace');
    setActiveTab('dashboard');
  };

  // View 1: Universal Institution Gateway & Entry Page (Mandatory First Screen)
  if (currentView === 'gateway') {
    return (
      <InstitutionGateway
        onEnterInstitutionWorkspace={handleEnterInstitutionWorkspace}
        onEnterSuperAdmin={() => {
          switchRole('super_admin');
          setCurrentView('superadmin');
        }}
      />
    );
  }

  // View 2: Platform Super Admin Control Centre
  if (currentView === 'superadmin') {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-6 lg:p-8 font-sans">
        <div className="max-w-7xl mx-auto space-y-6">
          <SuperAdminDashboard
            onSelectInstitution={(inst) => {
              handleEnterInstitutionWorkspace(inst, 'institution_admin');
            }}
            onExitToGateway={() => setCurrentView('gateway')}
          />
        </div>
      </div>
    );
  }

  // View 3: Public Marketing / Showcase Page
  if (currentView === 'landing') {
    return (
      <LandingPage
        onEnterDashboard={(role) => {
          if (role) switchRole(role);
          setCurrentView('workspace');
          setActiveTab('dashboard');
        }}
      />
    );
  }

  // View 4: Sovereign Multi-Tenant Institution Workspace
  const renderActiveModule = () => {
    const isCorporate = currentInstitution.type === 'corporate' || currentInstitution.type === 'public_sector';
    const isGovernment = currentInstitution.type === 'government';

    switch (activeTab) {
      case 'dashboard':
        if (isCorporate) {
          return <CorporateDashboard />;
        }
        if (isGovernment) {
          return <GovernmentDashboard />;
        }
        if (currentUser.role === 'student') {
          return (
            <StudentDashboardView
              onNavigateTab={setActiveTab}
              onOpenPaymentModal={handleOpenPayment}
            />
          );
        }
        if (currentUser.role === 'faculty') {
          return (
            <FacultyDashboardView
              onNavigateTab={setActiveTab}
              onOpenPaymentModal={handleOpenPayment}
            />
          );
        }
        return (
          <OverviewDashboard
            onNavigateTab={setActiveTab}
            onOpenPaymentModal={() => handleOpenPayment()}
          />
        );

      case 'students':
        return <StudentDirectory />;

      case 'attendance':
        return <AttendanceModule />;

      case 'timetable':
        return <TimetableModule />;

      case 'finance':
        return <FinanceModule initialInvoiceId={paymentInvoiceTarget} />;

      case 'exams':
        return <ExamsModule />;

      case 'assignments':
        return <AssignmentsModule />;

      case 'announcements':
        return <AnnouncementsModule />;

      case 'classes':
        return <ClassroomsModule />;

      case 'faculty':
        return <FacultyModule />;

      case 'leave':
        return <LeaveManagement />;

      case 'library':
        return <LibraryModule />;

      case 'integrations':
        return <IntegrationsModule />;

      case 'settings':
        return <SettingsModule />;

      case 'eventroute':
        return <EventRouteModule />;

      default:
        if (isCorporate) return <CorporateDashboard />;
        if (isGovernment) return <GovernmentDashboard />;
        return (
          <OverviewDashboard
            onNavigateTab={setActiveTab}
            onOpenPaymentModal={() => handleOpenPayment()}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        onExitToGateway={() => setCurrentView('gateway')}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto min-w-0">
        {/* Left Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Dynamic Main Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {renderActiveModule()}
        </main>
      </div>

      {/* Floating Bottom Quick Bar for Navigation Switching */}
      <div className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-40 flex items-center gap-1.5 sm:gap-2 max-w-[calc(100vw-1.5rem)] overflow-x-auto scrollbar-none py-1">
        <button
          onClick={() => setCurrentView('gateway')}
          className="flex items-center gap-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-white px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-semibold shadow-lg ring-1 ring-white/20 transition shrink-0 backdrop-blur-xs"
          title="Return to Universal Institution Gateway"
        >
          <Building2 className="h-3.5 w-3.5 text-cyan-400" />
          <span className="hidden xs:inline sm:inline">Gateway</span>
        </button>

        <button
          onClick={() => {
            switchRole('super_admin');
            setCurrentView('superadmin');
          }}
          className="flex items-center gap-1.5 rounded-full bg-purple-900/90 hover:bg-purple-800 text-white px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-semibold shadow-lg ring-1 ring-white/20 transition shrink-0 backdrop-blur-xs"
          title="Super Admin Verification Dashboard"
        >
          <ShieldAlert className="h-3.5 w-3.5 text-purple-300" />
          <span className="hidden xs:inline sm:inline">Super Admin</span>
        </button>

        <button
          onClick={() => setCurrentView('landing')}
          className="flex items-center gap-1.5 rounded-full bg-slate-800/90 hover:bg-slate-700 text-white px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold shadow-lg ring-1 ring-white/10 transition shrink-0 backdrop-blur-xs"
          title="View Public SaaS Marketing Showcase"
        >
          <Globe className="h-3.5 w-3.5 text-emerald-400" />
          <span className="hidden xs:inline sm:inline">Landing</span>
        </button>
      </div>


      {/* Global Cmd+K Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectTab={setActiveTab}
      />
    </div>
  );
}

export default function Page() {
  return (
    <StoreProvider>
      <MainAppContent />
    </StoreProvider>
  );
}
