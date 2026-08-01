// src/components/patient/cards/PainAlertCard.tsx
import React from 'react';

interface PainAlert {
  area: string;
  level: number;
  description: string;
}

interface PainAlertCardProps {
  painAlerts: PainAlert[];
}

export const PainAlertCard: React.FC<PainAlertCardProps> = ({ painAlerts }) => {
  const hasAlerts = painAlerts && painAlerts.length > 0;

  return (
    <div className={`card-base ${hasAlerts ? 'border-brand-red/50 bg-brand-red/5' : 'border-surface-border'}`}>
      <h3 className="text-[13px] font-semibold text-white uppercase tracking-[0.6px] mb-3">Alertas de Dolor</h3>
      {hasAlerts ? (
        <div className="space-y-3">
          {painAlerts.map((alert, index) => (
            <div key={index} className="bg-brand-red/10 border border-brand-red/15 p-3 rounded-lg">
              <p className="font-bold text-white text-xs">Área: {alert.area} (Nivel: {alert.level}/10)</p>
              <p className="text-xs text-surface-muted mt-1 leading-relaxed">{alert.description}</p>
            </div>
          ))}
          <p className="text-xs text-brand-red font-semibold leading-relaxed mt-2">
            ⚠️ ¿Qué hacer?: Reduce la intensidad en bajadas y prioriza ejercicios de movilidad de cadera y tobillo 2–3 veces esta semana.
          </p>
        </div>
      ) : (
        <p className="text-xs text-surface-muted">Sin alertas de dolor registradas para esta semana.</p>
      )}
    </div>
  );
};

export default PainAlertCard;
