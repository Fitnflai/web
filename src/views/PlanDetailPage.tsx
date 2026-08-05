import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store/useAppStore'
import { useTranslation } from '@/i18n/useTranslation'
import { T } from '@/components/ui/Typography'
import { Footer } from '@/components/layout/Footer'
import { 
  IconBrandApple, 
  IconBrandGooglePlay, 
  IconRun, 
  IconBike, 
  IconSwimming, 
  IconMountain, 
  IconDeviceWatch, 
  IconRoute, 
  IconStar, 
  IconCheck, 
  IconUsers, 
  IconGift, 
  IconCompass, 
  IconMessageCircle, 
  IconChevronLeft, 
  IconChevronRight, 
  IconMail, 
  IconTrophy, 
  IconLayoutDashboard, 
  IconUser,
  IconSparkles,
  IconChevronDown
} from '@tabler/icons-react'

interface WorkoutExplanation {
  title: string;
  desc: string;
  category: string;
}

interface AdviceSection {
  title: string;
  desc: string;
  bullets: string[];
  img: string;
}

interface PlanData {
  name: string;
  heroSubtitle: string;
  heroButton: string;
  menu: {
    how: string;
    benefits: string;
    custom: string;
    types: string;
    faqs: string;
  };
  whyUseTitle: string;
  whyUseParagraphs: string[];
  whyUseTestimonial: {
    quote: string;
    author: string;
    specialty: string;
    avatar: string;
  };
  whyChooseTitle: string;
  mockupFeatures: { title: string; desc: string }[];
  howItWorks: { title: string; desc: string }[];
  workouts: WorkoutExplanation[];
  advices: AdviceSection[];
  storiesTitle: string;
  storiesSubtitle: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButton: string;
  ctaLower: string;
}

