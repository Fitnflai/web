import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store/useAppStore'
import { useTranslation } from '@/i18n/useTranslation'
import { T } from '@/components/ui/Typography'
import { Footer } from '@/components/layout/Footer'
import { IconBrandApple, IconBrandGooglePlay, IconRun, IconBike, IconSwimming, IconMountain, IconDeviceWatch, IconRoute, IconStar, IconCheck, IconUsers, IconGift, IconCompass, IconMessageCircle, IconChevronDown, IconChevronUp, IconChevronLeft, IconChevronRight, IconMail, IconHeart, IconBrandFacebook, IconBrandX, IconBrandInstagram, IconBrandTiktok, IconBrandYoutube } from '@tabler/icons-react'

// Glossy Red Shield Badge helper replicating the exact Runna 3D logo shield
const ShieldIcon = ({ text }: { text: string }) => (
  <div className="relative flex items-center justify-center w-28 h-32 transform hover:scale-105 transition-transform duration-300">
    <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-[0_10px_20px_rgba(185,28,28,0.25)]">
      <defs>
        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#991b1b" />
        </linearGradient>
      </defs>
      <path
        d="M10 10 L50 0 L90 10 V60 C90 90 50 120 50 120 C50 120 10 90 10 60 Z"
        fill="url(#shieldGrad)"
        stroke="#ffffff"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path
        d="M15 15 L50 6 L85 15 V58 C85 82 50 108 50 108 C50 110 15 82 15 58 Z"
        fill="none"
        stroke="#fca5a5"
        strokeWidth="1.5"
        opacity="0.3"
      />
      {/* Small sport icon symbol inside the shield */}
      <circle cx="50" cy="92" r="5" fill="#ffffff" opacity="0.9" />
      <path d="M46 92 Q50 82 54 92" stroke="#ffffff" strokeWidth="2" fill="none" opacity="0.9" />
    </svg>
    <span className="absolute text-white font-black text-3xl tracking-tighter mt-[-10px]">{text}</span>
  </div>
);

