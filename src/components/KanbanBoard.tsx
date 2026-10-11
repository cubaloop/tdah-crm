import React from 'react';
import type { Lead, LeadStatus, KanbanColumn } from '../types/crm';
import { LeadCard } from './LeadCard';
import confetti from 'canvas-confetti';

interface KanbanBoardProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onUpdateLeadStatus: (leadId: string, newStatus: LeadStatus) => void;
  onUpdateLeadReminder: (leadId: string, hoursAhead: number) => void;
}

const KANBAN_COLUMNS: KanbanColumn[] = [
  {
    id: 'CREATED',
    title: 'Nuevos Leads',
    badgeColor: 'bg-blue-500 text-white',
    description: 'Recién importados'
  },
  {
    id: 'CONTACTED',
    title: 'Contactados',
    badgeColor: 'bg-cyan-500 text-white',
    description: 'Primer contacto realizado'
  },
  {
    id: 'FOLLOW_UP',
    title: 'En Seguimiento',
    badgeColor: 'bg-amber-500 text-white',
    description: 'Conversación en curso'
  },
  {
    id: 'APPOINTMENT',
    title: 'Cita Agendada',
    badgeColor: 'bg-indigo-500 text-white',
    description: 'Reunión o Zoom programado'
  },
  {
    id: 'RESERVATION',
    title: 'Reserva / EOI',
    badgeColor: 'bg-purple-500 text-white',
    description: 'EOI pagado / selección de unidad'
  },
  {
    id: 'CLOSED',
    title: 'Cerrados',
    badgeColor: 'bg-emerald-500 text-white',
    description: 'Venta completada / SPA'
  },
  {
    id: 'UNQUALIFIED',
    title: 'No Interesados',
    badgeColor: 'bg-slate-400 text-white',
    description: 'Sin presupuesto o descartados'
  }
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  leads,
  onSelectLead,
  onUpdateLeadStatus,
  onUpdateLeadReminder
}) => {
  const [draggedLeadId, setDraggedLeadId] = React.useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = React.useState<LeadStatus | null>(null);

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData('text/plain', leadId);
    setDraggedLeadId(leadId);
  };

  const handleDragOver = (e: React.DragEvent, columnId: LeadStatus) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: LeadStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    const leadId = e.dataTransfer.getData('text/plain') || draggedLeadId;
    
    if (leadId) {
      onUpdateLeadStatus(leadId, targetColumnId);

      // Celebration Dopamine Effect for ADHD on Closing a Deal!
      if (targetColumnId === 'CLOSED') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
    setDraggedLeadId(null);
  };

  return (
    <div className="flex-1 overflow-x-auto pb-6 pt-2">
      <div className="flex gap-4 min-w-max px-2">
        {KANBAN_COLUMNS.map((col) => {
          const colLeads = leads.filter((l) => l.lead_status === col.id);
          const isOver = dragOverColumn === col.id;

          return (
            <div
              key={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`w-80 flex-shrink-0 flex flex-col bg-slate-50/80 rounded-2xl p-3 border transition-all duration-200 ${
                isOver ? 'border-blue-400 bg-blue-50/40 ring-2 ring-blue-400/20' : 'border-slate-200/60'
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.badgeColor}`}>
                    {colLeads.length}
                  </span>
                  <h3 className="font-bold text-slate-800 text-sm">{col.title}</h3>
                </div>
                <span className="text-[11px] text-slate-400 truncate max-w-[110px]" title={col.description}>
                  {col.description}
                </span>
              </div>

              {/* Cards Container */}
              <div className="flex-1 overflow-y-auto pr-1 min-h-[500px]">
                {colLeads.map((lead) => (
                  <div
                    key={lead.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, lead.id)}
                  >
                    <LeadCard
                      lead={lead}
                      onSelectLead={onSelectLead}
                      onUpdateLeadReminder={onUpdateLeadReminder}
                    />
                  </div>
                ))}

                {colLeads.length === 0 && (
                  <div className="h-32 border-2 border-dashed border-slate-200/80 rounded-xl flex items-center justify-center text-slate-400 text-xs italic">
                    Arrastra un lead aquí
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
