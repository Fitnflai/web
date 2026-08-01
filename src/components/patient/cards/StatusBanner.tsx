// src/components/patient/cards/StatusBanner.tsx
import React from 'react';

interface StatusBannerProps {
  status: string;
}

export const StatusBanner: React.FC<StatusBannerProps> = ({ status }) => {
  return (
    <div className="card-base flex items-start gap-3">
      {/* Circle Icon */}
      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-brand-green/10 border-2 border-green-500 flex items-center justify-center">
        <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      {/* Content */}
      <div className="flex-1">
        <h4 className="text-base font-bold text-brand-green mb-1">
          Adelante ({status})
        </h4>
        <p className="text-sm text-surface-muted leading-relaxed mb-1">
          Vas por buen camino. Tu cuerpo responde bien al plan actual.
        </p>
        <p className="text-sm text-surface-muted leading-relaxed">
          Sigue con esta constancia y enfócate en la hidratación.
        </p>
      </div>
    </div>
  );
};

export default StatusBanner;
