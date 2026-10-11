import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import type { Lead } from '../types/crm';
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, X } from 'lucide-react';

interface ExcelImporterProps {
  onImportLeads: (importedLeads: Lead[]) => void;
  onClose: () => void;
}

export const ExcelImporter: React.FC<ExcelImporterProps> = ({ onImportLeads, onClose }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [parsedCount, setParsedCount] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ignoredColumns = [
    'created_time',
    'ad_id',
    'adset_id',
    'adset_name',
    'campaign_id',
    'form_id',
    'form_name',
    'is_organic',
    'id' // technical meta id
  ];

  const processFile = (inputFile: File) => {
    setErrorMsg(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        const rawJson: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (rawJson.length === 0) {
          setErrorMsg('El archivo cargado está vacío.');
          return;
        }

        const mappedLeads: Lead[] = rawJson.map((row, idx) => {
          // Rule: Clean row key lookup ignoring case & spaces
          const getVal = (...keys: string[]): string => {
            for (const key of Object.keys(row)) {
              const cleanKey = key.trim().toLowerCase();
              if (ignoredColumns.includes(cleanKey)) continue; // STRICT RULE FILTER

              for (const searchKey of keys) {
                if (cleanKey === searchKey.toLowerCase() || cleanKey.includes(searchKey.toLowerCase())) {
                  return String(row[key] || '').trim();
                }
              }
            }
            return '';
          };

          const fullName = getVal('full name', 'full_name', 'nombre', 'name') || `Lead Importado #${idx + 1}`;
          const phone = getVal('phone', 'telefono', 'teléfono') || '';
          const workPhone = getVal('work_phone_number', 'work_phone', 'telefono_trabajo') || phone;
          const email = getVal('email', 'correo') || '';
          
          const rawGoal = getVal('what_is_your_main_goal_with_a_dubai_property_investment?', 'investment_goal', 'goal', 'objetivo');
          const investmentGoal = rawGoal.includes('relocation') ? 'relocation/residency' : 'investment_purpose';

          const rawTimeline = getVal('when_do_you_plan_to_purchase_your_property?', 'purchase_timeline', 'timeline', 'plazo');
          let purchaseTimeline = 'within_3_-_6_months';
          if (rawTimeline.includes('month') && (rawTimeline.includes('1') || rawTimeline.includes('within_a_month'))) {
            purchaseTimeline = 'within_a_month';
          } else if (rawTimeline.includes('after_6') || rawTimeline.includes('6_months')) {
            purchaseTimeline = 'after_6_months';
          } else if (rawTimeline.includes('not_sure')) {
            purchaseTimeline = 'not_sure';
          }

          const preferredTime = getVal('what_is_your_preferred_time_to_call?', 'preferred_time_to_call', 'horario', 'time') || '12pm_-_4pm_';
          const adName = getVal('ad_name', 'ad') || 'Meta Ads Campaign';
          const campaignName = getVal('campaign_name', 'campaign') || 'Dubai Property Ads';
          const platform = getVal('platform', 'plataforma') || 'fb';
          const comments = getVal('comments', 'comentarios', 'notas') || null;

          return {
            id: `imp-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
            platform: platform.toLowerCase().includes('ig') ? 'ig' : 'fb',
            investment_goal: investmentGoal,
            purchase_timeline: purchaseTimeline,
            preferred_time_to_call: preferredTime,
            full_name: fullName,
            phone: phone ? (phone.startsWith('p:') ? phone : `p:${phone}`) : 'p:No proveído',
            work_phone_number: workPhone,
            email: email || 'sin_email@lead.com',
            lead_status: 'CREATED',
            comments: comments,
            notes: comments ? [{
              id: `note-${Date.now()}-${idx}`,
              createdAt: new Date().toISOString(),
              author: 'Meta Ads Import',
              content: comments,
              type: 'note'
            }] : [],
            created_at: new Date().toISOString(),
            ad_name: adName,
            campaign_name: campaignName,
            next_reminder_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
          };
        });

        setParsedCount(mappedLeads.length);
        onImportLeads(mappedLeads);
      } catch (err: any) {
        setErrorMsg(`Error procesando el archivo: ${err.message || 'Formato no válido'}`);
      }
    };
    reader.readAsArrayBuffer(inputFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-xl w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Importador Inteligente Meta Ads</h2>
            <p className="text-xs text-slate-500">Excel / CSV Parser con filtrado automático de columnas innecesarias</p>
          </div>
        </div>

        <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3 text-xs text-blue-800 mb-5 leading-relaxed">
          <strong>Regla Estricta de Filtrado Activa:</strong> Se ignoran automáticamente las columnas técnicas de Meta Ads 
          <code className="mx-1 bg-white px-1 py-0.5 rounded text-blue-700 font-mono">created_time, ad_id, adset_id, adset_name, campaign_id, form_id, form_name, is_organic</code>.
          Solo se extraerán los datos útiles del cliente.
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragging 
              ? 'border-blue-500 bg-blue-50/50 scale-[0.99]' 
              : 'border-slate-200 bg-slate-50/50 hover:border-blue-400 hover:bg-blue-50/20'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
            accept=".xlsx, .xls, .csv"
            className="hidden"
          />

          <Upload className="w-10 h-10 mx-auto text-blue-500 mb-3 animate-bounce-slow" />
          <p className="text-sm font-semibold text-slate-800">
            Arrastra tu Excel / CSV aquí o <span className="text-blue-600 underline">examina tus archivos</span>
          </p>
          <p className="text-xs text-slate-400 mt-1">Soporta exportaciones directas de Meta Ads (.xlsx, .csv)</p>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {parsedCount !== null && !errorMsg && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Se importaron correctamente <strong>{parsedCount} leads</strong>.</span>
            </div>
            <button
              onClick={onClose}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-3 py-1.5 rounded-lg text-xs transition"
            >
              Ver en el Kanban
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
