import { useState, useEffect, useMemo } from 'react';
import type { Lead, LeadStatus, PurchaseTimeline, InvestmentGoal } from './types/crm';
import { TRANSLATIONS, type Language } from './i18n/translations';
import { loadLeadsFromStorage, saveLeadsToStorage, syncLeadsToSupabase } from './services/supabaseClient';
import { SearchBarAndFilters } from './components/SearchBarAndFilters';
import { KanbanBoard } from './components/KanbanBoard';
import { AdhdFocusView } from './components/AdhdFocusView';
import { LeadDetailModal } from './components/LeadDetailModal';
import { ExcelImporter } from './components/ExcelImporter';
import { ProjectExplorer } from './components/ProjectExplorer';
import { AuthLanding } from './components/AuthLanding';
import { Building2, Database, LayoutGrid, Smartphone, Globe, LogOut } from 'lucide-react';

export function App() {
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string } | null>(() => {
    try {
      const saved = localStorage.getItem('tdah_active_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isImporterOpen, setIsImporterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'kanban' | 'focus' | 'projects'>('focus');
  const [language, setLanguage] = useState<Language>('es');

  const t = TRANSLATIONS[language] || TRANSLATIONS.es;

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [timelineFilter, setTimelineFilter] = useState('all');
  const [goalFilter, setGoalFilter] = useState('all');
  const [adhdAlertOnly, setAdhdAlertOnly] = useState(false);

  // Sync Notification State
  const [syncStatus, setSyncStatus] = useState<string>('Supabase Conectado en Vivo');

  // Load Leads isolated by current user email
  useEffect(() => {
    if (currentUser) {
      const loaded = loadLeadsFromStorage(currentUser.email);
      setLeads(loaded);
    }
  }, [currentUser]);

  const handleLogin = (user: { email: string; name: string }) => {
    setCurrentUser(user);
    localStorage.setItem('tdah_active_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    localStorage.removeItem('tdah_active_user');
    setCurrentUser(null);
    setLeads([]);
  };

  const updateLeadsState = (newLeads: Lead[]) => {
    setLeads(newLeads);
    if (currentUser) {
      saveLeadsToStorage(newLeads, currentUser.email);
    }
    syncLeadsToSupabase(newLeads).then((res) => {
      if (res.success) {
        setSyncStatus('Sincronizado en Vivo');
      }
    });
  };

  const handleUpdateLeadStatus = (leadId: string, newStatus: LeadStatus) => {
    const updated = leads.map((l) => {
      if (l.id === leadId) {
        return {
          ...l,
          lead_status: newStatus,
          last_contact_date: new Date().toISOString()
        };
      }
      return l;
    });
    updateLeadsState(updated);
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead({ ...selectedLead, lead_status: newStatus });
    }
  };

  const handleUpdateLeadBudget = (leadId: string, budget: number) => {
    const updated = leads.map((l) => (l.id === leadId ? { ...l, budget_aed: budget } : l));
    updateLeadsState(updated);
  };

  const handleUpdateLeadTimeline = (leadId: string, timeline: PurchaseTimeline) => {
    const updated = leads.map((l) => (l.id === leadId ? { ...l, purchase_timeline: timeline } : l));
    updateLeadsState(updated);
  };

  const handleUpdateLeadGoal = (leadId: string, goal: InvestmentGoal) => {
    const updated = leads.map((l) => (l.id === leadId ? { ...l, investment_goal: goal } : l));
    updateLeadsState(updated);
  };

  const handleUpdateLeadCallTime = (leadId: string, time: string) => {
    const updated = leads.map((l) => (l.id === leadId ? { ...l, preferred_time_to_call: time } : l));
    updateLeadsState(updated);
  };

  const handleAddNote = (leadId: string, noteContent: string) => {
    const updated = leads.map((l) => {
      if (l.id === leadId) {
        const newNoteObj = {
          id: `note-${Date.now()}`,
          createdAt: new Date().toISOString(),
          author: 'Agente / CRM User',
          content: noteContent,
          type: 'note' as const
        };
        return {
          ...l,
          notes: [newNoteObj, ...(l.notes || [])],
          last_contact_date: new Date().toISOString()
        };
      }
      return l;
    });
    updateLeadsState(updated);
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead({
        ...selectedLead,
        notes: [
          {
            id: `note-${Date.now()}`,
            createdAt: new Date().toISOString(),
            author: 'Agente / CRM User',
            content: noteContent,
            type: 'note'
          },
          ...(selectedLead.notes || [])
        ]
      });
    }
  };

  const handleSetReminder = (leadId: string, hoursAhead: number) => {
    const reminderIso = new Date(Date.now() + hoursAhead * 60 * 60 * 1000).toISOString();
    const updated = leads.map((l) => {
      if (l.id === leadId) {
        return {
          ...l,
          next_reminder_date: reminderIso
        };
      }
      return l;
    });
    updateLeadsState(updated);
  };

  const handleImportLeads = (newImportedLeads: Lead[]) => {
    const merged = [...newImportedLeads, ...leads];
    updateLeadsState(merged);
  };

  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesName = l.full_name.toLowerCase().includes(term);
        const matchesPhone = l.phone.toLowerCase().includes(term) || l.work_phone_number.includes(term);
        const matchesEmail = l.email.toLowerCase().includes(term);
        if (!matchesName && !matchesPhone && !matchesEmail) return false;
      }

      if (timelineFilter !== 'all' && l.purchase_timeline !== timelineFilter) {
        return false;
      }

      if (goalFilter !== 'all' && l.investment_goal !== goalFilter) {
        return false;
      }

      if (adhdAlertOnly) {
        const isUrgent = l.purchase_timeline === 'within_a_month';
        const isOverdue = !l.next_reminder_date || new Date(l.next_reminder_date).getTime() <= Date.now();
        if (!isUrgent && !isOverdue) return false;
      }

      return true;
    });
  }, [leads, searchTerm, timelineFilter, goalFilter, adhdAlertOnly]);

  // Security Gate: Protect user privacy. Unauthenticated visitors see the Landing Page
  if (!currentUser) {
    return <AuthLanding onLogin={handleLogin} />;
  }

  if (viewMode === 'projects') {
    return <ProjectExplorer onBackToCrm={() => setViewMode('focus')} language={language} />;
  }

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-900 flex flex-col font-sans antialiased">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200/80 px-4 md:px-6 py-3 sticky top-0 z-30 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black shadow-md shadow-blue-500/20 text-lg">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">{t.appTitle}</h1>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">
                  {currentUser.email}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Espacio Clínico Seguro y Aislado</p>
            </div>
          </div>

          {/* View Mode & Language Switcher Bar */}
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
              <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
              {(['es', 'en', 'fr', 'ru'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-2 py-1 rounded-xl uppercase transition ${
                    language === lang
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button
                onClick={() => setViewMode('focus')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  viewMode === 'focus'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>{t.focusMode}</span>
              </button>

              <button
                onClick={() => setViewMode('kanban')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  viewMode === 'kanban'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>{t.kanbanMode}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <Database className="w-3.5 h-3.5 text-blue-600" />
              <span>{syncStatus}</span>
            </div>

            <button
              onClick={() => setViewMode('projects')}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm transition"
            >
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>{t.projectsBtn}</span>
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 border border-red-200 transition"
              title="Cerrar sesión segura"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 p-3 md:p-6 flex flex-col overflow-hidden max-w-[1700px] mx-auto w-full">
        {/* Search & Filters Component */}
        <SearchBarAndFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          timelineFilter={timelineFilter}
          onTimelineFilterChange={setTimelineFilter}
          goalFilter={goalFilter}
          onGoalFilterChange={setGoalFilter}
          adhdAlertOnly={adhdAlertOnly}
          onAdhdAlertToggle={() => setAdhdAlertOnly(!adhdAlertOnly)}
          onOpenImporter={() => setIsImporterOpen(true)}
          onOpenProjects={() => setViewMode('projects')}
          onResetFilters={() => {
            setSearchTerm('');
            setTimelineFilter('all');
            setGoalFilter('all');
            setAdhdAlertOnly(false);
          }}
          totalLeadsCount={leads.length}
          filteredCount={filteredLeads.length}
        />

        {/* View Mode Switching */}
        {viewMode === 'focus' ? (
          <AdhdFocusView
            leads={filteredLeads}
            language={language}
            onUpdateLeadStatus={handleUpdateLeadStatus}
            onUpdateLeadBudget={handleUpdateLeadBudget}
            onUpdateLeadTimeline={handleUpdateLeadTimeline}
            onUpdateLeadGoal={handleUpdateLeadGoal}
            onUpdateLeadCallTime={handleUpdateLeadCallTime}
            onAddNote={handleAddNote}
            onSetReminder={handleSetReminder}
          />
        ) : (
          <KanbanBoard
            leads={filteredLeads}
            onSelectLead={(lead) => setSelectedLead(lead)}
            onUpdateLeadStatus={handleUpdateLeadStatus}
            onUpdateLeadReminder={handleSetReminder}
          />
        )}
      </main>

      {/* Modals */}
      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdateStatus={handleUpdateLeadStatus}
          onAddNote={handleAddNote}
          onSetReminder={handleSetReminder}
        />
      )}

      {isImporterOpen && (
        <ExcelImporter
          onImportLeads={handleImportLeads}
          onClose={() => setIsImporterOpen(false)}
        />
      )}
    </div>
  );
}

export default App;

