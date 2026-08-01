import type { IBiometricRepository } from '../ports';
import type { BiometricEntry, WeeklyProgressData, WeeklyClinicalReport } from '../../domain/types';

export class MockBiometricRepository implements IBiometricRepository {
  private entries: BiometricEntry[] = [
    {
      id: 'b1',
      userId: 'paciente-1',
      date: '2026-06-10',
      origin: 'Technogym',
      composition: {
        weight: 74.5,
        bodyFatPct: 14.2,
        muscleMass: 36.8,
        waterPct: 61.2,
        waterACT: 45.6,
        waterAEC: 17.8,
        waterAIC: 27.8,
        boneMineral: 3.2,
        bmi: 22.8
      },
      metabolic: {
        bmr: 1750,
        phaseAngle: 6.8
      },
      performance: {
        vo2Max: 54.2,
        mobilityScore: 82,
        balanceLeftSec: 45,
        balanceRightSec: 42,
        wellnessAge: 24
      }
    },
    {
      id: 'b2',
      userId: 'paciente-1',
      date: '2026-06-03',
      origin: 'Technogym',
      composition: {
        weight: 75.1,
        bodyFatPct: 14.8,
        muscleMass: 36.5,
        waterPct: 60.5,
        waterACT: 45.4,
        waterAEC: 18.0,
        waterAIC: 27.4,
        boneMineral: 3.2,
        bmi: 23.0
      },
      metabolic: {
        bmr: 1740,
        phaseAngle: 6.7
      },
      performance: {
        vo2Max: 53.8,
        mobilityScore: 80,
        balanceLeftSec: 42,
        balanceRightSec: 40,
        wellnessAge: 25
      }
    }
  ];

  async getByUserId(userId: string): Promise<BiometricEntry[]> {
    return this.entries.filter(e => e.userId === userId);
  }

  async getLatestByUserId(userId: string): Promise<BiometricEntry | null> {
    const userEntries = await this.getByUserId(userId);
    if (userEntries.length === 0) return null;
    return userEntries.sort((a, b) => b.date.localeCompare(a.date))[0];
  }
  async getWeeklyProgress(userId: string, weekIndex: number): Promise<WeeklyProgressData> {
    // For simplicity, userId is ignored in mock data
    const data = this._mockWeeklyProgressData[weekIndex];
    if (!data) {
      throw new Error(`No mock data for weekIndex: ${weekIndex}`);
    }
    return Promise.resolve(data);
  }

