import type { PlanItem } from '@/types'

export const MOCK_PLAN: PlanItem[] = [
  { id_entrenamiento:'ent-001',tipo:'Aeróbico Z1',fecha_programada:'2026-06-01',estado:'completado',descripcion:'Sesión aeróbica de baja intensidad.',titulo_entrenamiento:'Entrenamiento Aeróbico Z1',ejercicios_asociados:[
    {id_entrenamiento_ejercicio:'ee-001',series:3,repeticiones:'12 min',orden:1,descanso_segundos:60,duracion_segundos:720,peso_objetivo:0,estado:'completado',ejercicio:{id_ejercicio:'ex-001',nombre:'Trote suave en terreno plano',descripcion:'FC 120-135 lpm. Ritmo conversacional.',multimedia_url:'',tipo:'Cardio'}},
    {id_entrenamiento_ejercicio:'ee-002',series:2,repeticiones:'15 rep',orden:2,descanso_segundos:45,duracion_segundos:0,peso_objetivo:0,estado:'completado',ejercicio:{id_ejercicio:'ex-003',nombre:'Estiramiento de gemelos en pared',descripcion:'30 segundos por pierna.',multimedia_url:'',tipo:'Estiramiento'}}
  ]},
  { id_entrenamiento:'ent-002',tipo:'Fuerza',fecha_programada:'2026-06-02',estado:'completado',descripcion:'Bloque fuerza inferior.',titulo_entrenamiento:'Fuerza Inferior',ejercicios_asociados:[
    {id_entrenamiento_ejercicio:'ee-004',series:4,repeticiones:'12 rep',orden:1,descanso_segundos:90,duracion_segundos:0,peso_objetivo:40,estado:'completado',ejercicio:{id_ejercicio:'ex-004',nombre:'Sentadilla con peso',descripcion:'Espalda recta, rodillas alineadas.',multimedia_url:'',tipo:'Fuerza'}},
    {id_entrenamiento_ejercicio:'ee-005',series:3,repeticiones:'10 rep',orden:2,descanso_segundos:75,duracion_segundos:0,peso_objetivo:30,estado:'completado',ejercicio:{id_ejercicio:'ex-005',nombre:'Peso muerto rumano',descripcion:'Cadera atrás, barra cerca.',multimedia_url:'',tipo:'Fuerza'}},
    {id_entrenamiento_ejercicio:'ee-006',series:3,repeticiones:'15 c/u',orden:3,descanso_segundos:60,duracion_segundos:0,peso_objetivo:20,estado:'completado',ejercicio:{id_ejercicio:'ex-006',nombre:'Zancada alternada',descripcion:'Paso adelante controlado.',multimedia_url:'',tipo:'Fuerza'}}
  ]},
  { id_entrenamiento:'ent-003',tipo:'Técnica',fecha_programada:'2026-06-03',estado:'completado',descripcion:'Natación técnica.',titulo_entrenamiento:'Natación Técnica',ejercicios_asociados:[
    {id_entrenamiento_ejercicio:'ee-008',series:4,repeticiones:'50m',orden:1,descanso_segundos:30,duracion_segundos:0,peso_objetivo:0,estado:'completado',ejercicio:{id_ejercicio:'ex-008',nombre:'Drill cabeza estilo libre',descripcion:'Foco en rotación y entrada de mano.',multimedia_url:'',tipo:'Técnica'}}
  ]},
  { id_descanso:'desc-001', tipo:'Descanso',fecha_programada:'2026-06-04',mensaje:'La recuperación es parte del entrenamiento.',caminata:'20–30 min a ritmo conversacional',movilidad:'10 min de estiramientos dinámicos',hidratacion:'Mantén un buen nivel hídrico hoy',sueno:'Prioriza 7–9 horas de descanso' },
  { id_entrenamiento:'ent-004',tipo:'Aeróbico Z2',fecha_programada:'2026-06-05',estado:'completado',descripcion:'Sesión aeróbica zona 2. FC 135-150 lpm.',titulo_entrenamiento:'Bici Zona 2',ejercicios_asociados:[
    {id_entrenamiento_ejercicio:'ee-010',series:1,repeticiones:'70 min',orden:1,descanso_segundos:0,duracion_segundos:4200,peso_objetivo:0,estado:'completado',ejercicio:{id_ejercicio:'ex-010',nombre:'Pedaleo constante 60-70% FCmáx',descripcion:'Cadencia 80-90 RPM.',multimedia_url:'',tipo:'Cardio'}}
  ]},
  { id_descanso:'desc-002', tipo:'Descanso',fecha_programada:'2026-06-06',mensaje:'Recarga baterías. Fitnflai te quiere fuerte, no quemado.',caminata:'Caminata activa 25 min',movilidad:'Yoga rápido: 10 min',hidratacion:'Hidratación constante',sueno:'El descanso es tu mejor entrenamiento' },
  { id_entrenamiento:'ent-005',tipo:'Sesión clave',fecha_programada:'2026-06-07',estado:'pendiente',descripcion:'Mayor intensidad de la semana. Fuerza superior + core.',titulo_entrenamiento:'Fuerza Superior + Core',ejercicios_asociados:[
    {id_entrenamiento_ejercicio:'ee-011',series:4,repeticiones:'10 rep',orden:1,descanso_segundos:90,duracion_segundos:0,peso_objetivo:20,estado:'pendiente',ejercicio:{id_ejercicio:'ex-011',nombre:'Press de banca',descripcion:'Control en bajada, explosivo en subida.',multimedia_url:'',tipo:'Fuerza'}},
    {id_entrenamiento_ejercicio:'ee-013',series:3,repeticiones:'45 seg',orden:2,descanso_segundos:30,duracion_segundos:45,peso_objetivo:0,estado:'pendiente',ejercicio:{id_ejercicio:'ex-013',nombre:'Plancha frontal',descripcion:'Cuerpo recto, abdomen contraído.',multimedia_url:'',tipo:'Core'}}
  ]},
]
