import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Save, CheckCircle2, FileText, Share2, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { usersService } from '@/services/endpoints/users';
// Assuming User is exported now, or defining locally if not. Let's try defining locally to avoid external type issues for now.
import { WeeklyClinicalReport, CompositionActivitySection, PainLogSection, EvolutionSection } from '../../core/domain/types';
import { MockBiometricRepository } from '../../core/repositories/mocks/MockBiometricRepository';
import { toast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils';
import { useAppStore } from '@/store/useAppStore';

// Define a local User interface if it's not correctly exported from '../../core/domain/types'
// This matches the structure of the fallback patient data.
export interface User {
  id: string;
  nombre: string;
  email: string;
  apodo: string;
  genero: string;
  idioma: string;
  estilo_comunicacion: string;
  ciudad: string;
  altitud: number;
  registro_activo: boolean;
  onboarding_completo: boolean;
  nombre_disciplina: string;
  objetivo_principal: string;
  peso: number;
  unidad_peso: string;
  altura: number;
  unidad_altura: string;
  nivel_actividad: string;
  nivel_motor_actual: string;
  clasificacion_visible_actual: string;
  alimentacion: string;
}

// Enriched type for internal use within the component to match mockup requirements
// Directly using 'label' and 'painAlert' as per instructions for WeeklyClinicalReport
interface EnrichedWeeklyClinicalReport {
  weekOffset: number;
  label: string;
  status: 'ADELANTE' | 'ADELANTE CON AJUSTE' | 'PRECAUCIÓN' | 'DETENER' | 'PENDIENTE';
  painAlert: string;
  nextWeekPlan: string;
  compositionActivity: CompositionActivitySection;
  painLog: PainLogSection;
  evolution8Weeks: EvolutionSection;
  generalObservations: string;
  patientName: string;
  discipline: string;
  planType: string;
  altitude: string;
  objective: string;
  metrics: { label: string; value: string }[];
  painAlertActive: boolean;
  painAlertFooter: string;
  wellnessIndex: { overallScore: number; deltaVsLastWeek: number; bestWeekScore: number; bestWeekLabel: string; factors: { label: string; score: number; delta: number; color: string }[] };
  weightCompositionChart: { labels: string[]; muscleData: number[]; fatData: number[]; totalWeightData: number[] };
  wellnessIndexChart: { labels: string[]; scores: number[]; referenceLine: number; peakWeekLabel: string; peakWeekScore: number };
}

interface ApiClinicalReport {
  semana_info: string;
  indice_bienestar: number;
  alertas?: {
    activa: boolean;
    detalle: string;
  };
  mensaje_ia: string;
  detalle_factor_peso_composicion?: {
    actual: string;
    historico: {
      s_1: string;
      s_4: string;
    };
    target: string;
    label: string;
    indice_factor: number;
  }[];
  detalle_factor_hidratacion?: {
    actual: string;
    historico: {
      s_1: string;
      s_4: string;
    };
    target: string;
    label: string;
    indice_factor: number;
  }[];
  detalle_factor_carga_muscular?: {
    actual: string;
    historico: {
      s_1: string;
      s_4: string;
    };
    target: string;
    label: string;
    indice_factor: number;
  }[];
  dolor_activo?: {
    zona: string;
    intensidad: string;
    id?: string;
  }[];
  historial_semanal_composicion_reporte?: {
    semana_label: string;
    peso: number;
    musculo_pct: number;
    grasa_pct: number;
    nota: string;
  }[];
  historial_bienestar_semanal_reporte?: {
    semana_label: string;
    score: number;
  }[];
}

const createFallbackClinicalReport = (weekOffset: number, patient: any): EnrichedWeeklyClinicalReport => {
  const currentWeekNum = 12 - weekOffset; // Assuming 12 weeks total, 0-offset means current week

  const compositionActivityRows = [
    { metric: 'Weight and Composition', label: 'Peso y Composición', target: '70kg', actual: `${(75 - weekOffset * 0.5).toFixed(1)}kg`, S_1: '75.0kg', S_4: '76.0kg' },
    { metric: 'Hydration', label: 'Hidratación', target: '3L', actual: `${(2.5 + weekOffset * 0.1).toFixed(1)}L`, S_1: '2.5L', S_4: '2.4L' },
    { metric: 'Muscle Load', label: 'Carga Muscular', target: 'Normal', actual: 'Normal', S_1: 'Normal', S_4: 'Normal' },
  ];

  const painLogRows = weekOffset === 1 ? [{ id: 'pain-1', zone: 'Rodilla derecha', intensity: '2/10' }] : [];

  const evolution8WeeksRows = Array.from({ length: 8 }, (_, i) => {
    const weekLabel = `S${currentWeekNum - (7 - i)}`;
    const weight = (76 - (7 - i) * 0.2).toFixed(1);
    const musclePct = (22 + (7 - i) * 0.1).toFixed(1);
    const fatPct = (9 - (7 - i) * 0.05).toFixed(1);
    return {
      weekLabel,
      weight: `${weight}kg`,
      musclePct: `${musclePct}%`,
      fatPct: `${fatPct}%`,
      note: (i === 7 && weekOffset === 0) ? 'Excelente semana de entrenamiento!' : '',
    };
  });

  const weightCompositionChartLabels = evolution8WeeksRows.map(row => row.weekLabel);
  const muscleData = evolution8WeeksRows.map(row => parseFloat(row.musclePct.replace('%', '')));
  const fatData = evolution8WeeksRows.map(row => parseFloat(row.fatPct.replace('%', '')));
  const totalWeightData = evolution8WeeksRows.map(row => parseFloat(row.weight.replace('kg', '')));

  const wellnessScores = Array.from({ length: 8 }, (_, i) => 65 + (i * 2) + (weekOffset % 2 === 0 ? 0 : -3));
  const maxWellnessScore = Math.max(...wellnessScores);
  const peakWeekIndex = wellnessScores.indexOf(maxWellnessScore);
  const peakWeekLabel = weightCompositionChartLabels[peakWeekIndex] || '';


  return {
    weekOffset: weekOffset,
    label: `Semana ${currentWeekNum}`,
    status: weekOffset === 0 ? 'ADELANTE' : 'ADELANTE CON AJUSTE',
    painAlert: weekOffset === 1 ? 'Paciente reporta leve molestia en rodilla derecha. Monitorear.' : 'No hay alertas.',
    nextWeekPlan: 'Mantener la rutina actual y ajustar la hidratación. Enfocarse en la recuperación activa.',
    compositionActivity: {
      rows: compositionActivityRows,
      comment: weekOffset === 0 ? 'Revisar detalles de composición y actividad con el paciente.' : '',
    },
    painLog: {
      rows: painLogRows,
      comment: weekOffset === 1 ? 'Seguimiento de la molestia en rodilla. Reducir carga de impacto.' : '',
    },
    evolution8Weeks: {
      rows: evolution8WeeksRows,
      comment: 'Progreso constante en peso y composición. Nivel de bienestar estable.',
    },
    generalObservations: weekOffset === 0 ? 'El paciente ha mostrado un compromiso excelente y una mejora significativa en todos los indicadores clave.' : '',
    patientName: patient.nombre || 'Nombre del Paciente',
    discipline: patient.nombre_disciplina || 'Disciplina Deportiva',
    planType: `Pro - Sem. ${currentWeekNum}`,
    altitude: `${patient.altitud || 0} msnm`,
    objective: patient.objetivo_principal || 'Mejorar rendimiento',
    metrics: [{ label: 'VO2 Máx', value: '45.0 ml/kg/min' }],
    painAlertActive: painLogRows.length > 0,
    painAlertFooter: '→ Monitorear intensidad. Considerar derivación si el dolor persiste o aumenta.',
    wellnessIndex: {
      overallScore: wellnessScores[wellnessScores.length - 1],
      deltaVsLastWeek: weekOffset === 0 ? 2 : -1,
      bestWeekScore: maxWellnessScore,
      bestWeekLabel: peakWeekLabel,
      factors: [
        { label: 'Peso y composición', score: 75 + weekOffset, delta: 2, color: 'brand-orange' },
        { label: 'Hidratación', score: 60 + weekOffset * 2, delta: 1, color: 'brand-blue' },
        { label: 'Carga muscular', score: 80 - weekOffset, delta: 3, color: 'brand-purple' },
        { label: 'Movimiento', score: 70 + weekOffset, delta: 0, color: 'brand-green' },
      ],
    },
    weightCompositionChart: {
      labels: weightCompositionChartLabels,
      muscleData: muscleData,
      fatData: fatData,
      totalWeightData: totalWeightData,
    },
    wellnessIndexChart: {
      labels: weightCompositionChartLabels,
      scores: wellnessScores,
      referenceLine: 70,
      peakWeekLabel: peakWeekLabel,
      peakWeekScore: maxWellnessScore,
    },
  };
};



const adaptApiClinicalReport = (apiData: ApiClinicalReport, weekOffset: number, patient: any): EnrichedWeeklyClinicalReport => {
  const latestWeightComposition = apiData.detalle_factor_peso_composicion?.[0];
  const latestHydration = apiData.detalle_factor_hidratacion?.[0];
  const latestMuscleLoad = apiData.detalle_factor_carga_muscular?.[0];

  const compositionActivityRows = [
    ...(latestWeightComposition ? [{
      metric: 'Peso y Composición',
      label: latestWeightComposition.label,
      target: latestWeightComposition.target,
      S_1: latestWeightComposition.historico.s_1,
      S_4: latestWeightComposition.historico.s_4,
      actual: latestWeightComposition.actual,
    }] : []),
    ...(latestHydration ? [{
      metric: 'Hidratación',
      label: latestHydration.label,
      target: latestHydration.target,
      S_1: latestHydration.historico.s_1,
      S_4: latestHydration.historico.s_4,
      actual: latestHydration.actual,
    }] : []),
    ...(latestMuscleLoad ? [{
      metric: 'Carga Muscular',
      label: latestMuscleLoad.label,
      target: latestMuscleLoad.target,
      S_1: latestMuscleLoad.historico.s_1,
      S_4: latestMuscleLoad.historico.s_4,
      actual: latestMuscleLoad.actual,
    }] : []),
  ];

  const painLogRows = apiData.dolor_activo?.map((pain: any, index: number) => ({
    id: pain.id || `pain-${index}`,
    zone: pain.zona,
    intensity: pain.intensidad,
  })) || [];

  const evolution8WeeksRows = apiData.historial_semanal_composicion_reporte?.map((item: any) => ({
    weekLabel: item.semana_label,
    weight: item.peso,
    musclePct: item.musculo_pct,
    fatPct: item.grasa_pct,
    note: item.nota || '',
  })) || [];

  const weightCompositionChartLabels = apiData.historial_semanal_composicion_reporte?.map((item: any) => item.semana_label).reverse() || [];
  const muscleData = apiData.historial_semanal_composicion_reporte?.map((item: any) => item.musculo_pct).reverse() || [];
  const fatData = apiData.historial_semanal_composicion_reporte?.map((item: any) => item.grasa_pct).reverse() || [];
  const totalWeightData = apiData.historial_semanal_composicion_reporte?.map((item: any) => item.peso).reverse() || [];

  const wellnessIndexChartLabels = apiData.historial_bienestar_semanal_reporte?.map((item: any) => item.semana_label).reverse() || [];
  const wellnessScores = apiData.historial_bienestar_semanal_reporte?.map((item: any) => item.score).reverse() || [];

  const maxWellnessScore = wellnessScores.length > 0 ? Math.max(...wellnessScores) : 0;
  const peakWeekIndex = wellnessScores.indexOf(maxWellnessScore);
  const peakWeekLabel = wellnessIndexChartLabels[peakWeekIndex] || '';

  return {
    weekOffset: weekOffset,
    label: apiData.semana_info || `Semana ${12 - weekOffset}`,
    status: apiData.indice_bienestar >= 70 ? 'ADELANTE' : 'DETENER',
    painAlert: apiData.alertas?.detalle || 'No hay alertas.',
    nextWeekPlan: apiData.mensaje_ia || '',
    compositionActivity: {
      rows: compositionActivityRows,
      comment: '',
    },
    painLog: {
      rows: painLogRows,
      comment: '',
    },
    evolution8Weeks: {
      rows: evolution8WeeksRows,
      comment: '',
    },
    generalObservations: '',
    patientName: patient.nombre,
    discipline: patient.nombre_disciplina,
    planType: `Pro - Sem. ${12 - weekOffset}`,
    altitude: `${patient.altitud} msnm`,
    objective: patient.objetivo_principal,
    metrics: [{ label: 'VO2 Máx', value: '46.6 ml/kg/min' }],
    painAlertActive: apiData.alertas?.activa || false,
    painAlertFooter: '→ Sin impacto en tren inferior por 5 días. Derivar a traumatología si persiste en semana 13.',
    wellnessIndex: {
      overallScore: apiData.indice_bienestar,
      deltaVsLastWeek: 0, // Placeholder, actual calculation requires more data
      bestWeekScore: maxWellnessScore,
      bestWeekLabel: peakWeekLabel,
      factors: [
        ...(latestWeightComposition ? [{ label: latestWeightComposition.label, score: latestWeightComposition.indice_factor, delta: 0, color: 'brand-orange' }] : []),
        ...(latestHydration ? [{ label: latestHydration.label, score: latestHydration.indice_factor, delta: 0, color: 'brand-blue' }] : []),
        ...(latestMuscleLoad ? [{ label: latestMuscleLoad.label, score: latestMuscleLoad.indice_factor, delta: 0, color: 'brand-purple' }] : []),
        // Add other factors if they exist in API data
      ],
    },
    weightCompositionChart: {
      labels: weightCompositionChartLabels,
      muscleData: muscleData,
      fatData: fatData,
      totalWeightData: totalWeightData,
    },
    wellnessIndexChart: {
      labels: wellnessIndexChartLabels,
      scores: wellnessScores,
      referenceLine: 70,
      peakWeekLabel: peakWeekLabel,
      peakWeekScore: maxWellnessScore,
    },
  };
};

interface ClinicalReportTabProps {
  patientId: string;
  readOnly?: boolean;
}

const biometricRepository = new MockBiometricRepository();

export const ClinicalReportTab: React.FC<ClinicalReportTabProps> = ({ patientId, readOnly = false }) => {
  const [activeWeekOffset, setActiveWeekOffset] = useState<number>(0);
  const [activeSubTab, setActiveSubTab] = useState<'composition' | 'pain' | 'evolution'>('composition');
  const [reportDraft, setReportDraft] = useState<EnrichedWeeklyClinicalReport | null>(null);

  const selectedPatient = useAppStore(state => state.selectedPatient);

  const patient = useMemo(() => selectedPatient || {
    id: 'pat-carlos-mendoza',
    nombre: 'Carlos Mendoza',
    email: 'carlos.mendoza@mail.com',
    apodo: 'Carlitos',
    genero: 'M',
    idioma: 'es',
    estilo_comunicacion: 'formal',
    ciudad: 'Quito',
    altitud: 2850,
    registro_activo: true,
    onboarding_completo: true,
    nombre_disciplina: 'Trail Running',
    objetivo_principal: 'bajar peso',
    peso: 75,
    unidad_peso: 'kg',
    altura: 175,
    unidad_altura: 'cm',
    nivel_actividad: 'pro',
    nivel_motor_actual: 'avanzado',
    clasificacion_visible_actual: 'competitivo',
    alimentacion: 'flexible'
  } as any, [selectedPatient]);

  const isMockPatient = !patientId || patientId.startsWith('uid-') || patientId.startsWith('pro-') || patientId.startsWith('esp-') || patientId.length < 10 || patientId.startsWith('uid-mock-');

  const { data: apiClinicalData, isLoading: isApiLoading, error: apiError } = useQuery({
    queryKey: ['clinicalReport', patientId, activeWeekOffset],
    queryFn: () => usersService.getUserTabDetalle(patientId, 'reporte_clinico'),
    enabled: !isMockPatient && !!patientId,
  });

  useEffect(() => {
    const fetchAndEnrichReport = async () => {
      if (!patientId) {
        setReportDraft(null);
        toast.show('No hay paciente seleccionado.', 'error');
        return;
      }

      if (isMockPatient) {
        try {
          const fetchedReport: EnrichedWeeklyClinicalReport = createFallbackClinicalReport(activeWeekOffset, patient);
          setReportDraft(fetchedReport);
        } catch (error) {
          console.error('Failed to fetch clinical report:', error);
          setReportDraft(null);
          toast.show('Error al cargar el informe clínico.', 'error');
        }
      } else { // Not a mock patient, use API data
        if (apiClinicalData) {
          try {
            const enrichedReport = adaptApiClinicalReport(apiClinicalData as any, activeWeekOffset, patient);
            setReportDraft(enrichedReport);
          } catch (error) {
            console.error('Failed to adapt API clinical report:', error);
            setReportDraft(null);
            toast.show('Error al procesar el informe clínico del servidor.', 'error');
          }
        } else if (apiError) {
          console.error('Failed to fetch API clinical report:', apiError);
          setReportDraft(null);
          toast.show('Error al cargar el informe clínico del servidor.', 'error');
        }
      }
    };

    // Only run this effect if not using React Query for API data, or if API data changed
    if (isMockPatient || (!isApiLoading && !apiError && !!apiClinicalData)) {
        fetchAndEnrichReport();
    } else if (!isMockPatient && !patientId) {
        setReportDraft(null);
    } else if (!isMockPatient && apiError) {
        setReportDraft(null);
    }
  }, [patient, activeWeekOffset, isMockPatient, apiClinicalData, isApiLoading, apiError, patientId]);

  const updateReportField = (f: keyof EnrichedWeeklyClinicalReport, v: any) =>
    setReportDraft(p => p ? { ...p, [f]: v } : null);

  const updateCompositionActivityRow = (idx: number, val: string) =>
    setReportDraft(p => {
      if (!p) return null;
      const rows = [...p.compositionActivity.rows];
      rows[idx] = { ...rows[idx], actual: val };
      return { ...p, compositionActivity: { ...p.compositionActivity, rows } };
    });

  const updateCompositionActivityComment = (comment: string) =>
    setReportDraft(p => p ? { ...p, compositionActivity: { ...p.compositionActivity, comment } } : null);

  const updatePainLogEntry = (id: string, f: 'zone' | 'intensity', val: string) =>
    setReportDraft(p => {
      if (!p) return null;
      const rows = p.painLog.rows.map(r => r.id === id ? { ...r, [f]: val } : r);
      return { ...p, painLog: { ...p.painLog, rows } };
    });

  const updatePainLogComment = (comment: string) =>
    setReportDraft(p => p ? { ...p, painLog: { ...p.painLog, comment } } : null);

  const updateEvolution8WeeksRow = (idx: number, val: string) =>
    setReportDraft(p => {
      if (!p) return null;
      const rows = [...p.evolution8Weeks.rows];
      rows[idx] = { ...rows[idx], note: val };
      return { ...p, evolution8Weeks: { ...p.evolution8Weeks, rows } };
    });

  const updateEvolution8WeeksComment = (comment: string) =>
    setReportDraft(p => p ? { ...p, evolution8Weeks: { ...p.evolution8Weeks, comment } } : null);

  const updateNextWeekPlan = (plan: string) =>
    setReportDraft(p => p ? { ...p, nextWeekPlan: plan } : null);

  const updateGeneralObservations = (comment: string) =>
    setReportDraft(p => p ? { ...p, generalObservations: comment } : null);

  const handleSave = async () => {
    if (reportDraft) {
      try {
        // Destructure to remove UI-only properties that are not part of WeeklyClinicalReport
        const reportToSave: WeeklyClinicalReport = {
          weekOffset: reportDraft.weekOffset,
          label: reportDraft.label,
          status: (reportDraft.status === 'PENDIENTE' ? 'ADELANTE' : reportDraft.status) as WeeklyClinicalReport['status'],
          painAlert: reportDraft.painAlert,
          nextWeekPlan: reportDraft.nextWeekPlan,
          compositionActivity: reportDraft.compositionActivity,
          painLog: reportDraft.painLog,
          evolution8Weeks: reportDraft.evolution8Weeks,
          generalObservations: reportDraft.generalObservations,
        };

        await biometricRepository.saveClinicalReport(patientId, reportToSave);
        toast.show('Cambios guardados exitosamente!', 'success');
      } catch (error) {
        console.error('Failed to save clinical report:', error);
        toast.show('Error al guardar los cambios.', 'error');
      }
    }
  };

  const isCurrentWeek = activeWeekOffset === 0;


  // Helper for rendering charts
    const WeightCompositionChart = () => {
      if (!reportDraft) return null;
      const { labels, muscleData, fatData, totalWeightData } = reportDraft.weightCompositionChart;

    const viewBoxWidth = 500;
    const viewBoxHeight = 240;
    const paddingTop = 30;
    const paddingBottom = 40;
    const paddingLeft = 40;
    const paddingRight = 20;
    const chartHeight = viewBoxHeight - paddingTop - paddingBottom; // 170px plotting height
    const chartWidth = viewBoxWidth - paddingLeft - paddingRight; // 440px plotting width

    const maxWeight = 80;
    const yScale = chartHeight / maxWeight;
    const barWidth = 14;
    const spacing = labels.length > 1 ? (chartWidth - labels.length * barWidth) / (labels.length - 1) : 0;

    const yAxisTicks = [0, 20, 40, 60, 80];

    // Helper to get Y position from weight value
    const getYPos = (weight: number) => paddingTop + chartHeight - (weight * yScale);

    return (
      <div className="bg-surface-card p-4 rounded-xl h-[400px] flex flex-col justify-between">
        <h4 className="text-sm font-semibold text-white mb-4">Peso y composición (kg)</h4>
        <svg viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} className="w-full flex-grow">
          {/* Y-axis line */}
          <line x1={paddingLeft} y1={paddingTop} x2={paddingLeft} y2={paddingTop + chartHeight} stroke="#4A5568" strokeWidth="1" />

          {/* Y-axis labels and horizontal gridlines */}
          {yAxisTicks.map(tick => {
            const y = getYPos(tick);
            return (
              <g key={tick}>
                <line x1={paddingLeft} y1={y} x2={viewBoxWidth - paddingRight} y2={y} stroke="#2D3748" strokeDasharray="3 3" />
                <text x={paddingLeft - 10} y={y + 3} textAnchor="end" fill="#A0AEC0" fontSize="10">{tick}</text>
              </g>
            );
          })}
          {/* Y-axis label "kg" */}
          <text x={paddingLeft - 10} y={paddingTop - 10} textAnchor="end" fill="#A0AEC0" fontSize="10">kg</text>

          {labels.map((label, i) => {
            const xPos = paddingLeft + i * (barWidth + spacing);
            const sumPct = (muscleData[i] || 0) + (fatData[i] || 0);
            const muscleRatio = sumPct === 0 ? 0 : muscleData[i] / sumPct;
            const fatRatio = sumPct === 0 ? 0 : fatData[i] / sumPct;

            const totalWeightPx = totalWeightData[i] * yScale;
            const currentMuscleHeight = totalWeightPx * muscleRatio;
            const currentFatHeight = totalWeightPx * fatRatio;

            const muscleY = getYPos(totalWeightData[i]) + (totalWeightPx - currentMuscleHeight);
            const fatY = getYPos(totalWeightData[i]) + (totalWeightPx - currentMuscleHeight - currentFatHeight);
            const totalWeightDotY = getYPos(totalWeightData[i]);

            return (
              <g key={i}>
                {/* Muscle Bar */}
                <rect x={xPos} y={muscleY} width={barWidth} height={currentMuscleHeight} fill="#E8622A" />
                {/* Fat Bar */}
                <rect x={xPos} y={fatY} width={barWidth} height={currentFatHeight} fill="#D1D5DB" />

                {/* Total Weight Line & Dot */}
                {i > 0 && (
                  <line
                    x1={paddingLeft + (i - 1) * (barWidth + spacing) + barWidth / 2} y1={getYPos(totalWeightData[i-1])}
                    x2={xPos + barWidth / 2} y2={totalWeightDotY}
                    stroke="#FFFFFF" strokeWidth="2"
                  />
                )}
                <circle cx={xPos + barWidth / 2} cy={totalWeightDotY} r="4" fill="#FFFFFF" stroke="#E8622A" strokeWidth="1.5" />
                <text x={xPos + barWidth / 2} y={totalWeightDotY - 10} textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">{totalWeightData[i]}</text>

                {/* Week Labels */}
                <text x={xPos + barWidth / 2} y={paddingTop + chartHeight + 20} textAnchor="middle" fill="#A0AEC0" fontSize="10">{label}</text>
              </g>
            );
          })}
          {/* Legend */}
          <g transform={`translate(${paddingLeft} ${viewBoxHeight - paddingBottom + 30})`}>
            <rect x="0" y="0" width="10" height="10" fill="#E8622A" />
            <text x="15" y="9" fill="white" fontSize="10">Músculo est.</text>
            <rect x="70" y="0" width="10" height="10" fill="#D1D5DB" />
            <text x="85" y="9" fill="white" fontSize="10">Grasa est.</text>
            <line x1="140" y1="5" x2="155" y2="5" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="147.5" cy="5" r="4" fill="#FFFFFF" stroke="#E8622A" strokeWidth="1.5" />
            <text x="160" y="9" fill="white" fontSize="10">Peso total</text>
          </g>
        </svg>
      </div>
    );
  };

    const WellnessIndexChart = () => {
      if (!reportDraft) return null;
      const { labels, scores, referenceLine, peakWeekLabel, peakWeekScore } = reportDraft.wellnessIndexChart;

    const viewBoxWidth = 500;
    const viewBoxHeight = 240;
    const paddingTop = 30;
    const paddingBottom = 40;
    const paddingLeft = 40;
    const paddingRight = 20;
    const chartHeight = viewBoxHeight - paddingTop - paddingBottom; // 170px plotting height
    const chartWidth = viewBoxWidth - paddingLeft - paddingRight; // 440px plotting width

    const minY = 50;
    const maxY = 90;
    const scoreRange = maxY - minY; // 40 units
    const scoreScale = chartHeight / scoreRange; // Scale for vertical positioning (170px / 40 units)

    const pointGap = labels.length > 1 ? chartWidth / (labels.length - 1) : 0;

    // Helper to get Y position from score value
    const getYPos = (score: number) => paddingTop + chartHeight - (score - minY) * scoreScale;

    const pointsD = scores.map((score, i) => {
      const x = paddingLeft + i * pointGap;
      const y = getYPos(score);
      return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    }).join(' ');

    const areaD = `M${paddingLeft},${paddingTop + chartHeight} ${pointsD.replace('M', 'L')} L${paddingLeft + (scores.length - 1) * pointGap},${paddingTop + chartHeight} Z`;

    const yAxisTicks = [50, 60, 70, 80, 90];
    const peakIndex = labels.findIndex(label => label === peakWeekLabel);
    const s12Index = labels.length - 1; // Assuming S12 is the last week in the data

    return (
      <div className="bg-surface-card p-4 rounded-xl h-[400px] flex flex-col justify-between">
        <h4 className="text-sm font-semibold text-white mb-4">Índice de bienestar (0-100)</h4>
        <svg viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} className="w-full flex-grow">
          {/* Y-axis line */}
          <line x1={paddingLeft} y1={paddingTop} x2={paddingLeft} y2={paddingTop + chartHeight} stroke="#4A5568" strokeWidth="1" />

          {/* Y-axis labels and horizontal gridlines */}
          {yAxisTicks.map(tick => {
            const y = getYPos(tick);
            return (
              <g key={tick}>
                <line x1={paddingLeft} y1={y} x2={viewBoxWidth - paddingRight} y2={y} stroke="#2D3748" strokeDasharray="3 3" />
                <text x={paddingLeft - 10} y={y + 3} textAnchor="end" fill="#A0AEC0" fontSize="10">{tick}</text>
              </g>
            );
          })}

          {/* Filled Shading Area */}
          <path d={areaD} fill="rgba(232, 98, 42, 0.08)" />

          {/* Orange Line Curve */}
          <path d={pointsD} stroke="#E8622A" strokeWidth="3" fill="none" />

          {/* Dashed Reference Line at 70 */}
          <line x1={paddingLeft} y1={getYPos(70)} x2={viewBoxWidth - paddingRight} y2={getYPos(70)} stroke="#718096" strokeDasharray="4 4" />
          <text x={paddingLeft + 15} y={getYPos(70) - 5} fill="#718096" fontSize="10">referencia 70</text>

          {/* Points and Labels */}
          {scores.map((score, i) => {
            const xPos = paddingLeft + i * pointGap;
            const yPos = getYPos(score);
            const isPeak = i === peakIndex;
            const isS12 = i === s12Index;

            return (
              <g key={i}>
                {!isPeak && ( // Normal dots
                  <circle cx={xPos} cy={yPos} r="4" fill="#FFFFFF" stroke="#E8622A" strokeWidth="1.5" />
                )}

                {isPeak && ( // Peak S9 Highlight
                  <g>
                    <circle cx={xPos} cy={yPos} r="6" fill="#4CAF82" stroke="#FFFFFF" strokeWidth="2" />
                    <text x={xPos} y={yPos - 22} textAnchor="middle" fill="#4CAF82" fontWeight="bold" fontSize="11">★</text>
                    <text x={xPos} y={yPos - 12} textAnchor="middle" fill="#4CAF82" fontWeight="bold" fontSize="11">{peakWeekScore}</text>
                  </g>
                )}

                {isS12 && !isPeak && ( // S12 Node Label
                  <text x={xPos} y={yPos - 12} textAnchor="middle" fill="#E8622A" fontWeight="bold" fontSize="11">{score}</text>
                )}

                {/* Week Labels below */}
                <text x={xPos} y={paddingTop + chartHeight + 20} textAnchor="middle" fill="#A0AEC0" fontSize="10">{labels[i]}</text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className="card-base p-4 space-y-6 bg-surface-card text-white">
      {/* Clinical Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 border-b border-surface-border pb-4">
        {/* Patient Name & Metadata */}
        <div className="flex-1 text-center md:text-left mb-4 md:mb-0">
          <h2 className="text-3xl lg:text-4xl text-white font-bold mb-1">
            {patient?.nombre || "Carlos Mendoza"}
          </h2>
          <div className="text-[10px] text-surface-muted flex flex-wrap items-center justify-center md:justify-start gap-x-2">
            <span>{reportDraft?.discipline || patient.nombre_disciplina}</span>
            <span className="text-surface-border">|</span>
            <span>Pro - Sem. {reportDraft?.label || `Semana ${12 - activeWeekOffset}`}</span>
            <span className="text-surface-border">|</span>
            <span>{reportDraft?.altitude || `${patient.altitud} msnm`}</span>
            <span className="text-surface-border">|</span>
            <span>Objetivo: {reportDraft?.objective || patient.objetivo_principal}</span>
            <span className="text-surface-border">|</span>
            <span>VO2 Máx: {reportDraft?.metrics?.find(m => m.label === 'VO2 Máx')?.value || '46.6 ml/kg/min'}</span>
          </div>
        </div>

        {/* Week Selector & Action Buttons */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Week Navigator */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setActiveWeekOffset(prev => Math.min(prev + 1, 4))}><ChevronLeft size={16} /></Button>
            <span className="text-xs font-medium text-surface-muted uppercase tracking-wider">
              Semana {reportDraft?.label || `Semana ${12 - activeWeekOffset}`} {isCurrentWeek ? '(Actual)' : activeWeekOffset > 0 ? `+${activeWeekOffset}` : ''}
            </span>
            <Button variant="ghost" size="sm" onClick={() => setActiveWeekOffset(prev => Math.max(prev - 1, 0))}><ChevronRight size={16} /></Button>
          </div>

          {/* Action Buttons */}
          {isCurrentWeek && !readOnly && (
            <div className="flex items-center gap-2 mt-3 md:mt-0">
              <Button variant="ghost" onClick={handleSave} className="gap-2 text-surface-muted border border-surface-border hover:bg-surface-card2">
                <Save size={14} /> Guardar Cambios
              </Button>
              <Button
                variant="primary"
                onClick={() => toast.show('Informe aprobado/generado!', 'success')}
                className="bg-brand-orange hover:bg-brand-orange/90 gap-2 text-white font-semibold"
              >
                <CheckCircle2 size={16} /> {(reportDraft?.status || 'PENDIENTE') === 'ADELANTE' ? 'APROBAR INFORME' : 'GENERAR INFORME'}
              </Button>
            </div>
          )}
        </div>
      </div>

      {isApiLoading ? (
        <div className="text-white p-4 text-center animate-pulse">Cargando informe clínico...</div>
      ) : apiError ? (
        <div className="text-red-400 p-4 text-center font-mono">Error al cargar el informe clínico: {(apiError as any)?.message || 'Error'}</div>
      ) : !reportDraft ? (
        <div className="text-white p-4 text-center">No hay informe clínico disponible para esta semana.</div>
      ) : (
        <>
          {/* Alerta de Dolor Activa Section */}
      {reportDraft.painAlertActive && isCurrentWeek && (
        <div className="border border-brand-red p-4 rounded-xl bg-brand-red/10 flex items-start gap-4">
          <div className="w-6 h-6 bg-brand-red rounded-full flex-shrink-0 flex items-center justify-center mt-1">
            <AlertCircle size={16} className="text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-brand-red text-sm mb-2">Alerta de dolor activa</h3>
            <textarea
              rows={2}
              value={reportDraft.painAlert} // Using reportDraft.painAlert
              onChange={(e) => updateReportField('painAlert', e.target.value)}
              className="bg-surface-card2 border border-surface-border text-white text-xs px-3 py-2 rounded-xl focus:border-brand-orange outline-none w-full resize-y"
              disabled={readOnly || !isCurrentWeek}
            />
            <p className="text-brand-red text-xs mt-2">{reportDraft.painAlertFooter}</p>
          </div>
        </div>
      )}

      {/* Próxima Semana Section */}
      <div className="flex flex-col md:flex-row items-start border border-surface-border rounded-xl p-4 gap-4 bg-surface-card2">
        <p className="font-bold text-surface-muted flex-shrink-0 text-sm mt-1">Próxima semana:</p>
        <textarea
          rows={1}
          value={reportDraft.nextWeekPlan}
          onChange={(e) => updateNextWeekPlan(e.target.value)}
          className="bg-transparent border-none text-white text-sm px-0 py-0 focus:outline-none w-full resize-y"
          disabled={!isCurrentWeek}
        />
      </div>




      {/* Block 1: ÍNDICE DE BIENESTAR Section (full width) */}
      <div className="card-base bg-surface-card rounded-xl p-4 flex flex-col md:flex-row items-center">
        {/* Left Part (Overall Score) */}
        <div className="w-full md:w-1/3 flex flex-col items-center justify-center p-4 md:border-r md:border-surface-border md:pr-6">
          <h3 className="text-xs font-semibold text-surface-muted uppercase mb-2">ÍNDICE DE BIENESTAR</h3>
          <div className="flex items-baseline gap-1">
            <span className="text-6xl font-extrabold text-brand-orange">{reportDraft.wellnessIndex.overallScore}</span>
            <span className="text-surface-muted text-lg">/ 100</span>
          </div>
          <p className="text-brand-green font-bold text-sm mt-1">Buen estado</p>
          <p className="text-surface-muted text-xs mt-0.5">+{reportDraft.wellnessIndex.deltaVsLastWeek} vs sem. anterior</p>
          <p className="text-surface-muted text-xs mt-1">Mejor semana: {reportDraft.wellnessIndex.bestWeekScore} ({reportDraft.wellnessIndex.bestWeekLabel})</p>
        </div>
        
        {/* Right Part (Factors Table) */}
        <div className="w-full md:w-2/3 flex-grow p-4 md:pl-6 space-y-3">
          {reportDraft.wellnessIndex.factors.map((factor) => (
            <div key={factor.label} className="flex items-center gap-3">
              <span className="text-xs text-surface-muted w-28 flex-shrink-0 uppercase tracking-wider">{factor.label}</span>
              <div className="relative flex-1 bg-surface-card2 rounded-full h-2.5">
                <div
                  className={cn(
                    'absolute h-full rounded-full',
                    factor.color === 'brand-orange' ? 'bg-brand-orange' :
                    factor.color === 'brand-blue' ? 'bg-brand-blue' :
                    factor.color === 'brand-red' ? 'bg-brand-red' :
                    factor.color === 'brand-green' ? 'bg-brand-green' : 'bg-brand-purple'
                  )}
                  style={{ width: `${factor.score}%` }}
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-extrabold text-white leading-none">
                  {factor.score} ({factor.delta > 0 ? '+' : ''}{factor.delta})
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Block 2: EVOLUCIÓN Y COMPOSICIÓN Section (side-by-side charts) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart 1: WeightCompositionChart (Left Column) */}
        <WeightCompositionChart />
        {/* Chart 2: WellnessIndexChart (Right Column) */}
        <WellnessIndexChart />
      </div>




      {/* Datos Clínicos Detallados Section */}
      <div className="card-base p-4 bg-surface-card rounded-xl">
        {/* Sub-Tabs Navigation */}
        <div className="flex border-b border-surface-border mb-4">
          <button
            className={`py-2 px-4 text-sm font-medium ${activeSubTab === 'composition' ? 'text-white border-b-2 border-brand-orange' : 'text-surface-muted'}`}
            onClick={() => setActiveSubTab('composition')}
          >
            Composición - Actividad
          </button>
          <button
            className={`py-2 px-4 text-sm font-medium ${activeSubTab === 'pain' ? 'text-white border-b-2 border-brand-orange' : 'text-surface-muted'}`}
            onClick={() => setActiveSubTab('pain')}
          >
            Registro de Dolor
          </button>
          <button
            className={`py-2 px-4 text-sm font-medium ${activeSubTab === 'evolution' ? 'text-white border-b-2 border-brand-orange' : 'text-surface-muted'}`}
            onClick={() => setActiveSubTab('evolution')}
          >
            Evolución 8 Semanas
          </button>
        </div>

        {/* Sub-Tab Content */}
        <div>
          {activeSubTab === 'composition' && (
            <div>
              <table className="w-full text-left table-auto">
                <thead>
                  <tr className="text-surface-muted text-xs uppercase bg-surface-card2">
                    <th className="py-2 px-3 rounded-tl-lg">Métrica</th>
                    <th className="py-2 px-3">Target</th>
                    <th className="py-2 px-3">S-1</th>
                    <th className="py-2 px-3">S-4</th>
                    <th className="py-2 px-3 rounded-tr-lg">Actual</th>
                  </tr>
                </thead>
                <tbody>
                   {reportDraft.compositionActivity.rows.map((row, index: number) => (
                    <tr key={row.metric} className="border-t border-surface-border text-white text-sm">
                      <td className="py-2 px-3">{row.label}</td>
                      <td className="py-2 px-3">{row.target}</td>
                      <td className="py-2 px-3">{row.S_1}</td>
                      <td className="py-2 px-3">{row.S_4}</td>
                      <td className="py-2 px-3">
                        {isCurrentWeek ? (
                          <input
                            type="text"
                            value={row.actual}
                            onChange={(e) => updateCompositionActivityRow(index, e.target.value)}
                            className="bg-surface-card2 border border-surface-border text-white px-2 py-1 text-xs rounded-lg w-20 focus:border-brand-orange outline-none"
                          />
                        ) : (
                          row.actual
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <label className="text-surface-muted text-xs mt-4 block mb-1">Comentario Sección Composición</label>
              <textarea
                rows={2}
                className="w-full bg-surface-card2 border border-surface-border text-white text-xs px-3 py-2 rounded-xl focus:border-brand-orange outline-none resize-none"
                value={reportDraft.compositionActivity.comment}
                onChange={(e) => updateCompositionActivityComment(e.target.value)}
                disabled={readOnly || !isCurrentWeek}
              />
            </div>
          )}

          {activeSubTab === 'pain' && (
            <div>
              <table className="w-full text-left table-auto">
                <thead>
                  <tr className="text-surface-muted text-xs uppercase bg-surface-card2">
                    <th className="py-2 px-3 rounded-tl-lg">Sesión</th>
                    <th className="py-2 px-3">Zona de Dolor</th>
                    <th className="py-2 px-3 rounded-tr-lg">Nivel de Dolor</th>
                  </tr>
                </thead>
                <tbody>
                  {reportDraft.painLog.rows.map((entry) => (
                    <tr key={entry.id} className="border-t border-surface-border text-white text-sm">
                      <td className="py-2 px-3">{entry.id}</td>
                      <td className="py-2 px-3">
                        {isCurrentWeek ? (
                          <input
                            type="text"
                            value={entry.zone}
                            onChange={(e) => updatePainLogEntry(entry.id, 'zone', e.target.value)}
                            className="bg-surface-card2 border border-surface-border text-white px-2 py-1 text-xs rounded-lg w-32 focus:border-brand-orange outline-none"
                          />
                        ) : (
                          entry.zone
                        )}
                      </td>
                      <td className="py-2 px-3">
                        {isCurrentWeek ? (
                          <select
                            value={entry.intensity}
                            onChange={(e) => updatePainLogEntry(entry.id, 'intensity', e.target.value)}
                            className="bg-surface-card2 border border-surface-border text-white px-2 py-1 text-xs rounded-lg w-20 focus:border-brand-orange outline-none"
                          >
                            <option value="—">—</option>
                            {Array.from({ length: 10 }, (_, i) => i + 1).map((level) => (
                              <option key={level} value={`${level}/10`}>
                                {level}/10
                              </option>
                            ))}
                          </select>
                        ) : (
                          entry.intensity
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <label className="text-surface-muted text-xs mt-4 block mb-1">Comentario Sección Dolor</label>
              <textarea
                className="bg-surface-card2 border border-surface-border text-white text-xs px-3 py-2 rounded-xl focus:border-brand-orange outline-none w-full resize-y h-20"
                value={reportDraft.painLog.comment}
                onChange={(e) => updatePainLogComment(e.target.value)}
                disabled={readOnly || !isCurrentWeek}
              />
            </div>
          )}

          {activeSubTab === 'evolution' && (
            <div>
              <table className="w-full text-left table-auto">
                <thead>
                  <tr className="text-surface-muted text-xs uppercase bg-surface-card2">
                    <th className="py-2 px-3 rounded-tl-lg">Semana</th>
                    <th className="py-2 px-3">Peso</th>
                    <th className="py-2 px-3">Músculo %</th>
                    <th className="py-2 px-3">Grasa %</th>
                    <th className="py-2 px-3 rounded-tr-lg">Nota/Hito</th>
                  </tr>
                </thead>
                <tbody>
                  {reportDraft.evolution8Weeks.rows.map((row, index) => (
                    <tr key={row.weekLabel} className="border-t border-surface-border text-white text-sm">
                      <td className="py-2 px-3">{row.weekLabel}</td>
                      <td className="py-2 px-3">{row.weight}</td>
                      <td className="py-2 px-3">{row.musclePct}</td>
                      <td className="py-2 px-3">{row.fatPct}</td>
                      <td className="py-2 px-3">
                        {row.weekLabel === 'S12' && isCurrentWeek ? (
                          <input
                            type="text"
                            value={row.note}
                            onChange={(e) => updateEvolution8WeeksRow(index, e.target.value)}
                            className="bg-surface-card2 border border-surface-border text-white px-2 py-1 text-xs rounded-lg w-32 focus:border-brand-orange outline-none"
                          />
                        ) : (
                          row.note
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <label className="text-surface-muted text-xs mt-4 block mb-1">Comentario Sección Evolución</label>
              <textarea
                className="bg-surface-card2 border border-surface-border text-white text-xs px-3 py-2 rounded-xl focus:border-brand-orange outline-none w-full resize-y h-20"
                value={reportDraft.evolution8Weeks.comment}
                onChange={(e) => updateEvolution8WeeksComment(e.target.value)}
                disabled={readOnly || !isCurrentWeek}
              />
            </div>
          )}
        </div>
      </div>

      {/* Observaciones General (Plan Elite) */}
      <div className="flex border border-surface-border rounded-xl bg-surface-card">
        <div className="w-1 bg-brand-orange rounded-l-xl flex-shrink-0" /> {/* Orange border */}
        <div className="p-4 flex-1">
          <label className="text-surface-muted text-xs uppercase block mb-2 font-semibold">Observaciones General</label>
          <textarea
            rows={2}
            className="w-full bg-surface-card2 border border-surface-border text-white text-xs px-3 py-2 rounded-xl focus:border-brand-orange outline-none resize-none"
            value={reportDraft.generalObservations}
            onChange={(e) => updateGeneralObservations(e.target.value)}
            disabled={!isCurrentWeek}
          />
        </div>
      </div>
    </>
  )}
    </div>
  );
};
