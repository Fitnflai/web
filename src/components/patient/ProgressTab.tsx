import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { MockBiometricRepository } from '../../core/repositories/mocks/MockBiometricRepository';
import { WeeklyProgressData } from '../../core/domain/types';

// Import all card components
import StatusBanner from './cards/StatusBanner';
import PainAlertCard from './cards/PainAlertCard';
import WellnessIndexCard from './cards/WellnessIndexCard';
import WeightTrendCard from './cards/WeightTrendCard';
import SecondaryMetricsGrid from './cards/SecondaryMetricsGrid';
import WeeklyInsightsGrid from './cards/WeeklyInsightsGrid';
import AIFeedbackCard from './cards/AIFeedbackCard';

import { toast } from '@/components/ui/Toast';

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

const biometricRepository = new MockBiometricRepository();

export const ProgressTab: React.FC<ProgressTabProps> = ({ patientId, isSpecialist = false, readOnly = false }) => {
  const [activeWeekIndex, setActiveWeekIndex] = useState<number>(0); // 0 for current week, up to 4 for oldest
  const [selectedFactorId, setSelectedFactorId] = useState<'sleep' | 'stress' | 'nutrition' | 'energy'>('sleep');
  const [weeklyProgressData, setWeeklyProgressData] = useState<WeeklyProgressData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastReportSent, setLastReportSent] = useState<Date | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      setLoading(true);
      setError(null);
      setWeeklyProgressData(null); // Clear previous data
      try {
        const data = await biometricRepository.getWeeklyProgress(patientId, activeWeekIndex);
        setWeeklyProgressData(data);
      } catch (err) {
        setError('Failed to fetch progress data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [patientId, activeWeekIndex]);

  const handleGenerateReport = () => {
    showToast('Generando y enviando informe PDF...');
    setLastReportSent(new Date());
  };

  const currentWeekLabel = weeklyProgressData?.label || `Semana ${activeWeekIndex + 1}`;

  const isPrevDisabled = activeWeekIndex >= 4; // Assuming 5 weeks total (0-4)
  const isNextDisabled = activeWeekIndex <= 0;

  if (loading) {
    return <div className="p-4 text-center text-surface-muted">Cargando progreso del paciente...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-brand-red">Error: {error}</div>;
  }

  if (!weeklyProgressData) {
    return <div className="p-4 text-center text-surface-muted">No hay datos de progreso disponibles.</div>;
  }

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
    </div>
  );
};

export default ProgressTab;
