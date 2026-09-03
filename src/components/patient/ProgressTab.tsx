import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { MockBiometricRepository } from '../../core/repositories/mocks/MockBiometricRepository';
import { WeeklyProgressData } from '../../core/domain/types';
import { useQuery } from '@tanstack/react-query';
import { usersService } from '@/services/endpoints/users';

// Import all card components
import StatusBanner from './cards/StatusBanner';
import PainAlertCard from './cards/PainAlertCard';
import WellnessIndexCard from './cards/WellnessIndexCard';
import WeightTrendCard from './cards/WeightTrendCard';
import SecondaryMetricsGrid from './cards/SecondaryMetricsGrid';
import WeeklyInsightsGrid from './cards/WeeklyInsightsGrid';
import AIFeedbackCard from './cards/AIFeedbackCard';

import { toast } from '@/components/ui/Toast';

const createFallbackProgressData = (weekIndex: number): WeeklyProgressData => {
  const currentWeight = 75 - (weekIndex * 0.5); // Simulate weight loss
  const targetWeight = currentWeight - 5;
  const musclePct = 52 + (weekIndex * 0.2); // Simulate slight muscle gain
  const fatPct = 48 - (weekIndex * 0.2); // Simulate slight fat loss

  return {
    weekIndex: weekIndex,
    label: `Semana ${12 - weekIndex}`, // Assuming max 12 weeks, current week is 12, previous are 11, 10, etc.
    status: weekIndex === 0 ? 'Excelente Progreso' : 'Progreso Moderado',
    aiFeedback: `Este es un comentario de IA de respaldo para la semana ${12 - weekIndex}. Se recomienda revisar el progreso general.`,
    painAlerts: weekIndex === 1 ? [{ area: 'Rodilla', level: 2, description: 'Leve molestia en la rodilla derecha.' }] : [],
    wellnessIndex: {
      overallScore: 70 + (weekIndex % 2 === 0 ? 5 : -2),
      history8Weeks: Array.from({ length: 8 }, (_, i) => ({
        weekLabel: `Sem ${12 - (weekIndex + 7 - i)}`,
        sleep: 70 + Math.sin(i) * 10,
        stress: 60 + Math.cos(i) * 10,
        nutrition: 65,
        energy: 75 + Math.sin(i * 1.2) * 10,
      })),
    },
    weightTrend: {
      currentWeight: parseFloat(currentWeight.toFixed(1)),
      targetWeight: parseFloat(targetWeight.toFixed(1)),
      musclePct: parseFloat(musclePct.toFixed(1)),
      fatPct: parseFloat(fatPct.toFixed(1)),
      muscleDelta: weekIndex === 0 ? 0.2 : -0.1,
      fatDelta: weekIndex === 0 ? -0.3 : 0.1,
      history7Weeks: Array.from({ length: 7 }, (_, i) => ({
        weekLabel: `Sem ${12 - (weekIndex + 6 - i)}`,
        weight: parseFloat((currentWeight + (i * 0.1)).toFixed(1)),
      })).reverse(),
    },
    secondaryMetrics: {
      bodyAge: 35 + weekIndex,
      hydrationDeficit: weekIndex === 0 ? 0.1 : 0.3,
      vo2Max: 45 - (weekIndex * 0.2),
    },
    weeklyInsights: [
      {
        title: 'Tiempo Activo',
        value: `${120 + (weekIndex * 10)} min`,
        description: `Sesiones completadas: ${3 + weekIndex % 2} de 5`,
        type: 'success',
      },
      {
        title: 'Hidratación Total',
        value: `${2.5 + (weekIndex * 0.1)} L`,
        description: `Meta semanal de 3 L`,
        type: 'info',
      },
    ],
  };
};



interface ProgressTabProps {
  patientId: string;
  isSpecialist?: boolean;
  readOnly?: boolean;
}

// Mock toast notification for now
const showToast = (message: string) => {
  console.log('Toast:', message);
  // In a real app, this would trigger a UI toast notification
};


