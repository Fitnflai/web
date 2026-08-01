export type BiometricOrigin = 'Technogym' | 'Garmin' | 'AppleHealth';

export interface BiometricEntry {
  id: string;
  userId: string;
  date: string;
  origin: BiometricOrigin;
  composition?: {
    weight: number;
    bodyFatPct?: number;
    muscleMass?: number;
    waterPct?: number;
    waterACT?: number;
    waterAEC?: number;
    waterAIC?: number;
    boneMineral?: number;
    bmi?: number;
  };
  metabolic?: {
    bmr?: number;
    phaseAngle?: number;
  };
  performance?: {
    vo2Max?: number;
    mobilityScore?: number;
    balanceLeftSec?: number;
    balanceRightSec?: number;
    wellnessAge?: number;
  };
}

export interface FoodItem {
  id: string;
  time: string;
  name: string;
  portion: string;
  kcal: number;
  proteins: number;
  carbs: number;
  fats: number;
}

export interface IntakeItem {
  id: string;
  time: string;
  volumeMl: number;
  type: string;
  justification: string | null;
}

export interface Comida {
  id_comida: string;
  tipo: string;
  descripcion: string;
  instrucciones: string;
  kcal: number;
  ch: number;
  proteina: number;
  grasas: number;
  etiquetas: string[];
}

export interface DailyNutritionHydrationLog {
  id: string;
  userId: string;
  date: string;
  targetKcal: number;
  actualKcal: number;
  targetProteins: number;
  actualProteins: number;
  targetCarbs: number;
  actualCarbs: number;
  targetFats: number;
  actualFats: number;
  foodLog: FoodItem[];
  comidas?: Comida[];
  liquidVolumeMl: number;
  targetLiquidVolumeMl: number;
  intakes: IntakeItem[];
  dehydrationLevel?: 'None' | 'Mild' | 'Moderate' | 'Severe';
  calculatedDehydrationLiters?: number;
  hydrationJustification?: string;
  overriddenBySpecialist?: boolean;
}

export type CommentContext = 'exercise' | 'workout' | 'plan' | 'meal' | 'restday';

export interface Comment {
  id: string;
  parentId: string | null;
  userId: string;
  userName: string;
  userRole: 'specialist' | 'patient';
  content: string;
  createdAt: string;
  contextType: CommentContext;
  contextId: string;
}

export interface PredefinedExercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  distanceMeter?: number;
  restSeconds: number;
}

export interface PredefinedWorkout {
  id: string;
  discipline: string;
  category: string;
  title: string;
  description: string;
  exercises: PredefinedExercise[];
}

export interface WeeklyProgressData {
  weekIndex: number;
  label: string;
  status: string;
  painAlerts: { area: string; level: number; description: string }[];
  wellnessIndex: {
    overallScore: number;
    history8Weeks: { weekLabel: string; sleep: number; stress: number; nutrition: number; energy: number }[];
  };
  weightTrend: {
    currentWeight: number;
    targetWeight: number;
    musclePct: number;
    fatPct: number;
    muscleDelta: number;
    fatDelta: number;
    history7Weeks: { weekLabel: string; weight: number }[];
  };
  secondaryMetrics: { bodyAge: number; hydrationDeficit: number; vo2Max: number };
  weeklyInsights: { title: string; value: string; description: string; type: 'success' | 'warning' | 'info' | 'neutral' }[];
  aiFeedback: string;
}

export interface CompositionActivityRow {
  metric: string; label: string; target: string; actual: string; S_1: string; S_4: string;
}
export interface CompositionActivitySection {
  rows: CompositionActivityRow[]; comment: string;
}
export interface PainLogEntry {
  id: string; zone: string; intensity: string;
}
export interface PainLogSection {
  rows: PainLogEntry[]; comment: string;
}
export interface EvolutionWeekRow {
  weekLabel: string; weight: string; musclePct: string; fatPct: string; note: string;
}
export interface EvolutionSection {
  rows: EvolutionWeekRow[]; comment: string;
}
export interface WeeklyClinicalReport {
  weekOffset: number;
  label: string;
  status: 'ADELANTE' | 'ADELANTE CON AJUSTE' | 'PRECAUCIÓN' | 'DETENER';
  painAlert: string;
  nextWeekPlan: string;
  compositionActivity: CompositionActivitySection;
  painLog: PainLogSection;
  evolution8Weeks: EvolutionSection;
  generalObservations: string;
}

export interface MonthlyIncome {
  mes: string;
  total: number;
}

export interface AdminDashboardStats {
  usuarios_totales: number;
  ingresos_este_mes: number;
  especialistas_activos: number;
  especialistas_pendientes: number;
  usuarios_activos: number;
  usuarios_nuevos: number;
  ingresos_mensuales: MonthlyIncome[];
}
