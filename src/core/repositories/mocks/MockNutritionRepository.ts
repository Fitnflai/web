import type { INutritionRepository } from '../ports';
import type { DailyNutritionHydrationLog } from '../../domain/types';

export class MockNutritionRepository implements INutritionRepository {
  private logs: Map<string, DailyNutritionHydrationLog> = new Map();

  constructor() {
    const key = 'paciente-1_2026-06-23';
    this.logs.set(key, {
      id: 'n1',
      userId: 'paciente-1',
      date: '2026-06-23',
      targetKcal: 2200,
      actualKcal: 1100, // Sum of the seeded comidas (450 + 650)
      targetProteins: 150,
      actualProteins: 75, // Sum of seeded proteins (30 + 45)
      targetCarbs: 250,
      actualCarbs: 130, // Sum of seeded carbs (60 + 70)
      targetFats: 70,
      actualFats: 18, // Sum of seeded fats (8 + 10)
      foodLog: [],
      comidas: [
        {
          id_comida: 'm1',
          tipo: 'Desayuno',
          descripcion: 'Avena templada con plátano y whey protein isolate.',
          instrucciones: 'Mezclar 60g de avena con agua caliente. Añadir plátano maduro en rodajas y 1 scoop de proteína de suero aislada.',
          kcal: 450,
          ch: 60,
          proteina: 30,
          grasas: 8,
          etiquetas: ['Fácil digestión', 'Alta proteína']
        },
        {
          id_comida: 'm2',
          tipo: 'Almuerzo',
          descripcion: 'Pechuga de pollo grillada con arroz integral al vapor y brócoli.',
          instrucciones: 'Marinar 150g de pechuga con especias y sal marina. Cocinar a la plancha. Saltear brócoli con ajo picado.',
          kcal: 650,
          ch: 70,
          proteina: 45,
          grasas: 10,
          etiquetas: ['Volumen', 'Post-entreno']
        }
      ],
      liquidVolumeMl: 2500,
      targetLiquidVolumeMl: 3000,
      intakes: [
        { id: 'i1', time: '09:00', volumeMl: 500, type: 'Agua', justification: 'Pre-entrenamiento' },
        { id: 'i2', time: '11:00', volumeMl: 750, type: 'Electrolitos', justification: 'Post-entrenamiento' },
        { id: 'i3', time: '14:30', volumeMl: 500, type: 'Agua', justification: 'Hidratación regular' },
        { id: 'i4', time: '17:00', volumeMl: 750, type: 'Agua', justification: 'Hidratación regular' }
      ],
      dehydrationLevel: 'Mild',
      calculatedDehydrationLiters: 0.4,
      hydrationJustification: '+20% corrección de altitud (2600m)',
      overriddenBySpecialist: false
    });
  }

  async getLog(userId: string, date: string): Promise<DailyNutritionHydrationLog | null> {
    const key = `${userId}_${date}`;
    return this.logs.get(key) || {
      id: Math.random().toString(),
      userId,
      date,
      targetKcal: 2000,
      actualKcal: 0,
      targetProteins: 140,
      actualProteins: 0,
      targetCarbs: 220,
      actualCarbs: 0,
      targetFats: 60,
      actualFats: 0,
      foodLog: [],
      comidas: [],
      liquidVolumeMl: 0,
      targetLiquidVolumeMl: 2500,
      intakes: [],
      dehydrationLevel: 'None',
      calculatedDehydrationLiters: 0,
      hydrationJustification: 'Cálculo inicial estándar',
      overriddenBySpecialist: false
    };
  }

  async saveLog(log: DailyNutritionHydrationLog): Promise<DailyNutritionHydrationLog> {
    const key = `${log.userId}_${log.date}`;
    this.logs.set(key, log);
    return log;
  }
}
