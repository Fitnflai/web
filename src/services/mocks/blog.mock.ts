import type { BlogPost } from '@/types/blog'

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: 'Cómo entrenar según tus zonas de frecuencia cardíaca para maximizar resultados',
    slug: 'entrenar-zonas-frecuencia-cardiaca-resultados',
    excerpt: 'Descubre cómo la medición precisa de la frecuencia cardíaca te ayuda a quemar grasa, ganar resistencia y evitar el sobreentrenamiento con respaldo científico.',
    coverImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop',
    category: 'Entrenamiento',
    tags: ['Cardio', 'Frecuencia Cardíaca', 'Resistencia', 'Zonas FC'],
    author: {
      name: 'Dr. Alejandro Morales',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=200&auto=format&fit=crop',
      role: 'Médico Deportólogo',
    },
    status: 'published',
    publishedAt: '2026-05-15T10:00:00Z',
    updatedAt: '2026-05-15T10:00:00Z',
    readingTime: 6,
    featured: true,
    seo: {
      metaTitle: 'Entrenar por Zonas de Frecuencia Cardíaca: Guía Completa Fitnflai',
      metaDescription: 'Aprende a calcular tus zonas de FC y optimizar cada sesión de entrenamiento aeróbico y anaeróbico según deportólogos certificados.',
      keywords: ['frecuencia cardiaca', 'zonas de entrenamiento', 'cardio', 'resistencia', 'fitnflai'],
      canonicalUrl: 'https://fitnflai.com/blog/entrenar-zonas-frecuencia-cardiaca-resultados',
    },
    content: `
## ¿Por qué entrenar por zonas y no solo por sensaciones?

Muchos atletas y aficionados cometen el error de entrenar siempre a la misma intensidad o guiarse únicamente por el cansancio subjetivo. Sin embargo, **la frecuencia cardíaca (FC) es la ventana más confiable para entender qué sustrato energético estás utilizando** (grasas o glucógeno) y qué adaptaciones fisiológicas estás promoviendo.

---

### Las 5 Zonas de Frecuencia Cardíaca

1. **Zona 1 (Recuperación activa - 50% a 60% FC máx):**
   Ideal para días posteriores a cargas pesadas. Facilita la remoción de lactato sanguíneo y activa la circulación sin estresar el sistema nervioso central.
2. **Zona 2 (Base aeróbica - 60% a 70% FC máx):**
   La zona dorada de la salud mitocondrial y la oxidación de ácidos grasos. Aquí construyes el motor aeróbico que te permitirá rendir más en intensidades altas.
3. **Zona 3 (Tempo / Ritmo - 70% a 80% FC máx):**
   Trabajo a ritmo de carrera sostenido. Mejora la eficiencia cardiorrespiratoria, aunque exige una gestión inteligente del descanso.
4. **Zona 4 (Umbral anaeróbico - 80% a 90% FC máx):**
   Entrenamientos en intervalos donde el cuerpo produce lactato a una tasa cercana a su capacidad de aclaramiento. Aumenta tu techo de velocidad y tolerancia al esfuerzo.
5. **Zona 5 (Potencia neuromuscular y VO2 Máx - 90% a 100% FC máx):**
   Sprints cortos y esfuerzos máximos. Exclusivo para estímulos breves bajo supervisión técnica.

---

### Cómo calcular tu Frecuencia Cardíaca Máxima

Olvídate de la clásica fórmula simplista \`220 - edad\`, que tiene un margen de error de hasta 15 pulsaciones. Lo ideal es realizar un test de esfuerzo submáximo o progresivo validado por tu médico deportólogo en Fitnflai.

> **Consejo del especialista:** Al menos el 70% a 80% de tu volumen de cardio semanal debería transcurrir en Zona 2 si tu meta es la longevidad y la quema eficiente de lípidos.

---

### Integración con tus dispositivos

En Fitnflai nos sincronizamos con tus bandas pectorales y smartwatches (Garmin, Strava, Apple Health) para que tus sesiones ajusten automáticamente los descansos y ritmos recomendados por tu equipo de coaches.
    `.trim(),
  },
  {
    id: 'post-2',
    title: 'Nutrición peri-entrenamiento: Qué comer antes, durante y después de entrenar',
    slug: 'nutricion-peri-entrenamiento-antes-durante-despues',
    excerpt: 'Optimiza la síntesis proteica, repone glucógeno y acelera tu recuperación con esta guía práctica basada en evidencia científica reciente.',
    coverImage: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1200&auto=format&fit=crop',
    category: 'Nutrición',
    tags: ['Nutrición Deportiva', 'Proteínas', 'Carbohidratos', 'Recuperación'],
    author: {
      name: 'Lic. Sofía Valenzuela',
      avatar: 'https://images.unsplash.com/photo-1594824813639-952402927230?q=80&w=200&auto=format&fit=crop',
      role: 'Nutricionista Deportiva',
    },
    status: 'published',
    publishedAt: '2026-05-22T14:30:00Z',
    updatedAt: '2026-05-22T14:30:00Z',
    readingTime: 5,
    featured: false,
    seo: {
      metaTitle: 'Nutrición Peri-Entrenamiento: Antes, Durante y Después | Fitnflai',
      metaDescription: 'Descubre qué macronutrientes priorizar antes y después del ejercicio para potenciar tu rendimiento y acelerar la recuperación muscular.',
      keywords: ['nutricion peri entrenamiento', 'comida pre entreno', 'recuperacion muscular', 'proteina'],
      canonicalUrl: 'https://fitnflai.com/blog/nutricion-peri-entrenamiento-antes-durante-despues',
    },
    content: `
## La ventana anabólica desmitificada

Durante años se creyó que existía una ventana estricta de 30 minutos post-entreno en la que debías ingerir tu batido de proteínas o perdías tus ganancias. La ciencia contemporánea demostró que lo primordial es el **balance neto de macronutrientes a lo largo de las 24 horas**, aunque la temporización estratégica (nutrición peri-entreno) aporta ventajas notables.

---

### 1. Antes de entrenar (Pre-entrenamiento)

- **Objetivo:** Asegurar disponibilidad de glucosa y evitar malestar gastrointestinal.
- **Ventana de 2 a 3 horas antes:** Comida completa con carbohidratos complejos (avena, arroz, batata) y proteínas magras (pollo, huevos, tofu), con bajo contenido de grasas y fibra excesiva.
- **Ventana de 30 a 45 minutos antes:** Si necesitas energía rápida, opta por carbohidratos de absorción veloz (plátano maduro, dátiles, miel).

---

### 2. Durante la sesión (Intra-entrenamiento)

Para entrenamientos de fuerza o cardio menores a 60 minutos, el **agua e hidratación adecuada con electrolitos** es más que suficiente. Si la sesión excede los 75-90 minutos a alta intensidad:
- 30-60 gramos de carbohidratos simples por hora (bebidas isotónicas o geles).
- Sodio (300-500 mg por hora) para prevenir hiponatremia y calambres.

---

### 3. Después de entrenar (Post-entrenamiento)

- **Proteína:** Ingiere entre 20g y 40g de proteína de alto valor biológico para estimular la vía mTOR y la síntesis de proteínas musculares.
- **Carbohidratos:** Reponer entre 0.8g y 1.2g de carbohidratos por kg de peso corporal, fundamental si tienes otra sesión en menos de 24 horas.
    `.trim(),
  },
  {
    id: 'post-3',
    title: 'Prevención de lesiones en el entrenamiento de fuerza: Claves biomecánicas',
    slug: 'prevencion-lesiones-entrenamiento-fuerza-biomecanica',
    excerpt: 'Aprende los principios biomecánicos indispensables para progresar en cargas sin comprometer la salud de tus articulaciones y columna.',
    coverImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop',
    category: 'Salud',
    tags: ['Fisioterapia', 'Fuerza', 'Prevención', 'Biomecánica'],
    author: {
      name: 'Lic. Martín Herrera',
      avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=200&auto=format&fit=crop',
      role: 'Fisioterapeuta y Readaptador',
    },
    status: 'published',
    publishedAt: '2026-06-01T09:15:00Z',
    updatedAt: '2026-06-01T09:15:00Z',
    readingTime: 7,
    featured: false,
    seo: {
      metaTitle: 'Prevención de Lesiones en Entrenamiento de Fuerza | Fitnflai',
      metaDescription: 'Conoce los errores posturales más frecuentes y cómo la técnica adecuada protege hombros, rodillas y columna en sentadillas y peso muerto.',
      keywords: ['prevencion lesiones gym', 'biomecanica deportiva', 'fisioterapia fuerza', 'peso muerto tecnica'],
      canonicalUrl: 'https://fitnflai.com/blog/prevencion-lesiones-entrenamiento-fuerza-biomecanica',
    },
    content: `
## Levantar pesado es seguro; levantar sin control motor no lo es

El entrenamiento de fuerza es una de las intervenciones con mayor respaldo científico para aumentar la densidad ósea, mejorar la salud articular y prevenir el deterioro físico. Sin embargo, cuando el volumen o la intensidad superan la capacidad adaptativa de los tejidos pasivos (tendones, ligamentos y cartílago), surge el dolor lesivo.

---

### Los 3 errores biomecánicos más comunes

1. **Colapso en valgo de rodilla durante la sentadilla:**
   Ocurre con frecuencia por debilidad del glúteo medio o falta de dorsiflexión de tobillo. La rodilla viaja hacia adentro bajo carga, aumentando la tensión sobre el ligamento cruzado anterior y meniscos.
2. **Pérdida de rigidez intraabdominal (Bracing) en peso muerto:**
   Exhalar o arquear la zona lumbar bajo carga compromete la distribución de fuerzas axiales sobre los discos intervertebrales. La técnica de respiración diafragmática y presión intraabdominal no es opcional.
3. **Falta de fijación escapular en empujes y tracciones:**
   Dejar los hombros libres o adelantados al realizar press de banca comprime el manguito rotador en el espacio subacromial.

---

### La regla de la progresión de cargas

> "Nunca compenses con rango de movimiento lo que te falta en fuerza, y nunca agregues peso si no dominas la fase excéntrica con control absoluto."

En la app de Fitnflai, nuestros especialistas analizan tus videos de ejecución y ajustan tu volumen semanal antes de que aparezcan las molestias crónicas.
    `.trim(),
  },
]
