import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import i18n from '@/lib/i18n';

interface LabResult {
  biological_age: number | null;
  metabolic_risk_score: string | null;
  inflammation_score: string | null;
  ai_recommendations: string[] | null;
  total_cholesterol: number | null;
  hdl: number | null;
  ldl: number | null;
  triglycerides: number | null;
  glucose: number | null;
  hemoglobin: number | null;
  ast: number | null;
  alt: number | null;
  ggt: number | null;
  creatinine: number | null;
  vitamin_d: number | null;
  tsh: number | null;
  crp: number | null;
  upload_date: string;
}

interface OnboardingData {
  age: number | null;
  health_goals?: string[];
}

export const generateHealthReport = (
  labResult: LabResult,
  onboarding: OnboardingData | null,
  userName?: string
): void => {
  const t = i18n.t.bind(i18n);
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Colors
  const primaryColor: [number, number, number] = [59, 130, 246]; // Blue
  const textColor: [number, number, number] = [31, 41, 55];
  const mutedColor: [number, number, number] = [107, 114, 128];

  // Header
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('LongLife AI', 14, 20);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(t('dashboard'), 14, 30);

  // Patient Info
  let yPos = 55;
  doc.setTextColor(...textColor);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(userName || t('profile'), 14, yPos);
  
  yPos += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...mutedColor);
  doc.text(`${t('lastAnalysis')}: ${new Date(labResult.upload_date).toLocaleDateString()}`, 14, yPos);
  
  if (onboarding?.age) {
    doc.text(`${t('age')}: ${onboarding.age}`, 100, yPos);
  }

  // Biological Age Section
  yPos += 15;
  doc.setFillColor(240, 249, 255);
  doc.roundedRect(14, yPos - 5, pageWidth - 28, 30, 3, 3, 'F');
  
  doc.setTextColor(...textColor);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(t('yourBiologicalAge'), 20, yPos + 5);
  
  doc.setFontSize(24);
  doc.setTextColor(...primaryColor);
  const bioAge = labResult.biological_age !== null ? `${labResult.biological_age} ${t('yearsOld')}` : t('notAvailable');
  doc.text(bioAge, 20, yPos + 20);

  // Risk Scores
  yPos += 40;
  doc.setTextColor(...textColor);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(t('metabolicRisk') + ' & ' + t('inflammationScore'), 14, yPos);
  
  yPos += 8;
  
  const getRiskLabel = (score: string | null) => {
    if (!score) return t('notAvailable');
    return t(score as 'low' | 'moderate' | 'high');
  };

  autoTable(doc, {
    startY: yPos,
    head: [[t('metabolicRisk'), t('inflammationScore')]],
    body: [[getRiskLabel(labResult.metabolic_risk_score), getRiskLabel(labResult.inflammation_score)]],
    theme: 'grid',
    headStyles: { fillColor: primaryColor, fontSize: 10 },
    bodyStyles: { fontSize: 11, halign: 'center' },
    margin: { left: 14, right: 14 },
    tableWidth: 'auto',
  });

  // Biomarkers Table
  yPos = (doc as any).lastAutoTable.finalY + 15;
  doc.setTextColor(...textColor);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Biomarkers', 14, yPos);
  
  yPos += 8;

  const formatValue = (value: number | null, unit: string = '') => {
    if (value === null) return t('notAvailable');
    return `${value}${unit}`;
  };

  const biomarkerData = [
    [t('totalCholesterol'), formatValue(labResult.total_cholesterol, ' mg/dL'), '< 200 mg/dL'],
    [t('hdl'), formatValue(labResult.hdl, ' mg/dL'), '40-60 mg/dL'],
    [t('ldl'), formatValue(labResult.ldl, ' mg/dL'), '< 100 mg/dL'],
    [t('triglycerides'), formatValue(labResult.triglycerides, ' mg/dL'), '< 150 mg/dL'],
    [t('glucose'), formatValue(labResult.glucose, ' mg/dL'), '70-100 mg/dL'],
    [t('hemoglobin'), formatValue(labResult.hemoglobin, ' g/dL'), '12-17 g/dL'],
    [t('creatinine'), formatValue(labResult.creatinine, ' mg/dL'), '0.6-1.2 mg/dL'],
    [t('ast'), formatValue(labResult.ast, ' U/L'), '< 40 U/L'],
    [t('alt'), formatValue(labResult.alt, ' U/L'), '< 40 U/L'],
    [t('ggt'), formatValue(labResult.ggt, ' U/L'), '< 60 U/L'],
    [t('vitaminD'), formatValue(labResult.vitamin_d, ' ng/mL'), '30-100 ng/mL'],
    [t('tsh'), formatValue(labResult.tsh, ' mIU/L'), '0.4-4.0 mIU/L'],
    [t('crp'), formatValue(labResult.crp, ' mg/L'), '< 3 mg/L'],
  ];

  autoTable(doc, {
    startY: yPos,
    head: [['Biomarker', t('notAvailable').replace('Not Available', 'Value'), 'Reference']],
    body: biomarkerData,
    theme: 'striped',
    headStyles: { fillColor: primaryColor, fontSize: 10 },
    bodyStyles: { fontSize: 9 },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    margin: { left: 14, right: 14 },
  });

  // Check if we need a new page for recommendations
  yPos = (doc as any).lastAutoTable.finalY + 15;
  
  if (yPos > 250 && labResult.ai_recommendations?.length) {
    doc.addPage();
    yPos = 20;
  }

  // Recommendations
  if (labResult.ai_recommendations && labResult.ai_recommendations.length > 0) {
    doc.setTextColor(...textColor);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(t('personalizedRecommendations'), 14, yPos);
    
    yPos += 10;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    
    labResult.ai_recommendations.forEach((rec, index) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      
      const lines = doc.splitTextToSize(`${index + 1}. ${rec}`, pageWidth - 35);
      doc.text(lines, 14, yPos);
      yPos += lines.length * 5 + 3;
    });
  }

  // Footer with disclaimer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...mutedColor);
    doc.text(t('disclaimer'), 14, doc.internal.pageSize.getHeight() - 10);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 30, doc.internal.pageSize.getHeight() - 10);
  }

  // Download the PDF
  const fileName = `LongLife_Health_Report_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};
