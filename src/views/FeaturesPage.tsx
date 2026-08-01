import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
  IconChevronDown, 
  IconMail, 
  IconTrophy, 
  IconLayoutDashboard, 
  IconUser,
  IconSparkles,
  IconCalendar,
  IconActivity,
  IconLock
} from '@tabler/icons-react'

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



export function FeaturesPage() {
  const navigate = useNavigate()
  const { language, setLanguage, setPage, setUserRole } = useAppStore()
  const { t } = useTranslation()

  const [isPlanesDropdownOpen, setIsPlanesDropdownOpen] = useState(false)
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false)

  const isSpanish = language === 'ES'

  const handlePortalEntry = (role: 'admin' | 'specialist') => {
    navigate('/descargar')
  }

  // Active story slide in carousel (Image 1 / Image 2)
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

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans antialiased relative overflow-hidden">
      {/* Background Image Watermark */}
      <div 
        className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.10] bg-cover bg-center z-0"
        style={{ 
          backgroundImage: "url('/images/features-bg.png')",
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
                className="text-gray-300 hover:text-orange-400 transition duration-300 font-semibold flex items-center gap-1"
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
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-orange-400 transition duration-300 font-bold">{t('landing.header.features')}</button>
            <button onClick={() => navigate('/coaches')} className="text-gray-300 hover:text-orange-400 transition duration-300 font-semibold">{t('landing.header.coaches')}</button>
            <button onClick={() => navigate('/#soporte')} className="text-gray-300 hover:text-orange-400 transition duration-300 font-semibold">{t('landing.header.support')}</button>
          </div>

          {/* Language Selector Dropdown */}
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
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="py-20 px-6 relative z-10">
        
        {/* Title Section (Image 1 Descubre nuestras herramientas) */}
        <section className="text-center max-w-3xl mx-auto mb-16">
          <T.H1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 tracking-tight text-white leading-tight">
            {isSpanish ? 'Descubre nuestras' : 'Discover our'}{' '}
            <span className="text-orange-500">{isSpanish ? 'herramientas' : 'features'}</span>
          </T.H1>
          <T.P className="text-sm md:text-base text-gray-400 mb-8 leading-relaxed max-w-xl mx-auto">
            {isSpanish 
              ? 'Libera tu potencial con un plan personalizado. Impulsa tu progreso con un entrenamiento de élite. Forma parte de algo grande. Descubre todo lo que Fitnflai puede ofrecerte.'
              : 'Unlock your potential with a custom training plan. Fuel your progress with elite coaching. Be part of something great. Discover everything Fitnflai has to offer.'}
          </T.P>
          <button
            onClick={() => handlePortalEntry('admin')}
            className="px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-full transition duration-300 text-lg shadow-lg hover:scale-105 mb-4"
          >
            {isSpanish ? 'Comenzar prueba gratuita' : 'Start free trial'}
          </button>
          <T.P className="text-xs text-gray-500 font-bold uppercase mb-2">
            {isSpanish ? 'Primera semana gratis. Cancela cuando quieras.' : 'First week free. Cancel anytime.'}
          </T.P>
          <span className="inline-block text-[10px] text-gray-600 font-black tracking-wider uppercase bg-gray-900 border border-gray-850 px-3 py-1 rounded-full">
            🏆 App Store Awards 2024 Finalist
          </span>
        </section>

        {/* Anchor Navigation strip */}
        <div className="bg-orange-500/5 text-orange-400 py-3.5 text-xs md:text-sm font-extrabold flex flex-wrap justify-center items-center gap-x-6 gap-y-2 border-y border-orange-500/15 max-w-5xl mx-auto mb-20 px-4 rounded-xl">
          <a href="#plan" className="hover:text-white transition">{isSpanish ? 'Planes personalizados' : 'Custom Plans'}</a>
          <span className="text-orange-500/30 hidden sm:inline">•</span>
          <a href="#expert" className="hover:text-white transition">{isSpanish ? 'Entrenamiento de élite' : 'Elite Coaching'}</a>
          <span className="text-orange-500/30 hidden sm:inline">•</span>
          <a href="#simplicity" className="hover:text-white transition">{isSpanish ? 'Sencillo e Intuitivo' : 'Simple & Intuitive'}</a>
          <span className="text-orange-500/30 hidden sm:inline">•</span>
          <a href="#movement" className="hover:text-white transition">{isSpanish ? 'Comunidad' : 'Community'}</a>
          <span className="text-orange-500/30 hidden sm:inline">•</span>
          <a href="#support" className="hover:text-white transition">{isSpanish ? 'Ayuda' : 'Active Support'}</a>
        </div>

        {/* 5 Alternating Feature Rows (Image 1 style) */}
        <div className="space-y-32 max-w-5xl mx-auto mb-32">
          
          {/* Row 1: Tu plan. Tu progreso. */}
          <section className="flex flex-col md:flex-row items-center gap-12 scroll-mt-24" id="plan">
            {/* Left Side: Phone Mockups overlay */}
            <div className="w-full md:w-1/2 relative flex justify-center items-center h-[400px] select-none">
              <div className="absolute w-48 h-[340px] transform -rotate-12 z-10 flex items-center justify-center">
                <img src="/images/mockup_01.png" alt="Mockup 1" className="max-w-full max-h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]" />
              </div>
              <div className="absolute w-52 h-[380px] transform rotate-6 z-20 flex items-center justify-center">
                <img src="/images/mockup_02.png" alt="Mockup 2" className="max-w-full max-h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.4)]" />
              </div>
            </div>
            {/* Right Side: Copy */}
            <div className="w-full md:w-1/2 text-left">
              <T.H2 className="text-xl md:text-2xl lg:text-3xl font-black mb-4 leading-tight tracking-tight">
                {isSpanish ? 'Tu plan.' : 'Your plan.'}{' '}
                <span className="text-orange-500">{isSpanish ? 'Tu progreso.' : 'Your progress.'}</span>
              </T.H2>
              <ol className="space-y-4 text-sm text-gray-300">
                <li><span className="font-extrabold text-orange-400 mr-2">1.</span> {isSpanish ? 'Planes de entrenamiento personalizados para todos los niveles, desde 5k hasta ultra trail.' : 'Personalized plans for all fitness levels from 5k to ultra trail.'}</li>
                <li><span className="font-extrabold text-orange-400 mr-2">2.</span> {isSpanish ? 'Entrena para distancias personalizadas durante el período que más te convenga (6 a 26 semanas).' : 'Train for tailored goals over any period that works for you (6 to 26 weeks).'}</li>
                <li><span className="font-extrabold text-orange-400 mr-2">3.</span> {isSpanish ? 'Tu plan se adapta a tu rendimiento y te proporcionamos las herramientas para el éxito.' : 'Your plan automatically adapts to your performance metrics.'}</li>
                <li><span className="font-extrabold text-orange-400 mr-2">4.</span> {isSpanish ? 'Entrena para carreras o distancias específicas para ponerte en forma y lograr tus metas.' : 'Target specific goal races and safe milestones.'}</li>
              </ol>
              <button onClick={() => handlePortalEntry('admin')} className="mt-8 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs rounded-full uppercase tracking-wider shadow-md">
                {isSpanish ? 'Buscar tu plan' : 'Find your plan'}
              </button>
            </div>
          </section>

          {/* Row 2: Entrenadores de élite. */}
          <section className="flex flex-col md:flex-row-reverse items-center gap-12 scroll-mt-24" id="expert">
            {/* Right Side Mockup */}
            <div className="w-full md:w-1/2 relative flex justify-center items-center h-[400px] select-none">
              <div className="absolute w-56 h-[380px] flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
                <img src="/images/mockup_12.png" alt="Mockup 12" className="max-w-full max-h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.4)]" />
              </div>
            </div>
            {/* Left Side: Copy */}
            <div className="w-full md:w-1/2 text-left">
              <T.H2 className="text-xl md:text-2xl lg:text-3xl font-black mb-4 leading-tight tracking-tight">
                {isSpanish ? 'Entrenadores de élite.' : 'Elite coaches.'}{' '}
                <span className="text-orange-500">{isSpanish ? 'Resultados de élite.' : 'Elite results.'}</span>
              </T.H2>
              <ol className="space-y-4 text-sm text-gray-300">
                <li><span className="font-extrabold text-orange-400 mr-2">1.</span> {isSpanish ? 'Entrena de forma más inteligente con las ideas de entrenadores olímpicos y fisioterapeutas.' : 'Train smarter with insights from Olympic-level coaches and physical therapists.'}</li>
                <li><span className="font-extrabold text-orange-400 mr-2">2.</span> {isSpanish ? 'Sigue un plan basado en métodos probados, con entrenamientos eficaces de fuerza y movilidad.' : 'Follow a plan built on proven sports science, combining strength and mobility.'}</li>
                <li><span className="font-extrabold text-orange-400 mr-2">3.</span> {isSpanish ? 'Evita las lesiones y entrena eficazmente con consejos de expertos sobre ritmo y programación.' : 'Avoid injuries and plateau blocks with expert programming advise.'}</li>
                <li><span className="font-extrabold text-orange-400 mr-2">4.</span> {isSpanish ? 'Desarrolla la fuerza mental y la confianza con un entrenamiento que apoye tu actitud.' : 'Build mental resilience and confidence alongside physical metrics.'}</li>
              </ol>
              <button onClick={() => handlePortalEntry('admin')} className="mt-8 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs rounded-full uppercase tracking-wider shadow-md">
                {isSpanish ? 'Lograr más' : 'Achieve more'}
              </button>
            </div>
          </section>

          {/* Row 3: Simplicidad al alcance de la mano. */}
          <section className="flex flex-col md:flex-row items-center gap-12 scroll-mt-24" id="simplicity">
            {/* Left Side: Mockups */}
            <div className="w-full md:w-1/2 relative flex justify-center items-center h-[400px] select-none">
              <div className="absolute w-48 h-[340px] transform -rotate-12 overflow-hidden flex items-center justify-center">
                <img src="/images/mockup_13.png" alt="Mockup 13" className="max-w-full max-h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]" />
              </div>
              <div className="absolute w-52 h-[380px] transform rotate-6 overflow-hidden flex items-center justify-center">
                <img src="/images/mockup_14.png" alt="Mockup 14" className="max-w-full max-h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.4)]" />
              </div>
            </div>
            {/* Right Side: Copy */}
            <div className="w-full md:w-1/2 text-left">
              <T.H2 className="text-xl md:text-2xl lg:text-3xl font-black mb-4 leading-tight tracking-tight">
                {isSpanish ? 'Simplicidad al alcance' : 'Simplicity at your'}{' '}
                <span className="text-orange-500">{isSpanish ? 'de la mano.' : 'fingertips.'}</span>
              </T.H2>
              <ol className="space-y-4 text-sm text-gray-300">
                <li><span className="font-extrabold text-orange-400 mr-2">1.</span> {isSpanish ? 'Sin configuraciones complicadas. Empieza tu plan personalizado en cuestión de minutos.' : 'No complex setup steps. Launch your custom training calendar in minutes.'}</li>
                <li><span className="font-extrabold text-orange-400 mr-2">2.</span> {isSpanish ? 'Las instrucciones de ejecución claras y sencillas eliminan las conjeturas de cada sesión.' : 'Clear workout execution steps eliminate guesswork from every interval.'}</li>
                <li><span className="font-extrabold text-orange-400 mr-2">3.</span> {isSpanish ? 'Sincronízalo con tu dispositivo favorito para seguir tu progreso (Garmin, Strava, Apple).' : 'Sync automatically with your favorite smartwatches (Garmin, Apple Watch, Strava).'}</li>
                <li><span className="font-extrabold text-orange-400 mr-2">4.</span> {isSpanish ? 'Actualiza tu plan, mueve tu calendario, establece tus preferencias y entrena a tu ritmo.' : 'Update, shift, and reschedule sessions to adapt around your busy calendar.'}</li>
              </ol>
              <button onClick={() => handlePortalEntry('admin')} className="mt-8 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs rounded-full uppercase tracking-wider shadow-md">
                {isSpanish ? 'Comenzar ahora' : 'Start now'}
              </button>
            </div>
          </section>

          {/* Row 4: Esto es un movimiento. */}
          <section className="flex flex-col md:flex-row-reverse items-center gap-12 scroll-mt-24" id="movement">
            {/* Right Side Mockup */}
            <div className="w-full md:w-1/2 relative flex justify-center items-center h-[400px] select-none">
              <div className="absolute w-56 h-[380px] flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
                <img src="/images/mockup_01.png" alt="Mockup 1" className="max-w-full max-h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.4)]" />
              </div>
            </div>
            {/* Left Side: Copy */}
            <div className="w-full md:w-1/2 text-left">
              <T.H2 className="text-xl md:text-2xl lg:text-3xl font-black mb-4 leading-tight tracking-tight">
                {isSpanish ? 'Esto es un movimiento.' : 'This is a movement.'}{' '}
                <span className="text-orange-500">{isSpanish ? 'Sé parte de ello.' : 'Be part of it.'}</span>
              </T.H2>
              <ol className="space-y-4 text-sm text-gray-300">
                <li><span className="font-extrabold text-orange-400 mr-2">1.</span> {isSpanish ? 'Conecta con atletas de tu zona afines a ti o que compartan tus mismos desafíos.' : 'Connect with like-minded local athletes preparing for similar distance milestones.'}</li>
                <li><span className="font-extrabold text-orange-400 mr-2">2.</span> {isSpanish ? 'Aprende de otras personas de la comunidad con valiosos consejos sobre técnica y nutrición.' : 'Learn from other athletes sharing real-world tips on hydration and nutrition.'}</li>
                <li><span className="font-extrabold text-orange-400 mr-2">3.</span> {isSpanish ? 'Obtén el apoyo en los contratiempos e hitos de una comunidad unida de deportistas.' : 'Receive encouragement on heavy mileage weeks and injury recovery milestones.'}</li>
                <li><span className="font-extrabold text-orange-400 mr-2">4.</span> {isSpanish ? 'Únete a una comunidad privada de miles de deportistas de todo el mundo.' : 'Join a private, supportive global community of thousands of athletes.'}</li>
              </ol>
              <button onClick={() => handlePortalEntry('admin')} className="mt-8 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs rounded-full uppercase tracking-wider shadow-md">
                {isSpanish ? 'Unirse a Fitnflai' : 'Join Fitnflai'}
              </button>
            </div>
          </section>

          {/* Row 5: Con apoyo en cada paso. */}
          <section className="flex flex-col md:flex-row items-center gap-12 scroll-mt-24" id="support">
            {/* Left Side: Chat support mockup */}
            <div className="w-full md:w-1/2 relative flex justify-center items-center h-[400px] select-none">
              <div className="absolute w-56 h-[380px] flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
                <img src="/images/mockup_02.png" alt="Mockup 2" className="max-w-full max-h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.4)]" />
              </div>
            </div>
            {/* Right Side: Copy */}
            <div className="w-full md:w-1/2 text-left">
              <T.H2 className="text-xl md:text-2xl lg:text-3xl font-black mb-4 leading-tight tracking-tight">
                {isSpanish ? 'Con apoyo en cada' : 'With support at every'}{' '}
                <span className="text-orange-500">{isSpanish ? 'paso del camino.' : 'step of the way.'}</span>
              </T.H2>
              <ol className="space-y-4 text-sm text-gray-300">
                <li><span className="font-extrabold text-orange-400 mr-2">1.</span> {isSpanish ? '¿Tienes preguntas sobre el entrenamiento? Nuestro equipo responde rápidamente con consejos útiles.' : 'Got training questions? Our clinical support team responds quickly.'}</li>
                <li><span className="font-extrabold text-orange-400 mr-2">2.</span> {isSpanish ? 'Obtén el apoyo experto de deportólogos y coaches clínicos reales que cuidan de ti.' : 'Get expert supervision from certified sports doctors and certified coaches.'}</li>
                <li><span className="font-extrabold text-orange-400 mr-2">3.</span> {isSpanish ? 'Recibe orientación personalizada para ajustar el ritmo, evitar sobrecargas o adaptar lesiones.' : 'Receive custom pacing, recovery adjustments, or specific exercises for running knee pain.'}</li>
                <li><span className="font-extrabold text-orange-400 mr-2">4.</span> {isSpanish ? 'Desde el primer día hasta la meta de la carrera, estamos aquí para apoyarte.' : 'From your first walk-jog transition to race day, we support your health.'}</li>
              </ol>
              <button onClick={() => handlePortalEntry('admin')} className="mt-8 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs rounded-full uppercase tracking-wider shadow-md">
                {isSpanish ? 'Comenzar' : 'Get Started'}
              </button>
            </div>
          </section>

        </div>


        {/* "Cómo funciona" (How it works) Steps Section (Image 2 style) */}
        <section className="max-w-5xl mx-auto mb-28 text-center" id="funciones">
          <T.H2 className="text-2xl md:text-3xl font-black mb-3 tracking-tight text-white leading-tight">
            {isSpanish ? 'Cómo funciona' : 'How it works'}
          </T.H2>
          <T.P className="text-base text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            {isSpanish 
              ? 'Fitnflai es sencilla, intuitiva y está diseñada para atletas de todos los niveles. Tanto si estás entrenando para tu primera carrera de 5 km como si quieres superar tu MP en un maratón, te guiaremos en cada paso del camino.'
              : 'Fitnflai is simple, intuitive, and built for athletes of all levels. Whether you are training for your first 5k or chasing a PR in a marathon, we\'ll guide you every step of the way.'}
          </T.P>
          <button
            onClick={() => handlePortalEntry('admin')}
            className="px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-full transition duration-300 text-lg shadow-lg hover:scale-105 mb-16"
          >
            {isSpanish ? 'Join Now' : 'Join Now'}
          </button>

          {/* 4 Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1: Descargar */}
            <div className="flex flex-col items-center text-center p-4">
              <IconBrandApple size={48} className="text-orange-500 mb-6" />
              <T.H3 className="text-sm font-extrabold text-white mb-2">{isSpanish ? 'Descargar Fitnflai' : 'Download Fitnflai'}</T.H3>
              <T.P className="text-xs text-gray-400 leading-relaxed max-w-[200px]">
                {isSpanish 
                  ? 'Después de crear una cuenta, descarga Fitnflai en iOS o Android. Tu plan estará disponible al alcance de tu mano.'
                  : 'After creating an account, download Fitnflai on iOS or Android. Your custom training plan is always at hand.'}
              </T.P>
            </div>

            {/* Step 2: Fija tu objetivo */}
            <div className="flex flex-col items-center text-center p-4">
              <IconRoute size={48} className="text-orange-500 mb-6" />
              <T.H3 className="text-sm font-extrabold text-white mb-2">{isSpanish ? 'Fija tu objetivo' : 'Set Your Goal'}</T.H3>
              <T.P className="text-xs text-gray-400 leading-relaxed max-w-[200px]">
                {isSpanish 
                  ? 'Elige la distancia o la fecha de la carrera y te prepararemos un plan a medida, adaptado a tu experiencia y horario.'
                  : 'Choose your distance or race date, and we\'ll construct a custom plan adapted to your fitness level.'}
              </T.P>
            </div>

            {/* Step 3: Empieza a entrenar */}
            <div className="flex flex-col items-center text-center p-4">
              <IconRun size={48} className="text-orange-500 mb-6" />
              <T.H3 className="text-sm font-extrabold text-white mb-2">{isSpanish ? 'Empieza a entrenar' : 'Start Training'}</T.H3>
              <T.P className="text-xs text-gray-400 leading-relaxed max-w-[200px]">
                {isSpanish 
                  ? 'Sigue tus entrenamientos personalizados y registra tus carreras con tus dispositivos favoritos, como Garmin o Apple Watch.'
                  : 'Follow your daily training calendar and log your sessions using your Garmin, Apple Watch, or Strava account.'}
              </T.P>
            </div>

            {/* Step 4: Logra más */}
            <div className="flex flex-col items-center text-center p-4">
              <IconTrophy size={48} className="text-orange-500 mb-6" />
              <T.H3 className="text-sm font-extrabold text-white mb-2">{isSpanish ? 'Logra más' : 'Achieve More'}</T.H3>
              <T.P className="text-xs text-gray-400 leading-relaxed max-w-[200px]">
                {isSpanish 
                  ? 'Mantén la motivación con la monitorización del progreso, el apoyo de la comunidad y los consejos de entrenamiento para ayudarte a alcanzar tu máximo potencial.'
                  : 'Stay motivated with automated progress tracking, community support, and clinical advice.'}
              </T.P>
            </div>
          </div>
        </section>

        {/* Pre-Footer CTA (Image 3 style) */}
        <section className="container mx-auto px-6 max-w-5xl py-12 mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            {/* Left Side: Overlapping Mockups (Phones & Watches) */}
            <div className="md:w-1/2 relative flex justify-center items-center h-[400px] w-full">
              <div className="absolute w-48 h-[340px] transform -rotate-12 z-10 flex items-center justify-center">
                <img src="/images/mockup_03.png" alt="Mockup 3" className="max-w-full max-h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]" />
              </div>
              <div className="absolute w-52 h-[380px] transform rotate-6 z-20 flex items-center justify-center">
                <img src="/images/mockup_04.png" alt="Mockup 4" className="max-w-full max-h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.4)]" />
              </div>
            </div>

            {/* Right Side: Copy & Buttons */}
            <div className="md:w-1/2 text-center md:text-left">
              <T.H2 className="text-2xl md:text-3xl font-extrabold leading-tight tracking-tight text-white mb-4">
                {isSpanish ? 'Lleva tu carrera al siguiente nivel' : 'Take your running to the next level'}
              </T.H2>
              <T.P className="text-gray-400 text-sm leading-relaxed mb-8 max-w-md">
                {isSpanish 
                  ? 'Tu entrenador personalizado con planes de entrenamiento a la medida que te ayudarán a alcanzar tus objetivos, desde correr 5 km más rápido hasta terminar tu primer maratón.'
                  : 'Your personalized digital coach with tailored plans built around your fitness metrics to help you crush all your sport goals.'}
              </T.P>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button
                  onClick={() => handlePortalEntry('admin')}
                  className="px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-full shadow-lg hover:scale-105 transition-transform duration-300 tracking-wider text-base"
                >
                  {isSpanish ? 'Buscar plan' : 'Find Your Plan'}
                </button>
              </div>
              <T.P className="text-xs text-gray-500 font-bold uppercase mt-4">
                {isSpanish ? 'Primera semana gratis. Cancela cuando quieras.' : 'First week free. Cancel anytime.'}
              </T.P>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
