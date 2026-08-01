// src/components/patient/cards/WellnessIndexCard.tsx
import React, { useState } from 'react';
import {
  WELLNESS_RING_RADIUS,
  WELLNESS_RING_CIRCUMFERENCE,
  getWellnessRingStrokeDashoffset,
  LINE_CHART_WIDTH,
  LINE_CHART_HEIGHT,
  LINE_CHART_PADDING_X,
  LINE_CHART_PADDING_Y,
  getLineChartX,
  getLineChartY,
} from '../svgHelpers';

interface HistoryEntry {
  weekLabel: string;
  sleep: number;
  stress: number;
  nutrition: number;
  energy: number;
}

export interface WellnessIndexData {
  overallScore: number;
  history8Weeks: HistoryEntry[];
}

interface WellnessIndexCardProps {
  wellnessIndex: WellnessIndexData;
}

type WellnessFactor = 'sleep' | 'stress' | 'nutrition' | 'energy';

const factorColors: Record<WellnessFactor, string> = {
  sleep: 'stroke-brand-blue',
  stress: 'stroke-brand-red',
  nutrition: 'stroke-brand-green',
  energy: 'stroke-brand-purple',
};

const factorFills: Record<WellnessFactor, string> = {
  sleep: 'fill-brand-blue',
  stress: 'fill-brand-red',
  nutrition: 'fill-brand-green',
  energy: 'fill-brand-purple',
};