const plansData: Record<'ES' | 'EN', Record<string, PlanData>> = {
  ES: {
    'trail-running': {
      name: 'Trail Running',
      heroSubtitle: 'Entrena con un plan diseñado según tu nivel, experiencia, objetivos y disponibilidad. Mejora tu resistencia, velocidad y rendimiento en montaña con un programa creado específicamente para ti.',
      heroButton: 'Comienza tu plan',
      menu: {
        how: 'Cómo funciona',
        benefits: 'Beneficios',
        custom: 'Plan personalizado',
        types: 'Tipos de entrenamiento',
        faqs: 'Preguntas frecuentes'
      },
      whyUseTitle: '¿Por qué utilizar un plan de entrenamiento personalizado?',
      whyUseParagraphs: [
        'Cada corredor tiene un punto de partida diferente. Un plan personalizado adapta el volumen, la intensidad y la recuperación según tu condición física para ayudarte a progresar de forma segura y constante.',
        'Evita el sobreentrenamiento, reduce el riesgo de lesiones y llega mejor preparado a cada carrera de trail.'
      ],
      whyUseTestimonial: {
        quote: 'Desde que sigo un plan personalizado mejoré mi resistencia en subidas y terminé mi primer ultra trail sin lesiones.',
        author: 'Carlos G.',
        specialty: 'Corredor de Trail Running',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80'
      },
      whyChooseTitle: '¿Por qué elegir nuestros planes?',
      mockupFeatures: [
        { title: 'Plan totalmente personalizado', desc: 'Entrenamientos adaptados a tu nivel, experiencia, objetivos y disponibilidad semanal.' },
        { title: 'Seguimiento profesional', desc: 'Recibe ajustes continuos según tu evolución, sensaciones y rendimiento.' },
        { title: 'Preparación específica para montaña', desc: 'Trabaja fuerza, resistencia, desnivel, técnica y velocidad para afrontar cualquier terreno.' },
        { title: 'Análisis de progreso', desc: 'Monitorea tu evolución mediante métricas de entrenamiento y recomendaciones personalizadas.' }
      ],
      howItWorks: [
        { title: 'Cuéntanos tus objetivos', desc: 'Completa un formulario sobre tu experiencia, disponibilidad y próximas carreras.' },
        { title: 'Diseñamos tu plan', desc: 'Creamos un programa completamente adaptado a tus necesidades.' },
        { title: 'Entrena semana a semana', desc: 'Recibe entrenamientos claros con objetivos específicos para cada sesión.' },
        { title: 'Alcanza tu meta', desc: 'Mejora tu rendimiento y llega preparado para competir o disfrutar cada salida.' }
      ],
      workouts: [
        { title: 'Resistencia Aeróbica', desc: 'Construye la base necesaria para soportar largas distancias.', category: 'AERÓBICO' },
        { title: 'Series en Cuestas', desc: 'Mejora la fuerza y la potencia para afrontar desniveles exigentes.', category: 'DESNIVEL' },
        { title: 'Técnica de Trail', desc: 'Aprende a correr de forma eficiente en subidas, bajadas y terrenos técnicos.', category: 'TÉCNICA' },
        { title: 'Tiradas Largas', desc: 'Desarrolla resistencia física y mental para carreras de media y larga distancia.', category: 'ENDURANCE' }
      ],
      advices: [
        { 
          title: 'Nutrición para Trail Running', 
          desc: 'Aprende qué comer antes, durante y después de tus entrenamientos y competiciones para mantener un rendimiento óptimo.', 
          bullets: ['Suplementación mineral e hidratación', 'Carga de glucógeno para fondo', 'Uso de sales en clima extremo'], 
          img: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=400&q=80' 
        },
        { 
          title: 'Fuerza para corredores', 
          desc: 'Ejercicios específicos para fortalecer piernas, core y estabilidad, reduciendo el riesgo de lesiones.', 
          bullets: ['Sentadillas excéntricas en cuesta', 'Ejercicios concéntricos de gemelos', 'Estabilidad del tobillo propioceptiva'], 
          img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80' 
        },
        { 
          title: 'Recuperación inteligente', 
          desc: 'Conoce las mejores estrategias para recuperarte después de entrenamientos intensos y seguir progresando.', 
          bullets: ['Estiramientos de descarga muscular', 'Masaje con rodillo de espuma (foam roller)', '8 horas de sueño constante'], 
          img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80' 
        }
      ],
      storiesTitle: 'Corredores que alcanzaron sus objetivos',
      storiesSubtitle: 'Descubre cómo nuestros atletas mejoraron sus tiempos, completaron sus primeros trails y lograron nuevos retos gracias a un entrenamiento personalizado.',
      ctaTitle: 'Lleva tu Trail Running al siguiente nivel',
      ctaSubtitle: 'Empieza hoy mismo con un plan diseñado exclusivamente para ti y prepárate para conquistar nuevos senderos con confianza.',
      ctaButton: 'Comenzar ahora',
      ctaLower: 'Prueba gratuita · Cancela cuando quieras'
    },
    // Placeholders for other plans in ES
    'ciclismo-de-ruta': {
      name: 'Ciclismo de Ruta',
      heroSubtitle: 'Entrena con un plan diseñado según tu nivel, objetivos y disponibilidad. Mejora tu potencia, resistencia y rendimiento sobre la bicicleta con entrenamientos adaptados a tu evolución.',
      heroButton: 'Comienza tu plan',
      menu: {
        how: 'Cómo funciona',
        benefits: 'Beneficios',
        custom: 'Plan personalizado',
        types: 'Tipos de entrenamiento',
        faqs: 'Preguntas frecuentes'
      },
      whyUseTitle: '¿Por qué utilizar un plan de entrenamiento personalizado?',
      whyUseParagraphs: [
        'Cada ciclista tiene objetivos y capacidades diferentes. Un plan personalizado ajusta la carga de entrenamiento, la intensidad and la recuperación para ayudarte a progresar de forma eficiente y sostenible.',
        'Entrena con confianza, mejora tu rendimiento y llega preparado para cualquier reto, desde una salida de fin de semana hasta una competencia de larga distancia.'
      ],
      whyUseTestimonial: {
        quote: 'Con mi plan personalizado aumenté mi potencia, mejoré mi resistencia y logré completar mi primer gran fondo con excelentes sensaciones.',
        author: 'Andrés M.',
        specialty: 'Ciclista de Ruta',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80'
      },
      whyChooseTitle: '¿Por qué elegir nuestros planes?',
      mockupFeatures: [
        { title: 'Plan totalmente personalizado', desc: 'Entrenamientos adaptados a tu condición física, experiencia, objetivos y tiempo disponible.' },
        { title: 'Seguimiento profesional', desc: 'Ajustamos tu plan continuamente según tu progreso, rendimiento y recuperación.' },
        { title: 'Entrenamientos específicos', desc: 'Desarrolla potencia, resistencia, cadencia, técnica y eficiencia para rendir mejor en cada salida.' },
        { title: 'Análisis de rendimiento', desc: 'Visualiza tu progreso mediante métricas como potencia, frecuencia cardíaca, velocidad y carga de entrenamiento.' }
      ],
      howItWorks: [
        { title: 'Cuéntanos tus objetivos', desc: 'Comparte tu experiencia, disponibilidad semanal y las pruebas o retos que deseas completar.' },
        { title: 'Diseñamos tu plan', desc: 'Creamos un programa adaptado a tu nivel, calendario y objetivos deportivos.' },
        { title: 'Entrena cada semana', desc: 'Recibe sesiones estructuradas con objetivos claros para mejorar tu rendimiento progresivamente.' },
        { title: 'Alcanza tu mejor versión', desc: 'Incrementa tu resistencia, potencia y confianza para afrontar cualquier recorrido.' }
      ],
      workouts: [
        { title: 'Fondo Aeróbico', desc: 'Construye una base sólida de resistencia para afrontar rutas largas con mayor eficiencia.', category: 'AERÓBICO' },
        { title: 'Intervalos de Potencia', desc: 'Mejora tu FTP, capacidad anaeróbica y respuesta en cambios de ritmo.', category: 'POTENCIA' },
        { title: 'Subidas y Escaladas', desc: 'Entrena la fuerza y la resistencia necesarias para rendir mejor en puertos y ascensos.', category: 'DESNIVEL' },
        { title: 'Recuperación Activa', desc: 'Sesiones de baja intensidad que favorecen la recuperación y optimizan el rendimiento.', category: 'RECUPERACIÓN' }
      ],
      advices: [
        { 
          title: 'Nutrición para Ciclistas', 
          desc: 'Aprende cómo alimentarte e hidratarte antes, durante y después de cada entrenamiento o competencia.', 
          bullets: ['Suplementación e hidratación en ruta', 'Carga de carbohidratos previos', 'Sales para rodadas largas'], 
          img: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=400&q=80' 
        },
        { 
          title: 'Fuerza para Ciclistas', 
          desc: 'Ejercicios específicos para fortalecer piernas, core y estabilidad, mejorando la transferencia de potencia al pedaleo.', 
          bullets: ['Prensa de piernas unilateral', 'Sentadilla profunda', 'Planchas estables de core'], 
          img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80' 
        },
        { 
          title: 'Estrategias de Recuperación', 
          desc: 'Descubre cómo optimizar el descanso, reducir la fatiga muscular y mantener un rendimiento constante.', 
          bullets: ['Masaje de pantorrillas', 'Estiramientos lumbares específicos', 'Hidratación mineralizada posterior'], 
          img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80' 
        }
      ],
      storiesTitle: 'Ciclistas que alcanzaron nuevos objetivos',
      storiesSubtitle: 'Conoce cómo nuestros atletas mejoraron su potencia, completaron grandes fondos y alcanzaron nuevos récords personales gracias a un entrenamiento personalizado.',
      ctaTitle: 'Lleva tu ciclismo al siguiente nivel',
      ctaSubtitle: 'Comienza hoy con un plan de entrenamiento diseñado exclusivamente para ti y disfruta de cada kilómetro con mayor rendimiento y confianza.',
      ctaButton: 'Comenzar ahora',
      ctaLower: 'Prueba gratuita · Cancela cuando quieras'
    },
    'mtb': {
      name: 'MTB (Ciclismo de Montaña)',
      heroSubtitle: 'Domina cualquier sendero con un plan de entrenamiento diseñado según tu nivel, objetivos y disponibilidad. Mejora tu resistencia, técnica, potencia y control para rendir al máximo en cada ruta de montaña.',
      heroButton: 'Comienza tu plan',
      menu: {
        how: 'Cómo funciona',
        benefits: 'Beneficios',
        custom: 'Plan personalizado',
        types: 'Tipos de entrenamiento',
        faqs: 'Preguntas frecuentes'
      },
      whyUseTitle: '¿Por qué utilizar un plan de entrenamiento personalizado?',
      whyUseParagraphs: [
        'El ciclismo de montaña exige mucho más que resistencia. Necesitas potencia, técnica, equilibrio y capacidad para adaptarte a terrenos cambiantes. Un plan personalizado te permite entrenar cada una de estas habilidades de forma progresiva y segura.',
        'Prepárate para afrontar senderos técnicos, ascensos exigentes y descensos con mayor confianza, reduciendo el riesgo de lesiones y mejorando tu rendimiento.'
      ],
      whyUseTestimonial: {
        quote: 'Gracias al entrenamiento personalizado mejoré mi técnica en los descensos, aumenté mi resistencia y completé mi primera maratón de MTB con excelentes resultados.',
        author: 'Laura P.',
        specialty: 'Ciclista de Montaña',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80'
      },
      whyChooseTitle: '¿Por qué elegir nuestros planes?',
      mockupFeatures: [
        { title: 'Plan totalmente personalizado', desc: 'Entrenamientos diseñados según tu experiencia, condición física, disciplina (XC, XCM, Enduro o Maratón) y objetivos personales.' },
        { title: 'Seguimiento profesional', desc: 'Ajustamos tu planificación según tu evolución, recuperación y rendimiento en cada salida.' },
        { title: 'Preparación específica para MTB', desc: 'Desarrolla fuerza, técnica, equilibrio, potencia y resistencia para superar cualquier tipo de terreno.' },
        { title: 'Análisis de rendimiento', desc: 'Monitorea métricas como potencia, frecuencia cardíaca, desnivel acumulado, velocidad y carga de entrenamiento para optimizar tu progreso.' }
      ],
      howItWorks: [
        { title: 'Cuéntanos tus objetivos', desc: 'Indícanos tu experiencia, disponibilidad semanal, tipo de MTB que practicas y los retos que deseas alcanzar.' },
        { title: 'Diseñamos tu plan', desc: 'Creamos un programa completamente adaptado a tu nivel, calendario y modalidad de ciclismo de montaña.' },
        { title: 'Entrena cada semana', desc: 'Recibe sesiones estructuradas con objetivos específicos para mejorar técnica, resistencia y potencia.' },
        { title: 'Supera cualquier sendero', desc: 'Llega preparado para rutas técnicas, competencias o aventuras en montaña con mayor confianza y rendimiento.' }
      ],
      workouts: [
        { title: 'Resistencia para Largas Rutas', desc: 'Construye una base aeróbica sólida para mantener un alto rendimiento durante recorridos prolongados.', category: 'AERÓBICO' },
        { title: 'Potencia en Ascensos', desc: 'Mejora la fuerza y la capacidad de mantener un ritmo constante en subidas exigentes.', category: 'DESNIVEL' },
        { title: 'Técnica de Descenso', desc: 'Perfecciona el control de la bicicleta, la trazada, el equilibrio y la seguridad en terrenos técnicos.', category: 'TÉCNICA' },
        { title: 'Intervalos de Alta Intensidad', desc: 'Incrementa tu potencia y capacidad de recuperación para afrontar cambios de ritmo, obstáculos y esfuerzos explosivos.', category: 'INTENSIDAD' }
      ],
      advices: [
        { 
          title: 'Nutrición para Ciclismo de Montaña', 
          desc: 'Aprende cómo planificar tu alimentación e hidratación para mantener la energía durante rutas largas y terrenos exigentes.', 
          bullets: ['Nutrición en senderos de larga distancia', 'Consumo energético en desniveles', 'Hidratación constante'], 
          img: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=400&q=80' 
        },
        { 
          title: 'Fuerza y Estabilidad', 
          desc: 'Fortalece piernas, core y tren superior para mejorar el control de la bicicleta y prevenir lesiones.', 
          bullets: ['Ejercicios excéntricos de gemelos', 'Flexiones explosivas para brazos', 'Core y flexores de cadera'], 
          img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80' 
        },
        { 
          title: 'Técnica y Seguridad', 
          desc: 'Desarrolla habilidades para afrontar curvas, descensos, obstáculos y terrenos irregulares con mayor confianza.', 
          bullets: ['Postura de descenso activo', 'Control de frenada progresivo', 'Visualización anticipada del camino'], 
          img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80' 
        }
      ],
      storiesTitle: 'Ciclistas que conquistaron nuevos desafíos',
      storiesSubtitle: 'Conoce cómo nuestros atletas mejoraron su técnica, aumentaron su resistencia y alcanzaron nuevos objetivos en rutas de montaña y competiciones de MTB.',
      ctaTitle: 'Lleva tu MTB al siguiente nivel',
      ctaSubtitle: 'Empieza hoy con un plan de entrenamiento diseñado exclusivamente para ti y descubre todo tu potencial en cada sendero.',
      ctaButton: 'Comenzar ahora',
      ctaLower: 'Prueba gratuita · Cancela cuando quieras'
    },
    'triatlon': {
      name: 'Triatlón',
      heroSubtitle: 'Prepárate para superar cada disciplina con un plan de entrenamiento diseñado según tu nivel, objetivos y disponibilidad. Integra natación, ciclismo y carrera de forma inteligente para mejorar tu rendimiento y llegar en tu mejor estado a cada competencia.',
      heroButton: 'Comienza tu plan',
      menu: {
        how: 'Cómo funciona',
        benefits: 'Beneficios',
        custom: 'Plan personalizado',
        types: 'Tipos de entrenamiento',
        faqs: 'Preguntas frecuentes'
      },
      whyUseTitle: '¿Por qué utilizar un plan de entrenamiento personalizado?',
      whyUseParagraphs: [
        'El triatlón combina tres disciplinas con demandas físicas y técnicas diferentes. Un plan personalizado organiza tu entrenamiento para equilibrar la carga entre natación, ciclismo y carrera, optimizando tu recuperación y reduciendo el riesgo de lesiones.',
        'Entrena con una estrategia adaptada a tus objetivos, ya sea completar tu primer triatlón o mejorar tu rendimiento en distancias Sprint, Olímpica, 70.3 o Ironman.'
      ],
      whyUseTestimonial: {
        quote: 'Gracias al plan personalizado logré mejorar mis tiempos en las tres disciplinas y terminé mi primer medio Ironman sintiéndome fuerte hasta la meta.',
        author: 'Santiago R.',
        specialty: 'Triatleta',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80'
      },
      whyChooseTitle: '¿Por qué elegir nuestros planes?',
      mockupFeatures: [
        { title: 'Plan totalmente personalizado', desc: 'Entrenamientos adaptados a tu nivel, experiencia, disponibilidad y distancia objetivo.' },
        { title: 'Seguimiento profesional', desc: 'Tu planificación evoluciona contigo mediante ajustes continuos según tu progreso, recuperación y competiciones.' },
        { title: 'Integración de las tres disciplinas', desc: 'Equilibra natación, ciclismo, carrera y fuerza para maximizar tu rendimiento sin caer en el sobreentrenamiento.' },
        { title: 'Análisis de rendimiento', desc: 'Monitorea métricas clave como ritmo, potencia, frecuencia cardíaca, volumen de entrenamiento y carga acumulada para optimizar tu preparación.' }
      ],
      howItWorks: [
        { title: 'Cuéntanos tus objetivos', desc: 'Comparte tu experiencia, disponibilidad semanal y la distancia que deseas preparar.' },
        { title: 'Diseñamos tu plan', desc: 'Creamos una planificación equilibrada que integra las tres disciplinas de acuerdo con tu calendario deportivo.' },
        { title: 'Entrena cada semana', desc: 'Recibe sesiones estructuradas de natación, ciclismo, carrera y fuerza con objetivos específicos para cada entrenamiento.' },
        { title: 'Cruza la meta con confianza', desc: 'Llega preparado física y mentalmente para competir con seguridad y alcanzar tu mejor rendimiento.' }
      ],
      workouts: [
        { title: 'Natación Técnica y Resistencia', desc: 'Mejora tu técnica, eficiencia y capacidad aeróbica para salir del agua con mayor energía.', category: 'NATACIÓN' },
        { title: 'Ciclismo de Rendimiento', desc: 'Desarrolla potencia, resistencia y economía de esfuerzo para afrontar cualquier recorrido.', category: 'CICLISMO' },
        { title: 'Carrera Post Ciclismo (Brick)', desc: 'Entrena la transición entre bicicleta y carrera para adaptarte al cambio de disciplina y mantener un ritmo competitivo.', category: 'TRANSICIÓN' },
        { title: 'Fuerza y Recuperación', desc: 'Complementa tu preparación con sesiones de fuerza funcional, movilidad y recuperación para prevenir lesiones y mejorar el rendimiento.', category: 'FUERZA' }
      ],
      advices: [
        { 
          title: 'Nutrición para Competencias', 
          desc: 'Aprende a planificar tu alimentación e hidratación antes, durante y después de entrenamientos y carreras.', 
          bullets: ['Nutrición líquida en ruta', 'Consumo energético multideporte', 'Minerales e hidratación pre-evento'], 
          img: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=400&q=80' 
        },
        { 
          title: 'Optimiza tus Transiciones', 
          desc: 'Perfecciona las transiciones entre natación, ciclismo y carrera para ahorrar tiempo y mantener el ritmo de competencia.', 
          bullets: ['T1 y T2 bien ensayadas', 'Disposición rápida de zapatillas', 'Montaje activo sobre la bici'], 
          img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80' 
        },
        { 
          title: 'Recuperación Inteligente', 
          desc: 'Aplica estrategias de descanso, movilidad y recuperación activa para sostener una alta carga de entrenamiento sin comprometer tu progreso.', 
          bullets: ['Masaje neuromuscular', 'Geles fríos de descarga', '8 horas de sueño profundo'], 
          img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80' 
        }
      ],
      storiesTitle: 'Atletas que alcanzaron nuevos desafíos',
      storiesSubtitle: 'Conoce cómo nuestros deportistas completaron su primer triatlón, mejoraron sus marcas personales y lograron grandes resultados gracias a un entrenamiento personalizado.',
      ctaTitle: 'Lleva tu triatlón al siguiente nivel',
      ctaSubtitle: 'Empieza hoy con un plan de entrenamiento diseñado exclusivamente para ti y prepárate para rendir al máximo en cada disciplina y en cada competencia.',
      ctaButton: 'Comenzar ahora',
      ctaLower: 'Prueba gratuita · Cancela cuando quieras'
    },
    'senderismo': {
      name: 'Senderismo',
      heroSubtitle: 'Disfruta cada ruta con mayor seguridad, resistencia y confianza. Entrena con un plan diseñado según tu nivel, objetivos y el tipo de senderos que deseas recorrer, preparándote para afrontar cualquier aventura en la montaña.',
      heroButton: 'Comienza tu plan',
      menu: {
        how: 'Cómo funciona',
        benefits: 'Beneficios',
        custom: 'Plan personalizado',
        types: 'Tipos de entrenamiento',
        faqs: 'Preguntas frecuentes'
      },
      whyUseTitle: '¿Por qué utilizar un plan de entrenamiento personalizado?',
      whyUseParagraphs: [
        'El senderismo exige una buena condición física para recorrer largas distancias, superar desniveles y disfrutar cada experiencia al aire libre. Un plan personalizado fortalece tu resistencia, equilibrio y movilidad, ayudándote a caminar con mayor eficiencia y reduciendo el riesgo de lesiones.',
        'Prepárate para explorar nuevos paisajes con la confianza de que tu cuerpo está listo para cada desafío.'
      ],
      whyUseTestimonial: {
        quote: 'Gracias al entrenamiento personalizado pude completar una travesía de varios días sin fatiga excesiva y disfrutando cada etapa del recorrido.',
        author: 'María C.',
        specialty: 'Senderista',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80'
      },
      whyChooseTitle: '¿Por qué elegir nuestros planes?',
      mockupFeatures: [
        { title: 'Plan totalmente personalizado', desc: 'Entrenamientos adaptados a tu condición física, experiencia, disponibilidad y tipo de rutas que deseas realizar.' },
        { title: 'Seguimiento profesional', desc: 'Ajustamos tu planificación según tu evolución, recuperación y los retos que te propongas.' },
        { title: 'Preparación específica para montaña', desc: 'Mejora tu resistencia cardiovascular, fuerza, equilibrio y estabilidad para afrontar senderos de cualquier dificultad.' },
        { title: 'Análisis de progreso', desc: 'Realiza un seguimiento de tu evolución mediante métricas de rendimiento, caminatas completadas y objetivos alcanzados.' }
      ],
      howItWorks: [
        { title: 'Cuéntanos tus objetivos', desc: 'Comparte tu experiencia, disponibilidad semanal y el tipo de rutas o montañas que deseas recorrer.' },
        { title: 'Diseñamos tu plan', desc: 'Creamos un programa personalizado que se adapta a tu nivel físico y a tus objetivos de senderismo.' },
        { title: 'Entrena cada semana', desc: 'Recibe sesiones progresivas enfocadas en resistencia, fuerza, movilidad y preparación para terrenos irregulares.' },
        { title: 'Disfruta cada aventura', desc: 'Llega preparado para recorrer senderos, parques naturales y travesías de varios días con mayor confianza y seguridad.' }
      ],
      workouts: [
        { title: 'Caminatas de Resistencia', desc: 'Incrementa progresivamente tu capacidad para recorrer distancias más largas con menor fatiga.', category: 'RESISTENCIA' },
        { title: 'Fuerza para Montaña', desc: 'Fortalece piernas, glúteos y core para afrontar ascensos, descensos y terrenos irregulares con mayor estabilidad.', category: 'FUERZA' },
        { title: 'Equilibrio y Movilidad', desc: 'Mejora la coordinación, la movilidad articular y el equilibrio para caminar con seguridad en cualquier terreno.', category: 'COORDINACIÓN' },
        { title: 'Preparación para Grandes Desniveles', desc: 'Entrena específicamente para rutas con ascensos prolongados, descensos técnicos y caminatas de larga duración.', category: 'DESNIVEL' }
      ],
      advices: [
        { 
          title: 'Nutrición e Hidratación', 
          desc: 'Aprende cómo mantener tu energía e hidratación durante rutas largas para disfrutar al máximo cada recorrido.', 
          bullets: ['Nutrición energética de mochila', 'Suministro de agua por km', 'Sales y barritas naturales'], 
          img: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=400&q=80' 
        },
        { 
          title: 'Equipo y Seguridad', 
          desc: 'Conoce cómo elegir el calzado, la mochila y el equipamiento adecuado para cada tipo de sendero y condición climática.', 
          bullets: ['Botas con soporte de tobillo', 'Ajuste lumbar de la mochila', 'Impermeables cortavientos'], 
          img: 'https://images.unsplash.com/photo-1444491741275-3747c53c99b4?auto=format&fit=crop&w=400&q=80' 
        },
        { 
          title: 'Recuperación y Prevención', 
          desc: 'Descubre estrategias de estiramiento, movilidad y recuperación para reducir la fatiga y prevenir lesiones después de cada salida.', 
          bullets: ['Estiramientos de tren inferior', 'Movilidad pélvica', 'Compresión de gemelos post-trekking'], 
          img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80' 
        }
      ],
      storiesTitle: 'Aventuras que dejaron huella',
      storiesSubtitle: 'Descubre cómo nuestros senderistas mejoraron su condición física, conquistaron nuevas montañas y disfrutaron rutas más largas gracias a un entrenamiento personalizado.',
      ctaTitle: 'Prepárate para conquistar nuevos senderos',
      ctaSubtitle: 'Empieza hoy con un plan de entrenamiento diseñado exclusivamente para ti y vive cada aventura con más energía, seguridad y confianza.',
      ctaButton: 'Comenzar ahora',
      ctaLower: 'Prueba gratuita · Cancela cuando quieras'
    },
    'entrenamiento-funcional': {
      name: 'Entrenamiento Funcional',
      heroSubtitle: 'Mejora tu fuerza, movilidad, resistencia y condición física con un plan de entrenamiento diseñado según tu nivel, objetivos y disponibilidad. Entrena movimientos funcionales que potencian tu rendimiento tanto en el deporte como en la vida diaria.',
      heroButton: 'Comienza tu plan',
      menu: {
        how: 'Cómo funciona',
        benefits: 'Beneficios',
        custom: 'Plan personalizado',
        types: 'Tipos de entrenamiento',
        faqs: 'Preguntas frecuentes'
      },
      whyUseTitle: '¿Por qué utilizar un plan de entrenamiento personalizado?',
      whyUseParagraphs: [
        'El entrenamiento funcional desarrolla las capacidades físicas que utilizas todos los días: fuerza, equilibrio, coordinación, movilidad y resistencia. Un plan personalizado adapta cada sesión a tu condición física y objetivos para que progreses de forma segura y eficiente.',
        'Ya sea que busques mejorar tu rendimiento deportivo, perder grasa, ganar fuerza o mantenerte activo, entrenar con una planificación adecuada marcará la diferencia.'
      ],
      whyUseTestimonial: {
        quote: 'Con el plan personalizado mejoré mi condición física, aumenté mi fuerza y ahora me siento con más energía tanto en mis entrenamientos como en mi día a día.',
        author: 'Daniel P.',
        specialty: 'Entrenamiento Funcional',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80'
      },
      whyChooseTitle: '¿Por qué elegir nuestros planes?',
      mockupFeatures: [
        { title: 'Plan totalmente personalizado', desc: 'Entrenamientos diseñados según tu nivel, experiencia, objetivos y tiempo disponible.' },
        { title: 'Seguimiento profesional', desc: 'Adaptamos tu planificación continuamente según tu progreso, recuperación y evolución física.' },
        { title: 'Desarrollo físico integral', desc: 'Mejora fuerza, resistencia, movilidad, estabilidad, coordinación y potencia mediante ejercicios funcionales.' },
        { title: 'Análisis de progreso', desc: 'Monitorea tu evolución con indicadores de rendimiento, composición corporal y condición física para mantener un progreso constante.' }
      ],
      howItWorks: [
        { title: 'Cuéntanos tus objetivos', desc: 'Indícanos qué deseas conseguir: perder peso, ganar fuerza, mejorar tu condición física o complementar otro deporte.' },
        { title: 'Diseñamos tu plan', desc: 'Creamos un programa personalizado adaptado a tu nivel, disponibilidad y equipamiento.' },
        { title: 'Entrena cada semana', desc: 'Recibe sesiones progresivas con ejercicios funcionales enfocados en mejorar tu rendimiento y prevenir lesiones.' },
        { title: 'Alcanza tu mejor versión', desc: 'Desarrolla un cuerpo más fuerte, resistente y preparado para cualquier reto físico.' }
      ],
      workouts: [
        { title: 'Fuerza Funcional', desc: 'Incrementa tu fuerza mediante movimientos naturales que mejoran el rendimiento deportivo y cotidiano.', category: 'FUERZA' },
        { title: 'Resistencia Muscular', desc: 'Desarrolla la capacidad de mantener esfuerzos prolongados con mayor eficiencia y menor fatiga.', category: 'RESISTENCIA' },
        { title: 'Movilidad y Estabilidad', desc: 'Mejora la movilidad articular, el equilibrio y el control corporal para moverte con mayor seguridad.', category: 'MOVILIDAD' },
        { title: 'HIIT Funcional', desc: 'Combina ejercicios de alta intensidad para aumentar la capacidad cardiovascular, quemar grasa y mejorar el acondicionamiento físico general.', category: 'CARDIO' }
      ],
      advices: [
        { 
          title: 'Alimentación para el Rendimiento', 
          desc: 'Aprende a nutrir tu cuerpo correctamente para optimizar la energía, favorecer la recuperación y potenciar tus resultados.', 
          bullets: ['Nutrición proteica limpia', 'Hidratación mineralizada', 'Macronutrientes equilibrados'], 
          img: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=400&q=80' 
        },
        { 
          title: 'Técnica y Calidad del Movimiento', 
          desc: 'Realiza cada ejercicio con una técnica adecuada para maximizar los beneficios y reducir el riesgo de lesiones.', 
          bullets: ['Alineación espinal neutra', 'Ejecución concéntrica controlada', 'Soporte propioceptivo de base'], 
          img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80' 
        },
        { 
          title: 'Descanso y Recuperación', 
          desc: 'Conoce la importancia del descanso, la movilidad y la recuperación activa para mantener un progreso constante.', 
          bullets: ['Estiramientos de tren completo', 'Foam rolling activo', '8 horas de sueño constante'], 
          img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80' 
        }
      ],
      storiesTitle: 'Personas que alcanzaron sus objetivos',
      storiesSubtitle: 'Descubre cómo nuestros usuarios mejoraron su condición física, aumentaron su fuerza, redujeron su porcentaje de grasa y transformaron su estilo de vida gracias a un entrenamiento personalizado.',
      ctaTitle: 'Transforma tu condición física desde hoy',
      ctaSubtitle: 'Empieza con un plan de entrenamiento diseñado exclusivamente para ti y alcanza tus objetivos con una metodología personalizada, progresiva y efectiva.',
      ctaButton: 'Comenzar ahora',
      ctaLower: 'Prueba gratuita · Cancela cuando quieras'
    },
  },
  EN: {
    'trail-running': {
      name: 'Trail Running',
      heroSubtitle: 'Train with a plan designed for your level, experience, goals, and weekly schedule. Build mountain stamina, speed, and safety.',
      heroButton: 'Start your plan',
      menu: {
        how: 'How it works',
        benefits: 'Benefits',
        custom: 'Custom Plan',
        types: 'Workout Types',
        faqs: 'FAQs'
      },
      whyUseTitle: 'Why use a personalized training plan?',
      whyUseParagraphs: [
        'Every runner starts from a different baseline. A custom plan adapts the weekly volume, intensity, and recovery around your fitness metrics.',
        'Avoid overtraining, reduce injury risk, and arrive fully prepared for every single trail race.'
      ],
      whyUseTestimonial: {
        quote: 'Since starting my custom plan, I improved my hill pacing and completed my first 50k ultra without injuries.',
        author: 'Carlos G.',
        specialty: 'Trail Running Athlete',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80'
      },
      whyChooseTitle: 'Why choose our plans?',
      mockupFeatures: [
        { title: 'Fully Custom Plan', desc: 'Workouts adapted specifically to your weekly availability, fitness level, and background.' },
        { title: 'Professional Follow-up', desc: 'Receive continuous plan adjustments based on your feedback, fatigue levels, and metrics.' },
        { title: 'Specific Mountain Prep', desc: 'Target key technical dimensions: uphill power, downhill foot placement, and endurance.' },
        { title: 'Analytics Insights', desc: 'Track progress with automated clinical charts and expert coaches recommendations.' }
      ],
      howItWorks: [
        { title: 'Share Your Goals', desc: 'Fill out a brief onboarding form sharing your background and target race milestones.' },
        { title: 'We Design Your Plan', desc: 'We build an adaptive training calendar built uniquely around your needs.' },
        { title: 'Train Week-by-Week', desc: 'Receive clear, structured daily workouts with specific targets.' },
        { title: 'Crush Your Milestones', desc: 'Build lasting performance and arrive prepared on race day with confidence.' }
      ],
      workouts: [
        { title: 'Aerobic Base', desc: 'Build the foundational endurance needed to absorb high weekly volumes.', category: 'AEROBIC' },
        { title: 'Hill Repetitions', desc: 'Build explosive muscular strength on steep uphill sectors.', category: 'POWER' },
        { title: 'Technical Footwork', desc: 'Learn to descend safely and fast across rocky, irregular singletracks.', category: 'TECHNIQUE' },
        { title: 'Long Run', desc: 'Develop physical and mental resilience for medium and long-distance races.', category: 'ENDURANCE' }
      ],
      advices: [
        { 
          title: 'Trail Running Nutrition', 
          desc: 'Learn exactly what to eat before, during, and after long runs to sustain optimal glycogen fuel levels.', 
          bullets: ['Electrolyte and hydration targets', 'Carb loading guides', 'Gel testing routines'], 
          img: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=400&q=80' 
        },
        { 
          title: 'Strength for Runners', 
          desc: 'Specific routines targeting quads, calves, and ankles stability to bulletproof you from injuries.', 
          bullets: ['Eccentric squats', 'Ankle proprioception drills', 'Core stability holds'], 
          img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80' 
        },
        { 
          title: 'Smart Active Recovery', 
          desc: 'Discover active stretching and release strategies to absorb heavy volume weeks cleanly.', 
          bullets: ['Foam rolling guides', 'Active lower back mobility flows', 'Consistent 8-hour sleep goals'], 
          img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80' 
        }
      ],
      storiesTitle: 'Athletes who achieved their goals',
      storiesSubtitle: 'Discover how our runners improved their paces, finished their first trails and crushed target milestones.',
      ctaTitle: 'Take your Trail Running to the next level',
      ctaSubtitle: 'Start today with a plan built around you and conquer new singletracks with confidence.',
      ctaButton: 'Start Now',
      ctaLower: 'Free trial • Cancel anytime'
    },
    // Placeholders in EN
    'ciclismo-de-ruta': {
      name: 'Road Cycling',
      heroSubtitle: 'Train with a plan designed for your level, goals, and availability. Improve your power, stamina, and efficiency on the bike with adaptive workouts.',
      heroButton: 'Start your plan',
      menu: {
        how: 'How it works',
        benefits: 'Benefits',
        custom: 'Custom Plan',
        types: 'Workout Types',
        faqs: 'FAQs'
      },
      whyUseTitle: 'Why use a personalized training plan?',
      whyUseParagraphs: [
        'Every cyclist has different goals and fitness thresholds. A custom plan adapts your workload, intensity, and recovery ratios to help you progress safely.',
        'Ride with absolute confidence and arrive fully prepared for any challenge, from long weekend rides to competitive Gran Fondos.'
      ],
      whyUseTestimonial: {
        quote: 'With my personalized plan, I increased my FTP, built solid leg speed, and completed my first Gran Fondo feeling incredible.',
        author: 'Andrés M.',
        specialty: 'Road Cyclist',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80'
      },
      whyChooseTitle: 'Why choose our plans?',
      mockupFeatures: [
        { title: 'Fully Customized Plan', desc: 'Workouts structured around your fitness background, goals, and time available.' },
        { title: 'Professional Follow-up', desc: 'We continuously adjust your training calendar based on your metrics and progress.' },
        { title: 'Specific Workouts', desc: 'Build FTP power, climbing stamina, leg cadences, and optimal cycling form.' },
        { title: 'Performance Analytics', desc: 'Track progress with automated clinical charts showing power, heart rate, and speed.' }
      ],
      howItWorks: [
        { title: 'Share Your Goals', desc: 'Share your background, weekly availability, and target races or challenges.' },
        { title: 'We Design Your Plan', desc: 'We build an adaptive training calendar built uniquely around your needs.' },
        { title: 'Train Each Week', desc: 'Receive structured daily workouts with specific targets.' },
        { title: 'Crush Your Milestones', desc: 'Build lasting performance and arrive prepared on race day with confidence.' }
      ],
      workouts: [
        { title: 'Aerobic Base', desc: 'Build the foundational endurance needed to absorb long-distance weekend routes.', category: 'AEROBIC' },
        { title: 'Interval Watts', desc: 'Improve your FTP power, anaerobic capacity, and response to pace changes.', category: 'POWER' },
        { title: 'Hill Climbs', desc: 'Train the legs strength and stamina needed to crush long elevation passes.', category: 'ELEVATION' },
        { title: 'Active Recovery', desc: 'Low-intensity spin sessions to flush out legs fatiguing chemicals.', category: 'RECOVERY' }
      ],
      advices: [
        { 
          title: 'Road Cycling Nutrition', 
          desc: 'Learn exactly what to eat before, during, and after long rides to sustain optimal power fuel levels.', 
          bullets: ['Electrolyte and hydration targets', 'Carb loading guides', 'Gel testing routines'], 
          img: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=400&q=80' 
        },
        { 
          title: 'Strength for Cyclists', 
          desc: 'Specific routines targeting quads, core, and lower back stability to maximize pedal transfer.', 
          bullets: ['Single-leg leg press', 'Deep barbell squats', 'Plank holds'], 
          img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80' 
        },
        { 
          title: 'Active Recovery Strategies', 
          desc: 'Discover active stretching and release strategies to absorb heavy volume weeks cleanly.', 
          bullets: ['Lower back foam rolling', 'Hamstrings deep stretching', 'Mineralized hydration'], 
          img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80' 
        }
      ],
      storiesTitle: 'Athletes who achieved their goals',
      storiesSubtitle: 'Discover how our riders improved their watts, finished their first Gran Fondos and crushed target milestones.',
      ctaTitle: 'Take your cycling to the next level',
      ctaSubtitle: 'Start today with a plan built around you and conquer new roads with confidence.',
      ctaButton: 'Start Now',
      ctaLower: 'Free trial • Cancel anytime'
    },
    'mtb': {
      name: 'MTB (Mountain Cycling)',
      heroSubtitle: 'Conquer any singletrack with a custom plan built around your level, goals, and availability. Improve your stamina, technique, and core control on the trails.',
      heroButton: 'Start your plan',
      menu: {
        how: 'How it works',
        benefits: 'Benefits',
        custom: 'Custom Plan',
        types: 'Workout Types',
        faqs: 'FAQs'
      },
      whyUseTitle: 'Why use a personalized training plan?',
      whyUseParagraphs: [
        'Mountain cycling requires far more than basic stamina. You need raw power, core stability, and technique to absorb irregular and rocky trails safely.',
        'Arrive prepared for steep climbs and technical singletracks, boosting your safety margin and general trail performance.'
      ],
      whyUseTestimonial: {
        quote: 'Thanks to my personalized plan, I improved my descending technique, built explosive uphill power, and finished my first MTB marathon with incredible results.',
        author: 'Laura P.',
        specialty: 'MTB Athlete',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80'
      },
      whyChooseTitle: 'Why choose our plans?',
      mockupFeatures: [
        { title: 'Fully Customized Plan', desc: 'Workouts adapted specifically to your weekly availability, discipline (XC, Enduro), and background.' },
        { title: 'Professional Follow-up', desc: 'We continuously adjust your training calendar based on your metrics and progress.' },
        { title: 'Specific MTB Prep', desc: 'Target key technical dimensions: uphill power, cornering control, and active stability.' },
        { title: 'Performance Analytics', desc: 'Track progress with automated clinical charts showing power, heart rate, and elevation.' }
      ],
      howItWorks: [
        { title: 'Share Your Goals', desc: 'Indicate your training schedule, weekly availability, and target mountain challenges.' },
        { title: 'We Design Your Plan', desc: 'We build an adaptive training calendar built uniquely around your needs.' },
        { title: 'Train Each Week', desc: 'Receive structured daily workouts with specific targets.' },
        { title: 'Superb Control on Trails', desc: 'Build lasting performance and arrive prepared on race day with confidence.' }
      ],
      workouts: [
        { title: 'Long Trail Endurance', desc: 'Build the foundational aerobic base needed to absorb heavy multi-hour trail rides.', category: 'AEROBIC' },
        { title: 'Uphill Power', desc: 'Build explosive muscular strength on steep singletrack ascents.', category: 'ELEVATION' },
        { title: 'Descending Technique', desc: 'Perfect your active posture, cornering speed, and general descent control.', category: 'TECHNIQUE' },
        { title: 'HIIT Intervals', desc: 'Improve your anaerobic capacity and recovery to absorb heavy power bursts.', category: 'INTENSITY' }
      ],
      advices: [
        { 
          title: 'MTB Nutrition', 
          desc: 'Learn exactly what to eat before, during, and after long runs to sustain optimal power fuel levels.', 
          bullets: ['Electrolyte and hydration targets', 'Carb loading guides', 'Gel testing routines'], 
          img: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=400&q=80' 
        },
        { 
          title: 'Strength and Stability', 
          desc: 'Specific routines targeting core, shoulders, and lower back stability to absorb heavy shocks.', 
          bullets: ['Single-leg squats', 'Plank shifts', 'Kettlebell swings'], 
          img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80' 
        },
        { 
          title: 'Trail Safety Techniques', 
          desc: 'Discover active stretching and release strategies to absorb heavy volume weeks cleanly.', 
          bullets: ['Active descending stances', 'Progressive braking control', 'Anticipated trail scanning'], 
          img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80' 
        }
      ],
      storiesTitle: 'Athletes who achieved their goals',
      storiesSubtitle: 'Discover how our riders improved their watts, finished their first MTB marathons and crushed target milestones.',
      ctaTitle: 'Take your MTB to the next level',
      ctaSubtitle: 'Start today with a plan built around you and conquer new trails with confidence.',
      ctaButton: 'Start Now',
      ctaLower: 'Free trial • Cancel anytime'
    },
    'triatlon': {
      name: 'Triathlon',
      heroSubtitle: 'Prepare to master each discipline with a custom training plan built around your level, goals, and availability. Integrate swimming, cycling, and running smartly to boost your threshold performance.',
      heroButton: 'Start your plan',
      menu: {
        how: 'How it works',
        benefits: 'Benefits',
        custom: 'Custom Plan',
        types: 'Workout Types',
        faqs: 'FAQs'
      },
      whyUseTitle: 'Why use a personalized training plan?',
      whyUseParagraphs: [
        'Triathlon combines three disciplines with distinct physical and technical demands. A personalized plan balances your training load across swimming, cycling, and running, optimizing active recovery.',
        'Train with a robust strategy built specifically around your target distance: Sprint, Olympic, 70.3, or full Ironman.'
      ],
      whyUseTestimonial: {
        quote: 'Thanks to my custom plan, I managed to shave minutes off my swim and run, and completed my first half Ironman feeling powerful all the way to the finish line.',
        author: 'Santiago R.',
        specialty: 'Triathlete',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80'
      },
      whyChooseTitle: 'Why choose our plans?',
      mockupFeatures: [
        { title: 'Fully Customized Plan', desc: 'Workouts structured around your fitness background, goals, and time available.' },
        { title: 'Professional Follow-up', desc: 'We continuously adjust your training calendar based on your metrics and progress.' },
        { title: 'Three-Sport Integration', desc: 'Sustain swim, cycle, run, and strength cleanly without overtraining or fatigue plateau.' },
        { title: 'Performance Analytics', desc: 'Track progress with automated clinical charts showing power, heart rate, and speed.' }
      ],
      howItWorks: [
        { title: 'Share Your Goals', desc: 'Indicate your training schedule, weekly availability, and target race distance.' },
        { title: 'We Design Your Plan', desc: 'We build an adaptive training calendar built uniquely around your needs.' },
        { title: 'Train Each Week', desc: 'Receive structured daily workouts with specific targets.' },
        { title: 'Cross the Line with Pride', desc: 'Build lasting performance and arrive prepared on race day with confidence.' }
      ],
      workouts: [
        { title: 'Technical Swim Stamina', desc: 'Improve your stroke technique, breathing flow, and aerobic base for water exit.', category: 'SWIMMING' },
        { title: 'Performance Cycling', desc: 'Build cycling FTP power, wattage endurance, and effort economy.', category: 'CYCLING' },
        { title: 'Post-Cycle Run (Brick)', desc: 'Train the direct transition between bike and run to adapt your muscles to pace shifts.', category: 'TRANSITION' },
        { title: 'Functional Strength & Recovery', desc: 'Complement your preparation with sessions of strength functional, mobility and recovery to prevent injuries and improve performance.', category: 'STRENGTH' }
      ],
      advices: [
        { 
          title: 'Race Nutrition', 
          desc: 'Learn exactly what to eat before, during, and after long runs to sustain optimal power fuel levels.', 
          bullets: ['Electrolyte and hydration targets', 'Carb loading guides', 'Gel testing routines'], 
          img: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=400&q=80' 
        },
        { 
          title: 'Master Your Transitions', 
          desc: 'Perfecciona las transiciones entre natación, ciclismo y carrera para ahorrar tiempo y mantener el ritmo de competencia.', 
          bullets: ['T1 and T2 quick setups', 'Bike mounting practices', 'Elastic shoelaces swap'], 
          img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80' 
        },
        { 
          title: 'Smart Recovery', 
          desc: 'Discover active stretching and release strategies to absorb heavy volume weeks cleanly.', 
          bullets: ['Muscle release rolling', 'Deep hip mobility active flows', 'Consistent 8-hour sleep goals'], 
          img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80' 
        }
      ],
      storiesTitle: 'Athletes who achieved their goals',
      storiesSubtitle: 'Discover how our riders improved their watts, finished their first marathons and crushed target milestones.',
      ctaTitle: 'Take your triathlon to the next level',
      ctaSubtitle: 'Start today with a plan built around you and conquer new roads with confidence.',
      ctaButton: 'Start Now',
      ctaLower: 'Free trial • Cancel anytime'
    },
    'senderismo': {
      name: 'Hiking & Trekking',
      heroSubtitle: 'Enjoy every trail with greater safety, endurance, and confidence. Train with a custom plan designed for your fitness, goals, and target mountains.',
      heroButton: 'Start your plan',
      menu: {
        how: 'How it works',
        benefits: 'Benefits',
        custom: 'Custom Plan',
        types: 'Workout Types',
        faqs: 'FAQs'
      },
      whyUseTitle: 'Why use a personalized training plan?',
      whyUseParagraphs: [
        'Hiking requires solid physical conditioning to walk long distances, conquer steep elevation changes, and enjoy the outdoors. A custom plan builds your stamina, active balance, and joint mobility.',
        'Prepare to explore new national parks and multi-day trekkings with confidence that your body is fully ready.'
      ],
      whyUseTestimonial: {
        quote: 'Thanks to my personalized plan, I managed to complete a multi-day mountain traverse without excessive fatigue, enjoying every single step of the scenery.',
        author: 'María C.',
        specialty: 'Hiking Athlete',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80'
      },
      whyChooseTitle: 'Why choose our plans?',
      mockupFeatures: [
        { title: 'Fully Customized Plan', desc: 'Workouts adapted specifically to your weekly availability, fitness background, and target trails.' },
        { title: 'Professional Follow-up', desc: 'We continuously adjust your training calendar based on your metrics and progress.' },
        { title: 'Specific Mountain Prep', desc: 'Target key technical dimensions: cardio stamina, leg strength, and joint stability.' },
        { title: 'Performance Analytics', desc: 'Track progress with automated clinical charts showing completed hikes and goals.' }
      ],
      howItWorks: [
        { title: 'Share Your Goals', desc: 'Indicate your training schedule, weekly availability, and target mountain challenges.' },
        { title: 'We Design Your Plan', desc: 'We build an adaptive training calendar built uniquely around your needs.' },
        { title: 'Train Each Week', desc: 'Receive progressive sessions focused on stamina, strength, and mobility.' },
        { title: 'Enjoy Every Adventure', desc: 'Arrive prepared to enjoy natural parks and multi-day crossings with confidence and safety.' }
      ],
      workouts: [
        { title: 'Stamina Hikes', desc: 'Gradually increase your capacity to walk longer distances with less fatigue.', category: 'ENDURANCE' },
        { title: 'Mountain Strength', desc: 'Strengthen legs, glutes, and core to conquer climbs, descents, and uneven paths.', category: 'STRENGTH' },
        { title: 'Balance & Mobility', desc: 'Improve coordination, joint flexibility, and core stability to walk safely.', category: 'MOBILITY' },
        { title: 'Elevation Prep', desc: 'Train specifically for routes with heavy climbs, technical descents, and long treks.', category: 'ELEVATION' }
      ],
      advices: [
        { 
          title: 'Nutrition & Hydration', 
          desc: 'Learn exactly what to eat before, during, and after long runs to sustain optimal power fuel levels.', 
          bullets: ['Backpack nutrition targets', 'Water volume guidelines', 'Energy bars and minerals'], 
          img: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=400&q=80' 
        },
        { 
          title: 'Gear & Safety', 
          desc: 'Discover how to choose the correct boots, backpack fit, and windbreakers for safety.', 
          bullets: ['Ankle support hiking boots', 'Lumbar backpack harness adjustments', 'Waterproof windbreaker layers'], 
          img: 'https://images.unsplash.com/photo-1444491741275-3747c53c99b4?auto=format&fit=crop&w=400&q=80' 
        },
        { 
          title: 'Recovery & Prevention', 
          desc: 'Discover active stretching and release strategies to absorb heavy volume weeks cleanly.', 
          bullets: ['Lower back stretching', 'Active pelvis mobility', 'Post-hiking compression socks'], 
          img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80' 
        }
      ],
      storiesTitle: 'Success Stories',
      storiesSubtitle: 'Discover how our hikers improved their physical levels, conquered new peaks and enjoyed longer singletracks.',
      ctaTitle: 'Prepare to conquer new trails',
      ctaSubtitle: 'Start today with a plan built around you and conquer new routes with confidence.',
      ctaButton: 'Start Now',
      ctaLower: 'Free trial • Cancel anytime'
    },
    'entrenamiento-funcional': {
      name: 'Functional Fitness',
      heroSubtitle: 'Improve your strength, mobility, stamina, and overall fitness with a customized training plan designed for your level, goals, and availability.',
      heroButton: 'Start your plan',
      menu: {
        how: 'How it works',
        benefits: 'Benefits',
        custom: 'Custom Plan',
        types: 'Workout Types',
        faqs: 'FAQs'
      },
      whyUseTitle: 'Why use a personalized training plan?',
      whyUseParagraphs: [
        'Functional fitness develops the physical capabilities you use every single day: strength, balance, coordination, mobility, and stamina. A personalized plan adapts every workout.',
        'Whether you seek to improve athletic performance, burn fat, build raw strength, or stay active, structured training will make the ultimate difference.'
      ],
      whyUseTestimonial: {
        quote: 'With my personalized plan, I completely transformed my fitness, gained solid functional strength, and feel far more energized in my daily life.',
        author: 'Daniel P.',
        specialty: 'Functional Athlete',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80'
      },
      whyChooseTitle: 'Why choose our plans?',
      mockupFeatures: [
        { title: 'Fully Customized Plan', desc: 'Workouts structured around your fitness background, goals, and time available.' },
        { title: 'Professional Follow-up', desc: 'We continuously adjust your training calendar based on your metrics and progress.' },
        { title: 'Holistic Body Conditioning', desc: 'Sustain strength, mobility, stamina, and balance safely without overtraining.' },
        { title: 'Performance Analytics', desc: 'Track progress with automated clinical charts showing completed workouts and goals.' }
      ],
      howItWorks: [
        { title: 'Share Your Goals', desc: 'Indicate your training schedule, weekly availability, and target fitness milestones.' },
        { title: 'We Design Your Plan', desc: 'We build an adaptive training calendar built uniquely around your needs and gear.' },
        { title: 'Train Each Week', desc: 'Receive progressive sessions focused on technique, stamina, and strength.' },
        { title: 'Crush Your Milestones', desc: 'Build a stronger, more resilient body fully ready for any physical challenge.' }
      ],
      workouts: [
        { title: 'Functional Strength', desc: 'Increase raw strength using natural, multi-joint movement patterns.', category: 'STRENGTH' },
        { title: 'Muscular Endurance', desc: 'Build the capacity to sustain prolonged efforts with maximum efficiency.', category: 'ENDURANCE' },
        { title: 'Mobility & Stability', desc: 'Improve joint ranges, active balance, and complete core motor control.', category: 'MOBILITY' },
        { title: 'Functional HIIT', desc: 'Combine explosive high-intensity circuits to burn fat and boost cardio conditioning.', category: 'HIIT' }
      ],
      advices: [
        { 
          title: 'Performance Nutrition', 
          desc: 'Learn exactly how to eat before, during, and after workouts to optimize energy and muscle repair.', 
          bullets: ['High-quality clean protein', 'Optimal hydration targets', 'Balanced macronutrients'], 
          img: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=400&q=80' 
        },
        { 
          title: 'Form & Quality of Movement', 
          desc: 'Master the correct form of every pattern to maximize benefits and bulletproof yourself from strains.', 
          bullets: ['Neutral spine alignment', 'Controlled eccentric execution', 'Solid proprioceptive base'], 
          img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80' 
        },
        { 
          title: 'Smart Rest & Release', 
          desc: 'Discover active stretching and release strategies to absorb heavy volume weeks cleanly.', 
          bullets: ['Full-body stretching flows', 'Active foam rolling release', 'Consistent 8-hour sleep goals'], 
          img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80' 
        }
      ],
      storiesTitle: 'Transformation Stories',
      storiesSubtitle: 'Discover how our users improved their physical conditioning, gained solid strength, and transformed their lifestyles.',
      ctaTitle: 'Transform your fitness today',
      ctaSubtitle: 'Start today with a plan designed exclusively for you and crush your goals with an adaptive methodology.',
      ctaButton: 'Start Now',
      ctaLower: 'Free trial • Cancel anytime'
    },
  }
}