const adaptApiProgress = (apiData: any, weekIndex: number): WeeklyProgressData => {
  const currentWeightValue = apiData.historial_peso?.[0]?.peso || 120;
  const targetWeightValue = currentWeightValue - 5;

  return {
    weekIndex,
    label: apiData.semana_info || `Semana ${weekIndex + 1}`,
    status: apiData.indice_bienestar >= 70 ? 'Excelente Progreso' : 'Progreso Moderado',
    aiFeedback: apiData.mensaje_ia || 'No hay comentarios de IA disponibles.',
    painAlerts: apiData.alertas?.activa
      ? [{ area: 'Rodilla', level: 3, description: apiData.alertas.detalle || 'Alerta de dolor.' }]
      : [],
    wellnessIndex: {
      overallScore: apiData.indice_bienestar ?? 0,
      history8Weeks: apiData.evolucion_indice_bienestar?.map((item: any) => {
        const date = item.fecha;
        const sleep = apiData.metrica_sueno?.find((s: any) => s.semana === date)?.promedio ?? 0;
        const stress = apiData.metrica_estres?.find((s: any) => s.semana === date)?.promedio ?? 0;
        const energy = apiData.metrica_energia?.find((s: any) => s.semana === date)?.promedio ?? 0;
        return {
          weekLabel: `Sem ${item.semana_actual}`,
          sleep: Math.round(sleep * 20), // Convert 1-5 to 0-100
          stress: Math.round(stress * 20), // Convert 1-5 to 0-100
          nutrition: 65,
          energy: Math.round(energy * 20), // Convert 1-5 to 0-100
        };
      }) || [],
    },
    weightTrend: {
      currentWeight: currentWeightValue,
      targetWeight: targetWeightValue,
      musclePct: apiData.historial_peso?.[0]?.musculo || 52,
      fatPct: apiData.historial_peso?.[0]?.grasa || 48,
      muscleDelta: apiData.musculos?.actual - apiData.musculos?.anterior || 0,
      fatDelta: apiData.grasa?.actual - apiData.grasa?.anterior || 0,
      history7Weeks: apiData.historial_peso?.map((item: any) => ({
        weekLabel: `Sem ${item.semana}`,
        weight: item.peso,
      })).reverse() || [],
    },
    secondaryMetrics: {
      bodyAge: apiData.detalle_factor_edad_corporal?.puntaje || 36,
      hydrationDeficit: apiData.metricas_secundarias?.actual?.deficit_hidrico || 0,
      vo2Max: apiData.metricas_secundarias?.actual?.vo2_max || 44.48,
    },
    weeklyInsights: [
      {
        title: 'Tiempo Activo',
        value: apiData.tiempo_activo?.total_minutos ? `${apiData.tiempo_activo.total_minutos} min` : '120 min',
        description: apiData.tiempo_activo?.sesiones_totales ? `Sesiones completadas: ${apiData.tiempo_activo.sesiones_completadas || 0} de ${apiData.tiempo_activo.sesiones_totales}` : 'Has acumulado minutos de actividad física.',
        type: 'success',
      },
      {
        title: 'Hidratación Total',
        value: apiData.detalle_factor_hidratacion?.puntaje?.consumo_total_ml ? `${apiData.detalle_factor_hidratacion.puntaje.consumo_total_ml / 1000} L` : '13 L',
        description: apiData.detalle_factor_hidratacion?.puntaje?.requerimiento_total_ml ? `Meta semanal de ${Math.round(apiData.detalle_factor_hidratacion.puntaje.requerimiento_total_ml / 1000)} L` : 'Ingesta de líquidos de la semana.',
        type: 'warning',
      },
    ],
  };
};

const biometricRepository = new MockBiometricRepository();