const WellnessIndexCard: React.FC<WellnessIndexCardProps> = ({ wellnessIndex }) => {
  const [selectedFactor, setSelectedFactor] = useState<WellnessFactor>('sleep');

  const currentHistory = wellnessIndex.history8Weeks;
  const factorScores = currentHistory.map((entry) => entry[selectedFactor]);

  // Calculate min/max for the selected factor's history
  const minScore = Math.min(...factorScores);
  const maxScore = Math.max(...factorScores);

  // Generate SVG path for the line chart
  const linePath = factorScores
    .map((score, index) => {
      const x = getLineChartX(index, factorScores.length, LINE_CHART_WIDTH, LINE_CHART_PADDING_X);
      const y = getLineChartY(score, minScore, maxScore, LINE_CHART_HEIGHT, LINE_CHART_PADDING_Y);
      return `${index === 0 ? 'M' : 'L'}${x},${y}`;
    })
    .join(' ');

  const overallStrokeDashoffset = getWellnessRingStrokeDashoffset(wellnessIndex.overallScore);

  return (
    <div className="card-base">
      <h3 className="text-[13px] font-semibold text-white uppercase tracking-[0.6px] mb-4">Índice de Bienestar</h3>

      {/* Overall Wellness Ring */}
      <div className="flex flex-col items-center justify-center mb-6 relative">
        <div className="relative flex items-center justify-center w-[90px] h-[90px]">
          <svg width="90" height="90" viewBox="0 0 90 90" className="transform -rotate-90">
            <circle
              cx="45"
              cy="45"
              r={WELLNESS_RING_RADIUS}
              strokeWidth="8"
              className="stroke-surface-border"
              fill="none"
            />
            <circle
              cx="45"
              cy="45"
              r={WELLNESS_RING_RADIUS}
              strokeWidth="8"
              strokeDasharray={WELLNESS_RING_CIRCUMFERENCE}
              strokeDashoffset={overallStrokeDashoffset}
              className="stroke-brand-orange transition-all duration-500 ease-out"
              fill="none"
            />
          </svg>
          <span className="absolute text-xl font-extrabold text-white">
            {wellnessIndex.overallScore}<sub className="text-xs text-surface-muted font-normal">/100</sub>
          </span>
        </div>
        <p className="text-center text-xs text-surface-muted mt-2">Puntuación General de Bienestar</p>
      </div>

      {/* Factor Select Dropdown */}
      <div className="mb-4">
        <label htmlFor="wellness-factor-select" className="block text-[11px] text-surface-muted uppercase tracking-[0.6px] mb-1">
          Métrica Detallada:
        </label>
        <select
          id="wellness-factor-select"
          name="wellness-factor-select"
          className="mt-1 block w-full pl-3 pr-10 py-2 bg-surface-card2 text-white border border-surface-border text-xs focus:outline-none focus:ring-brand-orange focus:border-brand-orange rounded-lg"
          value={selectedFactor}
          onChange={(e) => setSelectedFactor(e.target.value as WellnessFactor)}
        >
          <option value="sleep">Sueño</option>
          <option value="stress">Estrés</option>
          <option value="nutrition">Nutrición</option>
          <option value="energy">Energía</option>
        </select>
      </div>

      {/* Dynamic 8-Week Line Chart */}
      <div className="mt-6 border-t border-surface-border pt-4">
        <h4 className="text-xs font-semibold text-white mb-2 capitalize">
          Historial de {selectedFactor === 'sleep' ? 'Sueño' : selectedFactor === 'stress' ? 'Estrés' : selectedFactor === 'nutrition' ? 'Nutrición' : 'Energía'} (Últimas 8 Semanas)
        </h4>
        <svg viewBox={`0 0 ${LINE_CHART_WIDTH} ${LINE_CHART_HEIGHT}`} className="w-full h-auto">
          {/* Grid lines */}
          <line x1={LINE_CHART_PADDING_X} y1={LINE_CHART_HEIGHT - LINE_CHART_PADDING_Y} x2={LINE_CHART_WIDTH - LINE_CHART_PADDING_X} y2={LINE_CHART_HEIGHT - LINE_CHART_PADDING_Y} className="stroke-surface-border stroke-1" />
          <line x1={LINE_CHART_PADDING_X} y1={LINE_CHART_PADDING_Y} x2={LINE_CHART_WIDTH - LINE_CHART_PADDING_X} y2={LINE_CHART_PADDING_Y} className="stroke-surface-border stroke-1" strokeDasharray="4 4" />

          {/* Line Path */}
          <path
            d={linePath}
            fill="none"
            className={`${factorColors[selectedFactor]} stroke-2 transition-all duration-500 ease-out`}
            strokeWidth="2"
          />

          {/* Data Points */}
          {factorScores.map((score, index) => {
            const x = getLineChartX(index, factorScores.length, LINE_CHART_WIDTH, LINE_CHART_PADDING_X);
            const y = getLineChartY(score, minScore, maxScore, LINE_CHART_HEIGHT, LINE_CHART_PADDING_Y);
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                className={`${factorFills[selectedFactor]}`}
              />
            );
          })}

          {/* Y-axis labels (min/max) */}
          <text x={LINE_CHART_PADDING_X - 5} y={getLineChartY(maxScore, minScore, maxScore, LINE_CHART_HEIGHT, LINE_CHART_PADDING_Y) + 4} textAnchor="end" className="text-[10px] fill-surface-muted font-mono">
            {Math.round(maxScore)}
          </text>
          <text x={LINE_CHART_PADDING_X - 5} y={getLineChartY(minScore, minScore, maxScore, LINE_CHART_HEIGHT, LINE_CHART_PADDING_Y) + 4} textAnchor="end" className="text-[10px] fill-surface-muted font-mono">
            {Math.round(minScore)}
          </text>

          {/* X-axis labels (week labels) */}
          {currentHistory.map((entry, index) => {
            const x = getLineChartX(index, factorScores.length, LINE_CHART_WIDTH, LINE_CHART_PADDING_X);
            return (
              <text
                key={index}
                x={x}
                y={LINE_CHART_HEIGHT - LINE_CHART_PADDING_Y + 15}
                textAnchor="middle"
                className="text-[9px] fill-surface-muted"
              >
                {entry.weekLabel.split(' ')[1]}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default WellnessIndexCard;