  private _mockWeeklyProgressData: WeeklyProgressData[] = [
    // Week 0: Latest Week (Week 12 equivalent)
    {
      weekIndex: 0,
      label: "Esta semana",
      status: "Excelente Progreso",
      painAlerts: [],
      wellnessIndex: {
        overallScore: 72,
        history8Weeks: [
          { weekLabel: "Sem 5", sleep: 50, stress: 60, nutrition: 65, energy: 55 },
          { weekLabel: "Sem 6", sleep: 55, stress: 55, nutrition: 70, energy: 60 },
          { weekLabel: "Sem 7", sleep: 60, stress: 50, nutrition: 75, energy: 65 },
          { weekLabel: "Sem 8", sleep: 65, stress: 45, nutrition: 80, energy: 70 },
          { weekLabel: "Sem 9", sleep: 68, stress: 42, nutrition: 82, energy: 72 },
          { weekLabel: "Sem 10", sleep: 70, stress: 40, nutrition: 85, energy: 75 },
          { weekLabel: "Sem 11", sleep: 75, stress: 35, nutrition: 88, energy: 78 },
          { weekLabel: "Sem 12", sleep: 80, stress: 30, nutrition: 90, energy: 80 },
        ],
      },
      weightTrend: {
        currentWeight: 87.1,
        targetWeight: 85.0,
        musclePct: 38.0,
        fatPct: 16.0,
        muscleDelta: 0.5,
        fatDelta: -0.8,
        history7Weeks: [
          { weekLabel: "Sem 6", weight: 91.5 },
          { weekLabel: "Sem 7", weight: 90.8 },
          { weekLabel: "Sem 8", weight: 90.1 },
          { weekLabel: "Sem 9", weight: 89.4 },
          { weekLabel: "Sem 10", weight: 88.7 },
          { weekLabel: "Sem 11", weight: 88.0 },
          { weekLabel: "Sem 12", weight: 87.1 },
        ],
      },
      secondaryMetrics: { bodyAge: 28, hydrationDeficit: 0.2, vo2Max: 55 },
      weeklyInsights: [
        { title: "Fuerza", value: "+5kg", description: "Aumento notable en press de banca.", type: "success" },
        { title: "Resistencia", value: "30min", description: "Mejora en carrera continua.", type: "success" },
        { title: "Flexibilidad", value: "10%", description: "Mayor rango de movimiento.", type: "info" },
        { title: "Recuperación", value: "Óptima", description: "Reportes de sueño mejorados.", type: "success" },
      ],
      aiFeedback: "¡Felicidades por tu excelente progreso esta semana! Tu índice de bienestar ha mejorado significativamente, y tus métricas de composición corporal muestran un aumento en la masa muscular y una disminución en la grasa. ¡Sigue así!",
    },
    // Week 1
    {
      weekIndex: 1,
      label: "Semana anterior",
      status: "Buen Progreso",
      painAlerts: [],
      wellnessIndex: {
        overallScore: 70,
        history8Weeks: [
          { weekLabel: "Sem 4", sleep: 48, stress: 62, nutrition: 60, energy: 50 },
          { weekLabel: "Sem 5", sleep: 50, stress: 60, nutrition: 65, energy: 55 },
          { weekLabel: "Sem 6", sleep: 55, stress: 55, nutrition: 70, energy: 60 },
          { weekLabel: "Sem 7", sleep: 60, stress: 50, nutrition: 75, energy: 65 },
          { weekLabel: "Sem 8", sleep: 65, stress: 45, nutrition: 80, energy: 70 },
          { weekLabel: "Sem 9", sleep: 68, stress: 42, nutrition: 82, energy: 72 },
          { weekLabel: "Sem 10", sleep: 70, stress: 40, nutrition: 85, energy: 75 },
          { weekLabel: "Sem 11", sleep: 75, stress: 35, nutrition: 88, energy: 78 },
        ],
      },
      weightTrend: {
        currentWeight: 88.0,
        targetWeight: 85.0,
        musclePct: 37.5,
        fatPct: 16.8,
        muscleDelta: 0.3,
        fatDelta: -0.5,
        history7Weeks: [
          { weekLabel: "Sem 5", weight: 92.2 },
          { weekLabel: "Sem 6", weight: 91.5 },
          { weekLabel: "Sem 7", weight: 90.8 },
          { weekLabel: "Sem 8", weight: 90.1 },
          { weekLabel: "Sem 9", weight: 89.4 },
          { weekLabel: "Sem 10", weight: 88.7 },
          { weekLabel: "Sem 11", weight: 88.0 },
        ],
      },
      secondaryMetrics: { bodyAge: 29, hydrationDeficit: 0.3, vo2Max: 54 },
      weeklyInsights: [
        { title: "Fuerza", value: "+3kg", description: "Mejora en sentadillas.", type: "success" },
        { title: "Dieta", value: "Constante", description: "Mantuvo plan nutricional.", type: "info" },
      ],
      aiFeedback: "Mantienes un buen ritmo. Es notable cómo tu compromiso se refleja en la mejora constante de tu composición corporal.",
    },
    // Week 2
    {
      weekIndex: 2,
      label: "Hace 2 semanas",
      status: "Progreso Estable",
      painAlerts: [],
      wellnessIndex: {
        overallScore: 68,
        history8Weeks: [
          { weekLabel: "Sem 3", sleep: 45, stress: 65, nutrition: 58, energy: 48 },
          { weekLabel: "Sem 4", sleep: 48, stress: 62, nutrition: 60, energy: 50 },
          { weekLabel: "Sem 5", sleep: 50, stress: 60, nutrition: 65, energy: 55 },
          { weekLabel: "Sem 6", sleep: 55, stress: 55, nutrition: 70, energy: 60 },
          { weekLabel: "Sem 7", sleep: 60, stress: 50, nutrition: 75, energy: 65 },
          { weekLabel: "Sem 8", sleep: 65, stress: 45, nutrition: 80, energy: 70 },
          { weekLabel: "Sem 9", sleep: 68, stress: 42, nutrition: 82, energy: 72 },
          { weekLabel: "Sem 10", sleep: 70, stress: 40, nutrition: 85, energy: 75 },
        ],
      },
      weightTrend: {
        currentWeight: 88.7,
        targetWeight: 85.0,
        musclePct: 37.0,
        fatPct: 17.5,
        muscleDelta: 0.2,
        fatDelta: -0.3,
        history7Weeks: [
          { weekLabel: "Sem 4", weight: 92.9 },
          { weekLabel: "Sem 5", weight: 92.2 },
          { weekLabel: "Sem 6", weight: 91.5 },
          { weekLabel: "Sem 7", weight: 90.8 },
          { weekLabel: "Sem 8", weight: 90.1 },
          { weekLabel: "Sem 9", weight: 89.4 },
          { weekLabel: "Sem 10", weight: 88.7 },
        ],
      },
      secondaryMetrics: { bodyAge: 30, hydrationDeficit: 0.4, vo2Max: 53 },
      weeklyInsights: [
        { title: "Recuperación", value: "Necesita mejorar", description: "Reportes de sueño irregulares.", type: "warning" },
        { title: "Adherencia", value: "90%", description: "Buena adherencia al plan.", type: "info" },
      ],
      aiFeedback: "Tu progreso es estable, pero hay oportunidades en la recuperación. Asegurarse de un sueño reparador es clave para optimizar los resultados.",
    },
    // Week 3
    {
      weekIndex: 3,
      label: "Hace 3 semanas",
      status: "Leve Progreso",
      painAlerts: [{ area: "Rodilla Izquierda", level: 3, description: "Dolor leve post-entreno." }],
      wellnessIndex: {
        overallScore: 65,
        history8Weeks: [
          { weekLabel: "Sem 2", sleep: 40, stress: 70, nutrition: 55, energy: 45 },
          { weekLabel: "Sem 3", sleep: 45, stress: 65, nutrition: 58, energy: 48 },
          { weekLabel: "Sem 4", sleep: 48, stress: 62, nutrition: 60, energy: 50 },
          { weekLabel: "Sem 5", sleep: 50, stress: 60, nutrition: 65, energy: 55 },
          { weekLabel: "Sem 6", sleep: 55, stress: 55, nutrition: 70, energy: 60 },
          { weekLabel: "Sem 7", sleep: 60, stress: 50, nutrition: 75, energy: 65 },
          { weekLabel: "Sem 8", sleep: 65, stress: 45, nutrition: 80, energy: 70 },
          { weekLabel: "Sem 9", sleep: 68, stress: 42, nutrition: 82, energy: 72 },
        ],
      },
      weightTrend: {
        currentWeight: 89.4,
        targetWeight: 85.0,
        musclePct: 36.5,
        fatPct: 18.2,
        muscleDelta: 0.1,
        fatDelta: -0.2,
        history7Weeks: [
          { weekLabel: "Sem 3", weight: 93.6 },
          { weekLabel: "Sem 4", weight: 92.9 },
          { weekLabel: "Sem 5", weight: 92.2 },
          { weekLabel: "Sem 6", weight: 91.5 },
          { weekLabel: "Sem 7", weight: 90.8 },
          { weekLabel: "Sem 8", weight: 90.1 },
          { weekLabel: "Sem 9", weight: 89.4 },
        ],
      },
      secondaryMetrics: { bodyAge: 31, hydrationDeficit: 0.5, vo2Max: 52 },
      weeklyInsights: [
        { title: "Dolor", value: "Rodilla Izquierda", description: "Reporte de dolor leve.", type: "warning" },
        { title: "Entrenamiento", value: "Consistente", description: "Asistencia regular.", type: "info" },
      ],
      aiFeedback: "Se observa un progreso leve. Presta atención al dolor reportado en la rodilla izquierda y considera ajustar la intensidad o técnica con tu especialista. El bienestar general muestra espacio para mejorar.",
    },
    // Week 4
    {
      weekIndex: 4,
      label: "Hace 4 semanas",
      status: "Inicio de Progreso",
      painAlerts: [{ area: "Hombro Derecho", level: 2, description: "Molestia ocasional." }],
      wellnessIndex: {
        overallScore: 60,
        history8Weeks: [
          { weekLabel: "Sem 1", sleep: 35, stress: 75, nutrition: 50, energy: 40 },
          { weekLabel: "Sem 2", sleep: 40, stress: 70, nutrition: 55, energy: 45 },
          { weekLabel: "Sem 3", sleep: 45, stress: 65, nutrition: 58, energy: 48 },
          { weekLabel: "Sem 4", sleep: 48, stress: 62, nutrition: 60, energy: 50 },
          { weekLabel: "Sem 5", sleep: 60, stress: 60, nutrition: 65, energy: 55 },
          { weekLabel: "Sem 6", sleep: 55, stress: 55, nutrition: 70, energy: 60 },
          { weekLabel: "Sem 7", sleep: 60, stress: 50, nutrition: 75, energy: 65 },
          { weekLabel: "Sem 8", sleep: 65, stress: 45, nutrition: 80, energy: 70 },
        ],
      },
      weightTrend: {
        currentWeight: 90.1,
        targetWeight: 85.0,
        musclePct: 36.0,
        fatPct: 19.0,
        muscleDelta: 0.0,
        fatDelta: -0.1,
        history7Weeks: [
          { weekLabel: "Sem 2", weight: 94.3 },
          { weekLabel: "Sem 3", weight: 93.6 },
          { weekLabel: "Sem 4", weight: 92.9 },
          { weekLabel: "Sem 5", weight: 92.2 },
          { weekLabel: "Sem 6", weight: 91.5 },
          { weekLabel: "Sem 7", weight: 90.8 },
          { weekLabel: "Sem 8", weight: 90.1 },
        ],
      },
      secondaryMetrics: { bodyAge: 32, hydrationDeficit: 0.2, vo2Max: 51 },
      weeklyInsights: [
        { title: "Adherencia", value: "85%", description: "Faltó un entrenamiento.", type: "neutral" },
        { title: "Hidratación", value: "Baja", description: "Consumo de agua insuficiente.", type: "warning" },
      ],
   aiFeedback: "Estás en el camino correcto para iniciar tu progreso. Es crucial mejorar la adherencia al plan de entrenamiento y, sobre todo, tu hidratación para optimizar tu rendimiento y bienestar general.",
     },
   ];

