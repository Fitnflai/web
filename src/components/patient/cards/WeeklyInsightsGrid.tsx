// src/components/patient/cards/WeeklyInsightsGrid.tsx
import React from 'react';

export interface WeeklyInsight {
  title: string;
  value: string;
  description: string;
  type: 'success' | 'warning' | 'info' | 'neutral';
}

interface WeeklyInsightsGridProps {
  insights: WeeklyInsight[];
}

export const WeeklyInsightsGrid: React.FC<WeeklyInsightsGridProps> = ({ insights }) => {
  const getCardClasses = (index: number) => {
    switch (index % 4) {
      case 0: // Fuerza (Orange highlight)
        return {
          container: 'border-brand-orange/25 bg-brand-orange/5',
          valueColor: 'text-brand-orange',
          titleColor: 'text-brand-orange/80'
        };
      case 1: // Resistencia (Blue highlight)
        return {
          container: 'border-brand-blue/25 bg-brand-blue/5',
          valueColor: 'text-brand-blue',
          titleColor: 'text-brand-blue/80'
        };
      case 2: // Flexibilidad (Purple highlight)
        return {
          container: 'border-brand-purple/25 bg-brand-purple/5',
          valueColor: 'text-brand-purple',
          titleColor: 'text-brand-purple/80'
        };
      case 3: // Recuperación (Green highlight)
      default:
        return {
          container: 'border-brand-green/25 bg-brand-green/5',
          valueColor: 'text-brand-green',
          titleColor: 'text-brand-green/80'
        };
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {insights.map((insight, index) => {
        const { container, valueColor, titleColor } = getCardClasses(index);
        return (
          <div key={index} className={`rounded-xl p-4 border flex flex-col justify-between transition-all hover:scale-[1.01] ${container}`}>
            <h4 className={`text-[10px] uppercase tracking-[0.4px] mb-1 font-semibold ${titleColor}`}>{insight.title}</h4>
            <p className={`text-lg font-extrabold my-1 ${valueColor}`}>{insight.value}</p>
            <p className="text-xs text-surface-muted leading-relaxed mt-1">{insight.description}</p>
          </div>
        );
      })}
    </div>
  );
};

export default WeeklyInsightsGrid;
