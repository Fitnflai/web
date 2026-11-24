import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight, Save, CheckCircle2, FileText, Share2, AlertCircle, Edit2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { usersService } from '@/services/endpoints/users';
import { usePlanWeekNavigation } from '@/hooks/usePlanWeekNavigation';
// Assuming User is exported now, or defining locally if not. Let's try defining locally to avoid external type issues for now.
import { WeeklyClinicalReport, CompositionActivitySection, PainLogSection, EvolutionSection } from '../../core/domain/types';
import { MockBiometricRepository } from '../../core/repositories/mocks/MockBiometricRepository';
import { toast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils';
import { useAppStore } from '@/store/useAppStore';

const formatDateISO = (d: Date): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getWeekDates = (offsetWeeks: number): Date[] => {
  const current = new Date(); // Real current date
  const day = current.getDay();
  const diff = current.getDate() - day + (day === 0 ? -6 : 1); // Start on Monday
  const monday = new Date(current.setDate(diff));
  monday.setDate(monday.getDate() + offsetWeeks * 7);

  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d);
  }
  return dates;
};


const formatDateFriendly = (d: Date): string => {
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
};

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
  composicion_actividad?: {
    porcentaje_masa_corporal?: number;
    peso_kg?: number;
    agua?: number;
    porcentaje_grasa?: number;
    musculo_esqueletico?: number;
    tasa_metabolica_reposo?: number;
    edad_corporal?: number;
  };
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