const SpainFlag = () => (
  <svg viewBox="0 0 750 500" className="w-4.5 h-3 rounded-sm object-cover shadow-sm inline-block shrink-0">
    <rect width="750" height="500" fill="#c60b1e" />
    <rect y="125" width="750" height="250" fill="#fbe122" />
    <rect x="150" y="175" width="50" height="120" fill="#c60b1e" rx="5" />
    <path d="M140 175 h70 v20 h-70 z" fill="#fbe122" />
  </svg>
);

const USAFlag = () => (
  <svg viewBox="0 0 7410 3900" className="w-4.5 h-3 rounded-sm object-cover shadow-sm inline-block shrink-0">
    <rect width="7410" height="3900" fill="#b22234" />
    <path d="M0,300 h7410 M0,900 h7410 M0,1500 h7410 M0,2100 h7410 M0,2700 h7410 M0,3300 h7410" stroke="#fff" strokeWidth="300" />
    <rect width="2964" height="2100" fill="#3c3b6e" />
    <g fill="#fff">
      <circle cx="494" cy="350" r="80" /><circle cx="1482" cy="350" r="80" /><circle cx="2470" cy="350" r="80" />
      <circle cx="988" cy="700" r="80" /><circle cx="1976" cy="700" r="80" />
      <circle cx="494" cy="1050" r="80" /><circle cx="1482" cy="1050" r="80" /><circle cx="2470" cy="1050" r="80" />
      <circle cx="988" cy="1400" r="80" /><circle cx="1976" cy="1400" r="80" />
      <circle cx="494" cy="1750" r="80" /><circle cx="1482" cy="1750" r="80" /><circle cx="2470" cy="1750" r="80" />
    </g>
  </svg>
);



