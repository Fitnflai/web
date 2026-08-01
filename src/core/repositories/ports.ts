import type { BiometricEntry, DailyNutritionHydrationLog, Comment, PredefinedWorkout, WeeklyProgressData, WeeklyClinicalReport } from '../domain/types';
import type { PlanItem, Workout, RestDay } from '@/types';

export interface IBiometricRepository {
  getByUserId(userId: string): Promise<BiometricEntry[]>;
  getLatestByUserId(userId: string): Promise<BiometricEntry | null>;
  getWeeklyProgress(userId: string, weekIndex: number): Promise<WeeklyProgressData>;
  getClinicalReport(userId: string, weekIndex: number): Promise<WeeklyClinicalReport>;
  saveClinicalReport(userId: string, report: WeeklyClinicalReport): Promise<void>;
}

export interface INutritionRepository {
  getLog(userId: string, date: string): Promise<DailyNutritionHydrationLog | null>;
  saveLog(log: DailyNutritionHydrationLog): Promise<DailyNutritionHydrationLog>;
}

export interface ICommentRepository {
  getComments(contextType: string, contextId: string): Promise<Comment[]>;
  postComment(comment: Omit<Comment, 'id' | 'createdAt'>): Promise<Comment>;
}

export interface IWorkoutRepository {
  getPlanForUser(userId: string): Promise<PlanItem[]>;
  getPredefinedWorkouts(): Promise<PredefinedWorkout[]>;
  getWorkoutTemplates(discipline?: string, category?: string): Promise<PredefinedWorkout[]>;
  updateWorkoutDate(workoutId: string, date: string): Promise<void>;
  updateRestDayDate(restDayId: string, date: string): Promise<void>;
  saveWorkout(workout: Workout): Promise<void>;
  saveRestDay(restDay: RestDay): Promise<void>;
  deletePlanItemByDate(date: string): Promise<void>;
}
