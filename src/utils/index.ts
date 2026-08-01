import { DAYS_ES, MONTHS_ES } from '@/constants'
import type { PlanItem, BadgeVariant } from '@/types'

/** Format ISO date string to "Mié 4 jun" */
export function formatDate(d: string): string {
  const dt = new Date(d + 'T12:00:00')
  return `${DAYS_ES[dt.getDay()]} ${dt.getDate()} ${MONTHS_ES[dt.getMonth()]}`
}

/** Format seconds to "X min" or "Xs" */
export function formatSeconds(s: number): string | null {
  if (!s || s === 0) return null
  return s >= 60 ? `${Math.round(s / 60)} min` : `${s} seg`
}

/** Determine plan item state */
export function getPlanState(item: PlanItem): 'done' | 'pend' | 'rest' | 'lock' {
  if (item.tipo === 'Descanso') return 'rest'
  if (!('estado' in item)) return 'lock'
  if (item.estado === 'completado') return 'done'
  if (item.estado === 'pendiente') {
    const today = new Date('2026-06-06')
    const fd = new Date(item.fecha_programada + 'T12:00:00')
    return fd <= today ? 'pend' : 'lock'
  }
  return 'lock'
}

/** State label */
export const STATE_LABEL: Record<string, string> = {
  done: 'Completado',
  pend: 'Pendiente',
  rest: 'Descanso',
  lock: 'Próximamente',
}

/** State badge variant */
export const STATE_BADGE: Record<string, BadgeVariant> = {
  done: 'green',
  pend: 'orange',
  rest: 'blue',
  lock: 'muted',
}

/** Type to color mapping */
export function typeColor(t: string): string {
  const lower = t.toLowerCase()
  if (lower.includes('aeróbico') || lower.includes('cardio')) return '#E8622A'
  if (lower.includes('fuerza')) return '#4CAF82'
  if (lower.includes('técnica') || lower.includes('natación')) return '#4A7CC7'
  if (lower.includes('clave')) return '#F5C842'
  if (lower.includes('core') || lower.includes('movilidad')) return '#9B59B6'
  return '#888'
}

/** Type to Lucide icon name */
export function typeIconName(t: string): string {
  const lower = t.toLowerCase()
  if (lower.includes('aeróbico') || lower.includes('cardio')) return 'Footprints'
  if (lower.includes('fuerza')) return 'Dumbbell'
  if (lower.includes('técnica') || lower.includes('natación')) return 'Waves'
  if (lower.includes('clave')) return 'Star'
  if (lower.includes('core')) return 'Target'
  return 'Dumbbell'
}

/** cn utility */
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrencyShorthand(value: number | undefined | null): string {
  if (value === undefined || value === null) {
    return '$0';
  }

  if (value < 1000) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value);
  }

  const K = value / 1000;
  if (K % 1 === 0) {
    return `$${K.toFixed(0)}k`;
  } else {
    return `$${K.toFixed(1)}k`;
  }
}
