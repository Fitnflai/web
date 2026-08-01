import type { IWorkoutRepository } from '../ports';
import type { PredefinedWorkout } from '../../domain/types';
import type { PlanItem, Workout, RestDay } from '@/types';

export class MockWorkoutRepository implements IWorkoutRepository {
  private templates: PredefinedWorkout[] = [
    {
      id: 't1',
      discipline: 'Trail Running',
      category: 'Aeróbico Z2',
      title: 'Rodaje en Zona 2',
      description: 'Entrenamiento continuo extensivo en senderos llanos para mejorar la base aeróbica.',
      exercises: [
        { id: 'e1', name: 'Trote continuo suave', sets: 1, reps: '45 min', distanceMeter: 8000, restSeconds: 0 },
        { id: 'e2', name: 'Ejercicios de movilidad de tobillo', sets: 3, reps: '15 reps', restSeconds: 45 }
      ]
    },
    {
      id: 't2',
      discipline: 'Trail Running',
      category: 'Fuerza Especial',
      title: 'Cuestas Cortas Explosivas',
      description: 'Intervalos cortos cuesta arriba enfocados en el desarrollo de la fuerza reactiva.',
      exercises: [
        { id: 'e3', name: 'Cuestas a máxima intensidad', sets: 6, reps: '15 seg', restSeconds: 120 },
        { id: 'e4', name: 'Zancadas de Trail', sets: 3, reps: '20 reps', restSeconds: 60 }
      ]
    }
  ];

  private plan: PlanItem[] = [
    {
      id_entrenamiento: 'w1',
      tipo: 'Trail Running',
      zona_esfuerzo: 'Zona 2 (Aeróbico)',
      fecha_programada: '2026-06-23',
      estado: 'Completado',
      descripcion: 'Sesión aeróbica matutina en el sendero del Bosque para evaluar rangos y fatiga.',
      titulo_entrenamiento: 'Rodaje Zona 2 - Adaptación',
      ejercicios_asociados: [
        {
          id_entrenamiento_ejercicio: 'we1',
          series: 3,
          repeticiones: '45 min',
          orden: 1,
          descanso_segundos: 60,
          duracion_segundos: 2700,
          peso_objetivo: 0,
          estado: 'Completado',
          ejercicio: {
            id_ejercicio: 'e1',
            nombre: 'Trote continuo suave',
            descripcion: 'Trote rítmico a pulso controlado.',
            multimedia_url: 'https://cdn.fitnflai.com/videos/trote.mp4',
            tipo: 'Aeróbico',
            necesita_mapa: true,
            instrucciones: {
              posicion_inicial: 'De pie, con el torso erguido, hombros relajados y mirada al frente.',
              ejecucion: 'Inicia el trote apoyando el mediopie, manteniendo una zancada corta y cadencia de 170-180 ppm.',
              consejos_tecnicos: ['Evita talonear', 'Mantén la respiración nasal rítmica', 'Saca pecho sutilmente'],
              errores_comunes: 'Zancada excesivamente larga (overstriding) e inclinación excesiva hacia adelante.'
            }
          }
        }
      ]
    },
    {
      id_descanso: 'd1',
      tipo: 'Descanso',
      fecha_programada: '2026-06-24',
      mensaje: 'La recuperación es parte del entrenamiento. ¡Disfruta este día de descanso!',
      caminata: '20–30 min a ritmo conversacional',
      movilidad: '10 min de estiramientos dinámicos',
      hidratacion: 'Mantén un buen nivel hídrico hoy',
      sueno: 'Prioriza 7–9 horas de descanso profundo'
    }
  ];

  async getPlanForUser(userId: string): Promise<PlanItem[]> {
    return this.plan;
  }

  async updateWorkoutDate(workoutId: string, date: string): Promise<void> {
    const workout = this.plan.find(item => 'id_entrenamiento' in item && item.id_entrenamiento === workoutId) as Workout;
    if (workout) {
      workout.fecha_programada = date;
    }
  }

  async updateRestDayDate(restDayId: string, date: string): Promise<void> {
    const restDay = this.plan.find(item => 'id_descanso' in item && item.id_descanso === restDayId) as RestDay;
    if (restDay) {
      restDay.fecha_programada = date;
    }
  }

  async saveWorkout(workout: Workout): Promise<void> {
    const idx = this.plan.findIndex(item => 'id_entrenamiento' in item && item.id_entrenamiento === workout.id_entrenamiento);
    if (idx !== -1) {
      this.plan[idx] = workout;
    } else {
      this.plan.push(workout);
    }
  }

  async saveRestDay(restDay: RestDay): Promise<void> {
    const idx = this.plan.findIndex(item => 'id_descanso' in item && item.id_descanso === restDay.id_descanso);
    if (idx !== -1) {
      this.plan[idx] = restDay;
    } else {
      this.plan.push(restDay);
    }
  }

  async deletePlanItemByDate(date: string): Promise<void> {
    this.plan = this.plan.filter(item => item.fecha_programada !== date);
  }

  async getPredefinedWorkouts(): Promise<PredefinedWorkout[]> {
    return this.templates;
  }

  async getWorkoutTemplates(discipline?: string, category?: string): Promise<PredefinedWorkout[]> {
    let result = this.templates;
    if (discipline) result = result.filter(t => t.discipline.toLowerCase() === discipline.toLowerCase());
    if (category) result = result.filter(t => t.category.toLowerCase() === category.toLowerCase());
    return result;
  }
}
