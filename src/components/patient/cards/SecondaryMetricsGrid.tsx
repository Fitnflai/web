// src/components/patient/cards/SecondaryMetricsGrid.tsx
import React from 'react';

export interface SecondaryMetricsData {
  bodyAge: number;
  hydrationDeficit: number;
  vo2Max: number;
}

interface SecondaryMetricsGridProps {
  metrics: SecondaryMetricsData;
}

export const SecondaryMetricsGrid: React.FC<SecondaryMetricsGridProps> = ({ metrics }) => {
  const hydrationWarning = metrics.hydrationDeficit > 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Body Age Card */}
      <div className="card-base text-center flex flex-col items-center justify-between">
        <p className="text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">Edad Corporal</p>
        <p className="text-3xl font-extrabold text-white">{metrics.bodyAge}</p>
        <span className="badge badge-green mt-2">Mejorando (-2 años)</span>
      </div>

      {/* Hydration Deficit Card */}
      <div className={`card-base text-center flex flex-col items-center justify-between ${hydrationWarning ? 'border-brand-yellow/40 bg-brand-yellow/5' : ''}`}>
        <p className="text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">Déficit Hídrico</p>
        <p className="text-3xl font-extrabold text-white">{metrics.hydrationDeficit.toFixed(1)} <span className="text-sm font-normal text-surface-muted">L</span></p>
        <span className={`badge ${hydrationWarning ? 'badge-yellow' : 'badge-green'} mt-2`}>
          {hydrationWarning ? 'Déficit Moderado' : 'Hidratado'}
        </span>
      </div>

      {/* VO2 Max Card */}
      <div className="card-base text-center flex flex-col items-center justify-between">
        <p className="text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">VO2 Max Estimado</p>
        <p className="text-3xl font-extrabold text-white">{metrics.vo2Max.toFixed(1)}</p>
        <span className="badge badge-green mt-2">Excelente</span>
      </div>
    </div>
  );
};

export default SecondaryMetricsGrid;
