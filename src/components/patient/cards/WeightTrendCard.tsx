// src/components/patient/cards/WeightTrendCard.tsx
import React from 'react';
import {
  LINE_CHART_WIDTH,
  LINE_CHART_HEIGHT,
  LINE_CHART_PADDING_X,
  LINE_CHART_PADDING_Y,
  getLineChartX,
  getLineChartY,
} from '../svgHelpers';

interface WeightHistoryEntry {
  weekLabel: string;
  weight: number;
}

export interface WeightTrendData {
  currentWeight: number;
  targetWeight: number;
  musclePct: number;
  fatPct: number;
  muscleDelta: number;
  fatDelta: number;
  history7Weeks: WeightHistoryEntry[];
}

interface WeightTrendCardProps {
  weightTrend: WeightTrendData;
}

const WeightTrendCard: React.FC<WeightTrendCardProps> = ({ weightTrend }) => {
  const history = weightTrend.history7Weeks;
  const weights = history.map(entry => entry.weight);

  const minWeight = Math.min(...weights);
  const maxWeight = Math.max(...weights);

  // Generate SVG path for the line chart
  const linePath = weights
    .map((weight, index) => {
      const x = getLineChartX(index, weights.length, LINE_CHART_WIDTH, LINE_CHART_PADDING_X);
      const y = getLineChartY(weight, minWeight, maxWeight, LINE_CHART_HEIGHT, LINE_CHART_PADDING_Y);
      return `${index === 0 ? 'M' : 'L'}${x},${y}`;
    })
    .join(' ');

  const getDeltaColorClass = (delta: number) => {
    if (delta > 0) return 'text-brand-red';
    if (delta < 0) return 'text-brand-green';
    return 'text-surface-muted';
  };

  return (
    <div className="card-base">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[13px] font-semibold text-white uppercase tracking-[0.6px]">Detalle de Peso</h3>
        <span className="badge badge-green">
          Objetivo: {weightTrend.targetWeight < weightTrend.currentWeight ? 'bajar peso' : 'mantener peso'}
        </span>
      </div>

      {/* 7-Week Weight Line Chart */}
      <div className="mb-4">
        <h4 className="text-xs font-semibold text-white mb-2">Últimas 7 Semanas</h4>
        <svg viewBox={`0 0 ${LINE_CHART_WIDTH} ${LINE_CHART_HEIGHT}`} className="w-full h-auto">
          {/* Horizontal grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
            <line
              key={i}
              x1={LINE_CHART_PADDING_X}
              y1={LINE_CHART_HEIGHT - LINE_CHART_PADDING_Y - ratio * (LINE_CHART_HEIGHT - 2 * LINE_CHART_PADDING_Y)}
              x2={LINE_CHART_WIDTH - LINE_CHART_PADDING_X}
              y2={LINE_CHART_HEIGHT - LINE_CHART_PADDING_Y - ratio * (LINE_CHART_HEIGHT - 2 * LINE_CHART_PADDING_Y)}
              className="stroke-surface-border stroke-1"
              strokeDasharray={ratio === 0 || ratio === 1 ? "" : "4 4"}
            />
          ))}

          {/* Vertical grid lines and X-axis labels */}
          {history.map((entry, index) => {
            const x = getLineChartX(index, history.length, LINE_CHART_WIDTH, LINE_CHART_PADDING_X);
            return (
              <React.Fragment key={index}>
                <line
                  x1={x}
                  y1={LINE_CHART_PADDING_Y}
                  x2={x}
                  y2={LINE_CHART_HEIGHT - LINE_CHART_PADDING_Y}
                  className="stroke-surface-border stroke-1"
                  strokeDasharray="4 4"
                />
                <text
                  x={x}
                  y={LINE_CHART_HEIGHT - LINE_CHART_PADDING_Y + 15}
                  textAnchor="middle"
                  className="text-[9px] fill-surface-muted"
                >
                  {entry.weekLabel.split(' ')[1]}
                </text>
              </React.Fragment>
            );
          })}

          {/* Line Path */}
          <path
            d={linePath}
            fill="none"
            className="stroke-brand-green stroke-2 animate-pulse"
            strokeWidth="2.5"
          />

          {/* Data Points */}
          {weights.map((weight, index) => {
            const x = getLineChartX(index, weights.length, LINE_CHART_WIDTH, LINE_CHART_PADDING_X);
            const y = getLineChartY(weight, minWeight, maxWeight, LINE_CHART_HEIGHT, LINE_CHART_PADDING_Y);
            return (
              <circle key={index} cx={x} cy={y} r="4" className="fill-brand-green" />
            );
          })}

          {/* Y-axis labels (min/max) */}
          <text x={LINE_CHART_PADDING_X - 5} y={getLineChartY(maxWeight, minWeight, maxWeight, LINE_CHART_HEIGHT, LINE_CHART_PADDING_Y) + 4} textAnchor="end" className="text-[10px] fill-surface-muted font-mono">
            {Math.round(maxWeight)}kg
          </text>
          <text x={LINE_CHART_PADDING_X - 5} y={getLineChartY(minWeight, minWeight, maxWeight, LINE_CHART_HEIGHT, LINE_CHART_PADDING_Y) + 4} textAnchor="end" className="text-[10px] fill-surface-muted font-mono">
            {Math.round(minWeight)}kg
          </text>
        </svg>
        <p className="text-center text-xs text-surface-muted mt-2">
          Peso Actual: <span className="text-white font-extrabold text-sm">{weightTrend.currentWeight} kg</span>
        </p>
      </div>

      {/* Body Composition Box */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-surface-card2 border border-surface-border p-3 rounded-xl text-center">
          <p className="text-[11px] text-surface-muted uppercase tracking-[0.4px] mb-1">Músculo Estimado</p>
          <p className="text-lg font-bold text-white">{weightTrend.musclePct}%</p>
          <p className={`text-xs ${getDeltaColorClass(weightTrend.muscleDelta)} font-semibold mt-1`}>
            {weightTrend.muscleDelta > 0 ? '↑' : '↓'} {Math.abs(weightTrend.muscleDelta)}%
          </p>
        </div>
        <div className="bg-surface-card2 border border-surface-border p-3 rounded-xl text-center">
          <p className="text-[11px] text-surface-muted uppercase tracking-[0.4px] mb-1">Grasa Estimada</p>
          <p className="text-lg font-bold text-white">{weightTrend.fatPct}%</p>
          <p className={`text-xs ${getDeltaColorClass(weightTrend.fatDelta)} font-semibold mt-1`}>
            {weightTrend.fatDelta > 0 ? '↑' : '↓'} {Math.abs(weightTrend.fatDelta)}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeightTrendCard;
