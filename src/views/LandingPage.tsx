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

// High-fidelity responsive SVG Radar Chart component for evaluation progress (Image 1)
function RadarChart({ isSpanish }: { isSpanish: boolean }) {
  const center = 150;
  const maxRadius = 100;
  const numAxes = 6;
  
  const axes = [
    { labelEs: 'Fuerza', labelEn: 'Strength' },
    { labelEs: 'Resistencia', labelEn: 'Endurance' },
    { labelEs: 'Cardio', labelEn: 'Cardio' },
    { labelEs: 'Equilibrio', labelEn: 'Balance' },
    { labelEs: 'Movilidad', labelEn: 'Mobility' },
    { labelEs: 'Core', labelEn: 'Core' }
  ];

  const getCoordinates = (index: number, value: number) => {
    const angle = (index * 2 * Math.PI) / numAxes - Math.PI / 2;
    const radius = (value / 100) * maxRadius;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return { x, y };
  };

  const week1Values = [40, 50, 45, 35, 55, 30];
  const week6Values = [85, 90, 80, 75, 85, 80];

  const getPointsString = (values: number[]) => {
    return values
      .map((val, idx) => {
        const { x, y } = getCoordinates(idx, val);
        return `${x},${y}`;
      })
      .join(' ');
  };

  const week1Points = getPointsString(week1Values);
  const week6Points = getPointsString(week6Values);
  const gridLevels = [25, 50, 75, 100];

  return (
    <div className="relative w-full max-w-[280px] mx-auto select-none">
      <svg viewBox="0 0 300 300" className="w-full h-auto overflow-visible">
        {/* Background Grids: Concentric Hexagons */}
        {gridLevels.map((level) => {
          const points = getPointsString(Array(numAxes).fill(level));
          return (
            <polygon
              key={level}
              points={points}
              fill="none"
              stroke="#2d3748"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          );
        })}

        {/* Axis Lines */}
        {axes.map((_, idx) => {
          const { x, y } = getCoordinates(idx, 100);
          return (
            <line
              key={idx}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="#2d3748"
              strokeWidth="1"
            />
          );
        })}

        {/* Semana 6 (Orange Progress) Polygon */}
        <polygon
          points={week6Points}
          fill="rgba(234, 88, 12, 0.25)"
          stroke="#ea580c"
          strokeWidth="2.5"
          className="transition-all duration-500 ease-in-out hover:fill-opacity-40"
        />
        {/* Semana 6 vertices dots */}
        {week6Values.map((val, idx) => {
          const { x, y } = getCoordinates(idx, val);
          return (
            <circle
              key={`w6-${idx}`}
              cx={x}
              cy={y}
              r="4"
              fill="#ea580c"
              className="transition-all duration-300 hover:scale-150"
            />
          );
        })}

        {/* Semana 1 (Red Initial) Polygon */}
        <polygon
          points={week1Points}
          fill="rgba(239, 68, 68, 0.25)"
          stroke="#ef4444"
          strokeWidth="2"
          className="transition-all duration-500 ease-in-out hover:fill-opacity-40"
        />
        {/* Semana 1 vertices dots */}
        {week1Values.map((val, idx) => {
          const { x, y } = getCoordinates(idx, val);
          return (
            <circle
              key={`w1-${idx}`}
              cx={x}
              cy={y}
              r="3.5"
              fill="#ef4444"
              className="transition-all duration-300 hover:scale-150"
            />
          );
        })}

        {/* Axis Labels */}
        {axes.map((axis, idx) => {
          const { x, y } = getCoordinates(idx, 120);
          const label = isSpanish ? axis.labelEs : axis.labelEn;
          
          let textAnchor: 'start' | 'middle' | 'end' = 'middle';
          if (x < center - 10) textAnchor = 'end';
          if (x > center + 10) textAnchor = 'start';

          let dy = '0.35em';
          if (y < center - 40) dy = '-0.2em';
          if (y > center + 40) dy = '1em';

          return (
            <text
              key={idx}
              x={x}
              y={y}
              textAnchor={textAnchor}
              dy={dy}
              fill="#a0aec0"
              fontSize="12"
              fontWeight="bold"
              className="transition-colors duration-300 hover:fill-white font-sans"
            >
              {label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

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
  const scienceSliderRef = useRef<HTMLDivElement>(null)
  const scrollScience = (direction: 'left' | 'right') => {
    if (scienceSliderRef.current) {
      const { scrollLeft } = scienceSliderRef.current
      const offset = direction === 'left' ? -320 : 320
      scienceSliderRef.current.scrollTo({ left: scrollLeft + offset, behavior: 'smooth' })
    }
  }

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

  // Autoplay benefits carousel (5 seconds interval, restarts on activeBenefit change)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBenefit((prev) => (prev === 4 ? 1 : (prev + 1) as 1 | 2 | 3 | 4))
    }, 5000)
    return () => clearInterval(timer)
  }, [activeBenefit])

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
        className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.12] bg-cover bg-center z-0"
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
          <T.H1 className="text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight text-white mb-4 max-w-4xl mx-auto">
            {isSpanish ? (
              <>
                El entrenamiento <span className="text-orange-500 block sm:inline">que te entiende</span>
              </>
            ) : (
              <>
                Training <span className="text-orange-500 block sm:inline">that understands you</span>
              </>
            )}
          </T.H1>
          <div className="text-lg lg:text-2xl font-extrabold text-orange-500 mb-6 tracking-tight max-w-3xl mx-auto">
            {isSpanish ? 'Wellness completo, a tu ritmo.' : 'Complete wellness, at your own pace.'}
          </div>
          <T.P className="text-sm lg:text-lg text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed font-medium">
            {isSpanish 
              ? 'No te manda ejercicios: te entiende. Primero conoce tu cuerpo, tu altitud, tu tiempo y tu energía — y recién ahí construye un plan con ciencia deportiva real que se adapta a tu vida, no al revés.' 
              : "It doesn't just assign exercises: it understands you. First it knows your body, your altitude, your time, and your energy — and only then does it build a plan backed by real sports science that adapts to your life, not the other way around."}
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

      {/* El Problema Section */}
      <section className="py-24 bg-gray-950/70 text-white relative z-10 border-t border-gray-900" id="problema">
        <div className="container mx-auto px-6 max-w-5xl text-center">
          <span className="text-orange-500 text-xs font-black uppercase tracking-widest block mb-3">
            {isSpanish ? 'EL PROBLEMA' : 'THE PROBLEM'}
          </span>
          <T.H2 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-6 max-w-3xl mx-auto leading-tight">
            {isSpanish ? 'Las apps genéricas no te conocen' : "Generic apps don't know you"}
          </T.H2>
          <T.P className="text-lg text-gray-400 max-w-3xl mx-auto mb-16 leading-relaxed">
            {isSpanish 
              ? 'La gente no abandona por falta de disciplina. Abandona porque las soluciones importadas no se adaptan a su realidad. Esto es lo que hacen mal — y lo que Fitnflai hace distinto.' 
              : "People don't quit because of a lack of discipline. They quit because imported solutions don't adapt to their reality. This is what they get wrong — and what Fitnflai does differently."}
          </T.P>

          {/* Stacked Cards */}
          <div className="flex flex-col gap-4 max-w-4xl mx-auto">
            {[
              {
                num: '01',
                titleEs: 'No te conocen',
                titleEn: "They don't know you",
                descEs: 'Te dan un plan sin saber cómo está tu cuerpo hoy. Nosotros te evaluamos primero.',
                descEn: 'They give you a plan without knowing how your body is today. We evaluate you first.'
              },
              {
                num: '02',
                titleEs: 'Ignoran tu realidad',
                titleEn: 'They ignore your reality',
                descEs: 'Que vives a 2.850m, que hoy tienes 20 minutos, que tu energía cambia con tu ciclo. Fitnflai lo sabe.',
                descEn: 'That you live at 2,850m, that today you only have 20 minutes, that your energy changes with your cycle. Fitnflai knows it.'
              },
              {
                num: '03',
                titleEs: 'Te abandonan',
                titleEn: 'They abandon you',
                descEs: 'Te dan un plan y desaparecen. Fitnflai te acompaña y ajusta semana a semana.',
                descEn: 'They give you a plan and disappear. Fitnflai accompanies you and adjusts week by week.'
              },
              {
                num: '04',
                titleEs: 'No te explican nada',
                titleEn: "They don't explain anything",
                descEs: 'Ejercicios sin porqué. Aquí, si no se puede explicar, no se manda.',
                descEn: 'Exercises with no "why". Here, if it cannot be explained, it is not prescribed.'
              },
              {
                num: '05',
                titleEs: 'Te generan culpa',
                titleEn: 'They make you feel guilty',
                descEs: 'Si faltas, te castigan. Fitnflai nunca te juzga: el plan simplemente se ajusta.',
                descEn: 'If you miss a workout, they punish you. Fitnflai never judges you: the plan simply adjusts.'
              }
            ].map((item, idx) => (
              <div 
                key={idx}
                className="bg-gradient-to-r from-[#141416]/80 to-orange-950/15 border border-orange-500/10 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 text-left hover:border-orange-500/30 transition-all duration-300 hover:scale-[1.015] shadow-lg hover:shadow-orange-950/10"
              >
                <div className="sm:w-1/3 shrink-0">
                  <h3 className="text-orange-500 font-extrabold text-base flex items-center gap-2 uppercase tracking-wide">
                    <span className="text-orange-500/60 font-mono text-sm">{item.num}</span>
                    <span>•</span>
                    <span>{isSpanish ? item.titleEs : item.titleEn}</span>
                  </h3>
                </div>
                <div className="text-gray-300 text-sm leading-relaxed sm:border-l sm:border-gray-800/80 sm:pl-8 flex-grow">
                  {isSpanish ? item.descEs : item.descEn}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Primero te conocemos Section */}
      <section className="py-24 bg-gray-950/70 text-white relative z-10 border-t border-gray-900" id="evaluacion">
        <div className="container mx-auto px-6 max-w-5xl flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          
          {/* Left Side: Content */}
          <div className="w-full lg:w-1/2 text-left">
            <span className="text-orange-500 text-xs font-black uppercase tracking-widest block mb-3">
              {isSpanish ? 'PRIMERO TE CONOCEMOS' : 'FIRST WE KNOW YOU'}
            </span>
            <T.H2 className="text-4xl font-extrabold text-white tracking-tight mb-6 leading-tight">
              {isSpanish 
                ? 'Tu objetivo importa. Pero primero entendemos desde dónde partes.' 
                : 'Your goal matters. But first we understand where you start from.'}
            </T.H2>
            <T.P className="text-gray-300 text-base leading-relaxed mb-8">
              {isSpanish 
                ? 'Antes de darte un solo ejercicio, Fitnflai te evalúa con 6 pruebas funcionales que haces en casa, sin equipo. Con ellas construimos tu radar de 6 dimensiones: un mapa real de tu cuerpo hoy.' 
                : 'Before giving you a single exercise, Fitnflai evaluates you with 6 functional tests that you can do at home, with no equipment. With them, we build your 6-dimensional radar: a real map of your body today.'}
            </T.P>

            {/* Checkpoints List */}
            <ul className="space-y-4">
              {[
                {
                  es: '6 tests funcionales: sentadillas, Cooper, flexiones, plancha, flexibilidad y equilibrio',
                  en: '6 functional tests: squats, Cooper, push-ups, plank, flexibility, and balance'
                },
                {
                  es: 'Composición corporal con medidas simples, sin laboratorio',
                  en: 'Body composition with simple measurements, no lab required'
                },
                {
                  es: 'La IA asigna tu nivel real (0 a 3) y detecta debilidades y molestias',
                  en: 'AI assigns your real level (0 to 3) and detects weaknesses and discomforts'
                },
                {
                  es: '"Nunca una app me había mostrado esto."',
                  en: '"Never before has an app shown me this."',
                  isQuote: true
                }
              ].map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-emerald-400 font-extrabold text-base flex-shrink-0 mt-0.5">✓</span>
                  <p className={`text-sm leading-relaxed ${bullet.isQuote ? 'italic text-gray-400' : 'text-gray-300'}`}>
                    {isSpanish ? bullet.es : bullet.en}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Side: Radar Chart */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="w-full max-w-[380px] bg-[#141416]/60 border border-gray-800/80 rounded-3xl p-8 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden">
              {/* Radar Chart SVG helper */}
              <RadarChart isSpanish={isSpanish} />

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 mt-6 border-t border-gray-800/60 pt-4 w-full">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] shadow-md"></span>
                  <span className="text-xs font-bold text-gray-400">
                    {isSpanish ? 'Semana 1' : 'Week 1'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ea580c] shadow-md"></span>
                  <span className="text-xs font-bold text-gray-400">
                    {isSpanish ? 'Semana 6' : 'Week 6'}
                  </span>
                </div>
              </div>

              {/* Subtext */}
              <span className="text-xs font-black uppercase tracking-wider text-gray-500 mt-4 block text-center">
                {isSpanish ? 'Tu progreso, visual e innegable.' : 'Your progress, visual and undeniable.'}
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* La Ciencia Detrás Section */}
      <section className="py-24 bg-gray-950/70 text-white relative z-10 border-t border-gray-900" id="ciencia">
        <div className="container mx-auto px-6 max-w-5xl text-center relative">
          <span className="text-orange-500 text-xs font-black uppercase tracking-widest block mb-3">
            {isSpanish ? 'LA CIENCIA DETRÁS' : 'THE SCIENCE BEHIND IT'}
          </span>
          <T.H2 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-6 max-w-3xl mx-auto leading-tight">
            {isSpanish ? 'No es una app más. Es ciencia aplicada.' : 'Not just another app. Applied science.'}
          </T.H2>
          <T.P className="text-lg text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            {isSpanish 
              ? 'Cada plan sigue un protocolo clínico de entrenamiento validado con criterios de medicina deportiva. La ciencia está detrás — lo que tú sientes son resultados.' 
              : 'Each plan follows a clinical training protocol validated with sports medicine criteria. Science is at the core — what you experience are real results.'}
          </T.P>

          {/* Carousel Wrapper */}
          <div className="relative group max-w-5xl mx-auto mb-16">
            {/* Left Button */}
            <button 
              onClick={() => scrollScience('left')}
              className="absolute left-[-20px] top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/85 border border-gray-800 flex items-center justify-center text-white hover:text-orange-500 hover:border-orange-500 hover:bg-black transition-all cursor-pointer z-20 shadow-2xl opacity-0 group-hover:opacity-100 hidden sm:flex"
              aria-label="Anterior"
            >
              <IconChevronLeft size={20} />
            </button>

            {/* Right Button */}
            <button 
              onClick={() => scrollScience('right')}
              className="absolute right-[-20px] top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/85 border border-gray-800 flex items-center justify-center text-white hover:text-orange-500 hover:border-orange-500 hover:bg-black transition-all cursor-pointer z-20 shadow-2xl opacity-0 group-hover:opacity-100 hidden sm:flex"
              aria-label="Siguiente"
            >
              <IconChevronRight size={20} />
            </button>

            {/* Horizontal Slider (Scroll Snap Container) */}
            <div 
              ref={scienceSliderRef}
              className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory px-4 py-4 select-none"
            >
              {[
                {
                  metric: '10%',
                  titleEs: 'Regla de progresión',
                  titleEn: 'Progression rule',
                  descEs: 'Ninguna carga sube más del 10% por semana. El estándar clínico más validado para prevenir lesiones.',
                  descEn: 'No training volume increases by more than 10% per week. The most validated clinical standard for injury prevention.'
                },
                {
                  metric: '9',
                  titleEs: 'Modalidades',
                  titleEn: 'Disciplines',
                  descEs: 'Running, ciclismo, triatlón, fuerza, HIIT, movilidad, cardio, senderismo y MTB — cada una con su lógica.',
                  descEn: 'Running, cycling, triathlon, strength, HIIT, mobility, cardio, hiking, and MTB — each with its own logic.'
                },
                {
                  metric: '6',
                  titleEs: 'Tests de evaluación',
                  titleEn: 'Evaluation tests',
                  descEs: 'Tu nivel real sale de pruebas funcionales, no de lo que crees que puedes hacer.',
                  descEn: 'Your real fitness level is determined by functional testing, not by what you guess you can do.'
                },
                {
                  metric: '70%',
                  titleEs: 'El sueño cuenta',
                  titleEn: 'Sleep matters',
                  descEs: 'Con menos de 6h, el riesgo de lesión sube 70%. Por eso el sueño ajusta tu sesión antes de empezar.',
                  descEn: 'With less than 6h of sleep, injury risk increases by 70%. That\'s why sleep duration adjusts your workout before starting.'
                },
                {
                  metric: '5',
                  titleEs: 'Fases de retorno',
                  titleEn: 'Return phases',
                  descEs: 'Si te lesionas, un protocolo de retorno seguro por fases evita la recaída — la mayoría ocurre en las 2 primeras semanas.',
                  descEn: 'If you get injured, a safe multi-phase return protocol prevents relapse — most of which occur in the first 2 weeks.'
                },
                {
                  metric: '✓',
                  titleEs: 'Tapering y descarga',
                  titleEn: 'Tapering and deload',
                  descEs: 'Periodización con semanas de descarga y afinamiento incluidas — no un PDF que solo sube la carga.',
                  descEn: 'Periodization with taper and deload weeks built-in — not a static PDF that only dials up volume.'
                }
              ].map((card, idx) => (
                <div 
                  key={idx}
                  className="w-[280px] h-[280px] shrink-0 bg-gradient-to-br from-[#141416]/80 to-orange-950/15 border border-orange-500/10 rounded-3xl p-8 flex flex-col justify-start text-left snap-start hover:border-orange-500/30 transition-all duration-300 hover:scale-[1.02] shadow-xl"
                >
                  <span className="text-4xl font-extrabold text-orange-500 mb-4 block font-mono">
                    {card.metric}
                  </span>
                  <h4 className="text-white font-extrabold text-lg mb-3 leading-snug">
                    {isSpanish ? card.titleEs : card.titleEn}
                  </h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {isSpanish ? card.descEs : card.descEn}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Wide Endorsement Banner (Dr. Mario Ochoa) */}
          <div className="bg-[#141416]/60 text-white rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8 text-left border border-gray-800/60 shadow-xl">
            <div className="flex items-center gap-6">
              {/* Circular Avatar */}
              <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center font-black text-xl text-black shrink-0 shadow-md">
                MO
              </div>
              <div className="flex-grow">
                <span className="text-[10px] uppercase font-black tracking-widest text-orange-500 block mb-1">
                  {isSpanish ? 'AVAL DE MEDICINA DEPORTIVA' : 'SPORTS MEDICINE ENDORSEMENT'}
                </span>
                <T.H3 className="text-xl font-extrabold text-white leading-tight mb-2">
                  Dr. Mario Ochoa
                </T.H3>
                <T.P className="text-gray-400 text-xs leading-relaxed max-w-2xl">
                  {isSpanish 
                    ? 'El protocolo clínico de Fitnflai está construido y validado con criterios de medicina deportiva. En el plan Signature, el especialista revisa tu plan cada mes.' 
                    : 'The Fitnflai clinical protocol is built and validated with sports medicine criteria. In the Signature plan, the specialist reviews your plan every month.'}
                </T.P>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Altitud Inteligente Section */}
      <section className="py-24 bg-gray-950/70 text-white relative z-10 border-t border-gray-900" id="altitud">
        <div className="container mx-auto px-6 max-w-5xl text-center">
          <span className="text-orange-500 text-xs font-black uppercase tracking-widest block mb-3">
            {isSpanish ? 'ALTITUD INTELIGENTE' : 'SMART ALTITUDE'}
          </span>
          <T.H2 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-6 max-w-3xl mx-auto leading-tight">
            {isSpanish ? 'Donde el aire pesa diferente' : 'Where the air feels different'}
          </T.H2>
          <T.P className="text-lg text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            {isSpanish 
              ? 'Entrenar en Quito no es lo mismo que en la costa. El oxígeno, tu ritmo cardíaco y tu recuperación cambian con la altura. Fitnflai detecta tu ciudad automáticamente y ajusta las semanas de tu plan y tus zonas cardíacas. Ninguna app importada hace esto.' 
              : 'Training in Quito is not the same as training on the coast. Oxygen levels, heart rate, and recovery change with elevation. Fitnflai automatically detects your altitude and adjusts both your weekly plan and heart rate zones. No generic imported app does this.'}
          </T.P>

          {/* Altitude Pills */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 justify-center">
            {[
              { alt: '3.640m', cityEs: 'La Paz', cityEn: 'La Paz' },
              { alt: '2.850m', cityEs: 'Quito', cityEn: 'Quito' },
              { alt: '2.640m', cityEs: 'Bogotá', cityEn: 'Bogotá' },
              { alt: '2.240m', cityEs: 'CDMX', cityEn: 'Mexico City' },
              { alt: '1.500m', cityEs: 'Medellín', cityEn: 'Medellín' },
              { alt: '~0m', cityEs: 'Guayaquil', cityEn: 'Guayaquil' }
            ].map((pill, idx) => (
              <div 
                key={idx}
                className="bg-gradient-to-b from-[#141416]/80 to-orange-950/15 border border-orange-500/10 rounded-2xl p-5 hover:border-orange-500/30 transition-all duration-300 hover:scale-[1.03] shadow-lg hover:shadow-orange-950/10"
              >
                <span className="text-lg sm:text-xl font-extrabold text-orange-500 block mb-1 font-mono">
                  {pill.alt}
                </span>
                <span className="text-gray-400 text-sm font-bold block uppercase tracking-wider">
                  {isSpanish ? pill.cityEs : pill.cityEn}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modo Vida Real Section */}
      <section className="py-24 bg-gray-950/70 text-white relative z-10 border-t border-gray-900" id="vida-real">
        <div className="container mx-auto px-6 max-w-5xl flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          
          {/* Left Side: Mock Phone Card */}
          <div className="w-full lg:w-1/2 flex justify-center order-2 lg:order-1">
            <div className="w-full max-w-[380px] bg-gradient-to-br from-[#141416]/80 to-indigo-950/20 border border-indigo-500/10 rounded-3xl p-8 flex flex-col text-left shadow-2xl relative overflow-hidden hover:border-indigo-500/30 transition-all duration-300 hover:shadow-indigo-950/10">
              <span className="text-xs font-black text-orange-500 tracking-widest mb-1.5 block uppercase">
                {isSpanish ? 'HOY' : 'TODAY'}
              </span>
              <h4 className="text-white font-extrabold text-lg mb-6 leading-tight">
                {isSpanish ? 'Tengo 20 min y estoy cansado' : 'I have 20 min and I am tired'}
              </h4>
              <div className="bg-gradient-to-r from-black/50 to-emerald-950/15 border border-emerald-500/20 rounded-2xl p-5 shadow-inner">
                <span className="text-xs font-black text-emerald-400 tracking-widest block mb-2 uppercase">
                  ✓ {isSpanish ? 'PLAN AJUSTADO' : 'PLAN ADJUSTED'}
                </span>
                <h5 className="text-white font-extrabold text-base mb-2 leading-tight">
                  {isSpanish ? 'Movilidad + core • 20 min' : 'Mobility + core • 20 min'}
                </h5>
                <p className="text-gray-400 text-sm leading-relaxed font-medium">
                  {isSpanish 
                    ? 'Hoy tu cuerpo necesita esto, no alta intensidad. Mañana retomamos fuerza. Sin sobreexigirte, sin culpa.' 
                    : 'Today your body needs this, not high intensity. Tomorrow we regain strength. No overexertion, no guilt.'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: Content */}
          <div className="w-full lg:w-1/2 text-left order-1 lg:order-2">
            <span className="text-orange-500 text-xs font-black uppercase tracking-widest block mb-3">
              {isSpanish ? 'MODO VIDA REAL' : 'REAL LIFE MODE'}
            </span>
            <T.H2 className="text-4xl font-extrabold text-white tracking-tight mb-6 leading-tight">
              {isSpanish 
                ? 'Tu plan se adapta a tu día — no al revés' 
                : 'Your plan adapts to your day — not the other way around'}
            </T.H2>
            <T.P className="text-gray-300 text-base leading-relaxed mb-8">
              {isSpanish 
                ? 'Trabajo, familia, cansancio, mala noche de sueño. Tu plan debería saber todo eso. El Modo Vida Real reajusta cada sesión según tu tiempo, tu energía, tu sueño y tu estrés. Es lo que hace que el plan se sientan tuyo.' 
                : 'Work, family, fatigue, poor sleep. Your plan should know all of that. Real Life Mode readjusts each session based on your time, energy, sleep, and stress. That\'s what makes the plan truly yours.'}
            </T.P>

            {/* Bullet Points List */}
            <ul className="space-y-4">
              {[
                {
                  es: 'Menos tiempo hoy → sesión más corta y efectiva',
                  en: 'Less time today → shorter, highly effective session'
                },
                {
                  es: 'Dormiste mal → menor carga automáticamente (con <6h el riesgo de lesión sube 70%)',
                  en: 'Poor sleep → automatic load reduction (with <6h of sleep, injury risk spikes 70%)'
                },
                {
                  es: 'Faltaste unos días → protocolo de retorno seguro, sin empezar de cero',
                  en: 'Missed a few days → safe return protocol, no starting over from scratch'
                }
              ].map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-emerald-400 font-extrabold text-base flex-shrink-0 mt-0.5">✓</span>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {isSpanish ? bullet.es : bullet.en}
                  </p>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      {/* El Semáforo de Seguridad Section */}
      <section className="py-24 bg-gray-950/70 text-white relative z-10 border-t border-gray-900" id="semaforo">
        <div className="container mx-auto px-6 max-w-5xl text-center">
          <span className="text-orange-500 text-xs font-black uppercase tracking-widest block mb-3">
            {isSpanish ? 'TU SALUD PRIMERO' : 'YOUR HEALTH FIRST'}
          </span>
          <T.H2 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-6 max-w-3xl mx-auto leading-tight">
            {isSpanish ? 'El semáforo de seguridad' : 'The safety traffic light'}
          </T.H2>
          <T.P className="text-lg text-gray-400 max-w-3xl mx-auto mb-16 leading-relaxed">
            {isSpanish 
              ? 'Tu salud es más importante que tu objetivo. Fitnflai monitorea señales en tiempo real y te indica siempre si estás en zona segura — y frena el plan si hace falta.' 
              : 'Your health is more important than your goal. Fitnflai monitors real-time biological signals and tells you if you are in the safe zone — pausing or dialing down the plan if necessary.'}
          </T.P>

          {/* Traffic Light Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-center">
            {[
              {
                colorDot: 'bg-[#10b981]',
                bgGradient: 'bg-gradient-to-br from-[#141416]/80 to-emerald-950/20 border-emerald-500/10 hover:border-emerald-500/30 hover:shadow-emerald-950/10',
                titleEs: 'Verde',
                titleEn: 'Green',
                descEs: 'Estás respondiendo bien. El plan puede progresar — nunca más del 10% por semana.',
                descEn: 'You are responding well. The plan can progress — never more than 10% per week.'
              },
              {
                colorDot: 'bg-[#f59e0b]',
                bgGradient: 'bg-gradient-to-br from-[#141416]/80 to-amber-950/20 border-amber-500/10 hover:border-amber-500/30 hover:shadow-amber-950/10',
                titleEs: 'Amarillo',
                titleEn: 'Yellow',
                descEs: 'Dolor muscular, sueño bajo o 3 días duros seguidos: el plan baja la carga automáticamente.',
                descEn: 'Muscle soreness, poor sleep, or 3 consecutive hard days: the plan automatically reduces the load.'
              },
              {
                colorDot: 'bg-[#ef4444]',
                bgGradient: 'bg-gradient-to-br from-[#141416]/80 to-red-950/20 border-red-500/10 hover:border-red-500/30 hover:shadow-red-950/10',
                titleEs: 'Rojo',
                titleEn: 'Red',
                descEs: 'Dolor articular o señales de alarma: se pausa la sesión y se protege tu cuerpo.',
                descEn: 'Joint pain or alarm signals: the session is paused to protect your body.'
              }
            ].map((card, idx) => (
              <div 
                key={idx}
                className={`${card.bgGradient} border rounded-2xl p-6 text-left transition-all duration-300 hover:scale-[1.03] shadow-lg`}
              >
                <h3 className="text-white font-extrabold text-base mb-3 flex items-center gap-2 uppercase tracking-wide">
                  <span className={`w-2.5 h-2.5 rounded-full ${card.colorDot} shadow-sm`}></span>
                  <span>{isSpanish ? card.titleEs : card.titleEn}</span>
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {isSpanish ? card.descEs : card.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Adaptación por Ciclo Menstrual Section */}
      <section className="py-24 bg-gray-950/70 text-white relative z-10 border-t border-gray-900" id="ciclo">
        <div className="container mx-auto px-6 max-w-5xl flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          
          {/* Left Side: Content */}
          <div className="w-full lg:w-1/2 text-left">
            <span className="text-orange-500 text-xs font-black uppercase tracking-widest block mb-3">
              {isSpanish ? 'ADAPTACIÓN POR CICLO MENSTRUAL' : 'MENSTRUAL CYCLE ADAPTATION'}
            </span>
            <T.H2 className="text-4xl font-extrabold text-white tracking-tight mb-6 leading-tight">
              {isSpanish 
                ? 'Tu plan sabe en qué fase estás' 
                : 'Your plan knows your active phase'}
            </T.H2>
            <T.P className="text-gray-300 text-base leading-relaxed mb-8">
              {isSpanish 
                ? 'Tu energía cambia con tu ciclo, y tu plan debería saberlo. Desde el plan Essential, Fitnflai adapta la carga a tu fase hormonal — priorizando movilidad y trabajo ligero cuando tu cuerpo lo necesita. Un diferenciador que las apps genéricas ignoran por completo.' 
                : 'Your energy levels change with your cycle, and your training plan should know it. Starting with our Essential plan, Fitnflai adapts your training load to your hormonal phase — prioritizing mobility and lighter workouts when your body needs them. A differentiator that generic apps completely ignore.'}
            </T.P>
          </div>

          {/* Right Side: Mock Card */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="w-full max-w-[380px] bg-gradient-to-br from-[#141416]/80 to-pink-950/20 border border-pink-500/10 rounded-3xl p-8 flex flex-col text-left shadow-2xl relative overflow-hidden hover:border-pink-500/30 transition-all duration-300 hover:shadow-pink-950/10">
              <span className="text-xs font-black text-orange-500 tracking-widest mb-1.5 block uppercase">
                {isSpanish ? 'FASE LÚTEA' : 'LUTEAR PHASE'}
              </span>
              <h4 className="text-white font-extrabold text-lg mb-3 leading-tight">
                {isSpanish ? 'Hoy priorizamos movilidad' : 'Today we prioritize mobility'}
              </h4>
              <p className="text-gray-400 text-sm leading-relaxed font-medium">
                {isSpanish 
                  ? 'Tu ciclo indica fase lútea. La energía suele bajar. Hoy trabajo ligero y movilidad — escucha a tu cuerpo. Retomamos intensidad cuando toque.' 
                  : 'Your cycle indicates lutear phase. Energy levels are usually lower. Lighter work and mobility today — listen to your body. We will dial back up when the time is right.'}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Cada Ejercicio Explicado Section */}
      <section className="py-24 bg-gray-950/70 text-white relative z-10 border-t border-gray-900" id="ejercicio-explicado">
        <div className="container mx-auto px-6 max-w-5xl flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          
          {/* Left Side: Mock Exercise Card */}
          <div className="w-full lg:w-1/2 flex justify-center order-2 lg:order-1">
            <div className="w-full max-w-[380px] bg-gradient-to-br from-[#141416]/80 to-orange-950/15 border border-orange-500/10 rounded-3xl p-8 flex flex-col text-left shadow-2xl relative overflow-hidden hover:border-orange-500/30 transition-all duration-300 hover:shadow-orange-950/10">
              <h4 className="text-white font-black text-2xl mb-6 leading-tight">
                {isSpanish ? 'Puente de glúteo' : 'Glute bridge'}
              </h4>
              
              <div className="mb-4">
                <span className="text-xs font-black tracking-widest text-orange-500 block mb-1 uppercase">
                  {isSpanish ? 'QUÉ TRABAJA' : 'WHAT IT WORKS'}
                </span>
                <p className="text-gray-300 text-sm leading-relaxed font-medium">
                  {isSpanish 
                    ? 'Glúteo y core, zona que tu evaluación mostró débil.' 
                    : 'Glutes and core, an area your evaluation flagged as weak.'}
                </p>
              </div>

              <div className="mb-4">
                <span className="text-xs font-black tracking-widest text-orange-500 block mb-1 uppercase">
                  {isSpanish ? 'POR QUÉ TE LO MANDAMOS' : 'WHY WE PRESCRIBED IT'}
                </span>
                <p className="text-gray-300 text-sm leading-relaxed font-medium">
                  {isSpanish 
                    ? 'Está conectada con la molestia que sientes al correr.' 
                    : 'It is connected to the discomfort you experience when running.'}
                </p>
              </div>

              <div>
                <span className="text-xs font-black tracking-widest text-orange-500 block mb-1 uppercase">
                  {isSpanish ? 'CÓMO HACERLO' : 'HOW TO DO IT'}
                </span>
                <p className="text-gray-300 text-sm leading-relaxed font-medium">
                  {isSpanish 
                    ? 'Espalda recta, sube controlado. Si sientes dolor, para.' 
                    : 'Straight back, raise under control. If you feel pain, stop.'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: Content */}
          <div className="w-full lg:w-1/2 text-left order-1 lg:order-2">
            <span className="text-orange-500 text-xs font-black uppercase tracking-widest block mb-3">
              {isSpanish ? 'CADA EJERCICIO, EXPLICADO' : 'EVERY EXERCISE EXPLAINED'}
            </span>
            <T.H2 className="text-4xl font-extrabold text-white tracking-tight mb-6 leading-tight">
              {isSpanish ? 'Si no lo entiendes, no te sirve' : "If you don't understand it, it's useless"}
            </T.H2>
            <T.P className="text-gray-300 text-base leading-relaxed mb-8">
              {isSpanish 
                ? 'Nuestra promesa: si un ejercicio no se puede explicar, no debería mandarse. Cada movimiento viene con qué trabaja, por qué te lo mandamos y cómo hacerlo — en lenguaje que cualquiera entiende, sin importar tu nivel. Y si mostramos un indicador, también te decimos qué significa y qué hacer.' 
                : 'Our promise: if an exercise cannot be explained, it shouldn\'t be prescribed. Every single movement details what it works on, why we prescribed it, and how to perform it — in language anyone can understand, regardless of experience. And if we show any metric, we tell you exactly what it means and how to act on it.'}
            </T.P>

            {/* Orange blockquote quote at bottom */}
            <p className="text-lg lg:text-xl font-serif italic text-orange-500 font-extrabold leading-relaxed">
              {isSpanish ? '"Por fin entiendo lo que hago y por qué lo hago."' : '"Finally I understand what I am doing and why I am doing it."'}
            </p>
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
                  <div className="space-y-6 text-left h-full flex flex-col justify-center">
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


                  </div>
                );
              })()}
            </div>

            {/* Right Card: Testimonial & Ratings (Dark Backdrop) */}
            <div className="w-full md:w-[55%] bg-[#141416]/80 rounded-3xl p-8 md:p-10 text-white shadow-2xl relative z-20 border border-gray-800/80 min-h-[420px]">
              {(() => {
                const currentProfile = athleticNutritionProfiles[activeProfileIndex];
                return (
                  <div className="flex flex-col justify-center h-full space-y-6">
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