export function PlanDetailPage() {
  const { planId } = useParams<{ planId: string }>()
  const navigate = useNavigate()
  const { language, setLanguage, setPage, setUserRole } = useAppStore()
  const { t } = useTranslation()

  const [isPlanesDropdownOpen, setIsPlanesDropdownOpen] = useState(false)
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isSpanish = language === 'ES'

  const handlePortalEntry = (role: 'admin' | 'specialist') => {
    navigate('/descargar')
  }

  // Active success story in carousel
  const [activeStory, setActiveStory] = useState<number>(0)
  const successStories = [
    {
      num: '01/04',
      text: isSpanish 
        ? '«Mi primera maratón y la segunda carrera que he corrido. Mi objetivo era menos de 3 horas, pero gracias a Fitnflai logré correr un 02:41:40!»'
        : '“My first marathon and only my second race ever. My target was sub-3 hours, but thanks to Fitnflai I managed a 02:41:40!”',
      author: 'Dan C.',
      sub: isSpanish ? 'Maratón de San Sebastián' : 'San Sebastián Marathon',
      img: 'https://images.unsplash.com/photo-1502224562085-639556652f33?auto=format&fit=crop&w=400&h=400&q=80'
    },
    {
      num: '04/04',
      text: isSpanish
        ? '«¡Desde esforzarnos por correr 5 km hasta correr nuestra primera media maratón dentro de los 6 meses de entrenamiento con Fitnflai! Me encantó cada segundo.»'
        : '“From struggling to run 5k to running our first half marathon within 6 months of training with Fitnflai! I loved every single second of it.”',
      author: 'Sara C.',
      sub: isSpanish ? 'Media Maratón de Belfast' : 'Belfast Half Marathon',
      img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&h=400&q=80'
    }
  ]

  const nextStory = () => {
    setActiveStory((prev) => (prev === successStories.length - 1 ? 0 : prev + 1))
  }
  const prevStory = () => {
    setActiveStory((prev) => (prev === 0 ? successStories.length - 1 : prev - 1))
  }

  // Fallback to trail-running if planId is invalid
  const activePlanId = planId && plansData[isSpanish ? 'ES' : 'EN'][planId] ? planId : 'trail-running'
  const planInfo = plansData[isSpanish ? 'ES' : 'EN'][activePlanId]

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans antialiased relative overflow-hidden">
      {/* Background Image Watermark */}
      <div 
        className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.20] bg-cover bg-center z-0"
        style={{ 
          backgroundImage: `url("/images/${activePlanId}-bg.png")`,
          backgroundAttachment: 'fixed'
        }}
      />
      {/* Sticky Header */}
      <nav className="sticky top-0 z-50 bg-gray-900 bg-opacity-80 backdrop-blur-md shadow-lg border-b border-gray-900">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Brand Logo */}
          <div 
            onClick={() => navigate('/')}
            className="flex items-center cursor-pointer select-none group shrink-0"
          >
            <img 
              src="/images/logo.png" 
              alt="Fitnflai Logo" 
              className="h-8 object-contain transform group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8 items-center">
            {/* Planes Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsPlanesDropdownOpen(!isPlanesDropdownOpen)} 
                className="text-orange-400 font-bold transition duration-300 flex items-center gap-1"
              >
                <span>{t('landing.header.plans')}</span>
                <IconChevronDown size={14} className={`transform transition-transform ${isPlanesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isPlanesDropdownOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl py-2 z-50 text-left">
                  {[
                    { id: 'trail-running', label: isSpanish ? 'Trail running' : 'Trail Running' },
                    { id: 'ciclismo-de-ruta', label: isSpanish ? 'Ciclismo de ruta' : 'Road Cycling' },
                    { id: 'mtb', label: isSpanish ? 'MTB (Ciclismo de montaña)' : 'MTB (Mountain Cycling)' },
                    { id: 'triatlon', label: isSpanish ? 'Triatlón' : 'Triathlon' },
                    { id: 'senderismo', label: isSpanish ? 'Senderismo' : 'Hiking & Trekking' },
                    { id: 'entrenamiento-funcional', label: isSpanish ? 'Entrenamiento funcional' : 'Functional Training' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setIsPlanesDropdownOpen(false)
                        navigate(`/planes/${p.id}`)
                      }}
                      className="block w-full text-left px-4 py-2 text-xs font-semibold text-gray-300 hover:bg-gray-800 hover:text-orange-400 transition"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => navigate('/precios')} className="text-gray-300 hover:text-orange-400 transition duration-300 font-semibold">{t('landing.header.pricing')}</button>
            <button onClick={() => navigate('/caracteristicas')} className="text-gray-300 hover:text-orange-400 transition duration-300 font-semibold">{t('landing.header.features')}</button>
            <button onClick={() => navigate('/coaches')} className="text-gray-300 hover:text-orange-400 transition duration-300 font-semibold">{t('landing.header.coaches')}</button>
            <button onClick={() => navigate('/#soporte')} className="text-gray-300 hover:text-orange-400 transition duration-300 font-semibold">{t('landing.header.support')}</button>
          </div>

          {/* Language Selector Dropdown & Mobile Toggle */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="text-gray-300 hover:text-orange-400 transition duration-300 font-semibold flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-800/40 border border-transparent hover:border-gray-800"
              >
                {isSpanish ? <SpainFlag /> : <USAFlag />}
                <span>{isSpanish ? 'ES' : 'EN'}</span>
                <IconChevronDown size={14} className={`transform transition-transform ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl py-1.5 z-50 text-left">
                  <button
                    onClick={() => {
                      setLanguage('ES')
                      setIsLangDropdownOpen(false)
                    }}
                    className={`flex items-center gap-2 w-full text-left px-3 py-2 text-xs font-semibold hover:bg-gray-850 hover:text-orange-400 transition ${isSpanish ? 'text-orange-400 font-bold bg-gray-850/50' : 'text-gray-300'}`}
                  >
                    <SpainFlag /> Español
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('EN')
                      setIsLangDropdownOpen(false)
                    }}
                    className={`flex items-center gap-2 w-full text-left px-3 py-2 text-xs font-semibold hover:bg-gray-850 hover:text-orange-400 transition ${!isSpanish ? 'text-orange-400 font-bold bg-gray-850/50' : 'text-gray-300'}`}
                  >
                    <USAFlag /> English
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-gray-300 hover:text-orange-400 focus:outline-none p-1 cursor-pointer transition-colors"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-900 border-t border-gray-800 px-6 py-4 space-y-4 shadow-2xl transition-all duration-300">
            {/* Planes Sub-Menu */}
            <div className="space-y-2">
              <div className="font-extrabold text-xs uppercase tracking-wider text-orange-500 mb-1">
                {t('landing.header.plans')}
              </div>
              <div className="grid grid-cols-2 gap-2 pl-2">
                {[
                  { id: 'trail-running', label: isSpanish ? 'Trail running' : 'Trail Running' },
                  { id: 'ciclismo-de-ruta', label: isSpanish ? 'Ciclismo de ruta' : 'Road Cycling' },
                  { id: 'mtb', label: isSpanish ? 'MTB (Ciclismo de montaña)' : 'MTB (Mountain Cycling)' },
                  { id: 'triatlon', label: isSpanish ? 'Triatlón' : 'Triathlon' },
                  { id: 'senderismo', label: isSpanish ? 'Senderismo' : 'Hiking & Trekking' },
                  { id: 'entrenamiento-funcional', label: isSpanish ? 'Entrenamiento funcional' : 'Functional Training' },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      navigate(`/planes/${p.id}`)
                    }}
                    className="text-left text-xs font-semibold text-gray-300 hover:text-orange-400 py-1 transition cursor-pointer"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <hr className="border-gray-800" />
            <button 
              onClick={() => {
                setIsMobileMenuOpen(false)
                navigate('/precios')
              }}
              className="block w-full text-left font-semibold text-sm text-gray-300 hover:text-orange-400 py-2 transition cursor-pointer"
            >
              {t('landing.header.pricing')}
            </button>
            <button 
              onClick={() => {
                setIsMobileMenuOpen(false)
                navigate('/caracteristicas')
              }}
              className="block w-full text-left font-semibold text-sm text-gray-300 hover:text-orange-400 py-2 transition cursor-pointer"
            >
              {t('landing.header.features')}
            </button>
            <button 
              onClick={() => {
                setIsMobileMenuOpen(false)
                navigate('/coaches')
              }}
              className="block w-full text-left font-semibold text-sm text-gray-300 hover:text-orange-400 py-2 transition cursor-pointer"
            >
              {t('landing.header.coaches')}
            </button>
            <button 
              onClick={() => {
                setIsMobileMenuOpen(false)
                navigate('/#soporte')
              }}
              className="block w-full text-left font-semibold text-sm text-gray-300 hover:text-orange-400 py-2 transition cursor-pointer"
            >
              {t('landing.header.support')}
            </button>
          </div>
        )}
      </nav>

      {/* Main Container */}
      <main className="py-20 px-6 relative z-10">
        
        {/* Hero Section (Image 2) */}
        <section className="container mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-between gap-12 mb-16 relative z-10">
          <div className="md:w-1/2 text-left">
            <T.H1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 tracking-tight text-white leading-tight">
              {isSpanish ? 'Planes de entrenamiento personalizados para' : 'Custom training plans built for'}{' '}
              <span className="text-orange-500">{planInfo.name}</span>
            </T.H1>
            <T.P className="text-sm md:text-base text-gray-400 mb-8 leading-relaxed max-w-md">
              {planInfo.heroSubtitle}
            </T.P>
            <button
              onClick={() => handlePortalEntry('admin')}
              className="px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-full transition duration-300 text-sm shadow-lg hover:scale-105 uppercase tracking-wider"
            >
              {planInfo.heroButton}
            </button>
          </div>
          {/* Right Side: Large Shield Image */}
          <div className="md:w-1/2 flex justify-center items-center h-80 w-full select-none transform hover:scale-105 transition-transform duration-300">
            <div className="relative w-56 h-64 flex items-center justify-center">
              <img 
                src={`/images/${activePlanId}.png`} 
                alt={planInfo.name} 
                className="max-w-full max-h-full object-contain filter drop-shadow-[0_15px_30px_rgba(232,98,42,0.25)]" 
              />
            </div>
          </div>
        </section>

        {/* Anchor Strip (Image 2 style) */}
        <div className="bg-orange-500/5 text-orange-400 py-3 text-xs md:text-sm font-extrabold flex flex-wrap justify-center items-center gap-x-6 gap-y-2 border-y border-orange-500/15 max-w-5xl mx-auto mb-20 px-4 rounded-xl">
          <a href="#como" className="hover:text-white transition">{planInfo.menu.how}</a>
          <span className="text-orange-500/30 hidden sm:inline">•</span>
          <a href="#planes" className="hover:text-white transition">{planInfo.menu.benefits}</a>
          <span className="text-orange-500/30 hidden sm:inline">•</span>
          <a href="#empezar" className="hover:text-white transition">{isSpanish ? 'Comenzar' : 'Start'}</a>
          <span className="text-orange-500/30 hidden sm:inline">•</span>
          <a href="#explicacion" className="hover:text-white transition">{planInfo.menu.types}</a>
          <span className="text-orange-500/30 hidden sm:inline">•</span>
          <a href="#consejos" className="hover:text-white transition">{isSpanish ? 'Consejos' : 'Advice'}</a>
        </div>

        {/* "¿Por qué utilizar un plan de entrenamiento personalizado?" Section (Image 2 style) */}
        <section className="container mx-auto max-w-4xl py-12 mb-20 text-center" id="como">
          <T.H2 className="text-2xl md:text-3xl font-black text-white mb-8 max-w-xl mx-auto leading-tight">
            {planInfo.whyUseTitle}
          </T.H2>
          <div className="space-y-4 text-xs md:text-sm text-gray-300 leading-relaxed text-left mb-12 max-w-2xl mx-auto">
            {planInfo.whyUseParagraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          {/* Coach avatar bubble (Image 2) */}
          <div className="flex flex-col items-center max-w-[280px] mx-auto mt-6">
            <img
              src={planInfo.whyUseTestimonial.avatar}
              alt={planInfo.whyUseTestimonial.author}
              className="w-20 h-20 rounded-full object-cover border-2 border-orange-500 mb-2 shadow-lg"
            />
            <span className="text-[9px] font-black text-orange-400 uppercase tracking-widest block mb-1">
              {planInfo.whyUseTestimonial.author}
            </span>
            <span className="text-[8px] font-bold text-gray-500 uppercase tracking-wider block mb-4 leading-none">
              {planInfo.whyUseTestimonial.specialty}
            </span>
            <div className="bg-[#141416]/80 backdrop-blur-md border border-gray-800/60 p-4 rounded-xl relative text-left text-xs text-gray-400 leading-relaxed shadow-md">
              <p>
                "{planInfo.whyUseTestimonial.quote}"
              </p>
              <div className="absolute top-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-[#141416]/80 backdrop-blur-md border-t border-l border-gray-800/60 transform rotate-45"></div>
            </div>
          </div>
        </section>

        {/* 4 Phones Features checklist Section */}
        <section className="max-w-5xl mx-auto mb-28 text-center scroll-mt-24" id="planes">
          <T.H2 className="text-2xl md:text-3xl font-black mb-16 tracking-tight text-white leading-tight">
            {planInfo.whyChooseTitle}
          </T.H2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {planInfo.mockupFeatures.map((feat, i) => {
              const mockupImages = [
                '/images/mockup_09.png',
                '/images/mockup_10.png',
                '/images/mockup_11.png',
                '/images/mockup_12.png',
              ];
              return (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-64 h-[360px] mb-6 flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
                    <img src={mockupImages[i % mockupImages.length]} alt={feat.title} className="max-w-full max-h-full object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.35)]" />
                  </div>
                  <T.H3 className="text-sm font-extrabold text-white mb-2">{feat.title}</T.H3>
                  <T.P className="text-xs text-gray-400 leading-relaxed max-w-[200px]">{feat.desc}</T.P>
                </div>
              );
            })}
          </div>
        </section>

        {/* "Cómo empezar" Onboarding Section */}
        <section className="max-w-5xl mx-auto mb-28 text-center scroll-mt-24" id="empezar">
          <T.H2 className="text-2xl md:text-3xl font-black mb-4 tracking-tight text-white leading-tight">
            {isSpanish ? 'Cómo empezar' : 'How to start'}
          </T.H2>
          <T.P className="text-sm text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            {isSpanish 
              ? 'Comenzar es sumamente sencillo e intuitivo. Te guiaremos en cada paso del camino.'
              : 'Getting started is simple and intuitive. We guide you every single step of the way.'}
          </T.P>
          <button
            onClick={() => handlePortalEntry('admin')}
            className="px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-full transition duration-300 text-base shadow-lg hover:scale-105 mb-16"
          >
            {isSpanish ? 'Comenzar' : 'Get Started'}
          </button>

          {/* 4 Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {planInfo.howItWorks.map((st, i) => (
              <div key={i} className="flex flex-col items-center text-center p-4">
                {i === 0 && <IconDeviceWatch size={48} className="text-orange-500 mb-6" />}
                {i === 1 && <IconRoute size={48} className="text-orange-500 mb-6" />}
                {i === 2 && <IconRun size={48} className="text-orange-500 mb-6" />}
                {i === 3 && <IconTrophy size={48} className="text-orange-500 mb-6" />}
                <T.H3 className="text-sm font-extrabold text-white mb-2">{st.title}</T.H3>
                <T.P className="text-xs text-gray-400 leading-relaxed max-w-[200px]">{st.desc}</T.P>
              </div>
            ))}
          </div>
        </section>

        {/* "Explicación de los entrenamientos" Section (Image 2 bottom) */}
        <section className="max-w-5xl mx-auto mb-28 text-center scroll-mt-24" id="explicacion">
          <T.H2 className="text-2xl md:text-3xl font-black mb-16 tracking-tight text-white leading-tight">
            {isSpanish ? 'Explicación de los entrenamientos' : 'Workout types explained'}
          </T.H2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {planInfo.workouts.map((wt, i) => (
              <div key={i} className="bg-[#141416]/80 backdrop-blur-md border border-gray-800/60 rounded-2xl overflow-hidden shadow-lg text-left flex flex-col justify-between hover:border-gray-700 transition duration-300">
                <div className="p-5">
                  <span className="text-[10px] font-extrabold text-orange-500 tracking-wider uppercase">{wt.category}</span>
                  <T.H3 className="text-base font-black text-white mt-2 mb-2 leading-tight">{wt.title}</T.H3>
                  <T.P className="text-gray-400 text-xs leading-normal">{wt.desc}</T.P>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* "Consejos para tu plan" Section (Image 3) */}
        <section className="max-w-5xl mx-auto mb-28 scroll-mt-24" id="consejos">
          <T.H2 className="text-2xl md:text-3xl font-black mb-16 text-center tracking-tight text-white leading-tight">
            {isSpanish ? 'Consejos para tu plan de entrenamiento personalizado' : 'Tips & Advice for your customized training plan'}
          </T.H2>
          
          <div className="space-y-16">
            {planInfo.advices.map((adv, i) => (
              <div key={i} className={`flex flex-col ${i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 bg-[#141416]/80 backdrop-blur-md p-8 rounded-3xl border border-gray-800/60 shadow-xl`}>
                <div className="w-full md:w-1/2">
                  <T.H3 className="text-2xl font-black text-orange-500 mb-3 leading-tight">{adv.title}</T.H3>
                  <T.P className="text-xs text-gray-300 mb-6 leading-relaxed">{adv.desc}</T.P>
                  <ul className="space-y-2 text-xs text-gray-400 text-left">
                    {adv.bullets.map((b, idx) => (
                      <li key={idx} className="flex items-center">
                        <IconCheck className="text-emerald-400 mr-2 flex-shrink-0" size={14} />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <img src={adv.img} alt={adv.title} className="w-full md:w-1/2 h-64 object-cover rounded-2xl border border-gray-800" />
              </div>
            ))}
          </div>
        </section>

        {/* Success Stories Section (Image 4) */}
        <section className="py-24 bg-[#141416]/50 backdrop-blur-md rounded-3xl p-8 md:p-12 max-w-5xl mx-auto mb-28 text-center border border-gray-800/60 shadow-2xl">
          <T.H2 className="text-2xl md:text-3xl font-black mb-16 tracking-tight text-white leading-tight">
            {planInfo.storiesTitle}
          </T.H2>
          <T.P className="text-sm text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            {planInfo.storiesSubtitle}
          </T.P>

          <div className="flex flex-col md:flex-row bg-[#141416]/80 backdrop-blur-md border border-gray-800/60 rounded-3xl overflow-hidden shadow-xl max-w-4xl mx-auto min-h-[300px]">
            <div className="w-full md:w-1/2 p-8 flex flex-col justify-between text-left relative">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-500 font-extrabold text-xs">{successStories[activeStory].num}</span>
                  <div className="flex items-center space-x-2 z-10">
                    <button onClick={prevStory} className="p-1.5 rounded-full border border-gray-800 hover:bg-gray-800 transition">
                      <IconChevronLeft size={16} className="text-gray-400" />
                    </button>
                    <button onClick={nextStory} className="p-1.5 rounded-full border border-gray-800 hover:bg-gray-800 transition">
                      <IconChevronRight size={16} className="text-gray-400" />
                    </button>
                  </div>
                </div>
                <p className="text-sm md:text-base text-gray-300 leading-relaxed italic mb-6">
                  {successStories[activeStory].text}
                </p>
              </div>
              <div>
                <p className="font-extrabold text-sm text-white">{successStories[activeStory].author}</p>
                <p className="text-xs text-gray-500 font-semibold mt-0.5">{successStories[activeStory].sub}</p>
              </div>
            </div>
            <div 
              className="w-full md:w-1/2 h-64 md:h-auto bg-cover bg-center shrink-0 border-l border-gray-850"
              style={{ backgroundImage: `url("${successStories[activeStory].img}")` }}
            ></div>
          </div>

          <div className="flex justify-center space-x-2 mt-6">
            {successStories.map((_, i) => (
              <span 
                key={i} 
                className={`w-2 h-2 rounded-full transition-all duration-300 ${activeStory === i ? 'bg-orange-500 w-4 shadow-md' : 'bg-gray-700'}`}
              ></span>
            ))}
          </div>
        </section>

        {/* Pre-Footer CTA (Image 4 style) */}
        <section className="container mx-auto px-6 max-w-5xl py-12 mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 relative flex justify-center items-center h-[400px] w-full select-none">
              <div className="absolute w-48 h-[340px] transform -rotate-12 z-10 flex items-center justify-center">
                <img src="/images/mockup_13.png" alt="Mockup 13" className="max-w-full max-h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]" />
              </div>
              <div className="absolute w-52 h-[380px] transform rotate-6 z-20 flex items-center justify-center">
                <img src="/images/mockup_14.png" alt="Mockup 14" className="max-w-full max-h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.4)]" />
              </div>
            </div>

            <div className="md:w-1/2 text-center md:text-left">
              <T.H2 className="text-2xl md:text-3xl font-extrabold leading-tight tracking-tight text-white mb-4">
                {planInfo.ctaTitle}
              </T.H2>
              <T.P className="text-gray-400 text-sm leading-relaxed mb-8 max-w-md">
                {planInfo.ctaSubtitle}
              </T.P>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button
                  onClick={() => handlePortalEntry('admin')}
                  className="px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-full shadow-lg hover:scale-105 transition-transform duration-300 tracking-wider text-base"
                >
                  {planInfo.ctaButton}
                </button>
              </div>
              <T.P className="text-xs text-gray-500 font-bold uppercase mt-4">
                {planInfo.ctaLower}
              </T.P>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
