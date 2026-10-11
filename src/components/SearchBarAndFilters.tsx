import React from 'react';
import { Search, AlertTriangle, FileSpreadsheet, Building2, RefreshCw } from 'lucide-react';

interface SearchBarAndFiltersProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  timelineFilter: string;
  onTimelineFilterChange: (val: string) => void;
  goalFilter: string;
  onGoalFilterChange: (val: string) => void;
  adhdAlertOnly: boolean;
  onAdhdAlertToggle: () => void;
  onOpenImporter: () => void;
  onOpenProjects: () => void;
  onResetFilters: () => void;
  totalLeadsCount: number;
  filteredCount: number;
}

export const SearchBarAndFilters: React.FC<SearchBarAndFiltersProps> = ({
  searchTerm,
  onSearchChange,
  timelineFilter,
  onTimelineFilterChange,
  goalFilter,
  onGoalFilterChange,
  adhdAlertOnly,
  onAdhdAlertToggle,
  onOpenImporter,
  onOpenProjects,
  onResetFilters,
  totalLeadsCount,
  filteredCount
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Búsqueda rápida por Nombre, Teléfono o Email..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Purchase Timeline Filter */}
          <select
            value={timelineFilter}
            onChange={(e) => onTimelineFilterChange(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="all">🗓️ Todos los plazos</option>
            <option value="within_a_month">🔥 Menos de 1 mes (Urgente)</option>
            <option value="within_3_-_6_months">⭐ 3 - 6 meses</option>
            <option value="after_6_months">📅 &gt; 6 meses</option>
            <option value="not_sure">💧 Por definir</option>
          </select>

          {/* Goal Filter */}
          <select
            value={goalFilter}
            onChange={(e) => onGoalFilterChange(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="all">💼 Todos los objetivos</option>
            <option value="investment_purpose">Inversión inmobiliaria</option>
            <option value="relocation/residency">Residencia / Traslado</option>
          </select>

          {/* TDAH Alert Toggle Button */}
          <button
            onClick={onAdhdAlertToggle}
            className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition ${
              adhdAlertOnly
                ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Alerta TDAH</span>
          </button>

          {(searchTerm || timelineFilter !== 'all' || goalFilter !== 'all' || adhdAlertOnly) && (
            <button
              onClick={onResetFilters}
              title="Limpiar filtros"
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenImporter}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Importar Excel</span>
          </button>

          <button
            onClick={onOpenProjects}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span>Explorar Proyectos (DAMAC)</span>
          </button>
        </div>
      </div>

      {/* Stats Counter Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
        <div>
          Mostrando <strong className="text-slate-800">{filteredCount}</strong> de{' '}
          <strong className="text-slate-800">{totalLeadsCount}</strong> leads activos
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span> Urgentes: {totalLeadsCount > 0 ? filteredCount : 0}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span> Dubai Maritime City Leads
          </span>
        </div>
      </div>
    </div>
  );
};