const createFallbackClinicalReport = (weekNum: number, patient: any): EnrichedWeeklyClinicalReport => {
  const currentWeekNum = weekNum;

  const compositionActivityRows = [
    { metric: 'BodyMassIndex', label: '% masa corporal', target: '22.0%', actual: `${(23.2 - (weekNum - 1) * 0.1).toFixed(1)}%`, S_1: '23.3%', S_2: '23.5%', S_4: '24.0%' },
    { metric: 'Weight', label: 'Peso', target: '70.0kg', actual: `${(75 - (weekNum - 1) * 0.5).toFixed(1)}kg`, S_1: '75.0kg', S_2: '75.5kg', S_4: '76.0kg' },
    { metric: 'Water', label: 'Agua', target: '60.0%', actual: `${(58.0 + (weekNum - 1) * 0.2).toFixed(1)}%`, S_1: '57.8%', S_2: '57.2%', S_4: '56.5%' },
    { metric: 'BodyFatPct', label: '% de grasa corporal', target: '15.0%', actual: `${(18.5 - (weekNum - 1) * 0.2).toFixed(1)}%`, S_1: '18.7%', S_2: '19.0%', S_4: '19.5%' },
    { metric: 'SkeletalMuscle', label: 'Músculo esquelético', target: '35.0kg', actual: `${(33.5 + (weekNum - 1) * 0.1).toFixed(1)}kg`, S_1: '33.4kg', S_2: '33.1kg', S_4: '32.8kg' },
    { metric: 'BasalMetabolicRate', label: 'Tasa metabolica en reposo', target: '1650 kcal', actual: `${1680 - (weekNum - 1) * 5} kcal`, S_1: '1675 kcal', S_2: '1665 kcal', S_4: '1650 kcal' },
    { metric: 'BodyAge', label: 'Edad corporal', target: '28 años', actual: `${29 + (weekNum > 1 ? 1 : 0)} años`, S_1: '30 años', S_2: '30 años', S_4: '31 años' },
  ];

  const painLogRows = weekNum === 2 ? [{ id: 'pain-1', zone: 'Rodilla derecha', intensity: '2/10' }] : [];

  const evolution8WeeksRows = Array.from({ length: 8 }, (_, i) => {
    const weekLabel = `S${Math.max(1, currentWeekNum - (7 - i))}`;
    const weight = (76 - (7 - i) * 0.2).toFixed(1);
    const musclePct = (22 + (7 - i) * 0.1).toFixed(1);
    const fatPct = (9 - (7 - i) * 0.05).toFixed(1);
    return {
      weekLabel,
      weight: `${weight}kg`,
      musclePct: `${musclePct}%`,
      fatPct: `${fatPct}%`,
      note: (i === 7) ? 'Excelente semana de entrenamiento!' : '',
    };
  });

  const weightCompositionChartLabels = evolution8WeeksRows.map(row => row.weekLabel);
  const muscleData = evolution8WeeksRows.map(row => parseFloat(row.musclePct.replace('%', '')));
  const fatData = evolution8WeeksRows.map(row => parseFloat(row.fatPct.replace('%', '')));
  const totalWeightData = evolution8WeeksRows.map(row => parseFloat(row.weight.replace('kg', '')));

  const wellnessScores = Array.from({ length: 8 }, (_, i) => 65 + (i * 2));
  const maxWellnessScore = Math.max(...wellnessScores);
  const peakWeekIndex = wellnessScores.indexOf(maxWellnessScore);
  const peakWeekLabel = weightCompositionChartLabels[peakWeekIndex] || '';

  return {
    weekOffset: 0,
    label: `Semana ${currentWeekNum}`,
    status: 'ADELANTE',
    painAlert: weekNum === 2 ? 'Paciente reporta leve molestia en rodilla derecha. Monitorear.' : 'No hay alertas.',
    nextWeekPlan: 'Mantener la rutina actual y ajustar la hidratación. Enfocarse en la recuperación activa.',
    compositionActivity: {
      rows: compositionActivityRows,
      comment: 'Revisar detalles de composición y actividad con el paciente.',
    },
    painLog: {
      rows: painLogRows,
      comment: weekNum === 2 ? 'Seguimiento de la molestia en rodilla. Reducir carga de impacto.' : '',
    },
    evolution8Weeks: {
      rows: evolution8WeeksRows,
      comment: 'Progreso constante en peso y composición. Nivel de bienestar estable.',
    },
    generalObservations: 'El paciente ha mostrado un compromiso excelente y una mejora significativa en todos los indicadores clave.',
    patientName: patient.nombre || 'Nombre del Paciente',
    discipline: patient.nombre_disciplina || 'Disciplina Deportiva',
    planType: `Pro · Semana ${currentWeekNum}`,
    altitude: `${patient.altitud || 0} msnm`,
    objective: patient.objetivo_principal || 'Mejorar rendimiento',
    metrics: [{ label: 'VO2 Máx', value: '45.0 ml/kg/min' }],
    painAlertActive: painLogRows.length > 0,
    painAlertFooter: '→ Monitorear intensidad. Considerar derivación si el dolor persiste o aumenta.',
    wellnessIndex: {
      overallScore: wellnessScores[wellnessScores.length - 1],
      deltaVsLastWeek: 2,
      bestWeekScore: maxWellnessScore,
      bestWeekLabel: peakWeekLabel,
      factors: [
        { label: 'Peso y composición', score: 75, delta: 2, color: 'brand-orange' },
        { label: 'Hidratación', score: 60, delta: 1, color: 'brand-blue' },
        { label: 'Carga muscular', score: 80, delta: 3, color: 'brand-purple' },
        { label: 'Movimiento', score: 70, delta: 0, color: 'brand-green' },
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



const adaptApiClinicalReport = (apiData: any, weekNum: number, patient: any): EnrichedWeeklyClinicalReport => {
  const p_comp = apiData.detalle_factor_peso_composicion;
  const hyd = apiData.detalle_factor_hidratacion;
  const m_load = apiData.detalle_factor_carga_muscular;
  const mov = apiData.detalle_factor_movimiento;
  const ca = apiData.composicion_actividad;

  const compositionActivityRows = [
    {
      metric: 'BodyMassIndex',
      label: '% masa corporal',
      target: '22.0%',
      S_1: p_comp?.variacion !== undefined ? `${p_comp.variacion}%` : '23.3%',
      S_2: '23.5%',
      S_4: '24.0%',
      actual: ca?.porcentaje_masa_corporal != null
        ? `${ca.porcentaje_masa_corporal}%`
        : (p_comp?.puntaje?.puntaje !== undefined ? `${p_comp.puntaje.puntaje}%` : '23.2%'),
    },
    {
      metric: 'Weight',
      label: 'Peso',
      target: '70.0kg',
      S_1: apiData.historial_semanal_composicion_reporte?.[1]?.peso ? `${apiData.historial_semanal_composicion_reporte[1].peso}kg` : '75.0kg',
      S_2: apiData.historial_semanal_composicion_reporte?.[2]?.peso ? `${apiData.historial_semanal_composicion_reporte[2].peso}kg` : '75.5kg',
      S_4: apiData.historial_semanal_composicion_reporte?.[4]?.peso ? `${apiData.historial_semanal_composicion_reporte[4].peso}kg` : '76.0kg',
      actual: ca?.peso_kg != null
        ? `${ca.peso_kg}kg`
        : (apiData.historial_semanal_composicion_reporte?.[0]?.peso ? `${apiData.historial_semanal_composicion_reporte[0].peso}kg` : (patient?.peso ? `${patient.peso}kg` : '75.0kg')),
    },
    {
      metric: 'Water',
      label: 'Agua',
      target: hyd?.puntaje?.requerimiento_total_ml ? `${(hyd.puntaje.requerimiento_total_ml / 1000).toFixed(1)}L` : '60.0%',
      S_1: hyd?.variacion !== undefined ? `Score ${hyd.variacion}` : '57.8%',
      S_2: '57.2%',
      S_4: '56.5%',
      actual: ca?.agua != null
        ? `${ca.agua}%`
        : (hyd?.puntaje?.consumo_total_ml ? `${(hyd.puntaje.consumo_total_ml / 1000).toFixed(1)}L` : '58.0%'),
    },
    {
      metric: 'BodyFatPct',
      label: '% de grasa corporal',
      target: '15.0%',
      S_1: apiData.historial_semanal_composicion_reporte?.[1]?.grasa ? `${apiData.historial_semanal_composicion_reporte[1].grasa}%` : '18.7%',
      S_2: apiData.historial_semanal_composicion_reporte?.[2]?.grasa ? `${apiData.historial_semanal_composicion_reporte[2].grasa}%` : '19.0%',
      S_4: apiData.historial_semanal_composicion_reporte?.[4]?.grasa ? `${apiData.historial_semanal_composicion_reporte[4].grasa}%` : '19.5%',
      actual: ca?.porcentaje_grasa != null
        ? `${ca.porcentaje_grasa}%`
        : (apiData.historial_semanal_composicion_reporte?.[0]?.grasa ? `${apiData.historial_semanal_composicion_reporte[0].grasa}%` : '18.5%'),
    },
    {
      metric: 'SkeletalMuscle',
      label: 'Músculo esquelético',
      target: '35.0kg',
      S_1: apiData.historial_semanal_composicion_reporte?.[1]?.musculo ? `${apiData.historial_semanal_composicion_reporte[1].musculo}%` : '33.4kg',
      S_2: apiData.historial_semanal_composicion_reporte?.[2]?.musculo ? `${apiData.historial_semanal_composicion_reporte[2].musculo}%` : '33.1kg',
      S_4: apiData.historial_semanal_composicion_reporte?.[4]?.musculo ? `${apiData.historial_semanal_composicion_reporte[4].musculo}%` : '32.8kg',
      actual: ca?.musculo_esqueletico != null
        ? (typeof ca.musculo_esqueletico === 'string' && (ca.musculo_esqueletico.includes('%') || ca.musculo_esqueletico.includes('kg'))
            ? ca.musculo_esqueletico
            : `${ca.musculo_esqueletico}%`)
        : (apiData.historial_semanal_composicion_reporte?.[0]?.musculo ? `${apiData.historial_semanal_composicion_reporte[0].musculo}%` : '33.5kg'),
    },
    {
      metric: 'BasalMetabolicRate',
      label: 'Tasa metabolica en reposo',
      target: '1650 kcal',
      S_1: '1675 kcal',
      S_2: '1665 kcal',
      S_4: '1650 kcal',
      actual: ca?.tasa_metabolica_reposo != null
        ? `${ca.tasa_metabolica_reposo} kcal`
        : '1680 kcal',
    },
    {
      metric: 'BodyAge',
      label: 'Edad corporal',
      target: '28 años',
      S_1: '30 años',
      S_2: '30 años',
      S_4: '31 años',
      actual: ca?.edad_corporal != null
        ? `${ca.edad_corporal} años`
        : '29 años',
    },
  ];

  const painLogRows = apiData.historial_dolores?.map((pain: any, index: number) => ({
    id: pain.id || `pain-${index}`,
    zone: pain.zona || pain.detalle || 'Dolor reportado',
    intensity: pain.intensidad || '—',
  })) || [];

  const weightRow = compositionActivityRows.find(r => r.metric === 'Weight');
  const muscleRow = compositionActivityRows.find(r => r.metric === 'SkeletalMuscle');
  const fatRow = compositionActivityRows.find(r => r.metric === 'BodyFatPct');

  const parseMetricVal = (str?: string, fallback = 0): number => {
    if (!str) return fallback;
    const num = parseFloat(str.replace(/[^\d.-]/g, ''));
    return isNaN(num) ? fallback : num;
  };

  const actualWeight = parseMetricVal(weightRow?.actual, patient?.peso ? Number(patient.peso) : 70);
  const s1Weight = parseMetricVal(weightRow?.S_1, 75);
  const s2Weight = parseMetricVal(weightRow?.S_2, 75.5);
  const s4Weight = parseMetricVal(weightRow?.S_4, 76);

  const actualMuscle = parseMetricVal(muscleRow?.actual, 33.5);
  const s1Muscle = parseMetricVal(muscleRow?.S_1, 33.4);
  const s2Muscle = parseMetricVal(muscleRow?.S_2, 33.1);
  const s4Muscle = parseMetricVal(muscleRow?.S_4, 32.8);

  const actualFat = parseMetricVal(fatRow?.actual, 18.5);
  const s1Fat = parseMetricVal(fatRow?.S_1, 18.7);
  const s2Fat = parseMetricVal(fatRow?.S_2, 19.0);
  const s4Fat = parseMetricVal(fatRow?.S_4, 19.5);

  const rawCompHistory = (
    apiData.historial_semanal_composicion_reporte ||
    apiData.historial_composicion ||
    apiData.evolucion_composicion ||
    []
  ).slice().sort((a: any, b: any) => {
    const semA = a.semana ?? a.semana_numero ?? a.semana_actual ?? 0;
    const semB = b.semana ?? b.semana_numero ?? b.semana_actual ?? 0;
    return semA - semB;
  });

  const rawWellnessList = (
    apiData.evolucion_indice_bienestar ||
    apiData.historial_bienestar_semanal_reporte ||
    apiData.historial_bienestar ||
    apiData.evolucion_bienestar ||
    []
  ).slice().sort((a: any, b: any) => {
    const semA = a.semana_actual ?? a.semana ?? a.semana_numero ?? 0;
    const semB = b.semana_actual ?? b.semana ?? b.semana_numero ?? 0;
    return semA - semB;
  });

  // Calculate the sequence of weeks to display in the evolution charts (from Week 1 up to weekNum, up to max 8 weeks)
  const totalWeeks = Math.max(1, weekNum);
  const startWeek = totalWeeks > 8 ? totalWeeks - 7 : 1;
  const numWeeksToShow = totalWeeks - startWeek + 1;

  const weekSequence = Array.from({ length: numWeeksToShow }, (_, i) => startWeek + i);

  const weightCompositionChartLabels: string[] = [];
  const muscleData: number[] = [];
  const fatData: number[] = [];
  const totalWeightData: number[] = [];
  const wellnessIndexChartLabels: string[] = [];
  const wellnessScores: number[] = [];

  weekSequence.forEach((w) => {
    const label = `S${w}`;
    weightCompositionChartLabels.push(label);
    wellnessIndexChartLabels.push(label);

    const compItem = rawCompHistory.find((item: any) => (item.semana ?? item.semana_numero ?? item.semana_actual) === w);
    const wellItem = rawWellnessList.find((item: any) => (item.semana_actual ?? item.semana ?? item.semana_numero) === w);

    let weight = 0;
    let muscle = 0;
    let fat = 0;
    let score = 0;

    if (compItem) {
      weight = Number(compItem.peso ?? 0);
      muscle = Number(compItem.musculo ?? compItem.musculo_pct ?? 0);
      fat = Number(compItem.grasa ?? compItem.grasa_pct ?? 0);
    } else {
      if (w === weekNum) {
        weight = actualWeight;
        muscle = actualMuscle;
        fat = actualFat;
      } else if (w === weekNum - 1) {
        weight = s1Weight;
        muscle = s1Muscle;
        fat = s1Fat;
      } else if (w === weekNum - 2) {
        weight = s2Weight;
        muscle = s2Muscle;
        fat = s2Fat;
      } else {
        weight = s4Weight;
        muscle = s4Muscle;
        fat = s4Fat;
      }
    }

    if (wellItem) {
      score = Number(wellItem.puntaje ?? wellItem.score ?? wellItem.valor ?? 0);
    } else {
      if (w === weekNum) {
        score = Number(apiData.indice_bienestar ?? 70);
      } else {
        const baseScore = Number(apiData.indice_bienestar ?? 70);
        score = Math.max(45, Math.min(95, Math.round(baseScore - (weekNum - w) * 2)));
      }
    }

    totalWeightData.push(weight);
    muscleData.push(muscle);
    fatData.push(fat);
    wellnessScores.push(score);
  });

  const evolution8WeeksRows = weekSequence.map((w, i) => ({
    weekLabel: `S${w}`,
    weight: `${totalWeightData[i]}kg`,
    musclePct: `${muscleData[i]}%`,
    fatPct: `${fatData[i]}%`,
    note: w === weekNum ? 'Semana actual en curso' : '',
  }));

  const maxWellnessScore = wellnessScores.length > 0 ? Math.max(...wellnessScores) : 0;
  const peakWeekIndex = wellnessScores.indexOf(maxWellnessScore);
  const peakWeekLabel = wellnessIndexChartLabels[peakWeekIndex] || '';

  return {
    weekOffset: 0,
    label: apiData.semana_info || `Semana ${weekNum}`,
    status: apiData.indice_bienestar >= 70 ? 'ADELANTE' : 'ADELANTE CON AJUSTE',
    painAlert: apiData.alertas?.detalle || 'No hay alertas.',
    nextWeekPlan: '',
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
    generalObservations: apiData.mensaje_ia || '',
    patientName: patient.nombre,
    discipline: patient.nombre_disciplina,
    planType: `Pro · Semana ${weekNum}`,
    altitude: `${patient.altitud} msnm`,
    objective: patient.objective_principal || patient.objetivo_principal,
    metrics: [{ label: 'VO2 Máx', value: '46.6 ml/kg/min' }],
    painAlertActive: apiData.alertas?.activa || false,
    painAlertFooter: '→ Monitorear intensidad. Considerar derivación si el dolor persiste o aumenta.',
    wellnessIndex: {
      overallScore: apiData.indice_bienestar || 0,
      deltaVsLastWeek: 0,
      bestWeekScore: maxWellnessScore,
      bestWeekLabel: peakWeekLabel,
      factors: [
        ...(p_comp ? [{ label: p_comp?.puntaje?.tag || 'Peso y composición', score: p_comp?.puntaje?.puntaje ?? 0, delta: p_comp?.variacion ?? 0, color: 'brand-orange' }] : []),
        ...(hyd ? [{ label: 'Hidratación', score: hyd?.puntaje?.score_hidratacion ?? 0, delta: hyd?.variacion ?? 0, color: 'brand-blue' }] : []),
        ...(m_load ? [{ label: 'Carga muscular', score: m_load?.puntaje ?? 0, delta: m_load?.variacion ?? 0, color: 'brand-purple' }] : []),
        ...(mov ? [{ label: 'Movimiento', score: mov?.puntaje ?? 0, delta: mov?.variacion ?? 0, color: 'brand-green' }] : []),
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
  patient?: any;
}

const biometricRepository = new MockBiometricRepository();

export const ClinicalReportTab: React.FC<ClinicalReportTabProps> = ({ patientId, readOnly = false, patient: patientProp }) => {
  const selectedPatient = useAppStore(state => state.selectedPatient);
  const selectedUser = useAppStore(state => state.selectedUser);

  const patient = useMemo(() => patientProp || selectedPatient || selectedUser || {
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
  } as any, [patientProp, selectedPatient, selectedUser]);

  const {
    selectedWeek,
    currentWeekNumber,
    canGoPrev,
    canGoNext,
    goToPrevWeek,
    goToNextWeek,
    weekDates,
    startDate,
    endDate,
    planStartDate,
    formattedDateRange,
    formatDateFriendly,
    getWeekRange,
  } = usePlanWeekNavigation({
    userId: patientId,
    patient,
    allowFuture: false, // In Clinical Report, cannot navigate beyond current week
  });

  const [activeSubTab, setActiveSubTab] = useState<'composition' | 'pain' | 'evolution'>('composition');
  const [reportDraft, setReportDraft] = useState<EnrichedWeeklyClinicalReport | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const generalObsRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (generalObsRef.current) {
      generalObsRef.current.style.height = 'auto';
      generalObsRef.current.style.height = `${generalObsRef.current.scrollHeight}px`;
    }
  }, [reportDraft?.generalObservations]);

  useEffect(() => {
    setIsEditing(false);
  }, [selectedWeek]);

  const handleGenerateReport = () => {
    try {
      const generatedReport = createFallbackClinicalReport(selectedWeek, patient);
      setReportDraft(generatedReport);
      setIsEditing(true);
    } catch (error) {
      console.error('Failed to generate fallback report:', error);
      toast.show('Error al generar el informe clínico.', 'error');
    }
  };

  const isMockPatient = !patientId || patientId.startsWith('uid-') || patientId.startsWith('pro-') || patientId.startsWith('esp-') || patientId.length < 10 || patientId.startsWith('uid-mock-');

  const { data: apiClinicalData, isLoading: isApiLoading, error: apiError, isError: isApiError } = useQuery({
    queryKey: ['clinicalReport', patientId, planStartDate],
    queryFn: () => usersService.getUserTabDetalle(patientId, 'reporte_clinico', planStartDate),
    enabled: !isMockPatient && !!patientId,
  });

  const is404Error = !isMockPatient && isApiError && (
    (apiError as any)?.response?.status === 404 || 
    apiError?.message?.includes('404')
  );

  useEffect(() => {
    setReportDraft(null);
    setIsEditing(false);
  }, [selectedWeek, patientId]);

  useEffect(() => {
    const fetchAndEnrichReport = async () => {
      if (!patientId) {
        setReportDraft(null);
        toast.show('No hay paciente seleccionado.', 'error');
        return;
      }

      if (isMockPatient) {
        try {
          const fetchedReport: EnrichedWeeklyClinicalReport = createFallbackClinicalReport(selectedWeek, patient);
          setReportDraft(fetchedReport);
        } catch (error) {
          console.error('Failed to fetch clinical report:', error);
          setReportDraft(null);
          toast.show('Error al cargar el informe clínico.', 'error');
        }
      } else { // Not a mock patient, use API data
        if (apiClinicalData) {
          try {
            const enrichedReport = adaptApiClinicalReport(apiClinicalData as any, selectedWeek, patient);
            setReportDraft(enrichedReport);
          } catch (error) {
            console.error('Failed to adapt API clinical report:', error);
            setReportDraft(null);
            toast.show('Error al procesar el informe clínico del servidor.', 'error');
          }
        } else if (apiError) {
          console.error('Failed to fetch API clinical report:', apiError);
          setReportDraft(null);
          if (!is404Error) {
            toast.show('Error al cargar el informe clínico del servidor.', 'error');
          }
        }
      }
    };

    // Only run this effect if not using React Query for API data, or if API data changed
    if (isMockPatient || (!isApiLoading && !apiError && !!apiClinicalData)) {
        fetchAndEnrichReport();
    } else if (!isMockPatient && !patientId) {
        setReportDraft(null);
    }
  }, [patient, isMockPatient, apiClinicalData, isApiLoading, apiError, isApiError, is404Error, selectedWeek]);

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
        setIsEditing(false);
      } catch (error) {
        console.error('Failed to save clinical report:', error);
        toast.show('Error al guardar los cambios.', 'error');
      }
    }
  };

  const isCurrentWeek = selectedWeek === currentWeekNumber;
  const w2Num = selectedWeek - 2;
  const w1Num = selectedWeek - 1;
  const w2Info = w2Num >= 1 ? getWeekRange(w2Num) : null;
  const w1Info = w1Num >= 1 ? getWeekRange(w1Num) : null;
  const actualInfo = getWeekRange(selectedWeek);


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

    const maxWeightVal = totalWeightData.length > 0 ? Math.max(...totalWeightData, 80) : 80;
    const maxWeight = Math.ceil(maxWeightVal / 20) * 20; // Round up to nearest 20
    const yScale = chartHeight / maxWeight;
    const barWidth = 14;
    const isSingleBar = labels.length === 1;
    const spacing = labels.length > 1 ? (chartWidth - labels.length * barWidth) / (labels.length - 1) : 0;

    const yAxisTicks = [0, Math.round(maxWeight * 0.2), Math.round(maxWeight * 0.4), Math.round(maxWeight * 0.6), Math.round(maxWeight * 0.8), maxWeight];

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
            const xPos = isSingleBar ? paddingLeft + chartWidth / 2 - barWidth / 2 : paddingLeft + i * (barWidth + spacing);
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
                {i > 0 && !isSingleBar && (
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

    const minY = 0;
    const maxY = 100;
    const scoreRange = maxY - minY; // 40 units
    const scoreScale = chartHeight / scoreRange; // Scale for vertical positioning (170px / 40 units)

    const isSinglePoint = labels.length === 1;
    const pointGap = labels.length > 1 ? chartWidth / (labels.length - 1) : 0;

    // Helper to get Y position from score value
    const getYPos = (score: number) => paddingTop + chartHeight - (score - minY) * scoreScale;

    const pointsD = scores.length > 1
      ? scores.map((score, i) => {
          const x = paddingLeft + i * pointGap;
          const y = getYPos(score);
          return `${i === 0 ? 'M' : 'L'}${x},${y}`;
        }).join(' ')
      : '';

    const areaD = scores.length > 1
      ? `M${paddingLeft},${paddingTop + chartHeight} ${pointsD.replace('M', 'L')} L${paddingLeft + (scores.length - 1) * pointGap},${paddingTop + chartHeight} Z`
      : '';

    const yAxisTicks = [0, 20, 40, 60, 80, 100];
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
          {areaD && <path d={areaD} fill="rgba(232, 98, 42, 0.08)" />}

          {/* Orange Line Curve */}
          {pointsD && <path d={pointsD} stroke="#E8622A" strokeWidth="3" fill="none" />}

          {/* Dashed Reference Line at 70 */}
          <line x1={paddingLeft} y1={getYPos(70)} x2={viewBoxWidth - paddingRight} y2={getYPos(70)} stroke="#718096" strokeDasharray="4 4" />
          <text x={paddingLeft + 15} y={getYPos(70) - 5} fill="#718096" fontSize="10">referencia 70</text>

          {/* Points and Labels */}
          {scores.map((score, i) => {
            const xPos = isSinglePoint ? paddingLeft + chartWidth / 2 : paddingLeft + i * pointGap;
            const yPos = getYPos(score);
            const isPeak = !isSinglePoint && i === peakIndex;
            const isS12 = !isSinglePoint && i === s12Index;

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

                {(isS12 || isSinglePoint) && !isPeak && ( // Node Label
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
            <span>Pro · Semana {selectedWeek}</span>
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
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPrevWeek}
              disabled={!canGoPrev}
              className={cn(!canGoPrev && "opacity-30 cursor-not-allowed")}
            >
              <ChevronLeft size={16} />
            </Button>
            <div className="flex flex-col items-center min-w-[120px] text-center">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                SEMANA {selectedWeek}
              </span>
              <span className="text-[9px] text-surface-muted mt-0.5">
                {formattedDateRange}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToNextWeek}
              disabled={!canGoNext}
              className={cn(!canGoNext && "opacity-30 cursor-not-allowed")}
            >
              <ChevronRight size={16} />
            </Button>
          </div>

          {/* Action Buttons */}
          {!readOnly && !!reportDraft && (
            <div className="flex items-center gap-2 mt-3 md:mt-0">
              {isEditing ? (
                <>
                  <Button variant="ghost" onClick={handleSave} className="gap-2 text-surface-muted border border-surface-border hover:bg-surface-card2">
                    <Save size={14} /> Guardar Cambios
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setIsEditing(false);
                      toast.show('Informe aprobado/generado!', 'success');
                    }}
                    className="bg-brand-orange hover:bg-brand-orange/90 gap-2 text-white font-semibold"
                  >
                    <CheckCircle2 size={16} /> {(reportDraft?.status || 'PENDIENTE') === 'ADELANTE' ? 'APROBAR INFORME' : 'GENERAR INFORME'}
                  </Button>
                </>
              ) : (
                <Button
                  variant="primary"
                  onClick={() => setIsEditing(true)}
                  className="bg-brand-orange hover:bg-brand-orange/90 gap-2 text-white font-semibold"
                >
                  <Edit2 size={16} /> EDITAR INFORME
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {isApiLoading ? (
        <div className="text-white p-4 text-center animate-pulse">Cargando informe clínico...</div>
      ) : !reportDraft ? (
        <div className="card-base p-10 bg-surface-card border border-surface-border rounded-xl text-center flex flex-col items-center justify-center min-h-[280px]">
          <span className="text-4xl mb-3">📋</span>
          <div className="text-[14px] font-bold text-white uppercase tracking-wide">Semana sin informe clínico</div>
          <p className="text-[12px] text-surface-muted max-w-[340px] mt-1.5 mb-5 leading-relaxed">
            No hay un informe clínico generado para la semana del <span className="font-bold text-white">{formatDateFriendly(weekDates[0])}</span> al <span className="font-bold text-white">{formatDateFriendly(weekDates[6])}</span>.
            {apiError && !is404Error && (
              <span className="block mt-2 font-mono text-[10px] text-red-400">
                Detalle técnico: {(apiError as any)?.message || 'Network Error'}
              </span>
            )}
          </p>
          {!readOnly && (
            <Button
              variant="primary"
              onClick={handleGenerateReport}
              className="gap-1.5 py-2 px-5 bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold"
            >
              ➕ Generar Informe
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Alerta de Dolor Activa Section */}
      {reportDraft.painAlertActive && (
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
              disabled={readOnly || !isEditing}
            />
            <p className="text-brand-red text-xs mt-2">{reportDraft.painAlertFooter}</p>
          </div>
        </div>
      )}

      {/* Próxima Semana Section */}
      <div className="flex flex-col md:flex-row items-start border border-surface-border rounded-xl p-4 gap-4 bg-surface-card2">
        <p className="font-bold text-surface-muted flex-shrink-0 text-sm mt-1">Alertas:</p>
        <textarea
          rows={1}
          value={reportDraft.painAlert}
          onChange={(e) => updateReportField('painAlert', e.target.value)}
          className="bg-transparent border-none text-white text-sm px-0 py-0 focus:outline-none w-full resize-y"
          disabled={!isEditing}
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
            {reportDraft.wellnessIndex.overallScore >= 75 ? (
              <p className="text-green-400 font-bold text-sm mt-1">Buen estado</p>
            ) : reportDraft.wellnessIndex.overallScore >= 50 ? (
              <p className="text-yellow-400 font-bold text-sm mt-1">Estado regular</p>
            ) : (
              <p className="text-red-400 font-bold text-sm mt-1">Requiere atención</p>
            )}
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
                    <th className="py-2 px-3">
                      <div>{w2Num >= 1 ? `Semana ${w2Num}` : '—'}</div>
                      <div className="text-[10px] font-normal text-surface-muted lowercase">
                        {w2Info ? w2Info.formattedRange : 'Sin datos'}
                      </div>
                    </th>
                    <th className="py-2 px-3">
                      <div>{w1Num >= 1 ? `Semana ${w1Num}` : '—'}</div>
                      <div className="text-[10px] font-normal text-surface-muted lowercase">
                        {w1Info ? w1Info.formattedRange : 'Sin datos'}
                      </div>
                    </th>
                    <th className="py-2 px-3 rounded-tr-lg">
                      <div>Semana {selectedWeek} {isCurrentWeek ? '(Actual)' : ''}</div>
                      <div className="text-[10px] font-normal text-surface-muted lowercase">
                        {actualInfo.formattedRange}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                   {reportDraft.compositionActivity.rows.map((row, index: number) => (
                    <tr key={row.metric} className="border-t border-surface-border text-white text-sm">
                      <td className="py-2 px-3">{row.label}</td>
                      <td className="py-2 px-3">{row.target}</td>
                      <td className="py-2 px-3">{w2Num >= 1 ? (row.S_2 || row.S_4 || '—') : '—'}</td>
                      <td className="py-2 px-3">{w1Num >= 1 ? (row.S_1 || '—') : '—'}</td>
                      <td className="py-2 px-3">
                        {isEditing ? (
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
                disabled={readOnly || !isEditing}
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
                        {isEditing ? (
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
                        {isEditing ? (
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
                disabled={readOnly || !isEditing}
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
                        {(row.weekLabel === 'S12' || index === 7) && isEditing ? (
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
                disabled={readOnly || !isEditing}
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
            ref={generalObsRef}
            rows={2}
            className="w-full bg-surface-card2 border border-surface-border text-white text-xs px-3 py-2 rounded-xl focus:border-brand-orange outline-none resize-none overflow-hidden"
            value={reportDraft.generalObservations}
            onChange={(e) => updateGeneralObservations(e.target.value)}
            disabled={!isEditing}
          />
        </div>
      </div>
    </>
  )}
    </div>
  );
};
