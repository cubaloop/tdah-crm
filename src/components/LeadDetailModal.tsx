import React, { useState } from 'react';
import type { Lead, LeadStatus } from '../types/crm';
import { X, Phone, Mail, Clock, User, Tag, Plus, MessageSquare } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

interface LeadDetailModalProps {
  lead: Lead;
  onClose: () => void;
  onUpdateStatus: (leadId: string, status: LeadStatus) => void;
  onAddNote: (leadId: string, noteContent: string) => void;
  onSetReminder: (leadId: string, hoursAhead: number) => void;
}

const STATUS_OPTIONS: { id: LeadStatus; label: string }[] = [
  { id: 'CREATED', label: 'Nuevos Leads' },
  { id: 'CONTACTED', label: 'Contactados' },
  { id: 'FOLLOW_UP', label: 'En Seguimiento' },
  { id: 'APPOINTMENT', label: 'Cita Agendada' },
  { id: 'RESERVATION', label: 'Reserva / EOI' },
  { id: 'CLOSED', label: 'Cerrado' },
  { id: 'UNQUALIFIED', label: 'No Interesado' }
];

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  lead,
  onClose,
  onUpdateStatus,
  onAddNote,
  onSetReminder
}) => {
  const [newNote, setNewNote] = useState('');

  const rawPhone = lead.phone.replace(/^p:/, '') || lead.work_phone_number;
  const cleanPhone = rawPhone.replace(/[^\d+]/g, '');

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Hola ${lead.full_name}, te escribo para dar seguimiento a tu interés en propiedades exclusivas en Dubai.`
  )}`;

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onAddNote(lead.id, newNote.trim());
    setNewNote('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-6 relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                {lead.platform === 'fb' ? 'Facebook Ads' : 'Instagram Ads'}
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: {lead.id}</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight">{lead.full_name}</h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Action Buttons & Status Selector */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                Etapa del Embudo (Status)
              </label>
              <select
                value={lead.lead_status}
                onChange={(e) => onUpdateStatus(lead.id, e.target.value as LeadStatus)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                Acciones Directas
              </label>
              <div className="flex gap-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-3 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <WhatsAppIcon className="w-4 h-4 fill-current" />
                  WhatsApp
                </a>

                <a
                  href={`tel:${cleanPhone}`}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Phone className="w-4 h-4" />
                  Llamar
                </a>

                <a
                  href={`mailto:${lead.email}`}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium px-3 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Mail className="w-4 h-4" />
                  Email
                </a>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-4 h-4 text-blue-500" /> Datos de Contacto
              </h3>
              <div>
                <p className="text-xs text-slate-400">Teléfono Principal</p>
                <p className="text-sm font-semibold text-slate-800">{cleanPhone || 'No registrado'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Teléfono de Trabajo</p>
                <p className="text-sm font-semibold text-slate-800">{lead.work_phone_number || 'No registrado'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Correo Electrónico</p>
                <p className="text-sm font-semibold text-slate-800">{lead.email}</p>
              </div>
            </div>

            <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-purple-500" /> Perfil de Inversión
              </h3>
              <div>
                <p className="text-xs text-slate-400">Objetivo Principal</p>
                <span className="inline-block mt-0.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
                  {lead.investment_goal === 'relocation/residency' ? '🏠 Residencia / Relocalización' : '💼 Inversión'}
                </span>
              </div>
              <div>
                <p className="text-xs text-slate-400">Plazo de Compra</p>
                <span className="inline-block mt-0.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 text-xs font-bold border border-amber-100">
                  {lead.purchase_timeline.replace(/_/g, ' ')}
                </span>
              </div>
              <div>
                <p className="text-xs text-slate-400">Horario Preferido de Llamada</p>
                <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-500" />
                  {lead.preferred_time_to_call.replace(/_/g, ' ')}
                </p>
              </div>
            </div>
          </div>

          {/* Anti-Forgetfulness Quick Reminder Buttons */}
          <div className="bg-rose-50/60 border border-rose-100 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold">
                ⏰
              </div>
              <div>
                <p className="text-xs font-bold text-rose-900">Configurar Alerta Anti-Olvidos TDAH</p>
                <p className="text-[11px] text-rose-700">Evita que este lead quede paralizado sin seguimiento</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onSetReminder(lead.id, 24)}
                className="bg-white hover:bg-rose-100 text-rose-800 font-bold px-3 py-1.5 rounded-xl text-xs border border-rose-200 transition"
              >
                Recordar en 24h
              </button>
              <button
                onClick={() => onSetReminder(lead.id, 48)}
                className="bg-white hover:bg-rose-100 text-rose-800 font-bold px-3 py-1.5 rounded-xl text-xs border border-rose-200 transition"
              >
                Llamar mañana
              </button>
            </div>
          </div>

          {/* Activity & Notes Log */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600" /> Historial de Notas y Seguimiento
            </h3>

            <form onSubmit={handleAddNoteSubmit} className="flex gap-2 mb-4">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Escribe una nota o resultado de llamada..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition"
              >
                <Plus className="w-4 h-4" /> Agregar Nota
              </button>
            </form>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {lead.notes && lead.notes.length > 0 ? (
                lead.notes.map((note) => (
                  <div key={note.id} className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                    <div className="flex items-center justify-between text-slate-400 mb-1">
                      <span className="font-semibold text-slate-700">{note.author}</span>
                      <span>{new Date(note.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-slate-800 font-medium">{note.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic text-center py-4">No hay notas todavía.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