    private clinicalReports: Record<string, WeeklyClinicalReport[]> = {};

  constructor() {
    this._initClinicalReports();
  }

  async getClinicalReport(userId: string, weekIndex: number): Promise<WeeklyClinicalReport> {
    let userReports = this.clinicalReports[userId];
    if (!userReports || userReports.length === 0) {
      userReports = JSON.parse(JSON.stringify(this.clinicalReports['paciente-1']));
      this.clinicalReports[userId] = userReports; // Store the copied reports for the user
    }
    if (!userReports[weekIndex]) {
      throw new Error(`No clinical report found for user ${userId} and weekIndex ${weekIndex}`);
    }
    return Promise.resolve(userReports[weekIndex]);
  }

  async saveClinicalReport(userId: string, report: WeeklyClinicalReport): Promise<void> {
    if (!this.clinicalReports[userId]) {
      this.clinicalReports[userId] = JSON.parse(JSON.stringify(this.clinicalReports['paciente-1']));
    }
    this.clinicalReports[userId][report.weekOffset] = report;
    return Promise.resolve();
  }

  private _initClinicalReports() {
    const paciente1Id = 'paciente-1';
    this.clinicalReports[paciente1Id] = [];

    // Week Offset 0 (Semana 12)
    this.clinicalReports[paciente1Id][0] = {
      weekOffset: 0,
      label: 'Semana 12',
      status: 'ADELANTE CON AJUSTE',
      painAlert: "Rodilla derecha reportada en 2 de 4 sesiones esta semana (lunes y jueves). Intensidad: 3-4/10, persistente en descensos. Sin impacto en tren inferior por 5 días. Derivar a traumatología si persiste en semana 13.",
      nextWeekPlan: "Trail reducido + movilidad · Carga -20% · Monitoreo de rodilla en cada sesión",
      compositionActivity: {
        rows: [
          { metric: 'Peso', label: 'Peso', target: '72.0 kg', actual: '72.4 kg', S_1: '73.2', S_4: '75.3' },
          { metric: 'Músculo est.', label: 'Músculo est.', target: '60%', actual: '62%', S_1: '61%', S_4: '59%' },
          { metric: 'Grasa est.', label: 'Grasa est.', target: '35%', actual: '38%', S_1: '39%', S_4: '41%' },
          { metric: 'Déf. hídrico', label: 'Déf. hídrico', target: '2.0 L', actual: '3.2 L', S_1: '2.8', S_4: '2.1' },
          { metric: 'Sesiones', label: 'Sesiones', target: '5/5', actual: '4/5', S_1: '4/5', S_4: '—' },
          { metric: 'Kcal entreno', label: 'Kcal entreno', target: '1500', actual: '1840', S_1: '1720', S_4: '—' },
          { metric: 'RPE prom.', label: 'RPE prom.', target: '6.0', actual: '6.8/10', S_1: '6.4', S_4: '—' },
        ],
        comment: "Revisar peso y grasa est. Déficit hídrico alto."
      },
      painLog: {
        rows: [
          { id: 'pain-1', zone: 'Rodilla der.', intensity: '3/10' }, // Lun 23
          { id: 'pain-2', zone: '—', intensity: '—' }, // Mar 24
          { id: 'pain-3', zone: '—', intensity: '—' }, // Mié 25
          { id: 'pain-4', zone: 'Rodilla der.', intensity: '4/10' }, // Jue 26
          { id: 'pain-5', zone: '—', intensity: '—' }, // Sáb 28
        ],
        comment: "Dolor en rodilla derecha requiere seguimiento. Evitar descensos."
      },
      evolution8Weeks: {
        rows: [
          { weekLabel: 'S5', weight: '76.1', musclePct: '58%', fatPct: '45%', note: '—' },
          { weekLabel: 'S6', weight: '75.8', musclePct: '62%', fatPct: '45%', note: '—' },
          { weekLabel: 'S7', weight: '75.5', musclePct: '56%', fatPct: '45%', note: 'Hombro molestia' },
          { weekLabel: 'S8', weight: '75.2', musclePct: '67%', fatPct: '45%', note: '—' },
          { weekLabel: 'S9', weight: '74.5', musclePct: '81%', fatPct: '45%', note: '—' },
          { weekLabel: 'S10', weight: '74.0', musclePct: '72%', fatPct: '45%', note: '—' },
          { weekLabel: 'S11', weight: '73.2', musclePct: '68%', fatPct: '45%', note: '—' },
          { weekLabel: 'S12', weight: '72.4', musclePct: '74%', fatPct: '45%', note: 'Trail reducido' },
        ],
        comment: "Peso se mantiene, pero porcentaje muscular bajo. Trail reducido esta semana."
      },
      generalObservations: "Carlos ha mostrado un buen compromiso, pero la molestia en la rodilla derecha es un factor a considerar. Se sugiere un ajuste en el entrenamiento de trail y monitoreo constante."
    } as WeeklyClinicalReport;


    // Week Offset 1 (Semana 11)
    this.clinicalReports[paciente1Id][1] = {
      weekOffset: 1,
      label: 'Semana 11',
      status: 'ADELANTE',
      painAlert: "Sin alertas de dolor significativas.",
      nextWeekPlan: "Mantener volumen de entrenamiento. Introducir 1 sesión de fuerza explosiva.",
      compositionActivity: {
        rows: [
          { metric: 'Peso', label: 'Peso', target: '73.0 kg', actual: '73.2 kg', S_1: '74.0', S_4: '75.8' },
          { metric: 'Músculo est.', label: 'Músculo est.', target: '60%', actual: '61%', S_1: '68%', S_4: '62%' },
          { metric: 'Grasa est.', label: 'Grasa est.', target: '36%', actual: '39%', S_1: '40%', S_4: '42%' },
          { metric: 'Déf. hídrico', label: 'Déf. hídrico', target: '2.0 L', actual: '2.8 L', S_1: '2.5', S_4: '2.0' },
          { metric: 'Sesiones', label: 'Sesiones', target: '5/5', actual: '4/5', S_1: '5/5', S_4: '—' },
          { metric: 'Kcal entreno', label: 'Kcal entreno', target: '1500', actual: '1720', S_1: '1650', S_4: '—' },
          { metric: 'RPE prom.', label: 'RPE prom.', target: '6.0', actual: '6.4/10', S_1: '6.2', S_4: '—' },
        ],
        comment: "Buen progreso general. Mantener enfoque en hidratación."
      },
      painLog: {
        rows: [
          { id: 'pain-6', zone: '—', intensity: '—' },
          { id: 'pain-7', zone: '—', intensity: '—' },
          { id: 'pain-8', zone: '—', intensity: '—' },
          { id: 'pain-9', zone: '—', intensity: '—' },
          { id: 'pain-10', zone: '—', intensity: '—' },
        ],
        comment: "No se reportaron dolores esta semana."
      },
      evolution8Weeks: {
        rows: [
          { weekLabel: 'S4', weight: '76.5', musclePct: '57%', fatPct: '46%', note: '—' },
          { weekLabel: 'S5', weight: '76.1', musclePct: '58%', fatPct: '45%', note: '—' },
          { weekLabel: 'S6', weight: '75.8', musclePct: '62%', fatPct: '45%', note: '—' },
          { weekLabel: 'S7', weight: '75.5', musclePct: '56%', fatPct: '45%', note: 'Hombro molestia' },
          { weekLabel: 'S8', weight: '75.2', musclePct: '67%', fatPct: '45%', note: '—' },
          { weekLabel: 'S9', weight: '74.5', musclePct: '81%', fatPct: '45%', note: '—' },
          { weekLabel: 'S10', weight: '74.0', musclePct: '72%', fatPct: '45%', note: '—' },
          { weekLabel: 'S11', weight: '73.2', musclePct: '68%', fatPct: '45%', note: '—' },
        ],
        comment: "Progreso constante. Reducir grasa est. es clave."
      },
      generalObservations: "Carlos mantiene un buen rendimiento. Es importante seguir monitoreando los déficits hídricos para optimizar la recuperación."
    } as WeeklyClinicalReport;


    // Week Offset 2 (Semana 10)
    this.clinicalReports[paciente1Id][2] = {
      weekOffset: 2,
      label: 'Semana 10',
      status: 'ADELANTE',
      painAlert: "Molestia leve en hombro derecho (jueves).",
      nextWeekPlan: "Foco en técnica de levantamiento de pesas. 1 día de descanso activo.",
      compositionActivity: {
        rows: [
          { metric: 'Peso', label: 'Peso', target: '74.0 kg', actual: '74.0 kg', S_1: '74.5', S_4: '76.1' },
          { metric: 'Músculo est.', label: 'Músculo est.', target: '60%', actual: '68%', S_1: '72%', S_4: '58%' },
          { metric: 'Grasa est.', label: 'Grasa est.', target: '37%', actual: '40%', S_1: '41%', S_4: '46%' },
          { metric: 'Déf. hídrico', label: 'Déf. hídrico', target: '2.0 L', actual: '2.5 L', S_1: '2.2', S_4: '2.0' },
          { metric: 'Sesiones', label: 'Sesiones', target: '5/5', actual: '5/5', S_1: '4/5', S_4: '—' },
          { metric: 'Kcal entreno', label: 'Kcal entreno', target: '1400', actual: '1650', S_1: '1500', S_4: '—' },
          { metric: 'RPE prom.', label: 'RPE prom.', target: '5.5', actual: '6.2/10', S_1: '6.0', S_4: '—' },
        ],
        comment: "Buen balance en composición. Monitorear molestia en hombro."
      },
      painLog: {
        rows: [
          { id: 'pain-11', zone: '—', intensity: '—' },
          { id: 'pain-12', zone: '—', intensity: '—' },
          { id: 'pain-13', zone: '—', intensity: '—' },
          { id: 'pain-14', zone: 'Hombro der.', intensity: '2/10' },
          { id: 'pain-15', zone: '—', intensity: '—' },
        ],
        comment: "Molestia en hombro controlada. Enfatizar calentamiento."
      },
      evolution8Weeks: {
        rows: [
          { weekLabel: 'S3', weight: '77.0', musclePct: '55%', fatPct: '47%', note: '—' },
          { weekLabel: 'S4', weight: '76.5', musclePct: '57%', fatPct: '46%', note: '—' },
          { weekLabel: 'S5', weight: '76.1', musclePct: '58%', fatPct: '45%', note: '—' },
          { weekLabel: 'S6', weight: '75.8', musclePct: '62%', fatPct: '45%', note: '—' },
          { weekLabel: 'S7', weight: '75.5', musclePct: '56%', fatPct: '45%', note: 'Hombro molestia' },
          { weekLabel: 'S8', weight: '75.2', musclePct: '67%', fatPct: '45%', note: '—' },
          { weekLabel: 'S9', weight: '74.5', musclePct: '81%', fatPct: '45%', note: '—' },
          { weekLabel: 'S10', weight: '74.0', musclePct: '72%', fatPct: '45%', note: '—' },
        ],
        comment: "Hombro mejorando. Mantener técnica."
      },
      generalObservations: "Se mantiene un progreso sólido, con atención a la molestia en el hombro. La adherencia al plan es excelente."
    } as WeeklyClinicalReport;


    // Week Offset 3 (Semana 9)
    this.clinicalReports[paciente1Id][3] = {
      weekOffset: 3,
      label: 'Semana 9',
      status: 'PRECAUCIÓN',
      painAlert: "Dolor lumbar bajo (miércoles y viernes). Intensidad 3/10. Realizar ejercicios de fortalecimiento del core.",
      nextWeekPlan: "Reducir cargas en ejercicios de espalda. Incluir más estiramientos y movilidad.",
      compositionActivity: {
        rows: [
          { metric: 'Peso', label: 'Peso', target: '75.0 kg', actual: '74.5 kg', S_1: '75.2', S_4: '77.0' },
          { metric: 'Músculo est.', label: 'Músculo est.', target: '60%', actual: '72%', S_1: '81%', S_4: '55%' },
          { metric: 'Grasa est.', label: 'Grasa est.', target: '38%', actual: '41%', S_1: '42%', S_4: '47%' },
          { metric: 'Déf. hídrico', label: 'Déf. hídrico', target: '2.0 L', actual: '2.2 L', S_1: '2.0', S_4: '1.8' },
          { metric: 'Sesiones', label: 'Sesiones', target: '5/5', actual: '4/5', S_1: '5/5', S_4: '—' },
          { metric: 'Kcal entreno', label: 'Kcal entreno', target: '1400', actual: '1500', S_1: '1450', S_4: '—' },
          { metric: 'RPE prom.', label: 'RPE prom.', target: '5.5', actual: '6.0/10', S_1: '5.8', S_4: '—' },
        ],
        comment: "Dolor lumbar es preocupante. Ajustar entrenamiento para prevenir lesiones."
      },
      painLog: {
        rows: [
          { id: 'pain-16', zone: '—', intensity: '—' },
          { id: 'pain-17', zone: 'Lumbar bajo', intensity: '3/10' },
          { id: 'pain-18', zone: '—', intensity: '—' },
          { id: 'pain-19', zone: 'Lumbar bajo', intensity: '3/10' },
          { id: 'pain-20', zone: '—', intensity: '—' },
        ],
        comment: "Revisar técnica de sentadillas y peso muerto."
      },
      evolution8Weeks: {
        rows: [
          { weekLabel: 'S2', weight: '77.0', musclePct: '55%', fatPct: '47%', note: '—' },
          { weekLabel: 'S3', weight: '77.0', musclePct: '55%', fatPct: '47%', note: '—' },
          { weekLabel: 'S4', weight: '76.5', musclePct: '57%', fatPct: '46%', note: '—' },
          { weekLabel: 'S5', weight: '76.1', musclePct: '58%', fatPct: '45%', note: '—' },
          { weekLabel: 'S6', weight: '75.8', musclePct: '62%', fatPct: '45%', note: '—' },
          { weekLabel: 'S7', weight: '75.5', musclePct: '56%', fatPct: '45%', note: 'Hombro molestia' },
          { weekLabel: 'S8', weight: '75.2', musclePct: '67%', fatPct: '45%', note: '—' },
          { weekLabel: 'S9', weight: '74.5', musclePct: '81%', fatPct: '45%', note: '—' },
        ],
        comment: "Importante corregir el dolor lumbar."
      },
      generalObservations: "Se detecta dolor lumbar. Es crucial ajustar la rutina y priorizar la recuperación de la zona media."
    } as WeeklyClinicalReport;


    // Week Offset 4 (Semana 8)
    this.clinicalReports[paciente1Id][4] = {
      weekOffset: 4,
      label: 'Semana 8',
      status: 'PRECAUCIÓN',
      painAlert: "Molestia en tobillo izquierdo (lunes). Leve. No impide el entrenamiento.",
      nextWeekPlan: "Ejercicios de movilidad de tobillo. Reducir impacto en carrera.",
      compositionActivity: {
        rows: [
          { metric: 'Peso', label: 'Peso', target: '76.0 kg', actual: '75.2 kg', S_1: '75.5', S_4: '77.5' },
          { metric: 'Músculo est.', label: 'Músculo est.', target: '60%', actual: '81%', S_1: '67%', S_4: '53%' },
          { metric: 'Grasa est.', label: 'Grasa est.', target: '39%', actual: '42%', S_1: '43%', S_4: '48%' },
          { metric: 'Déf. hídrico', label: 'Déf. hídrico', target: '2.0 L', actual: '2.0 L', S_1: '1.9', S_4: '1.7' },
          { metric: 'Sesiones', label: 'Sesiones', target: '5/5', actual: '5/5', S_1: '4/5', S_4: '—' },
          { metric: 'Kcal entreno', label: 'Kcal entreno', target: '1300', actual: '1450', S_1: '1400', S_4: '—' },
          { metric: 'RPE prom.', label: 'RPE prom.', target: '5.0', actual: '5.8/10', S_1: '5.5', S_4: '—' },
        ],
        comment: "Tobillo izquierdo requiere atención. Buen rendimiento en general."
      },
      painLog: {
        rows: [
          { id: 'pain-21', zone: 'Tobillo izq.', intensity: '2/10' },
          { id: 'pain-22', zone: '—', intensity: '—' },
          { id: 'pain-23', zone: '—', intensity: '—' },
          { id: 'pain-24', zone: '—', intensity: '—' },
          { id: 'pain-25', zone: '—', intensity: '—' },
        ],
        comment: "Movilidad de tobillo al inicio del entrenamiento."
      },
      evolution8Weeks: {
        rows: [
          { weekLabel: 'S1', weight: '78.0', musclePct: '50%', fatPct: '49%', note: '—' },
          { weekLabel: 'S2', weight: '77.5', musclePct: '53%', fatPct: '48%', note: '—' },
          { weekLabel: 'S3', weight: '77.0', musclePct: '55%', fatPct: '47%', note: '—' },
          { weekLabel: 'S4', weight: '76.5', musclePct: '57%', fatPct: '46%', note: '—' },
          { weekLabel: 'S5', weight: '76.1', musclePct: '58%', fatPct: '45%', note: '—' },
          { weekLabel: 'S6', weight: '75.8', musclePct: '62%', fatPct: '45%', note: '—' },
          { weekLabel: 'S7', weight: '75.5', musclePct: '56%', fatPct: '45%', note: 'Hombro molestia' },
          { weekLabel: 'S8', weight: '75.2', musclePct: '67%', fatPct: '45%', note: '—' },
        ],
        comment: "Monitorear tobillo. Mantener buena ejecución."
      },
      generalObservations: "El progreso es constante, pero la molestia en el tobillo izquierdo requiere atención preventiva. Es fundamental trabajar en la movilidad."
    } as WeeklyClinicalReport;

  }
}