export const ProgressTab: React.FC<ProgressTabProps> = ({ patientId, isSpecialist = false, readOnly = false }) => {
  const [activeWeekIndex, setActiveWeekIndex] = useState<number>(0); // 0 for current week, up to 4 for oldest
  const [selectedFactorId, setSelectedFactorId] = useState<'sleep' | 'stress' | 'nutrition' | 'energy'>('sleep');
  const [weeklyProgressData, setWeeklyProgressData] = useState<WeeklyProgressData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastReportSent, setLastReportSent] = useState<Date | null>(null);

  const isMockPatient = !patientId || patientId.startsWith('uid-') || patientId.startsWith('pro-') || patientId.startsWith('esp-') || patientId.length < 10 || patientId.startsWith('uid-mock-');

  const {
    data: apiProgressData,
    isLoading: isApiLoading,
    isError: isApiError,
    error: apiError,
  } = useQuery({
    queryKey: ['patientProgress', patientId, activeWeekIndex],
    queryFn: () => usersService.getUserTabDetalle(patientId, 'progreso'),
    enabled: !isMockPatient && !!patientId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    const fetchProgress = async () => {
      setLoading(true);
      setError(null);
      setWeeklyProgressData(null); // Clear previous data

      if (isMockPatient) {
        try {
          const data = createFallbackProgressData(activeWeekIndex);
          setWeeklyProgressData(data);
        } catch (err) {
          setError('Failed to fetch progress data.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      } else {
        // Handled by React Query, just set local state based on query result
        setLoading(isApiLoading);
        if (isApiError) {
          setError(apiError?.message || 'Failed to fetch progress data from API.');
        } else if (apiProgressData) {
          setWeeklyProgressData(adaptApiProgress(apiProgressData, activeWeekIndex));
        }
      }
    };

    fetchProgress();
  }, [patientId, activeWeekIndex, isMockPatient, isApiLoading, isApiError, apiError, apiProgressData]);

  const handleGenerateReport = () => {
    showToast('Generando y enviando informe PDF...');
    setLastReportSent(new Date());
  };

  const currentWeekLabel = weeklyProgressData?.label || `Semana ${activeWeekIndex + 1}`;

  const isPrevDisabled = activeWeekIndex >= 4; // Assuming 5 weeks total (0-4)
  const isNextDisabled = activeWeekIndex <= 0;

  const displayLoading = isMockPatient ? loading : isApiLoading;
  const displayError = isMockPatient ? error : (isApiError ? apiError?.message || 'Failed to fetch progress data from API.' : null);


  return (
    <div className="space-y-4">
      {/* Header with week navigation */}
      <div className="card-base flex items-center justify-between py-3 mb-4">
        <div className="flex items-center gap-2">
          <Calendar size={15} className="text-brand-orange" />
          <span className="text-[12px] font-bold text-white">Progreso Semanal</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveWeekIndex(prev => prev + 1)}
            disabled={isPrevDisabled}
            className="w-7 h-7 bg-surface-card2 border border-surface-border rounded-lg flex items-center justify-center text-surface-muted hover:border-brand-orange hover:text-white cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={13} />
          </button>
          <span className="text-[11px] font-medium text-surface-muted uppercase tracking-wider min-w-[80px] text-center">
            {currentWeekLabel}
          </span>
          <button
            onClick={() => setActiveWeekIndex(prev => prev - 1)}
            disabled={isNextDisabled}
            className="w-7 h-7 bg-surface-card2 border border-surface-border rounded-lg flex items-center justify-center text-surface-muted hover:border-brand-orange hover:text-white cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight size={13} />
          </button>
        </div>
      </div>

      {/* Conditional Content Area */}
      {displayLoading ? (
        <div className="p-4 text-center text-surface-muted">Cargando progreso del paciente...</div>
      ) : displayError ? (
        <div className="p-4 text-center text-brand-red">Error: {displayError}</div>
      ) : !weeklyProgressData ? (
        <div className="p-4 text-center text-surface-muted">No hay datos de progreso disponibles.</div>
      ) : (
        <>
          {lastReportSent && (
            <p className="text-xs text-surface-muted text-right mb-4">
              Último informe enviado: {lastReportSent.toLocaleDateString()} {lastReportSent.toLocaleTimeString()}
            </p>
          )}

          {/* Graphs Row: side-by-side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <WellnessIndexCard wellnessIndex={weeklyProgressData.wellnessIndex} />
            <WeightTrendCard weightTrend={weeklyProgressData.weightTrend} />
          </div>

          {/* Cards Row: organized below the graphs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left Column: Status, Pain Alerts & Specialist Feedback */}
            <div className="space-y-4">
              <StatusBanner status={weeklyProgressData.status} />
              <PainAlertCard painAlerts={weeklyProgressData.painAlerts} />
              <AIFeedbackCard
                feedback={weeklyProgressData.aiFeedback}
                isEditable={isSpecialist && !readOnly}
                onSave={(newFeedback) => {
                  weeklyProgressData.aiFeedback = newFeedback;
                  setWeeklyProgressData({ ...weeklyProgressData });
                  toast.show('Mensaje actualizado con éxito', 'success');
                }}
              />
            </div>

            {/* Right Column: Weekly Insights & Secondary Metrics */}
            <div className="space-y-4">
              <WeeklyInsightsGrid insights={weeklyProgressData.weeklyInsights} />
              <SecondaryMetricsGrid metrics={weeklyProgressData.secondaryMetrics} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProgressTab;
