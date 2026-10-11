import React, { useState } from 'react';
import { CHELSEA_RESIDENCES_DATA } from '../data/chelseaData';
import type { ProjectUnit } from '../types/crm';
import { generateUnitPaymentPdf } from './UnitPdfExporter';
import type { Language } from '../i18n/translations';
import {
  ArrowLeft,
  Building2,
  TrendingUp,
  Download,
  DollarSign,
  ChevronRight,
  Layers,
  Sparkles,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

interface ProjectExplorerProps {
  onBackToCrm: () => void;
  language?: Language;
}

export const ProjectExplorer: React.FC<ProjectExplorerProps> = ({ onBackToCrm, language = 'es' }) => {
  const [selectedCurrency, setSelectedCurrency] = useState<'AED' | 'USD' | 'EUR' | 'GBP'>('AED');
  const [activeTypology, setActiveTypology] = useState<'1-BR' | '2-BR' | '3-BR'>('1-BR');
  const [selectedUnit, setSelectedUnit] = useState<ProjectUnit>(CHELSEA_RESIDENCES_DATA.units[0]);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isZoomedInMap, setIsZoomedInMap] = useState(false);
  const [activeTab, setActiveTab] = useState<'3d_units' | 'payment_plan' | 'market_analytics'>('3d_units');

  // Currency Exchange Rates (Base AED)
  const currencyRates = {
    AED: 1,
    USD: 0.2723,
    EUR: 0.25,
    GBP: 0.215
  };

  const currentRate = currencyRates[selectedCurrency];
  const symbol = selectedCurrency === 'AED' ? 'AED' : selectedCurrency === 'USD' ? '$' : selectedCurrency === 'EUR' ? '€' : '£';

  const formatPrice = (aedAmount: number) => {
    const val = aedAmount * currentRate;
    return `${symbol} ${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  const buyWhatsAppUrl = `https://wa.me/${CHELSEA_RESIDENCES_DATA.salesWhatsApp.replace(/[^\d+]/g, '')}?text=${encodeURIComponent(
    `Hola, me interesa reservar la unidad ${selectedUnit.unitNo} (${selectedUnit.typology}, ${selectedUnit.sqft} sqft, ${formatPrice(selectedUnit.priceAED)}) en Chelsea Residences por DAMAC.`
  )}`;

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col font-sans animate-fade-in">
      {/* Top Header */}
      <header className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 py-3.5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToCrm}
            className="flex items-center gap-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al CRM</span>
          </button>

          <div className="h-5 w-px bg-slate-800" />

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                Desarrolladora: {CHELSEA_RESIDENCES_DATA.developer}
              </span>
              <span className="text-xs text-slate-400">Dubai Maritime City</span>
            </div>
            <h1 className="text-lg font-black text-white leading-tight">
              {CHELSEA_RESIDENCES_DATA.projectName}
            </h1>
          </div>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
            <DollarSign className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
            {(['AED', 'USD', 'EUR', 'GBP'] as const).map((curr) => (
              <button
                key={curr}
                onClick={() => setSelectedCurrency(curr)}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  selectedCurrency === curr
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>

          <a
            href={buyWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition"
          >
            <WhatsAppIcon className="w-4 h-4 fill-current" />
            <span>Comprar Unidad ({selectedUnit.unitNo})</span>
          </a>
        </div>
      </header>

      {/* Main Grid View */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* LEFT FOLDABLE SIDEBAR: Typologies & Units */}
        <div
          className={`bg-slate-950/90 border-r border-slate-800 transition-all duration-300 flex flex-col z-30 ${
            isLeftSidebarOpen ? 'w-80' : 'w-12 overflow-hidden'
          }`}
        >
          <div className="p-3 border-b border-slate-800 flex items-center justify-between">
            {isLeftSidebarOpen && (
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-400" /> Precios y Unidades
              </span>
            )}
            <button
              onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition mx-auto"
            >
              {isLeftSidebarOpen ? <ChevronRight className="w-4 h-4 rotate-180" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>

          {isLeftSidebarOpen && (
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              {/* Typology Tabs */}
              <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-bold">
                {(['1-BR', '2-BR', '3-BR'] as const).map((typ) => (
                  <button
                    key={typ}
                    onClick={() => setActiveTypology(typ)}
                    className={`py-1.5 rounded-lg transition ${
                      activeTypology === typ
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {typ}
                  </button>
                ))}
              </div>

              {/* Typology Summary Card */}
              {(() => {
                const summary = CHELSEA_RESIDENCES_DATA.typologySummary.find((t) => t.typology === activeTypology);
                if (!summary) return null;
                return (
                  <div className="bg-slate-900/80 rounded-2xl p-3.5 border border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between items-center text-slate-400">
                      <span>Rango de Precio</span>
                      <span className="font-bold text-emerald-400">{summary.startingText}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Superficie</span>
                      <span className="font-semibold">{summary.minSqft} - {summary.maxSqft} sqft</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Promedio PSF</span>
                      <span className="font-semibold">{formatPrice(summary.avgPsf)} / sqft</span>
                    </div>
                  </div>
                );
              })()}

              {/* Inventory List */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Inventario de Torres (Torre C)
                </h4>

                <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
                  {CHELSEA_RESIDENCES_DATA.units
                    .filter((u) => u.typology === activeTypology)
                    .map((unit) => {
                      const isSelected = selectedUnit.unitNo === unit.unitNo;
                      return (
                        <div
                          key={unit.unitNo}
                          onClick={() => setSelectedUnit(unit)}
                          className={`p-3 rounded-xl border text-xs cursor-pointer transition flex items-center justify-between ${
                            isSelected
                              ? 'bg-blue-600/20 border-blue-500 text-white ring-1 ring-blue-500'
                              : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div>
                            <span className="font-extrabold text-sm block">{unit.unitNo}</span>
                            <span className="text-[11px] text-slate-400">{unit.sqft} sqft • Piso {unit.floor}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-emerald-400 block">{formatPrice(unit.priceAED)}</span>
                            <span className="text-[10px] text-slate-400">{formatPrice(unit.psf)}/sqft</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Download Quote Button */}
              <button
                onClick={() => generateUnitPaymentPdf(selectedUnit, selectedCurrency, currentRate, language)}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition"
              >
                <Download className="w-4 h-4" />
                <span>Descargar PDF Cotización ({selectedUnit.unitNo})</span>
              </button>
            </div>
          )}
        </div>

        {/* CENTER INTERACTIVE AREA: Dubai Map & 3D Interactive Showcase */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-slate-950 p-6 space-y-6">
          {/* Sub Nav Tabs */}
          <div className="flex items-center justify-between bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('3d_units')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  activeTab === '3d_units' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-4 h-4" /> Vista 3D del Proyecto y Unidades
              </button>

              <button
                onClick={() => setActiveTab('payment_plan')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  activeTab === 'payment_plan' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-4 h-4" /> Plan de Pago (60/40 Launch)
              </button>

              <button
                onClick={() => setActiveTab('market_analytics')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  activeTab === 'market_analytics' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <TrendingUp className="w-4 h-4" /> Plusvalía y Análisis de Zona
              </button>
            </div>

            <div className="text-xs text-amber-400 font-semibold px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Sin exención DLD (Aplica 4% DLD)
            </div>
          </div>

          {/* TAB 1: Interactive Dubai Map & 3D Showcase */}
          {activeTab === '3d_units' && (
            <div className="space-y-6">
              {/* Interactive Dubai Map Simulation */}
              <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 min-h-[340px] flex flex-col justify-between p-6">
                <div
                  className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ${
                    isZoomedInMap ? 'scale-150 origin-top-right filter brightness-90' : 'scale-100 filter brightness-75'
                  }`}
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80')`
                  }}
                />

                {/* Map Overlay Info */}
                <div className="relative z-10 flex justify-between items-start">
                  <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-700/80 max-w-md">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-400 block mb-1">
                      Ubicación Estratégica en Dubai
                    </span>
                    <h3 className="text-lg font-bold text-white">Dubai Maritime City (Madinat Dubai Al Melaheyah)</h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Entre Port Rashid y Drydocks World. A 20 min del Aeropuerto Int. de Dubai y Downtown.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsZoomedInMap(!isZoomedInMap)}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg transition flex items-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    <span>{isZoomedInMap ? 'Vista General Dubai' : 'Hacer Zoom 3D al Proyecto'}</span>
                  </button>
                </div>

                {/* Pin Point Indicator */}
                <div className="relative z-10 flex items-center justify-center my-8">
                  <div className="relative flex items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-blue-500 opacity-75"></span>
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-2xl shadow-2xl border-2 border-white flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      <div>
                        <p className="text-xs font-black">CHELSEA RESIDENCES</p>
                        <p className="text-[10px] text-blue-200">Sitio Oficial del Proyecto DAMAC</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Highlights */}
                <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3">
                  {CHELSEA_RESIDENCES_DATA.locationHighlights.map((hl) => (
                    <div key={hl.label} className="bg-slate-950/80 backdrop-blur-md p-3 rounded-xl border border-slate-800 text-center">
                      <span className="text-[10px] text-slate-400 block">{hl.label}</span>
                      <span className="text-xs font-black text-emerald-400">{hl.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3D Unit Card Feature View */}
              <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-blue-400 font-bold uppercase tracking-wider">
                        Unidad Seleccionada: {selectedUnit.unitNo}
                      </span>
                      <h3 className="text-xl font-extrabold text-white">
                        Distribución 3D - {selectedUnit.typology} ({selectedUnit.sqft} sqft)
                      </h3>
                    </div>
                    <span className="text-2xl font-black text-emerald-400">{formatPrice(selectedUnit.priceAED)}</span>
                  </div>

                  {/* Rendered Visual Room Showcase */}
                  <div className="relative h-64 rounded-2xl overflow-hidden border border-slate-800 group">
                    <img
                      src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                      alt="Floor plan 3d"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent p-4 flex flex-col justify-end">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-xs font-bold text-white">Acabados de Lujo DAMAC & Chelsea FC</p>
                          <p className="text-[11px] text-slate-300">Cocina equipada, ventanales dobles, vestidores integrados</p>
                        </div>
                        <a
                          href={buyWhatsAppUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl shadow-xl transition flex items-center gap-2"
                        >
                          <WhatsAppIcon className="w-4 h-4 fill-current" />
                          <span>Buy This Unit</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features & Specifications Side Box */}
                <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 space-y-3 text-xs">
                  <h4 className="font-bold text-white uppercase text-[11px] tracking-wider border-b border-slate-800 pb-2">
                    Características de la Unidad
                  </h4>
                  <ul className="space-y-2 text-slate-300">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      Ventanales de doble cristal termoacústicos
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      Pisos de porcelanato italiano de gran formato
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      Cocina integrada con electrodomésticos incluidos
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      Acceso exclusivo a Amenidades Chelsea Club
                    </li>
                  </ul>

                  <div className="pt-2 border-t border-slate-800">
                    <p className="text-[11px] text-slate-400 mb-2">¿Quieres presentar esta propuesta a tu cliente?</p>
                    <button
                      onClick={() => generateUnitPaymentPdf(selectedUnit, selectedCurrency, currentRate, language)}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <Download className="w-3.5 h-3.5" /> Generar PDF PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Payment Plan Launch 60/40 */}
          {activeTab === 'payment_plan' && (
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Plan de Pago de Lanzamiento (60/40 Plan)</h3>
                  <p className="text-xs text-slate-400">
                    Desglose de cuotas para la unidad <strong className="text-blue-400">{selectedUnit.unitNo}</strong> ({formatPrice(selectedUnit.priceAED)})
                  </p>
                </div>
                <button
                  onClick={() => generateUnitPaymentPdf(selectedUnit, selectedCurrency, currentRate, language)}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition"
                >
                  <Download className="w-4 h-4" /> Exportar Plan en PDF
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                      <th className="py-2.5 px-3">Hito de Pago</th>
                      <th className="py-2.5 px-3">Porcentaje (%)</th>
                      <th className="py-2.5 px-3">Monto ({selectedCurrency})</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300 font-medium">
                    {CHELSEA_RESIDENCES_DATA.paymentScheduleTemplate.map((row, idx) => {
                      const amount = (selectedUnit.priceAED * row.percentage) / 100;
                      return (
                        <tr key={idx} className="hover:bg-slate-800/40 transition">
                          <td className="py-2.5 px-3">{row.event}</td>
                          <td className="py-2.5 px-3 font-bold text-blue-400">{row.percentage}%</td>
                          <td className="py-2.5 px-3 font-bold text-emerald-400">{formatPrice(amount)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: Market Analytics & Competitors */}
          {activeTab === 'market_analytics' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Capital Appreciation Timeline */}
              <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" /> Histórico de Plusvalía (Dubai Maritime City)
                  </h3>
                  <p className="text-xs text-slate-400">Evolución de precio por pie cuadrado (+53% en mercado primario)</p>
                </div>

                <div className="space-y-3">
                  {CHELSEA_RESIDENCES_DATA.capitalAppreciationHistory.map((item) => (
                    <div key={item.year} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-300">
                        <span>Año {item.year}</span>
                        <span className="text-emerald-400">{formatPrice(item.psfPrimary)} / sqft</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2">
                        <div
                          className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(item.psfPrimary / 3500) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Competitors Rates */}
              <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-400" /> Comparativa de Competidores (1BR PSF)
                  </h3>
                  <p className="text-xs text-slate-400">Tarifas promedio de venta en proyectos vecinos de la zona</p>
                </div>

                <div className="space-y-2.5">
                  {CHELSEA_RESIDENCES_DATA.competitorsPSF.map((comp) => (
                    <div key={comp.name} className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                      <div>
                        <span className="font-bold text-white block">{comp.name}</span>
                        <span className="text-[10px] text-slate-400">Lanzamiento: {comp.launch}</span>
                      </div>
                      <span className="font-extrabold text-blue-400">{formatPrice(comp.psf)} / sqft</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
