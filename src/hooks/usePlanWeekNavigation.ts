import { useState, useMemo, useEffect } from 'react';
import {
  startOfWeek,
  addWeeks,
  addDays,
  differenceInCalendarWeeks,
  parseISO,
  format,
  isValid,
} from 'date-fns';
import { es } from 'date-fns/locale';

export interface UsePlanWeekNavigationOptions {
  userId?: string;
  patient?: any;
  allowFuture?: boolean;
}

export interface UsePlanWeekNavigationReturn {
  selectedWeek: number;
  currentWeekNumber: number;
  minWeek: number;
  maxWeek: number;
  canGoPrev: boolean;
  canGoNext: boolean;
  goToPrevWeek: () => void;
  goToNextWeek: () => void;
  setSelectedWeek: (week: number) => void;
  weekDates: Date[];
  weekStartDate: Date;
  weekEndDate: Date;
  startDate: string;
  endDate: string;
  planStartDate: string;
  formattedDateRange: string;
  formatDateFriendly: (d: Date) => string;
  getWeekRange: (weekNumber: number) => { start: Date; end: Date; formattedRange: string };
}

export const usePlanWeekNavigation = ({
  userId: _userId,
  patient,
  allowFuture = false,
}: UsePlanWeekNavigationOptions): UsePlanWeekNavigationReturn => {
  // Calculate the raw plan start date string (prioritizing patient's fecha_inicio_preferida)
  const resolvedPlanStartDateStr = useMemo(() => {
    // 1. Authoritative: patient's fecha_inicio_preferida / fecha_inicio_deseada
    const patientStartDate =
      patient?.fecha_inicio_preferida ||
      patient?.fecha_inicio_deseada ||
      patient?.fecha_inicio_plan ||
      patient?.fecha_inicio ||
      patient?.fecha_creacion ||
      patient?.created_at ||
      null;

    if (patientStartDate && typeof patientStartDate === 'string' && patientStartDate.length >= 10) {
      return patientStartDate.substring(0, 10);
    }

    return null;
  }, [patient]);

  // Calculate the Monday of Week 1
  const startOfPlanWeek1 = useMemo(() => {
    if (resolvedPlanStartDateStr) {
      const parsed = parseISO(resolvedPlanStartDateStr);
      if (isValid(parsed)) {
        return startOfWeek(parsed, { weekStartsOn: 1 });
      }
    }

    // Fallback to Monday of current week
    return startOfWeek(new Date(), { weekStartsOn: 1 });
  }, [resolvedPlanStartDateStr]);

  // Determine current week number relative to Week 1
  const currentWeekNumber = useMemo(() => {
    const todayMonday = startOfWeek(new Date(), { weekStartsOn: 1 });
    const diffWeeks = differenceInCalendarWeeks(todayMonday, startOfPlanWeek1, { weekStartsOn: 1 });
    return Math.max(1, diffWeeks + 1);
  }, [startOfPlanWeek1]);

  const [selectedWeek, setSelectedWeek] = useState<number>(currentWeekNumber);
  const [hasUserNavigated, setHasUserNavigated] = useState<boolean>(false);

  // Sync to currentWeekNumber on initial load until user manually changes week
  useEffect(() => {
    if (!hasUserNavigated) {
      setSelectedWeek(currentWeekNumber);
    }
  }, [currentWeekNumber, hasUserNavigated]);

  const minWeek = 1;
  const maxWeek = allowFuture ? 52 : currentWeekNumber;

  const canGoPrev = selectedWeek > minWeek;
  const canGoNext = selectedWeek < maxWeek;

  const goToPrevWeek = () => {
    if (canGoPrev) {
      setHasUserNavigated(true);
      setSelectedWeek(prev => prev - 1);
    }
  };

  const goToNextWeek = () => {
    if (canGoNext) {
      setHasUserNavigated(true);
      setSelectedWeek(prev => prev + 1);
    }
  };

  // Dates for selected week
  const weekStartDate = useMemo(() => {
    return addWeeks(startOfPlanWeek1, selectedWeek - 1);
  }, [startOfPlanWeek1, selectedWeek]);

  const weekEndDate = useMemo(() => {
    return addDays(weekStartDate, 6);
  }, [weekStartDate]);

  const weekDates = useMemo(() => {
    const dates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      dates.push(addDays(weekStartDate, i));
    }
    return dates;
  }, [weekStartDate]);

  const startDate = useMemo(() => format(weekStartDate, 'yyyy-MM-dd'), [weekStartDate]);
  const endDate = useMemo(() => format(weekEndDate, 'yyyy-MM-dd'), [weekEndDate]);
  const planStartDate = useMemo(() => {
    return resolvedPlanStartDateStr || format(startOfPlanWeek1, 'yyyy-MM-dd');
  }, [resolvedPlanStartDateStr, startOfPlanWeek1]);

  const formatDateFriendly = (d: Date): string => {
    return format(d, 'd MMM', { locale: es });
  };

  const formattedDateRange = useMemo(() => {
    return `${formatDateFriendly(weekStartDate)} - ${formatDateFriendly(weekEndDate)}`;
  }, [weekStartDate, weekEndDate]);

  const getWeekRange = (weekNumber: number) => {
    const start = addWeeks(startOfPlanWeek1, weekNumber - 1);
    const end = addDays(start, 6);
    return {
      start,
      end,
      formattedRange: `${formatDateFriendly(start)} - ${formatDateFriendly(end)}`,
    };
  };

  return {
    selectedWeek,
    currentWeekNumber,
    minWeek,
    maxWeek,
    canGoPrev,
    canGoNext,
    goToPrevWeek,
    goToNextWeek,
    setSelectedWeek,
    weekDates,
    weekStartDate,
    weekEndDate,
    startDate,
    endDate,
    planStartDate,
    formattedDateRange,
    formatDateFriendly,
    getWeekRange,
  };
};