// Premium Interactive Calculator replicating the 3-phone screen stage layouts (Image 2)
function TrainingCalculator({ onPortalEntry }: { onPortalEntry: (role: 'admin' | 'specialist') => void }) {
  const { language } = useAppStore()
  const isSpanish = language === 'ES'

  const [activeDiscipline, setActiveDiscipline] = useState<'running' | 'cycling' | 'triathlon' | 'hiking' | 'functional'>('running')

  const disciplinesContent = {
    running: {
      title: isSpanish ? 'Genera tu plan de entrenamiento de Running' : 'Generate your Running training plan',
      desc: isSpanish 
        ? '¿Quieres saber qué logros puedes alcanzar con un plan de Fitnflai? Genera tu plan de entrenamiento dinámico y descúbrelo.' 
        : 'Want to know what milestones you can achieve with a Fitnflai plan? Generate your dynamic training plan and find out.',
      step1: isSpanish 
        ? 'Cuéntanos un poco sobre ti, como tu nivel actual de running y la distancia para la que te estás preparando' 
        : 'Tell us a bit about yourself, like your current training level and your target distance',
      step2: isSpanish 
        ? 'Dinos cuánto estás dispuesto a entrenar, desde la duración del plan hasta los días de entrenamiento a la semana' 
        : 'Tell us how much you are willing to train, from plan duration to weekly training schedule',
      step3: isSpanish 
        ? 'Te daremos tu plan con los ritmos y entrenamientos ideales para tu carrera. Empecemos...' 
        : 'We will give you your plan with the ideal paces and workouts for your race. Let\'s begin...',
      btn: isSpanish ? 'Generar mi Plan' : 'Generate my Plan'
    },
    cycling: {
      title: isSpanish ? 'Genera tus entrenamientos de Ciclismo' : 'Generate your Cycling workouts',
      desc: isSpanish 
        ? '¿Quieres optimizar tu potencia o terminar tu primer gran fondo en bicicleta? Obtén tu plan de entrenamiento adaptativo de ciclismo.' 
        : 'Want to optimize your power output or finish your first cycling gran fondo? Get your custom adaptive cycling training plan.',
      step1: isSpanish 
        ? 'Cuéntanos sobre tu nivel, potencia estimada (FTP) y los recorridos de ruta o montaña que quieres conquistar' 
        : 'Tell us about your level, estimated power output (FTP), and the road or mountain routes you want to dominate',
      step2: isSpanish 
        ? 'Elige tus días disponibles de pedaleo a la semana y los entrenamientos cruzados de fuerza en el gimnasio' 
        : 'Choose your available weekly riding days and cross-training strength sessions in the gym',
      step3: isSpanish 
        ? 'Te daremos tu rutina con vatios objetivo (W/Kg) y entrenamientos recomendados de rodaje. Empecemos...' 
        : 'We will give you your routine with target power (W/Kg) and recommended training rides. Let\'s begin...',
      btn: isSpanish ? 'Generar mis Entrenamientos' : 'Generate my Workouts'
    },
    triathlon: {
      title: isSpanish ? 'Genera tu planificación de Triatlón' : 'Generate your Triathlon planning',
      desc: isSpanish 
        ? 'Combina natación, ciclismo y carrera a pie en una sola rutina inteligente que se ajusta a tu fatiga diaria.' 
        : 'Combine swimming, cycling, and running into a single smart routine that automatically adjusts to your daily fatigue.',
      step1: isSpanish 
        ? 'Cuéntanos tus ritmos en el agua, potencia en bici y tiempos de carrera junto con tu distancia objetivo' 
        : 'Tell us your swim paces, cycling power, and run times along with your target triathlon distance',
      step2: isSpanish 
        ? 'Ajusta tus sesiones de natación en piscina, rodajes en ruta y entrenamientos en transición (ladrillos)' 
        : 'Fine-tune your pool swims, road rides, and weekly transitional brick training workouts',
      step3: isSpanish 
        ? 'Te daremos tu planificación con las horas semanales y ritmos óptimos de carrera. Empecemos...' 
        : 'We will give you your plan with weekly hours distribution and optimal race-day pacing. Let\'s begin...',
      btn: isSpanish ? 'Generar mi Plan de Triatlón' : 'Generate my Triathlon Plan'
    },
    hiking: {
      title: isSpanish ? 'Genera tu entrenamiento de Senderismo' : 'Generate your Hiking training',
      desc: isSpanish 
        ? 'Acondiciona tu cuerpo para largas caminatas de montaña, desnivel acumulado y aclimatación de altitud.' 
        : 'Bulletproof your body for long mountain hikes, elevation gain, and smart altitude acclimation.',
      step1: isSpanish 
        ? 'Cuéntanos el desnivel positivo de tu expedición y las horas estimadas de marcha continua en altura' 
        : 'Tell us your expedition\'s vertical gain and estimated continuous hiking hours at high altitude',
      step2: isSpanish 
        ? 'Define tus sesiones de subida de escalones, caminatas con mochila cargada y fortalecimiento articular' 
        : 'Define your step-up sessions, loaded backpack hikes, and joints-strengthening routines',
      step3: isSpanish 
        ? 'Te daremos tus entrenamientos con el ritmo de marcha recomendado (km/h) y el equipamiento ideal. Empecemos...' 
        : 'We will give you your workouts with recommended hiking pace (km/h) and ideal equipment. Let\'s begin...',
      btn: isSpanish ? 'Generar mi Ruta' : 'Generate my Route'
    },
    functional: {
      title: isSpanish ? 'Genera tu rutina de Funcional y Fuerza' : 'Generate your Functional & Strength routine',
      desc: isSpanish 
        ? 'Aumenta tu fuerza máxima, estabilidad del CORE y rango de movimiento para prevenir lesiones en el deporte.' 
        : 'Increase your peak strength, core stability, and range of motion to prevent injuries in sports.',
      step1: isSpanish 
        ? 'Elige tu objetivo principal: ganar fuerza máxima, hipertrofia muscular, resistencia metabólica o movilidad' 
        : 'Choose your main goal: peak strength, muscle hypertrophy, metabolic endurance, or active mobility',
      step2: isSpanish 
        ? 'Configura tus días disponibles, elementos de entrenamiento y tus puntos de dolor para evitar lesiones' 
        : 'Configure your available days, training equipment, and any joint pain areas to prevent injuries',
      step3: isSpanish 
        ? 'Te daremos tu volumen semanal de series recomendadas y el rango de intensidad óptimo. Empecemos...' 
        : 'We will give you your recommended weekly set volume and optimal intensity ranges. Let\'s begin...',
      btn: isSpanish ? 'Generar mi Rutina' : 'Design my Workout'
    }
  }

  const currentData = disciplinesContent[activeDiscipline]

  return (
    <section className="py-24 bg-gray-950/70 text-white relative z-10" id="calculadora">
      <div className="container mx-auto px-6 text-center">

        {/* Discipline Selector Tabs */}
        <div className="flex flex-wrap justify-center items-center gap-3 mb-12 max-w-4xl mx-auto px-4 select-none">
          {[
            { id: 'running', name: isSpanish ? 'Running / Trail' : 'Running & Trail', icon: IconRun, color: 'text-orange-500' },
            { id: 'cycling', name: isSpanish ? 'Ciclismo (Ruta / MTB)' : 'Cycling (Road / MTB)', icon: IconBike, color: 'text-emerald-500' },
            { id: 'triathlon', name: isSpanish ? 'Triatlón' : 'Triathlon', icon: IconSwimming, color: 'text-blue-500' },
            { id: 'hiking', name: isSpanish ? 'Senderismo / Montaña' : 'Hiking & Mountain', icon: IconMountain, color: 'text-yellow-500' },
            { id: 'functional', name: isSpanish ? 'Funcional / Fuerza' : 'Functional & Strength', icon: IconDeviceWatch, color: 'text-purple-500' },
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeDiscipline === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveDiscipline(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs md:text-sm font-bold tracking-wide border cursor-pointer transition-all duration-300 ${
                  isActive 
                    ? 'bg-orange-500/10 border-orange-500 text-orange-500 shadow-[0_0_20px_rgba(234,88,12,0.15)] scale-105' 
                    : 'bg-[#141416]/50 border-gray-800/80 text-gray-400 hover:border-gray-700 hover:text-white'
                }`}
              >
                <Icon size={18} className={tab.color} />
                <span>{tab.name}</span>
              </button>
            )
          })}
        </div>

        {/* Title & Subtitle */}
        <T.H2 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4 max-w-3xl mx-auto leading-tight min-h-[96px] flex items-center justify-center">
          {currentData.title}
        </T.H2>
        <T.P className="text-lg text-gray-400 max-w-3xl mx-auto mb-16 leading-relaxed min-h-[56px]">
          {currentData.desc}
        </T.P>

        {/* 3 Phone Mockups Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto mb-16 items-center justify-center">
          
          {/* Phone 1: Unlock Your Potential */}
          <div className="flex flex-col items-center">
            <div className="w-64 h-[440px] mb-6 flex items-center justify-center transform hover:scale-105 transition-transform duration-300 select-none">
              <img src="/images/mockup_01.png" alt="Unlock Your Potential" className="max-w-full max-h-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)]" />
            </div>
            <p className="text-sm font-semibold text-gray-400 mt-4 max-w-[240px] leading-relaxed min-h-[48px]">
              {currentData.step1}
            </p>
          </div>

          {/* Phone 2: Details & Schedule */}
          <div className="flex flex-col items-center">
            <div className="w-64 h-[440px] mb-6 flex items-center justify-center transform hover:scale-105 transition-transform duration-300 select-none">
              <img src="/images/mockup_02.png" alt="Configura tu Disponibilidad" className="max-w-full max-h-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)]" />
            </div>
            <p className="text-sm font-semibold text-gray-400 mt-4 max-w-[240px] leading-relaxed min-h-[48px]">
              {currentData.step2}
            </p>
          </div>

          {/* Phone 3: Dynamic Result */}
          <div className="flex flex-col items-center">
            <div className="w-64 h-[440px] mb-6 flex items-center justify-center transform hover:scale-105 transition-transform duration-300 select-none">
              <img src="/images/mockup_03.png" alt="Dynamic Result" className="max-w-full max-h-full object-contain filter drop-shadow-[0_25px_40px_rgba(232,98,42,0.15)]" />
            </div>
            <p className="text-sm font-semibold text-gray-400 mt-4 max-w-[240px] leading-relaxed min-h-[48px]">
              {currentData.step3}
            </p>
          </div>

        </div>

        {/* Big Coral Button (from Image 2) */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => onPortalEntry('admin')}
            className="px-10 py-4 bg-[#ea580c] hover:bg-orange-600 text-white font-black text-xl rounded-xl transition duration-300 shadow-xl cursor-pointer"
          >
            {currentData.btn}
          </button>
        </div>

      </div>
    </section>
  )
}

export const athleticNutritionProfiles = [
  {
    name: "Stephanie",
    title: {
      en: "Runner & Nutritionist",
      es: "Corredora & Nutricionista"
    },
    sportIcon: "IconRun",
    quote: {
      en: "The personalized training plan is brilliant for being able to train with a clear goal! The entire Fitnflai team has been very helpful and supportive. They made sure the plan and pacing were just right for me and answered all my questions. Great value, highly recommend!",
      es: "¡El plan de entrenamiento personalizado es genial para poder entrenar con un objetivo claro! Todo el equipo de Fitnflai ha sido muy atento y me han ayudado mucho. Se han asegurado de que el plan y los ritmos fueran los adecuados para mí y han respondido a todas mis preguntas. Gran relación calidad-precio, ¡la recomiendo sin duda!"
    },
    nutritionFocus: {
      en: "Marathon carb-loading & recovery",
      es: "Carga de carbohidratos para maratón y recuperación"
    },
    dailyTargetCalories: 2450,
    macros: [
      { name: { en: "Carbohydrates", es: "Carbohidratos" }, percentage: 55, color: "bg-orange-500" },
      { name: { en: "Proteins", es: "Proteínas" }, percentage: 25, color: "bg-emerald-500" },
      { name: { en: "Fats", es: "Grasas" }, percentage: 20, color: "bg-sky-500" }
    ],
    preWorkoutRecommendation: {
      en: "Oatmeal with berries and a banana",
      es: "Avena con bayas y un plátano"
    },
    postWorkoutRecommendation: {
      en: "Protein shake with milk and a handful of nuts",
      es: "Batido de proteínas con leche y un puñado de frutos secos"
    },
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&h=256&q=80"
  },
  {
    name: "Arjun",
    title: {
      en: "Cyclist & Sports Scientist",
      es: "Ciclista & Científico del Deporte"
    },
    sportIcon: "IconBike",
    quote: {
      en: "Fitnflai transformed my approach to fueling. Their tailored nutrition plans helped me push harder and recover faster on long rides.",
      es: "Fitnflai transformó mi enfoque de la alimentación. Sus planes de nutrición personalizados me ayudaron a esforzarme más y a recuperarme más rápido en mis salidas largas."
    },
    nutritionFocus: {
      en: "Endurance fueling & hydration",
      es: "Combustible e hidratación para resistencia"
    },
    dailyTargetCalories: 3200,
    macros: [
      { name: { en: "Carbohydrates", es: "Carbohidratos" }, percentage: 60, color: "bg-orange-500" },
      { name: { en: "Proteins", es: "Proteínas" }, percentage: 20, color: "bg-emerald-500" },
      { name: { en: "Fats", es: "Grasas" }, percentage: 20, color: "bg-sky-500" }
    ],
    preWorkoutRecommendation: {
      en: "Energy bar and electrolyte drink",
      es: "Barrita energética y bebida electrolítica"
    },
    postWorkoutRecommendation: {
      en: "Recovery shake with high carbs and protein",
      es: "Batido de recuperación con alto contenido de carbohidratos y proteínas"
    },
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80"
  },
  {
    name: "Valeria",
    title: {
      en: "Triathlete & Coach",
      es: "Triatleta & Entrenadora"
    },
    sportIcon: "IconSwimming",
    quote: {
      en: "Balancing three disciplines requires precise nutrition. Fitnflai's comprehensive platform ensured I met my caloric and macronutrient needs, leading to peak performance.",
      es: "Equilibrar tres disciplinas exige una nutrición precisa. La plataforma integral de Fitnflai aseguró que cubriera mis necesidades calóricas y de macronutrientes, lo que me llevó a un rendimiento máximo."
    },
    nutritionFocus: {
      en: "Multi-sport macro timing",
      es: "Sincronización de macros para multideporte"
    },
    dailyTargetCalories: 2800,
    macros: [
      { name: { en: "Carbohydrates", es: "Carbohidratos" }, percentage: 50, color: "bg-orange-500" },
      { name: { en: "Proteins", es: "Proteínas" }, percentage: 30, color: "bg-emerald-500" },
      { name: { en: "Fats", es: "Grasas" }, percentage: 20, color: "bg-sky-500" }
    ],
    preWorkoutRecommendation: {
      en: "Banana and a small coffee",
      es: "Plátano y un café pequeño"
    },
    postWorkoutRecommendation: {
      en: "Quinoa salad with chicken breast",
      es: "Ensalada de quinoa con pechuga de pollo"
    },
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&h=256&q=80"
  }
];



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



export function LandingPage() {
  const [activeProfileIndex, setActiveProfileIndex] = useState(0);
  const [profileImgError, setProfileImgError] = useState(false);
  const navigate = useNavigate()
  const { language, setLanguage, setPage, setUserRole } = useAppStore()
  const { t } = useTranslation()

  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [billingCycle, setBillingCycle] = useState<'annual' | 'monthly'>('annual')
  const [isPlanesDropdownOpen, setIsPlanesDropdownOpen] = useState(false)
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeBenefit, setActiveBenefit] = useState<1 | 2 | 3 | 4>(1)
  const [activeWhy, setActiveWhy] = useState<1 | 2 | 3 | 4>(1)

  // Autoplay benefits carousel (5 seconds interval, restarts on activeBenefit change)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBenefit((prev) => (prev === 4 ? 1 : (prev + 1) as 1 | 2 | 3 | 4))
    }, 5000)
    return () => clearInterval(timer)
  }, [activeBenefit])

  // Autoplay "¿Por qué Fitnflai?" carousel (5 seconds interval, restarts on activeWhy change)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveWhy((prev) => (prev === 4 ? 1 : (prev + 1) as 1 | 2 | 3 | 4))
    }, 5000)
    return () => clearInterval(timer)
  }, [activeWhy])

  // Autoplay testimonials carousel (6 seconds interval, restarts on activeProfileIndex change or manual click)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveProfileIndex((prev) => (prev === athleticNutritionProfiles.length - 1 ? 0 : prev + 1));
    }, 8000); // 8 seconds
    return () => clearInterval(timer);
  }, [activeProfileIndex]); // Dependency on activeProfileIndex to reset timer on manual click

  // Reset profile image error state on active profile change
  useEffect(() => {
    setProfileImgError(false);
  }, [activeProfileIndex]);
  
  // 3D Coverflow Carousel States and Methods
  const [activeIndex, setActiveIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const scrollLeft = () => {
    setActiveIndex((prev) => (prev === 0 ? 5 : prev - 1))
  }

  const scrollRight = () => {
    setActiveIndex((prev) => (prev === 5 ? 0 : prev + 1))
  }

  const getCircularDiff = (idx: number, active: number, total: number = 6) => {
    let diff = idx - active;
    while (diff < -total / 2) diff += total;
    while (diff >= total / 2) diff -= total;
    return diff;
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const diff = touchStart - touchEnd
    if (diff > 50) {
      scrollRight()
    } else if (diff < -50) {
      scrollLeft()
    }
    setTouchStart(null)
    setTouchEnd(null)
  }

  const isSpanish = language === 'ES'
  const toggleLanguage = () => {
    setLanguage(isSpanish ? 'EN' : 'ES')
  }

  const handlePortalEntry = (role: 'admin' | 'specialist') => {
    navigate('/descargar')
  }

  const handleNavClick = (anchorId: string) => {
    document.getElementById(anchorId)?.scrollIntoView({ behavior: 'smooth' })
  }

  const handlePricingClick = () => {
    navigate('/precios')
  }

  const getPlanRoute = (shield: string) => {
    const lower = shield.toLowerCase()
    if (lower.includes('bike') || lower.includes('120')) return 'ciclismo-de-ruta'
    if (lower.includes('swim') || lower.includes('tri')) return 'triatlon'
    if (lower.includes('str') || lower.includes('fit')) return 'entrenamiento-funcional'
    if (lower.includes('rec')) return 'senderismo'
    return 'trail-running'
  }

  const faqs: { q: string; a: string }[] = [
    {
      q: isSpanish ? '¿Cuánto cuesta Fitnflai?' : 'How much does Fitnflai cost?',
      a: isSpanish 
        ? 'Ofrecemos tres planes flexibles adaptados a tus objetivos: Essential por $9.99/mes, Pro por $19.99/mes (nuestro plan más popular con nutrición) y Elite por $29.99/mes (con soporte clínico prioritario). ¡Tu prueba de 21 días es completamente gratis!'
        : 'We offer three flexible plans: Essential for $9.99/mo, Pro for $19.99/mo (our most popular plan with nutrition coaching), and Elite for $29.99/mo (includes medical supervision). Your 21-day trial is completely free!'
    },
    {
      q: isSpanish ? '¿Puedo regalar una suscripción de Fitnflai?' : 'Can I gift a Fitnflai membership?',
      a: isSpanish
        ? '¡Sí, totalmente! Puedes adquirir tarjetas de regalo digitales de 3, 6 o 12 meses directamente desde el portal para regalárselas a amigos o familiares.'
        : 'Yes, absolutely! You can purchase digital gift cards for 3, 6, or 12 months directly from the portal for your friends and family.'
    },
    {
      q: isSpanish ? 'Nunca he corrido o entrenado antes, ¿es para mí?' : 'I have never run or trained before, is this for me?',
      a: isSpanish
        ? '¡Claro que sí! Contamos con planes específicos como "Aprender a correr" que empiezan desde cero, caminando y trotando suavemente, guiados de forma adaptativa para evitar que te frustres o te lesiones.'
        : 'Yes, definitely! We have specific plans like "Learn to Run" that start completely from scratch, blending walking and slow jogging safely to prevent injuries and frustration.'
    },
    {
      q: isSpanish ? '¿Puedo sincronizar Fitnflai con mi reloj inteligente o Strava?' : 'Can I sync Fitnflai with my smartwatch or Strava?',
      a: isSpanish
        ? '¡Sí! Sincronizamos de forma directa y automática con Garmin, Strava, Health Connect, Apple Health y Huawei Health. Tus entrenamientos se cargan solos al instante.'
        : 'Yes! We sync directly and automatically with Garmin, Strava, Health Connect, Apple Health and Huawei Health. Your activities download instantly.'
    },
    {
      q: isSpanish ? '¿Puedo hablar con coaches reales o profesionales de salud?' : 'Can I speak with real coaches or health professionals?',
      a: isSpanish
        ? '¡Exacto! A diferencia de otras apps básicas, en nuestros planes Pro y Elite cuentas con un canal de chat directo con deportólogos, fisioterapeutas y nutricionistas calificados para que tu progreso esté médicamente respaldado.'
        : 'Exactly! Unlike other basic apps, with our Pro and Elite plans, you have a direct chat channel with sports doctors, physiotherapists, and nutritionists.'
    }
  ];

  const articles: { title: string; desc: string; img: string; category: string }[] = [
    {
      title: isSpanish ? '¿Por qué correr es tan difícil después de un maratón?' : 'Why running is so hard after a marathon',
      desc: isSpanish ? 'Comprende el desgaste muscular y fisiológico tras la gran carrera.' : 'Understand the muscle and physiological repair process.',
      img: 'https://images.unsplash.com/photo-1502224562085-639556652f33?auto=format&fit=crop&w=400&q=80',
      category: isSpanish ? 'RECUPERACIÓN' : 'RECOVERY'
    },
    {
      title: isSpanish ? 'Estrategia de ritmo para recorridos con colinas' : 'Pacing strategy for hilly courses',
      desc: isSpanish ? 'Consejos prácticos para regular tu energía en ascensos.' : 'Practical tips to regulate your threshold power on climbs.',
      img: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=400&q=80',
      category: isSpanish ? 'TÉCNICA' : 'TECHNIQUE'
    },
    {
      title: isSpanish ? '¿Se puede entrenar con resfriado?' : 'Should you train with a cold?',
      desc: isSpanish ? 'La regla del cuello: cuándo descansar y cuándo activar.' : 'The neck rule: when to rest and when to keep moving.',
      img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80',
      category: isSpanish ? 'SALUD CLÍNICA' : 'CLINICAL HEALTH'
    },
    {
      title: isSpanish ? '¿Debo ir al gimnasio en semana de descarga?' : 'Should I lift during a taper week?',
      desc: isSpanish ? 'Cómo dosificar tu entrenamiento de fuerza antes de competir.' : 'How to dosage your strength routines before race day.',
      img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80',
      category: isSpanish ? 'FUERZA' : 'STRENGTH'
    }
  ];

  return (
    <div className="min-h-screen text-white font-sans antialiased relative overflow-hidden">
      {/* Background Image Watermark */}
      <div
        className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.20] bg-cover bg-center z-0"
        style={{
                    backgroundImage: "url('/images/home-bg.png')",
          backgroundAttachment: 'fixed'
        }}
      />
      {/* Sticky Header */}
      <nav className="sticky top-0 z-50 bg-gray-900 bg-opacity-80 backdrop-blur-md shadow-lg">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Brand Logo */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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
                className="text-gray-300 hover:text-orange-400 transition duration-300 font-semibold flex items-center gap-1"
              >
                <span>{t('landing.header.plans')}</span>
                <IconChevronDown size={14} className={`transform transition-transform ${isPlanesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isPlanesDropdownOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-gray-900/80 border border-gray-800 rounded-xl shadow-2xl py-2 z-50 text-left">
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
            <button onClick={handlePricingClick} className="text-gray-300 hover:text-orange-400 transition duration-300 font-semibold">{t('landing.header.pricing')}</button>
            <button onClick={() => navigate('/caracteristicas')} className="text-gray-300 hover:text-orange-400 transition duration-300 font-semibold">{t('landing.header.features')}</button>
            <button onClick={() => navigate('/coaches')} className="text-gray-300 hover:text-orange-400 transition duration-300 font-semibold">{t('landing.header.coaches')}</button>
            <button onClick={() => handleNavClick('soporte')} className="text-gray-300 hover:text-orange-400 transition duration-300 font-semibold">{t('landing.header.support')}</button>
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
                handlePricingClick()
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
                handleNavClick('soporte')
              }}
              className="block w-full text-left font-semibold text-sm text-gray-300 hover:text-orange-400 py-2 transition cursor-pointer"
            >
              {t('landing.header.support')}
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section (Image 2 Centered Design) */}
      <section
        className="relative z-10 pt-24 pb-32 text-center overflow-hidden bg-cover bg-center"
      >
        {/* Dark overlay to preserve background color depth */}
        <div className="absolute inset-0 bg-gray-950/30 pointer-events-none"></div>

        {/* Slanted Bottom Boundary for transition */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gray-800" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }}></div>

        <div className="container mx-auto px-6 relative z-10">
          {/* Centered Headlines */}
          <T.H1 className="text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight text-white mb-6 max-w-4xl mx-auto">
            {t('landing.hero.title')}
          </T.H1>
          <T.P className="text-xl lg:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            {t('landing.hero.subtitle')}
          </T.P>

          {/* Centered Main CTA Buttons */}
          <div className="flex flex-col items-center justify-center space-y-4 mb-16">
            <button
              onClick={() => handlePortalEntry('admin')}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-orange-500/20 hover:scale-105 transition-all duration-300 text-xl"
            >
              {isSpanish ? 'Comenzar prueba gratuita' : 'Start Free Trial'}
            </button>
            <T.P className="text-sm text-gray-400 font-medium">
              {isSpanish ? 'Prueba gratuita de 21 días. Cancela cuando quieras.' : '21-day free trial. Cancel anytime.'}
            </T.P>
          </div>

          {/* 5 Overlapping Phones & Watches Composite Layout */}
          <div className="relative max-w-5xl mx-auto h-[400px] md:h-[560px] flex items-center justify-center select-none mb-12">
            
            {/* Left Watch: Garmin Style */}
            <div className="absolute left-[-2%] lg:left-[2%] z-40 hidden md:block w-40 transform hover:scale-110 transition-transform duration-300">
              <div className="w-28 h-28 bg-gray-850 rounded-full border-4 border-gray-700 shadow-2xl flex flex-col items-center justify-center text-center p-2 relative">
                <div className="absolute inset-2 border border-gray-800 rounded-full"></div>
                <span className="text-orange-500 text-[10px] font-bold tracking-widest uppercase mb-1">Ritmo</span>
                <span className="text-white text-xl font-black tracking-tighter">10:27</span>
                <span className="text-emerald-400 text-[10px] font-bold mt-1">▲ 142 lpm</span>
              </div>
            </div>

            {/* Phone 1 (Far Left): Categorías */}
            <div className="absolute left-[2%] lg:left-[8%] w-40 md:w-56 h-[260px] md:h-[395px] transform -rotate-12 z-10 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity duration-300">
              <img src="/images/mockup_09.png" alt="Mockup 9" className="max-w-full max-h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]" />
            </div>

            {/* Phone 2 (Mid Left): Progreso / Plan */}
            <div className="absolute left-[15%] lg:left-[21%] w-40 md:w-56 h-[285px] md:h-[420px] transform -rotate-6 z-20 flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity duration-300">
              <img src="/images/mockup_10.png" alt="Mockup 10" className="max-w-full max-h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.4)]" />
            </div>

            {/* Phone 3 (Center): Calendario de Hoy - HIGHLIGHTED */}
            <div className="absolute left-1/2 -translate-x-1/2 w-44 md:w-60 h-[300px] md:h-[460px] z-30 flex items-center justify-center scale-105">
              <img src="/images/mockup_11.png" alt="Mockup 11" className="max-w-full max-h-full object-contain filter drop-shadow-[0_25px_40px_rgba(232,98,42,0.25)]" />
            </div>

            {/* Phone 4 (Mid Right): GPS Map */}
            <div className="absolute right-[15%] lg:right-[21%] w-40 md:w-56 h-[285px] md:h-[420px] transform rotate-6 z-20 flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity duration-300">
              <img src="/images/mockup_12.png" alt="Mockup 12" className="max-w-full max-h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.4)]" />
            </div>

            {/* Phone 5 (Far Right): Comunidad & Soporte */}
            <div className="absolute right-[2%] lg:right-[8%] w-40 md:w-56 h-[260px] md:h-[395px] transform rotate-12 z-10 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity duration-300">
              <img src="/images/mockup_13.png" alt="Mockup 13" className="max-w-full max-h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]" />
            </div>

            {/* Right Watch: Apple Style */}
            <div className="absolute right-[-2%] lg:right-[2%] z-40 hidden md:block w-40 transform hover:scale-110 transition-transform duration-300">
              <div className="w-24 h-28 bg-gray-850 rounded-[1.2rem] border-4 border-gray-700 shadow-2xl flex flex-col justify-between p-2.5 relative">
                <div className="absolute inset-1.5 border border-gray-800 rounded-[0.9rem]"></div>
                <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold">
                  <span>9:41</span>
                  <span className="text-red-500">●</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full border-4 border-orange-500 border-t-emerald-400 flex items-center justify-center">
                    <span className="text-[11px] font-black text-white">78%</span>
                  </div>
                </div>
                <div className="text-center text-[8px] font-bold uppercase text-gray-500 tracking-wider">Fitnflai</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Device Integration Row */}
      <section className="py-12 bg-gray-800/70 relative z-10">
        <div className="container mx-auto px-6 text-center">
          <T.P className="text-xl text-gray-300 mb-8">{t('landing.deviceIntegration.title')}</T.P>
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-400">
            {/* Using simple text for brands with generic icons */}
            <div className="flex items-center space-x-2">
              <IconDeviceWatch size={36} className="text-gray-500" />
              <T.P className="text-2xl font-semibold">{t('landing.deviceIntegration.brands.garmin')}</T.P>
            </div>
            <div className="flex items-center space-x-2">
              <IconRoute size={36} className="text-gray-500" />
              <T.P className="text-2xl font-semibold">{t('landing.deviceIntegration.brands.strava')}</T.P>
            </div>
            <div className="flex items-center space-x-2">
              <IconHeart size={36} className="text-gray-500" />
              <T.P className="text-2xl font-semibold">{t('landing.deviceIntegration.brands.healthConnect')}</T.P>
            </div>
            <div className="flex items-center space-x-2">
              <IconBrandApple size={36} className="text-gray-500" />
              <T.P className="text-2xl font-semibold">{t('landing.deviceIntegration.brands.appleHealth')}</T.P>
            </div>
            <div className="flex items-center space-x-2">
              <IconDeviceWatch size={36} className="text-gray-500" />
              <T.P className="text-2xl font-semibold">{t('landing.deviceIntegration.brands.huaweiHealth')}</T.P>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Calculator Section */}
      <TrainingCalculator onPortalEntry={handlePortalEntry} />

      {/* User Testimonials Section (Image 1 Layered Offset Design - Brand Orange & Dark Background) */}
      <section className="py-24 bg-gray-950/70 text-white overflow-hidden relative z-10">
        <div className="relative max-w-5xl mx-auto px-12 md:px-16">
          {/* Centered Profile Navigation Tabs */}


          <button
            onClick={() => setActiveProfileIndex((prev) => (prev === 0 ? athleticNutritionProfiles.length - 1 : prev - 1))}
            className="absolute left-0 md:left-4 top-1/2 -translate-y-1/2 bg-gray-900/50 hover:bg-gray-800/70 text-white p-2 rounded-full shadow-lg border border-gray-700 transition-all duration-300"
          >
            <IconChevronLeft size={24} />
          </button>
          <button
            onClick={() => setActiveProfileIndex((prev) => (prev === athleticNutritionProfiles.length - 1 ? 0 : prev + 1))}
            className="absolute right-0 md:right-4 top-1/2 -translate-y-1/2 bg-gray-900/50 hover:bg-gray-800/70 text-white p-2 rounded-full shadow-lg border border-gray-700 transition-all duration-300"
          >
            <IconChevronRight size={24} />
          </button>
          <div className="flex flex-col md:flex-row items-stretch justify-center gap-8 md:gap-0 relative">
            {/* Left Card: Profile Details (Orange Backdrop) */}
            <div className="w-full md:w-[45%] bg-[#ea580c]/15 backdrop-blur-md border border-orange-500/20 rounded-3xl p-8 shadow-lg relative z-10 md:-mr-4 min-h-[420px]">
              {(() => {
                const currentProfile = athleticNutritionProfiles[activeProfileIndex];
                return (
                  <div className="space-y-6 text-left h-full flex flex-col justify-between">
                    <div>
                      {/* Title & Image */}
                      <div className="flex items-center gap-4 mb-6">
                        {!profileImgError ? (
                          <img 
                            src={currentProfile.image} 
                            alt={currentProfile.name} 
                            onError={() => setProfileImgError(true)}
                            className="w-16 h-16 rounded-full object-cover border-2 border-orange-400 shadow-md shrink-0" 
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full border-2 border-orange-400 bg-orange-600 flex items-center justify-center font-black text-xl text-white shadow-md shrink-0">
                            {currentProfile.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="text-xl font-extrabold text-white">{currentProfile.name}</p>
                          <p className="text-sm text-gray-200">{isSpanish ? currentProfile.title.es : currentProfile.title.en}</p>
                        </div>
                      </div>

                      {/* Nutrition Focus */}
                      <h4 className="text-sm font-black uppercase tracking-wider text-orange-400 mb-2">
                        {isSpanish ? 'Enfoque Nutricional' : 'Nutrition Focus'}
                      </h4>
                      <p className="text-lg font-bold text-white mb-6 leading-relaxed">
                        {isSpanish ? currentProfile.nutritionFocus.es : currentProfile.nutritionFocus.en}
                      </p>

                      {/* Daily Target & Macros */}
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-4 border-b border-orange-500/30 pb-4">
                          <span className="text-sm uppercase font-bold text-orange-300 tracking-wider">
                            {isSpanish ? 'Objetivo Diario' : 'Daily Target'}
                          </span>
                          <span className="text-2xl font-black text-white">
                            {currentProfile.dailyTargetCalories} kcal
                          </span>
                        </div>
                        <h5 className="text-xs font-black uppercase tracking-wider text-gray-100 mb-3">
                          {isSpanish ? 'Distribución de Macronutrientes' : 'Macronutrient Distribution'}
                        </h5>
                        <div className="space-y-2">
                          {currentProfile.macros.map((macro) => (
                            <div key={isSpanish ? macro.name.es : macro.name.en}>
                              <div className="flex justify-between text-xs font-bold text-gray-100 mb-1">
                                <span>{isSpanish ? macro.name.es : macro.name.en}</span>
                                <span>{macro.percentage}%</span>
                              </div>
                              <div className="w-full bg-orange-900/40 h-2 rounded-full overflow-hidden">
                                <div
                                  className={`${macro.color} h-full rounded-full transition-all duration-500`}
                                  style={{ width: `${macro.percentage}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Fueling Strategy Grid */}
                    <div className="grid grid-cols-1 gap-4 pt-4 border-t border-orange-500/30">
                      <div className="bg-orange-900/30 rounded-xl p-4">
                        <span className="text-[10px] uppercase font-black tracking-wider text-orange-300 block mb-1">
                          {isSpanish ? 'Pre-Entrenamiento' : 'Pre-Workout'}
                        </span>
                        <p className="text-sm text-white leading-relaxed font-medium">
                          {isSpanish ? currentProfile.preWorkoutRecommendation.es : currentProfile.preWorkoutRecommendation.en}
                        </p>
                      </div>
                      <div className="bg-orange-900/30 rounded-xl p-4">
                        <span className="text-[10px] uppercase font-black tracking-wider text-orange-300 block mb-1">
                          {isSpanish ? 'Post-Entrenamiento' : 'Post-Workout'}
                        </span>
                        <p className="text-sm text-white leading-relaxed font-medium">
                          {isSpanish ? currentProfile.postWorkoutRecommendation.es : currentProfile.postWorkoutRecommendation.en}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Right Card: Testimonial & Ratings (Dark Backdrop) */}
            <div className="w-full md:w-[55%] bg-[#141416]/80 rounded-3xl p-8 md:p-10 text-white shadow-2xl relative z-20 border border-gray-800/80 min-h-[420px]">
              {(() => {
                const currentProfile = athleticNutritionProfiles[activeProfileIndex];
                return (
                  <div className="flex flex-col justify-between h-full space-y-6">
                    {/* Testimonial Quote */}
                    <div className="text-center flex-grow flex items-center justify-center">
                      <T.H3 className="text-2xl md:text-3xl font-serif italic text-white leading-relaxed">
                        {isSpanish ? currentProfile.quote.es : currentProfile.quote.en}
                      </T.H3>
                    </div>

                    {/* Profile Name & Title */}
                    <div className="text-center mb-6">
                      <p className="font-extrabold text-lg text-orange-400 tracking-wide">
                        {currentProfile.name}
                      </p>
                      <p className="text-sm text-gray-400">
                        {isSpanish ? currentProfile.title.es : currentProfile.title.en}
                      </p>
                    </div>

                    {/* App Ratings */}
                    <div className="mt-auto pt-6 border-t border-gray-800/60 flex flex-col sm:flex-row justify-around items-center gap-6">
                      {/* Apple Rating */}
                      <div className="text-center">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-white/80 mb-1 flex items-center justify-center gap-1">
                          76,000+ {isSpanish ? 'opiniones en' : 'ratings on'}
                          <IconBrandApple size={14} className="text-white" /> Apple App Store
                        </p>
                        <div className="flex items-center justify-center gap-1">
                          <div className="flex text-white">
                            <IconStar size={18} fill="currentColor" strokeWidth={0} />
                            <IconStar size={18} fill="currentColor" strokeWidth={0} />
                            <IconStar size={18} fill="currentColor" strokeWidth={0} />
                            <IconStar size={18} fill="currentColor" strokeWidth={0} />
                            <IconStar size={18} fill="currentColor" strokeWidth={0} />
                          </div>
                          <span className="text-base font-black ml-2">4.9</span>
                        </div>
                      </div>

                      {/* Google Play Rating */}
                      <div className="text-center">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-white/80 mb-1 flex items-center justify-center gap-1">
                          17,000+ {isSpanish ? 'opiniones en' : 'ratings on'}
                          <IconBrandGooglePlay size={14} className="text-white" /> Google Play Store
                        </p>
                        <div className="flex items-center justify-center gap-1">
                          <div className="flex text-white">
                            <IconStar size={18} fill="currentColor" strokeWidth={0} />
                            <IconStar size={18} fill="currentColor" strokeWidth={0} />
                            <IconStar size={18} fill="currentColor" strokeWidth={0} />
                            <IconStar size={18} fill="currentColor" strokeWidth={0} />
                            <IconStar size={18} fill="currentColor" strokeWidth={0} />
                          </div>
                          <span className="text-base font-black ml-2">4.7</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* Why Fitnflai Section (Image 1 High-Fidelity Watches & Dark Background) */}
      <section className="py-24 bg-gray-950/70 text-white overflow-hidden border-t border-gray-900 relative z-10" id="funciones">
        <div className="container mx-auto px-6 max-w-5xl flex flex-col md:flex-row items-center justify-between gap-12">
          
          {/* Left Side: Dynamic Image with Rounded Corners (no border, no container frame) */}
          <div className="w-full md:w-1/2 flex items-center justify-center min-h-[420px] md:min-h-[500px] pr-0 md:pr-12">
            <div className="w-[340px] h-[520px] md:w-[440px] md:h-[640px] flex items-center justify-center transform hover:scale-[1.02] transition-all duration-300 select-none">
              <img 
                src={
                  activeWhy === 1 ? '/images/why_plans.png' :
                  activeWhy === 2 ? '/images/why_sync.png' :
                  activeWhy === 3 ? '/images/why_support.png' :
                  '/images/why_strength.png'
                } 
                alt="Why Fitnflai Feature" 
                className="max-w-full max-h-full object-contain transition-opacity duration-300 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                key={activeWhy}
              />
            </div>
          </div>

          {/* Right Side: Numbered List */}
          <div className="w-full md:w-1/2 text-left">
            <T.H2 className="text-4xl font-extrabold mb-8 text-white tracking-tight leading-tight">
              {isSpanish ? '¿Por qué Fitnflai?' : 'Why Fitnflai?'}
            </T.H2>
            <ul className="space-y-6">
              {/* Item 1 */}
              <li 
                onClick={() => setActiveWhy(1)}
                className={`flex items-start gap-4 cursor-pointer transition-all duration-300 p-3 rounded-2xl ${activeWhy === 1 ? 'bg-orange-500/5 border border-orange-500/10 shadow-[0_4px_20px_rgba(232,98,42,0.05)]' : 'hover:bg-gray-900/20 border border-transparent'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1 transition-all duration-300 ${activeWhy === 1 ? 'bg-orange-500 border border-orange-500 text-white shadow-md shadow-orange-500/20' : 'border border-gray-700 text-gray-400'}`}>
                  1
                </div>
                <div>
                  <T.H3 className={`font-bold text-sm mb-1 transition-colors duration-300 ${activeWhy === 1 ? 'text-orange-500' : 'text-white'}`}>
                    {isSpanish ? 'Planes de carrera personalizados sólo para ti' : 'Personalized training plans tailored just for you'}
                  </T.H3>
                  <T.P className="text-gray-400 text-xs leading-relaxed mt-1">
                    {isSpanish 
                      ? 'Nuestros planes de entrenamiento, los mejor valorados, están personalizados especialmente para ti con sesiones variadas y emocionantes creadas por el motor de Fitnflai.' 
                      : 'Our highly-rated training plans are customized specifically for you with exciting, varied sessions created by the Fitnflai engine.'}
                  </T.P>
                </div>
              </li>

              {/* Item 2 */}
              <li 
                onClick={() => setActiveWhy(2)}
                className={`flex items-start gap-4 cursor-pointer transition-all duration-300 p-3 rounded-2xl ${activeWhy === 2 ? 'bg-orange-500/5 border border-orange-500/10 shadow-[0_4px_20px_rgba(232,98,42,0.05)]' : 'hover:bg-gray-900/20 border border-transparent'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1 transition-all duration-300 ${activeWhy === 2 ? 'bg-orange-500 border border-orange-500 text-white shadow-md shadow-orange-500/20' : 'border border-gray-700 text-gray-400'}`}>
                  2
                </div>
                <div>
                  <T.H3 className={`font-bold text-sm mb-1 transition-colors duration-300 ${activeWhy === 2 ? 'text-orange-500' : 'text-white'}`}>
                    {isSpanish ? 'Sincroniza con tus dispositivos favoritos' : 'Sync with your favorite devices'}
                  </T.H3>
                  <T.P className="text-gray-400 text-xs leading-relaxed mt-1">
                    {isSpanish 
                      ? 'Sigue todos tus entrenamientos en tiempo real en tus dispositivos mientras corres, pedaleas o nadas. Hasta te ayudaremos a establecer el ritmo adecuado.' 
                      : 'Track all your workouts in real time on your devices as you run, cycle, or swim. We\'ll even help you set the correct target pace.'}
                  </T.P>
                </div>
              </li>

              {/* Item 3 */}
              <li 
                onClick={() => setActiveWhy(3)}
                className={`flex items-start gap-4 cursor-pointer transition-all duration-300 p-3 rounded-2xl ${activeWhy === 3 ? 'bg-orange-500/5 border border-orange-500/10 shadow-[0_4px_20px_rgba(232,98,42,0.05)]' : 'hover:bg-gray-900/20 border border-transparent'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1 transition-all duration-300 ${activeWhy === 3 ? 'bg-orange-500 border border-orange-500 text-white shadow-md shadow-orange-500/20' : 'border border-gray-700 text-gray-400'}`}>
                  3
                </div>
                <div>
                  <T.H3 className={`font-bold text-sm mb-1 transition-colors duration-300 ${activeWhy === 3 ? 'text-orange-500' : 'text-white'}`}>
                    {isSpanish ? 'Asistencia integral' : 'Holistic support'}
                  </T.H3>
                  <T.P className="text-gray-400 text-xs leading-relaxed mt-1">
                    {isSpanish 
                      ? 'Obtén asistencia integral para convertirte en un mejor atleta, tanto si necesitas consejos sobre tu técnica de carrera, consejos de nutrición o ejercicios específicos para la rodilla de corredor.' 
                      : 'Get holistic support to become a better athlete, whether you need running form tips, nutrition guidance, or specific exercises for runner\'s knee injuries.'}
                  </T.P>
                </div>
              </li>

              {/* Item 4 */}
              <li 
                onClick={() => setActiveWhy(4)}
                className={`flex items-start gap-4 cursor-pointer transition-all duration-300 p-3 rounded-2xl ${activeWhy === 4 ? 'bg-orange-500/5 border border-orange-500/10 shadow-[0_4px_20px_rgba(232,98,42,0.05)]' : 'hover:bg-gray-900/20 border border-transparent'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1 transition-all duration-300 ${activeWhy === 4 ? 'bg-orange-500 border border-orange-500 text-white shadow-md shadow-orange-500/20' : 'border border-gray-700 text-gray-400'}`}>
                  4
                </div>
                <div>
                  <T.H3 className={`font-bold text-sm mb-1 transition-colors duration-300 ${activeWhy === 4 ? 'text-orange-500' : 'text-white'}`}>
                    {isSpanish ? 'Entrenamiento de fuerza y movilidad para atletas' : 'Strength & mobility training for athletes'}
                  </T.H3>
                  <T.P className="text-gray-400 text-xs leading-relaxed mt-1">
                    {isSpanish 
                      ? 'Complementa tu entrenamiento de resistencia con un programa personalizado de fuerza, acondicionamiento y movilidad que se adapte a tu plan de entrenamiento.' 
                      : 'Complement your endurance training with a personalized strength, conditioning, and mobility program tailored to your active training calendar.'}
                  </T.P>
                </div>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* Plan Finder Section (Image 1 High-Fidelity & Dark Background) */}
      <section className="py-24 bg-gray-950/70 text-white border-t border-gray-900 relative z-10" id="planes">
        <div className="container mx-auto px-6 text-center max-w-5xl">
          {/* Centered Heading */}
          <T.H2 className="text-4xl lg:text-5xl font-black text-white mb-2 tracking-tight">
            {isSpanish ? 'Encuentra un plan de entrenamiento que se adapte a ti.' : 'Find a training plan that adapts to you.'}
          </T.H2>
          <T.P className="text-2xl text-orange-500 font-extrabold mb-12">
            {isSpanish ? 'Tu prueba de 21 días es gratis.' : 'Your 21-day trial is free.'}
          </T.P>

          {/* Relative wrapper for 3D Coverflow Carousel and Navigation Buttons */}
          <div 
            className="relative group max-w-5xl mx-auto h-[450px] flex items-center justify-center mb-4 select-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            
            {/* Left Button */}
            <button 
              onClick={scrollLeft}
              className="absolute left-[5%] top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-black/85 border border-gray-800 flex items-center justify-center text-white hover:text-orange-500 hover:border-orange-500 hover:bg-black transition-all cursor-pointer z-40 opacity-0 group-hover:opacity-100 hidden lg:flex shadow-2xl"
              aria-label="Anterior"
            >
              <IconChevronLeft size={20} />
            </button>

            {/* Right Button */}
            <button 
              onClick={scrollRight}
              className="absolute right-[5%] top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-black/85 border border-gray-800 flex items-center justify-center text-white hover:text-orange-500 hover:border-orange-500 hover:bg-black transition-all cursor-pointer z-40 opacity-0 group-hover:opacity-100 hidden lg:flex shadow-2xl"
              aria-label="Siguiente"
            >
              <IconChevronRight size={20} />
            </button>

            {/* 3D Scene Perspective Box */}
            <div 
              className="relative w-full h-full flex items-center justify-center"
              style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
            >
              {(() => {
                const actualPlans = [
                  { 
                    title: isSpanish ? 'Ciclismo de ruta' : 'Road Cycling', 
                    image: '/images/ciclismo-de-ruta.png', 
                    route: 'ciclismo-de-ruta',
                    desc: isSpanish 
                      ? 'Perfecciona tu resistencia, cadencia y potencia aeróbica en carretera.' 
                      : 'Perfect your endurance, cadence, and aerobic power on the road.',
                    color: '#E24B4A' // Red
                  },
                  { 
                    title: isSpanish ? 'Trail running' : 'Trail Running', 
                    image: '/images/trail-running.png', 
                    route: 'trail-running',
                    desc: isSpanish 
                      ? 'Entrena con desnivel y mejora tu técnica en terrenos de montaña.' 
                      : 'Train with elevation and improve your technique on mountain terrain.',
                    color: '#E8622A' // Brand Orange
                  },
                  { 
                    title: isSpanish ? 'MTB' : 'MTB', 
                    image: '/images/mtb.png', 
                    route: 'mtb',
                    desc: isSpanish 
                      ? 'Domina senderos técnicos con potencia explosiva y agilidad.' 
                      : 'Master technical singletracks with explosive power and agility.',
                    color: '#4CAF82' // Green
                  },
                  { 
                    title: isSpanish ? 'Triatlón' : 'Triathlon', 
                    image: '/images/triatlon.png', 
                    route: 'triatlon',
                    desc: isSpanish 
                      ? 'Optimiza las transiciones y consolida natación, ciclismo y carrera.' 
                      : 'Optimize transitions and solidify swim, bike, and run legs.',
                    color: '#E24B4A' // Deep Red (matches Triatlon shield)
                  },
                  { 
                    title: isSpanish ? 'Senderismo' : 'Hiking & Trekking', 
                    image: '/images/senderismo.png', 
                    route: 'senderismo',
                    desc: isSpanish 
                      ? 'Prepara travesías de montaña con fuerza, estabilidad y fondo.' 
                      : 'Prepare for mountain crossings with strength, stability, and base.',
                    color: '#F5C842' // Gold Yellow
                  },
                  { 
                    title: isSpanish ? 'Entrenamiento funcional' : 'Functional Training', 
                    image: '/images/entrenamiento-funcional.png', 
                    route: 'entrenamiento-funcional',
                    desc: isSpanish 
                      ? 'Mejora tu fuerza general, movilidad y acondicionamiento físico.' 
                      : 'Improve your overall strength, mobility, and general conditioning.',
                    color: '#9B59B6' // Purple
                  },
                ];

                return actualPlans.map((p, idx) => {
                  const diff = getCircularDiff(idx, activeIndex, 6);
                  const absDiff = Math.abs(diff);
                  const isCenter = idx === activeIndex;
                  const isVisible = absDiff <= 2;

                  // 3D positioning style calculations for Coveflow
                  const xOffset = diff * 180; // horizontal separation
                  const zOffset = isCenter ? 100 : -150 - absDiff * 30; // center is pulled forward, sides pushed back
                  const rotationY = diff * -32; // tilt angles for side cards
                  const scale = isCenter ? 1.05 : 1 - absDiff * 0.12;

                  const cardStyle: React.CSSProperties = {
                    transform: `translateX(${xOffset}px) translateZ(${zOffset}px) rotateY(${rotationY}deg) scale(${scale})`,
                    zIndex: 30 - absDiff,
                    opacity: isVisible ? 1 - absDiff * 0.25 : 0,
                    pointerEvents: isCenter ? 'auto' : 'none',
                    transition: 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
                    borderColor: isCenter ? p.color : undefined,
                    boxShadow: isCenter ? `0 20px 50px rgba(0,0,0,0.5), 0 0 15px ${p.color}35` : undefined,
                  };

                  return (
                    <div 
                      key={idx}
                      style={cardStyle}
                      onClick={() => setActiveIndex(idx)}
                      className={`absolute w-[280px] sm:w-[310px] h-[380px] bg-[#141416]/80 border ${isCenter ? '' : 'border-gray-800/60'} rounded-3xl p-6 flex flex-col justify-between items-center text-center cursor-pointer backface-hidden`}
                    >
                      {/* Artistic Card Line-Art Background with rounded corners aligned to top */}
                      <div 
                        className="absolute inset-0 pointer-events-none opacity-[0.22] bg-top bg-no-repeat bg-contain mix-blend-screen z-0 rounded-t-3xl"
                        style={{ backgroundImage: `url("/images/${p.route}-bg.png")` }}
                      />
                      <div className="flex flex-col items-center w-full z-10">
                        {/* Glowing Custom Shield Image */}
                        <div className="mb-4 w-28 h-28 flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
                          <img 
                            src={p.image} 
                            alt={p.title} 
                            className="max-w-full max-h-full object-contain filter drop-shadow-[0_10px_20px_rgba(232,98,42,0.15)]" 
                          />
                        </div>
                        <T.H3 className="text-lg font-bold mb-2 text-white">{p.title}</T.H3>
                        <T.P className="text-gray-400 text-xs px-2 line-clamp-3 leading-relaxed min-h-[48px]">{p.desc}</T.P>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/planes/' + p.route);
                        }}
                        className={`mt-4 w-full py-2 bg-black hover:bg-orange-500 hover:border-orange-500 text-white font-extrabold rounded-full transition-colors duration-300 text-xs tracking-wide border ${isCenter ? 'border-orange-500/30' : 'border-gray-800'} cursor-pointer z-10`}
                      >
                        {isSpanish ? 'Saber más' : 'Learn more'}
                      </button>
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          {/* Dots Indicator below the 3D scene to keep it grounded */}
          <div className="flex justify-center space-x-2.5 mb-16">
            {[0, 1, 2, 3, 4, 5].map((idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${idx === activeIndex ? 'bg-orange-500 w-6' : 'bg-gray-700 hover:bg-gray-500'}`}
                aria-label={`Ir al plan ${idx + 1}`}
              />
            ))}
          </div>

          {/* Custom Plan Wide Card (Image 1 style) */}
          <div className="bg-[#141416] text-white rounded-3xl p-8 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 mb-16 text-left border border-gray-900 shadow-xl">
            <div className="flex items-center space-x-8">
              {/* Custom Plan High-Fidelity Image */}
              <div className="hidden sm:flex items-center justify-center w-36 h-24 shrink-0 transform hover:scale-105 transition-transform duration-300">
                <img 
                  src="/images/plan-personalizado.png" 
                  alt={isSpanish ? 'Plan personalizado' : 'Custom Plan'} 
                  className="max-w-full max-h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.3)]"
                />
              </div>
              <div>
                <T.H3 className="text-2xl font-black mb-2 text-white">
                  {isSpanish ? 'Plan personalizado' : 'Custom Plan'}
                </T.H3>
                <T.P className="text-gray-400 text-sm max-w-md">
                  {isSpanish 
                    ? '¿Tienes en mente alguna carrera concreta o una distancia específica? Esta es la solución que necesitas. Crea un plan personalizado de entre 6 y 26 semanas de duración para cualquier distancia.' 
                    : 'Have a specific race or distance in mind? Create a custom training plan of 6 to 26 weeks long for any tailored distance.'}
                </T.P>
              </div>
            </div>
            <button 
              onClick={() => navigate('/planes/trail-running')}
              className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full transition duration-300 text-lg shadow-md shrink-0"
            >
              {isSpanish ? 'Comenzar' : 'Get Started'}
            </button>
          </div>

          {/* Pricing Highlight Text */}
          <div className="max-w-2xl mx-auto border-t border-gray-800 pt-12" id="precios">
            <T.P className="text-2xl text-gray-400 mb-6">
              {isSpanish 
                ? 'Únete al equipo que ya entrena con Fitnflai, la aplicación de rendimiento mejor valorada.' 
                : 'Join the athletes already training with Fitnflai, the highest-rated performance coaching app.'}
            </T.P>
            <T.P className="text-3xl font-extrabold text-white mb-8">
              {isSpanish 
                ? 'Inicia tu plan hoy mismo por solo $9.99 por mes / $101.90 por año.' 
                : 'Start your plan today for only $9.99 per month / $101.90 per year.'}
            </T.P>
            <button
              onClick={() => navigate('/descargar')}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-full shadow-lg transition duration-300 text-xl"
            >
              {isSpanish ? 'Comenzar prueba gratuita' : 'Start Free Trial'}
            </button>
            <T.P className="text-sm text-gray-500 mt-4">
              {isSpanish ? 'Prueba gratuita de 21 días. Cancela cuando quieras.' : '21-day free trial. Cancel anytime.'}
            </T.P>
          </div>
        </div>
      </section>

      {/* Become a Fitnflai Section (Image 2 High-Fidelity Community Feed) */}
      <section className="py-24 bg-gray-950/70 text-white overflow-hidden relative z-10">
        <div className="container mx-auto px-6 max-w-5xl flex flex-col md:flex-row items-center justify-between gap-12">
          
          {/* Left Side: Perks List */}
          <div className="w-full md:w-1/2 text-left">
            <T.H2 className="text-2xl md:text-3xl font-black mb-10 text-white tracking-tight leading-tight">
              {isSpanish ? 'Conviértete en un Fitnflai' : 'Become a Fitnflai'}
            </T.H2>
             <ul className="space-y-6">
                {/* Item 1 */}
                <li 
                  onClick={() => setActiveBenefit(1)}
                  className={`flex items-start gap-4 cursor-pointer transition-all duration-300 p-3 rounded-2xl ${activeBenefit === 1 ? 'bg-orange-500/5 border border-orange-500/10 shadow-[0_4px_20px_rgba(232,98,42,0.05)]' : 'hover:bg-gray-900/20 border border-transparent'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1 transition-all duration-300 ${activeBenefit === 1 ? 'bg-orange-500 border border-orange-500 text-white shadow-md shadow-orange-500/20' : 'border border-gray-700 text-gray-400'}`}>
                    1
                  </div>
                  <div>
                    <T.H3 className={`font-bold text-sm mb-1 transition-colors duration-300 ${activeBenefit === 1 ? 'text-orange-500' : 'text-white'}`}>
                      {isSpanish ? 'Únete a la Comunidad' : 'Join the Community'}
                    </T.H3>
                    <T.P className="text-gray-400 text-xs leading-relaxed mt-1.5">
                      {isSpanish 
                        ? 'Mantente motivado y responsable uniéndote a una Comunidad privada de miles de atletas de todo el mundo.' 
                        : 'Stay motivated and accountable by joining a private Community of thousands of athletes worldwide.'}
                    </T.P>
                  </div>
                </li>

                {/* Item 2 */}
                <li 
                  onClick={() => setActiveBenefit(2)}
                  className={`flex items-start gap-4 cursor-pointer transition-all duration-300 p-3 rounded-2xl ${activeBenefit === 2 ? 'bg-orange-500/5 border border-orange-500/10 shadow-[0_4px_20px_rgba(232,98,42,0.05)]' : 'hover:bg-gray-900/20 border border-transparent'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1 transition-all duration-300 ${activeBenefit === 2 ? 'bg-orange-500 border border-orange-500 text-white shadow-md shadow-orange-500/20' : 'border border-gray-700 text-gray-400'}`}>
                    2
                  </div>
                  <div>
                    <T.H3 className={`font-bold text-sm mb-1 transition-colors duration-300 ${activeBenefit === 2 ? 'text-orange-500' : 'text-white'}`}>
                      {isSpanish ? 'Consigue descuentos & ofertas' : 'Get discounts & offers'}
                    </T.H3>
                    <T.P className="text-gray-400 text-xs leading-relaxed mt-1.5">
                      {isSpanish 
                        ? 'Nos hemos asociado con proveedores líderes en nutrición, ropa, eventos y suplementos para ofrecer descuentos exclusivos a los atletas.' 
                        : 'We have partnered with leading nutrition, apparel, events, and supplement providers to offer exclusive discounts.'}
                    </T.P>
                  </div>
                </li>

                {/* Item 3 */}
                <li 
                  onClick={() => setActiveBenefit(3)}
                  className={`flex items-start gap-4 cursor-pointer transition-all duration-300 p-3 rounded-2xl ${activeBenefit === 3 ? 'bg-orange-500/5 border border-orange-500/10 shadow-[0_4px_20px_rgba(232,98,42,0.05)]' : 'hover:bg-gray-900/20 border border-transparent'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1 transition-all duration-300 ${activeBenefit === 3 ? 'bg-orange-500 border border-orange-500 text-white shadow-md shadow-orange-500/20' : 'border border-gray-700 text-gray-400'}`}>
                    3
                  </div>
                  <div>
                    <T.H3 className={`font-bold text-sm mb-1 transition-colors duration-300 ${activeBenefit === 3 ? 'text-orange-500' : 'text-white'}`}>
                      {isSpanish ? 'Seguimiento por especialista' : 'Specialist follow-up'}
                    </T.H3>
                    <T.P className="text-gray-400 text-xs leading-relaxed mt-1.5">
                      {isSpanish 
                        ? 'Recibe acompañamiento continuo y ajustes personalizados en tus rutinas de la mano de deportólogos, fisioterapeutas o entrenadores dedicados.' 
                        : 'Receive continuous support and personalized adjustments to your routines from dedicated sports doctors, physiotherapists, or coaches.'}
                    </T.P>
                  </div>
                </li>

                {/* Item 4 */}
                <li 
                  onClick={() => setActiveBenefit(4)}
                  className={`flex items-start gap-4 cursor-pointer transition-all duration-300 p-3 rounded-2xl ${activeBenefit === 4 ? 'bg-orange-500/5 border border-orange-500/10 shadow-[0_4px_20px_rgba(232,98,42,0.05)]' : 'hover:bg-gray-900/20 border border-transparent'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1 transition-all duration-300 ${activeBenefit === 4 ? 'bg-orange-500 border border-orange-500 text-white shadow-md shadow-orange-500/20' : 'border border-gray-700 text-gray-400'}`}>
                    4
                  </div>
                  <div>
                    <T.H3 className={`font-bold text-sm mb-1 transition-colors duration-300 ${activeBenefit === 4 ? 'text-orange-500' : 'text-white'}`}>
                      {isSpanish ? 'Agenda citas con tu especialista' : 'Schedule appointments with your specialist'}
                    </T.H3>
                    <T.P className="text-gray-400 text-xs leading-relaxed mt-1.5">
                      {isSpanish 
                        ? 'Reserva consultas individuales y sesiones de seguimiento de forma directa desde la app para optimizar tu rendimiento y salud activa.' 
                        : 'Book individual consultations and follow-up sessions directly from the app to optimize your performance and active health.'}
                    </T.P>
                  </div>
                </li>
              </ul>
            </div>

            {/* Right Side: Community Feed Phone Mockup */}
            <div className="w-full md:w-1/2 flex justify-center md:justify-start pl-0 md:pl-12">
              <div className="w-[370px] h-[640px] flex items-center justify-center transform hover:scale-[1.02] transition-transform duration-300 select-none">
                {/* Custom iPhone Bezel CSS Wrapper */}
                <div className="relative mx-auto border-[#1c1c21] bg-[#0c0c0e] border-[10px] rounded-[3rem] h-[600px] w-[338px] shadow-[0_30px_60px_rgba(0,0,0,0.65)]">
                  {/* Speaker/Notch inside bezel */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-4 bg-[#1c1c21] rounded-b-xl z-20"></div>
                  
                  {/* Internal screenshot clipped with rounded corners */}
                  <div className="w-full h-full rounded-[2.1rem] overflow-hidden bg-black relative z-10">
                    <img 
                      src={
                        activeBenefit === 1 ? '/images/benefit_community.png' :
                        activeBenefit === 2 ? '/images/benefit_discounts.png' :
                        activeBenefit === 3 ? '/images/benefit_specialist.png' :
                        '/images/benefit_appointments.png'
                      } 
                      alt="Benefit Mockup Screen" 
                      className="w-full h-full object-cover transition-opacity duration-300"
                      key={activeBenefit}
                    />
                  </div>
                </div>
              </div>
            </div>

        </div>
      </section>

      {/* Team of Coaches Section (Image 9 High-Fidelity Design) */}
      <section className="py-24 bg-gray-950/70 text-white relative z-10" id="coaches">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Centered Heading */}
          <T.H2 className="text-4xl lg:text-5xl font-black text-center mb-16 leading-tight max-w-2xl mx-auto">
            {isSpanish ? 'Te presentamos a tu equipo de coaches de primer nivel' : 'Meet your world-class coaching team'}
          </T.H2>

          {/* Carousel Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            
            {/* Coach 1: Adrian D'Costa (Highlighted/Active Card in Deep Slate Blue) */}
            <div className="bg-[#141416] rounded-3xl p-8 shadow-xl flex flex-col justify-between border border-gray-800 transition-transform duration-300 hover:scale-[1.02]">
              <div>
                {/* Header Row */}
                <div className="flex items-center gap-4 mb-6">
                  {/* Photo Avatar */}
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80"
                    alt="Adrian D'Costa"
                    className="w-20 h-20 rounded-full object-cover border-2 border-orange-500 shadow-md shrink-0"
                  />
                  <div>
                    <span className="inline-block px-2.5 py-0.5 bg-orange-500/10 text-orange-400 rounded-full text-[9px] font-black uppercase tracking-wider mb-1">
                      {isSpanish ? 'Kinesiólogo' : 'Physical Therapist'}
                    </span>
                    <T.H3 className="text-xl font-extrabold text-white leading-tight">Adrian D'Costa</T.H3>
                    <T.P className="text-gray-400 text-xs mt-0.5">{isSpanish ? 'Fisioterapeuta Deportivo' : 'Sports Physiotherapist'}</T.P>
                    
                    {/* Social Link */}
                    <div className="mt-1.5 flex items-center">
                      <a href="#" className="text-gray-500 hover:text-orange-400 transition-colors">
                        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Paragraph Intro */}
                <T.P className="text-xs text-gray-300 leading-relaxed mb-6 font-medium">
                  {isSpanish 
                    ? 'Adrian es un fisioterapeuta experimentado y fundador de The Running Room, una clínica con sede en Londres dedicada a ayudar a los atletas a recuperarse, mantenerse fuertes y rendir al máximo.'
                    : 'Adrian is an experienced sports therapist and founder of The Running Room, a clinic dedicated to helping athletes recover, stay strong and perform at their personal best.'}
                </T.P>

                {/* Numbered List */}
                <ol className="space-y-3 text-xs text-gray-300 text-left border-t border-gray-800 pt-6">
                  <li><span className="font-extrabold text-orange-400 mr-1.5">1.</span> {isSpanish ? 'Fundador de The Running Room, clínica enfocada en el rendimiento' : 'Founder of The Running Room clinic'}</li>
                  <li><span className="font-extrabold text-orange-400 mr-1.5">2.</span> {isSpanish ? 'Especializado en dolor de cadera/ingle y lesiones de rodilla' : 'Specialized in hip and sports knee injuries'}</li>
                  <li><span className="font-extrabold text-orange-400 mr-1.5">3.</span> {isSpanish ? 'Ha tratado a miles de corredores y atletas de múltiples deportes' : 'Treated thousands of runners and multi-sport athletes'}</li>
                  <li><span className="font-extrabold text-orange-400 mr-1.5">4.</span> {isSpanish ? 'Apasionado del trail running y la salud de la comunidad' : 'Passionate about running and community health'}</li>
                </ol>
              </div>
            </div>

            {/* Coach 2: Fraser Briggs (Secondary Card) */}
            <div className="bg-[#141416] rounded-3xl p-8 shadow-xl flex flex-col justify-between border border-gray-900 transition-transform duration-300 hover:scale-[1.02]">
              <div>
                {/* Header Row */}
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80"
                    alt="Fraser Briggs"
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-800 shadow-md shrink-0"
                  />
                  <div>
                    <span className="inline-block px-2.5 py-0.5 bg-gray-800 text-gray-300 rounded-full text-[9px] font-black uppercase tracking-wider mb-1">
                      {isSpanish ? 'Estiramientos' : 'Stretch & Mobility'}
                    </span>
                    <T.H3 className="text-xl font-extrabold text-white leading-tight">Fraser Briggs</T.H3>
                    <T.P className="text-gray-400 text-xs mt-0.5">{isSpanish ? 'Instructor de Movimiento' : 'Movement Instructor'}</T.P>
                    
                    <div className="mt-1.5 flex items-center">
                      <a href="#" className="text-gray-500 hover:text-orange-400 transition-colors">
                        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Paragraph Intro */}
                <T.P className="text-xs text-gray-300 leading-relaxed mb-6 font-medium">
                  {isSpanish
                    ? 'Fraser es Entrenador de Movimiento con 6 años de experiencia ayudando a los atletas a moverse mejor, sentirse más fuertes y mantenerse sin lesiones. Su estilo combina movilidad y fuerza.'
                    : 'Fraser is a Movement Coach with 6 years of experience helping athletes move better, feel stronger and stay injury free. His calm style blends strength and mobility.'}
                </T.P>

                {/* Numbered List */}
                <ol className="space-y-3 text-xs text-gray-300 text-left border-t border-gray-850 pt-6">
                  <li><span className="font-extrabold text-gray-500 mr-1.5">1.</span> {isSpanish ? 'Dirige sesiones de Estiramiento & Estabilidad postural' : 'Leads stretching & stability sessions'}</li>
                  <li><span className="font-extrabold text-gray-500 mr-1.5">2.</span> {isSpanish ? 'Especializado en salud articular y prevención de lesiones' : 'Specialized in joint health and active prevention'}</li>
                  <li><span className="font-extrabold text-gray-500 mr-1.5">3.</span> {isSpanish ? 'Experto en calistenia, peso corporal y yoga funcional' : 'Expert in calisthenics and functional flow'}</li>
                  <li><span className="font-extrabold text-gray-500 mr-1.5">4.</span> {isSpanish ? 'Ex DJ trotamundos convertido en guía de respiración' : 'World-traveler DJ turned mobility guide'}</li>
                </ol>
              </div>
            </div>

            {/* Coach 3: Christie (Translucent Secondary Card) */}
            <div className="bg-[#141416] rounded-3xl p-8 shadow-xl flex flex-col justify-between border border-gray-900 transition-all duration-300 opacity-60 hover:opacity-100 hover:scale-[1.02] hidden lg:flex">
              <div>
                {/* Header Row */}
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80"
                    alt="Christie"
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-800 shadow-md shrink-0"
                  />
                  <div>
                    <span className="inline-block px-2.5 py-0.5 bg-gray-800 text-gray-300 rounded-full text-[9px] font-black uppercase tracking-wider mb-1">
                      {isSpanish ? 'Pilates' : 'Pilates Coach'}
                    </span>
                    <T.H3 className="text-xl font-extrabold text-white leading-tight">Christie</T.H3>
                    <T.P className="text-gray-400 text-xs mt-0.5">{isSpanish ? 'Instructora de Postura' : 'Core & Posture Instructor'}</T.P>
                    
                    <div className="mt-1.5 flex items-center">
                      <a href="#" className="text-gray-500 hover:text-orange-400 transition-colors">
                        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Paragraph Intro */}
                <T.P className="text-xs text-gray-300 leading-relaxed mb-6 font-medium">
                  {isSpanish
                    ? 'Christie es instructora de Pilates clásico con 8 años de experiencia. Trabaja con atletas de fondo para optimizar la estabilidad de la postura y la eficiencia respiratoria.'
                    : 'Christie is a classical Pilates instructor with 8 years of experience. She works with endurance athletes to optimize core stability and breathing efficiency.'}
                </T.P>

                {/* Numbered List */}
                <ol className="space-y-3 text-xs text-gray-300 text-left border-t border-gray-850 pt-6">
                  <li><span className="font-extrabold text-gray-500 mr-1.5">1.</span> {isSpanish ? 'Certificada en Pilates y reeducación corporal' : 'Certified in Pilates and posture alignment'}</li>
                  <li><span className="font-extrabold text-gray-500 mr-1.5">2.</span> {isSpanish ? 'Ha entrenado a atletas olímpicos y fondistas de élite' : 'Trained Olympic and elite endurance athletes'}</li>
                  <li><span className="font-extrabold text-gray-500 mr-1.5">3.</span> {isSpanish ? 'Especialista en movilidad lumbar y pélvica' : 'Endurance posture and pelvis specialist'}</li>
                  <li><span className="font-extrabold text-gray-500 mr-1.5">4.</span> {isSpanish ? 'Apasionada del ciclismo, el senderismo y el Pilates' : 'Loves cycling, trail hiking, and active stretching'}</li>
                </ol>
              </div>
            </div>

          </div>

          {/* Carousel Controls Bottom (Image 2 style) */}
          <div className="flex flex-row justify-between items-center max-w-6xl mx-auto px-4 mt-8">
            {/* Dots Indicator (Left-aligned under Coach 1) */}
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-md"></span>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((dot) => (
                <span key={dot} className="w-1.5 h-1.5 rounded-full bg-gray-700"></span>
              ))}
            </div>

            {/* Carousel Arrows (Right-aligned under Coach 2) */}
            <div className="flex items-center space-x-3">
              <button className="w-10 h-10 rounded-full border border-gray-800 bg-gray-900/60 hover:bg-gray-800 text-gray-400 hover:text-white flex items-center justify-center transition-all">
                <IconChevronLeft size={20} />
              </button>
              <button className="w-10 h-10 rounded-full border border-gray-800 bg-gray-900/60 hover:bg-gray-800 text-gray-400 hover:text-white flex items-center justify-center transition-all">
                <IconChevronRight size={20} />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* FAQs Section (Image 2 Minimalist Accordion Layout & Dark Background) */}
      <section className="py-24 bg-gray-950/70 text-white relative z-10" id="soporte">
        <div className="container mx-auto px-6 max-w-5xl flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Left Heading */}
          <div className="lg:w-2/5 text-left">
            <T.H2 className="text-2xl md:text-3xl font-black text-white leading-tight tracking-tight">
              {isSpanish 
                ? 'PREGUNTAS FRECUENTES: todo lo que debes saber sobre Fitnflai' 
                : 'FREQUENTLY ASKED QUESTIONS: everything you need to know about Fitnflai'}
            </T.H2>
          </div>

          {/* Right Accordion List (Image 2 flat row layout) */}
          <div className="lg:w-3/5 w-full">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index} className="border-b border-gray-800/80 transition-all duration-300">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full py-5 flex justify-between items-center text-left hover:text-orange-400 transition-colors duration-300 gap-4"
                  >
                    <span className="text-lg font-bold text-white leading-snug">{faq.q}</span>
                    <IconChevronDown 
                      size={20} 
                      className={`text-orange-500 flex-shrink-0 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                    />
                  </button>
                  <div className={`transition-all duration-300 ${isOpen ? 'max-h-60 pb-6 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                    <T.P className="text-gray-400 text-sm leading-relaxed">{faq.a}</T.P>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
