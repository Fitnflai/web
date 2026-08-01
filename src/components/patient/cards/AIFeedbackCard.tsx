import React, { useState, useEffect } from 'react';

interface AIFeedbackCardProps {
  feedback: string;
  isEditable?: boolean;
  onSave?: (newFeedback: string) => void;
}

export const AIFeedbackCard: React.FC<AIFeedbackCardProps> = ({ feedback, isEditable = false, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localFeedback, setLocalFeedback] = useState(feedback);

  // Sync state if prop changes
  useEffect(() => {
    setLocalFeedback(feedback);
  }, [feedback]);

  const handleSave = () => {
    if (onSave) {
      onSave(localFeedback);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLocalFeedback(feedback);
    setIsEditing(false);
  };

  return (
    <div className="card-base">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[13px] font-semibold text-white uppercase tracking-[0.6px] flex items-center gap-1.5">
          <span>✨</span> Mensaje para ti
        </h3>
        {isEditable && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-[11px] font-semibold text-brand-orange hover:text-brand-orange/80 transition-colors bg-transparent border-0 cursor-pointer p-0"
          >
            ✏️ Editar mensaje
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={localFeedback}
            onChange={(e) => setLocalFeedback(e.target.value)}
            className="w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] text-white outline-none focus:border-brand-orange min-h-[110px] resize-y leading-relaxed"
            placeholder="Escribe un mensaje para el deportista..."
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={handleCancel}
              className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-surface-card border border-surface-border text-white hover:text-white/80 transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-2.5 py-1 text-[11px] font-semibold rounded-lg text-white bg-brand-orange hover:bg-brand-orange/80 transition-all cursor-pointer border-0"
            >
              💾 Guardar
            </button>
          </div>
        </div>
      ) : (
        <p className="text-xs text-surface-muted leading-relaxed whitespace-pre-line">
          {feedback}
        </p>
      )}
    </div>
  );
};

export default AIFeedbackCard;
