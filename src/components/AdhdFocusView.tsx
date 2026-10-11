import React, { useState } from 'react';
import type { Lead, LeadStatus, PurchaseTimeline, InvestmentGoal } from '../types/crm';
import { TRANSLATIONS, type Language } from '../i18n/translations';
import {
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  Clock,
  Tag,
  DollarSign,
  Plus,
  MessageSquare,
  Filter,
  Bell,
  Sparkles
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import confetti from 'canvas-confetti';

interface AdhdFocusViewProps {
  leads: Lead[];
  language?: Language;
  onUpdateLeadStatus: (leadId: string, status: LeadStatus) => void;
  onUpdateLeadBudget: (leadId: string, budget: number) => void;
  onUpdateLeadTimeline: (leadId: string, timeline: PurchaseTimeline) => void;
  onUpdateLeadGoal: (leadId: string, goal: InvestmentGoal) => void;
  onUpdateLeadCallTime: (leadId: string, time: string) => void;
  onAddNote: (leadId: string, noteContent: string) => void;
  onSetReminder: (leadId: string, hoursAhead: number) => void;
}

const STATUS_OPTIONS: { id: LeadStatus; label: string; badgeClass: string }[] = [
  { id: 'CREATED', label: 'Sin Contactar', badgeClass: 'bg-blue-100 text-blue-800 border-blue-200' },
  { id: 'CONTACTED', label: 'Contactado', badgeClass: 'bg-cyan-100 text-cyan-800 border-cyan-200' },
  { id: 'FOLLOW_UP', label: 'En Seguimiento', badgeClass: 'bg-amber-100 text-amber-800 border-amber-200' },
  { id: 'APPOINTMENT', label: 'Cita Agendada', badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  { id: 'RESERVATION', label: 'Reserva / EOI', badgeClass: 'bg-purple-100 text-purple-800 border-purple-200' },
  { id: 'CLOSED', label: 'Cerrado / Venta', badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { id: 'UNQUALIFIED', label: 'No Interesado', badgeClass: 'bg-slate-100 text-slate-700 border-slate-200' }
];

export const AdhdFocusView: React.FC<AdhdFocusViewProps> = ({
  leads,
  language = 'es',
  onUpdateLeadStatus,
  onUpdateLeadBudget,
  onUpdateLeadTimeline,
  onUpdateLeadGoal,
  onUpdateLeadCallTime,
  onAddNote,
  onSetReminder
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.es;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [newNoteText, setNewNoteText] = useState('');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Touch Swipe state
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Category filter state for the deck
  const [deckStatusFilter, setDeckStatusFilter] = useState<string>('all');
  const [deckTimelineFilter, setDeckTimelineFilter] = useState<string>('all');

  // Filter deck leads
  const filteredDeck = leads.filter((l) => {
    if (deckStatusFilter !== 'all' && l.lead_status !== deckStatusFilter) return false;
    if (deckTimelineFilter !== 'all' && l.purchase_timeline !== deckTimelineFilter) return false;
    return true;
  });

  const currentLead: Lead | undefined = filteredDeck[currentIndex] || filteredDeck[0];

  const handleNext = () => {
    if (currentIndex < filteredDeck.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Touch Swipe Handler for Mobile Phones
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    setTouchStartX(null);
  };

  const handleStatusChange = (newStatus: LeadStatus) => {
    if (!currentLead) return;
    onUpdateLeadStatus(currentLead.id, newStatus);
    if (newStatus === 'CLOSED') {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    }
  };

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim() || !currentLead) return;
    onAddNote(currentLead.id, newNoteText.trim());
    setNewNoteText('');
  };

  if (!currentLead || filteredDeck.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-2xl mb-3">
          🔍
        </div>
        <h3 className="text-lg font-bold text-slate-800">No hay tarjetas con este filtro</h3>
        <p className="text-xs text-slate-500 mt-1 mb-4">Ajusta los filtros laterales para cargar más tarjetas.</p>
        <button
          onClick={() => { setDeckStatusFilter('all'); setDeckTimelineFilter('all'); }}
          className="bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-xl"
        >
          Ver Todos los Leads ({leads.length})
        </button>
      </div>
    );
  }

  const rawPhone = currentLead.phone.replace(/^p:/, '') || currentLead.work_phone_number;
  const cleanPhone = rawPhone.replace(/[^\d+]/g, '');

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Hola ${currentLead.full_name}, te escribo para dar seguimiento a tu solicitud de inversión en Dubai.`
  )}`;

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative bg-slate-100/60 p-3 md:p-6">
      {/* SIDE FILTER RAIL */}
      <div
        className={`bg-white rounded-3xl border border-slate-200 p-4 space-y-4 transition-all duration-300 md:w-64 flex-shrink-0 shadow-sm ${
          showFilterDrawer ? 'block' : 'hidden md:block'
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-blue-600" /> Filtros de Tarjetas
          </h3>
          <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
            {filteredDeck.length} leads
          </span>
        </div>

        {/* Filter by Status */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Por Estado del Lead
          </label>
          <select
            value={deckStatusFilter}
            onChange={(e) => { setDeckStatusFilter(e.target.value); setCurrentIndex(0); }}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-semibold text-slate-800"
          >
            <option value="all">📂 Todos los estados</option>
            {STATUS_OPTIONS.map((st) => (
              <option key={st.id} value={st.id}>{st.label}</option>
            ))}
          </select>
        </div>

        {/* Filter by Urgency */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Por Plazo de Compra
          </label>
          <select
            value={deckTimelineFilter}
            onChange={(e) => { setDeckTimelineFilter(e.target.value); setCurrentIndex(0); }}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-semibold text-slate-800"
          >
            <option value="all">🗓️ Todos los plazos</option>
            <option value="within_a_month">🔥 Menos de 1 mes (Urgente)</option>
            <option value="within_3_-_6_months">⭐ 3 - 6 meses</option>
            <option value="after_6_months">📅 &gt; 6 meses</option>
            <option value="not_sure">💧 Por definir</option>
          </select>
        </div>

        <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 leading-relaxed">
          💡 <strong>Modo Enfoque Cero Parálisis:</strong> Navega una tarjeta a la vez deslizando la pantalla con el dedo. Edita el estatus y notas directamente.
        </div>
      </div>

      {/* CENTER SINGLE CARD CONTAINER */}
      <div className="flex-1 flex flex-col items-center justify-between max-w-xl mx-auto w-full space-y-4">
        {/* Navigation Top Header Bar */}
        <div className="w-full flex items-center justify-between bg-white px-4 py-2.5 rounded-2xl border border-slate-200/80 shadow-xs">
          <button
            onClick={() => setShowFilterDrawer(!showFilterDrawer)}
            className="md:hidden p-2 text-slate-500 hover:text-blue-600 rounded-xl hover:bg-slate-100"
          >
            <Filter className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-slate-800">
              {t.cardCount.replace('{current}', String(currentIndex + 1)).replace('{total}', String(filteredDeck.length))}
            </span>
            <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / filteredDeck.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 disabled:opacity-40 disabled:pointer-events-none transition"
              title="Anterior lead"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex === filteredDeck.length - 1}
              className="p-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white disabled:opacity-40 disabled:pointer-events-none transition shadow-sm"
              title="Siguiente lead"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CENTRAL SINGLE CARD VIEW */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="w-full bg-white rounded-3xl border-2 border-slate-200/90 shadow-xl p-5 md:p-6 space-y-5 animate-fade-in transition-all duration-200 relative overflow-hidden"
        >
          {/* Card Top Header & Direct Status Picker */}
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100">
                {currentLead.platform === 'fb' ? 'Facebook Ads' : 'Instagram Ads'}
              </span>
              <h2 className="text-2xl font-black text-slate-900 leading-tight mt-1">
                {currentLead.full_name}
              </h2>
              <p className="text-xs text-slate-500 font-mono">{currentLead.email}</p>
            </div>

            {/* Direct In-Card Status Selector */}
            <div className="text-right">
              <label className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">
                {t.changeStatus}
              </label>
              <select
                value={currentLead.lead_status}
                onChange={(e) => handleStatusChange(e.target.value as LeadStatus)}
                className="bg-slate-900 text-white font-bold text-xs px-3 py-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm cursor-pointer"
              >
                {STATUS_OPTIONS.map((st) => (
                  <option key={st.id} value={st.id}>{st.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Direct Communication Bar with Dial Fix */}
          <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-200/70">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
            >
              <WhatsAppIcon className="w-4 h-4 fill-current" />
              <span>{t.whatsapp}</span>
            </a>

            <a
              href={`tel:${cleanPhone}`}
              onClick={(e) => {
                e.stopPropagation();
                if (cleanPhone) window.location.href = `tel:${cleanPhone}`;
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
            >
              <Phone className="w-4 h-4" />
              <span>{t.call}</span>
            </a>

            <a
              href={`mailto:${currentLead.email}`}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
            >
              <Mail className="w-4 h-4" />
              <span>{t.email}</span>
            </a>
          </div>

          {/* Editable Parameters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {/* Presupuesto */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> {t.estimatedBudget}
              </label>
              <input
                type="number"
                value={currentLead.budget_aed || ''}
                onChange={(e) => onUpdateLeadBudget(currentLead.id, Number(e.target.value))}
                placeholder="Ej. 2560000"
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Plazo de Compra */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> {t.purchaseTimeline}
              </label>
              <select
                value={currentLead.purchase_timeline}
                onChange={(e) => onUpdateLeadTimeline(currentLead.id, e.target.value as PurchaseTimeline)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="within_a_month">{t.urgentTimeline}</option>
                <option value="within_3_-_6_months">{t.mediumTimeline}</option>
                <option value="after_6_months">{t.longTimeline}</option>
                <option value="not_sure">{t.notSureTimeline}</option>
              </select>
            </div>

            {/* Horario de Llamada */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-1">
                <Clock className="w-3.5 h-3.5 text-blue-500" /> {t.preferredTime}
              </label>
              <select
                value={currentLead.preferred_time_to_call}
                onChange={(e) => onUpdateLeadCallTime(currentLead.id, e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="8am_-_12pm_">Mañana (8am - 12pm)</option>
                <option value="12pm_-_4pm_">Tarde (12pm - 4pm)</option>
                <option value="4pm__-_8pm_">Tarde-Noche (4pm - 8pm)</option>
                <option value="after_8pm">Noche (después 8pm)</option>
              </select>
            </div>

            {/* Objetivo de Inversión */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-1">
                <Tag className="w-3.5 h-3.5 text-purple-500" /> {t.goal}
              </label>
              <select
                value={currentLead.investment_goal}
                onChange={(e) => onUpdateLeadGoal(currentLead.id, e.target.value as InvestmentGoal)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="investment_purpose">💼 {t.investmentGoal}</option>
                <option value="relocation/residency">🏠 {t.relocationGoal}</option>
              </select>
            </div>
          </div>

          {/* Anti-Forgetfulness Quick Reminders */}
          <div className="flex items-center justify-between bg-rose-50 border border-rose-100 p-3 rounded-2xl">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-rose-600" />
              <span className="text-xs font-bold text-rose-900">{t.reminderAlert}</span>
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={() => onSetReminder(currentLead.id, 24)}
                className="bg-white hover:bg-rose-100 text-rose-800 font-bold px-2.5 py-1 rounded-lg text-xs border border-rose-200 transition"
              >
                +24h
              </button>
              <button
                onClick={() => onSetReminder(currentLead.id, 48)}
                className="bg-white hover:bg-rose-100 text-rose-800 font-bold px-2.5 py-1 rounded-lg text-xs border border-rose-200 transition"
              >
                Mañana
              </button>
            </div>
          </div>

          {/* Live In-Card Notes Area */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-3.5 space-y-2">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-blue-600" /> {t.interactionNotes}
            </h4>

            <form onSubmit={handleAddNoteSubmit} className="flex gap-2">
              <input
                type="text"
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Escribe el resultado de la llamada..."
                className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1 shadow-sm transition"
              >
                <Plus className="w-4 h-4" /> {t.saveNote}
              </button>
            </form>

            <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1 pt-1">
              {currentLead.notes && currentLead.notes.length > 0 ? (
                currentLead.notes.map((n) => (
                  <div key={n.id} className="bg-white p-2 rounded-xl border border-slate-200/60 text-xs">
                    <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                      <span className="font-semibold text-slate-600">{n.author}</span>
                      <span>{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-slate-800">{n.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-[11px] text-slate-400 italic text-center py-2">Sin notas guardadas aún.</p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Swipe Guidance */}
        <div className="text-center text-xs text-slate-400 font-medium">
          {t.swipeTip}
        </div>
      </div>
    </div>
  );
};

