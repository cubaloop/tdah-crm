import React, { useState } from 'react';
import type { Lead } from '../types/crm';
import { Phone, Mail, Clock, Bell, ChevronDown } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

interface LeadCardProps {
  lead: Lead;
  onSelectLead: (lead: Lead) => void;
  onUpdateLeadReminder: (leadId: string, hoursAhead: number) => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({
  lead,
  onSelectLead,
  onUpdateLeadReminder
}) => {
  const [showReminderMenu, setShowReminderMenu] = useState(false);

  // Clean phone number for WhatsApp
  const rawPhone = lead.phone.replace(/^p:/, '') || lead.work_phone_number;
  const cleanPhone = rawPhone.replace(/[^\d+]/g, '');

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Hola ${lead.full_name}, te contacto respecto a tu interés en propiedades exclusivas de inversión en Dubai.`
  )}`;

  // ADHD Anti-Forgetfulness Logic:
  // Check if reminder is due or missing (e.g. no contact in last 48h)
  const isOverdueOrMissing = (() => {
    if (!lead.next_reminder_date) return true;
    const remDate = new Date(lead.next_reminder_date).getTime();
    return remDate <= Date.now();
  })();

  // Badge mapping for Purchase Timeline
  const getTimelineBadge = () => {
    switch (lead.purchase_timeline) {
      case 'within_a_month':
        return { label: '🔥 Urgente (< 1 mes)', bg: 'bg-rose-100 text-rose-800 border-rose-200' };
      case 'within_3_-_6_months':
        return { label: '⭐ 3 - 6 meses', bg: 'bg-amber-100 text-amber-800 border-amber-200' };
      case 'not_sure':
        return { label: '💧 Por definir', bg: 'bg-sky-100 text-sky-800 border-sky-200' };
      case 'after_6_months':
      default:
        return { label: '📅 > 6 meses', bg: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  const badge = getTimelineBadge();

  const handleReminderClick = (e: React.MouseEvent, hours: number) => {
    e.stopPropagation();
    onUpdateLeadReminder(lead.id, hours);
    setShowReminderMenu(false);
  };

  return (
    <div
      onClick={() => onSelectLead(lead)}
      className="group relative bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer select-none mb-3"
    >
      {/* TDAH Anti-Forgetfulness Red Pulse Dot */}
      {isOverdueOrMissing && (
        <div 
          className="absolute -top-1.5 -right-1.5 flex items-center justify-center"
          title="Alerta TDAH: Sin seguimiento o recordatorio pendiente"
        >
          <span className="relative flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-600 border-2 border-white"></span>
          </span>
        </div>
      )}

      {/* Header Info */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors leading-tight">
            {lead.full_name}
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-0.5">{lead.email}</p>
        </div>

        {/* Platform tag */}
        <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
          {lead.platform === 'fb' ? 'Facebook' : 'Instagram'}
        </span>
      </div>

      {/* Badges Row */}
      <div className="flex flex-wrap items-center gap-1.5 mb-3">
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${badge.bg}`}>
          {badge.label}
        </span>

        <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {lead.preferred_time_to_call.replace(/_/g, ' ')}
        </span>

        {lead.investment_goal && (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
            {lead.investment_goal === 'relocation/residency' ? '🏠 Residencia' : '💼 Inversión'}
          </span>
        )}
      </div>

      {/* Comments snippet */}
      {lead.comments && (
        <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg mb-3 line-clamp-2 border border-slate-100 italic">
          "{lead.comments}"
        </p>
      )}

      {/* Actions & Reminder bar */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        {/* Direct Action Buttons */}
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Chat directo por WhatsApp"
            className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-all duration-150 shadow-xs"
          >
            <WhatsAppIcon className="w-4 h-4 fill-current" />
          </a>

          <a
            href={`tel:${cleanPhone}`}
            onClick={(e) => {
              e.stopPropagation();
              if (cleanPhone) window.location.href = `tel:${cleanPhone}`;
            }}
            title="Llamar teléfono directo"
            className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all duration-150 shadow-xs"
          >
            <Phone className="w-4 h-4" />
          </a>

          <a
            href={`mailto:${lead.email}`}
            title="Enviar correo"
            className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white flex items-center justify-center transition-all duration-150 shadow-xs"
          >
            <Mail className="w-4 h-4" />
          </a>
        </div>

        {/* Anti-Forgetfulness Reminder Dropdown */}
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setShowReminderMenu(!showReminderMenu)}
            className={`flex items-center gap-1 text-[11px] font-medium px-2 py-1.5 rounded-lg border transition ${
              isOverdueOrMissing
                ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Bell className="w-3 h-3" />
            <span>Recordatorio</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {showReminderMenu && (
            <div className="absolute right-0 bottom-full mb-1 w-40 bg-white rounded-xl shadow-lg border border-slate-100 p-1 z-30 animate-fade-in text-xs">
              <button
                onClick={(e) => handleReminderClick(e, 24)}
                className="w-full text-left px-3 py-1.5 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium"
              >
                ⚡ Recordarme en 24h
              </button>
              <button
                onClick={(e) => handleReminderClick(e, 48)}
                className="w-full text-left px-3 py-1.5 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium"
              >
                📅 Llamar en 2 días
              </button>
              <button
                onClick={(e) => handleReminderClick(e, 168)}
                className="w-full text-left px-3 py-1.5 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium"
              >
                🗓️ En 1 semana
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
