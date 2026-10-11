import jsPDF from 'jspdf';
import type { ProjectUnit } from '../types/crm';
import { CHELSEA_RESIDENCES_DATA } from '../data/chelseaData';
import { TRANSLATIONS, type Language } from '../i18n/translations';

export const generateUnitPaymentPdf = (
  unit: ProjectUnit,
  currency: 'AED' | 'USD' | 'EUR' | 'GBP' = 'AED',
  conversionRate: number = 1,
  lang: Language = 'es'
) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.es;
  const doc = new jsPDF();
  const symbol = currency === 'AED' ? 'AED' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';
  
  const formatAmt = (aedVal: number) => {
    const val = aedVal * conversionRate;
    return `${symbol} ${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  // Title Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('CHELSEA RESIDENCES BY DAMAC', 14, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${t.pdfTitle} | Dubai Maritime City`, 14, 28);

  // Unit Details Section
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(`${t.pdfUnit}: ${unit.unitNo}`, 14, 52);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${t.pdfTypology}: ${unit.typology}`, 14, 60);
  doc.text(`${t.pdfArea}: ${unit.sqft} sqft (${(unit.sqft * 0.092903).toFixed(1)} m²)`, 14, 66);
  doc.text(`${t.pdfPsf}: ${formatAmt(unit.psf)} / sqft`, 14, 72);
  doc.text(`${t.pdfCompletion}: ${CHELSEA_RESIDENCES_DATA.completionDate}`, 14, 78);

  // Total Price Highlight
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(118, 48, 78, 34, 3, 3, 'F');
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text(t.pdfTotal, 123, 56);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 185, 129); // emerald-600
  doc.text(formatAmt(unit.priceAED), 123, 67);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(t.pdfDldNote, 123, 76);

  // Payment Breakdown Table Header
  doc.setFillColor(30, 41, 59);
  doc.rect(14, 90, 182, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(t.pdfMilestoneCol, 18, 95.5);
  doc.text(t.pdfFeeCol, 125, 95.5);
  doc.text(`${t.pdfAmountCol} (${currency})`, 160, 95.5);

  // Payment Table Rows
  let y = 104;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);

  CHELSEA_RESIDENCES_DATA.paymentScheduleTemplate.forEach((item, idx) => {
    if (y > 260) {
      doc.addPage();
      y = 20;
    }

    const rowBg = idx % 2 === 0 ? 250 : 255;
    doc.setFillColor(rowBg, rowBg, rowBg);
    doc.rect(14, y - 5, 182, 7, 'F');

    const installmentAmt = (unit.priceAED * item.percentage) / 100;

    doc.text(item.event, 18, y);
    doc.text(`${item.percentage}%`, 125, y);
    doc.text(formatAmt(installmentAmt), 160, y);

    y += 8;
  });

  // Footer / Agent WhatsApp Contact
  doc.setLineWidth(0.5);
  doc.setDrawColor(226, 232, 240);
  doc.line(14, 275, 196, 275);

  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(t.pdfAgentContact, 14, 283);
  doc.text(`DAMAC | Chelsea Residences (${lang.toUpperCase()})`, 135, 283);

  doc.save(`Cotizacion_Chelsea_${unit.unitNo.replace(/\//g, '_')}_${currency}_${lang}.pdf`);
};
