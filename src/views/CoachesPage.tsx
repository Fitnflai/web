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
  IconArrowRight
} from '@tabler/icons-react'
import { RegisterProfessionalModal } from './RegisterProfessionalModal'

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



export function CoachesPage() {
  const navigate = useNavigate()
  const { language, setLanguage, setPage, setUserRole } = useAppStore()
  const { t } = useTranslation()

  const [isPlanesDropdownOpen, setIsPlanesDropdownOpen] = useState(false)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false)

  const isSpanish = language === 'ES'

  const handlePortalEntry = (role: 'admin' | 'specialist') => {
    navigate('/descargar')
  }

  // Coaches List Data matching the Grid screenshots
  const coaches = [
    {
      name: 'Adrian D\'Costa',
      role: isSpanish ? 'Fisioterapeuta' : 'Physical Therapist',
      badge: isSpanish ? 'Fisioterapeuta' : 'PHYSICAL THERAPIST',
      badgeColor: 'bg-red-500/10 text-red-400 border-red-500/20',
      img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80'
    },
    {
      name: 'Fraser Briggs',
      role: isSpanish ? 'Instructor de Movimiento' : 'Stretch & Mobility Instructor',
      badge: isSpanish ? 'Estiramientos' : 'STRETCH',
      badgeColor: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80'
    },
    {
      name: 'Christie Wang',
      role: isSpanish ? 'Instructor de Pilates Clásico' : 'Classical Pilates Instructor',
      badge: isSpanish ? 'Pilates' : 'PILATES',
      badgeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
      img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80'
    },
    {
      name: 'Ben Parker',
      role: isSpanish ? 'Fundador de Fitnflai' : 'Founder of Fitnflai',
      badge: isSpanish ? 'Entrenador Principal' : 'HEAD COACH',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80'
    },
    {
      name: 'Anya Culling',
      role: isSpanish ? 'Corredor de maratón de Inglaterra' : 'England Marathon Runner',
      badge: isSpanish ? 'Deportista' : 'ATHLETE',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      img: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=150&h=150&q=80'
    },
    {
      name: 'Steph Kessell',
      role: isSpanish ? 'Deportista olímpico británico' : 'British Olympic Athlete',
      badge: isSpanish ? 'Entrenador Principal' : 'HEAD COACH',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80'
    },
    {
      name: 'Colleen Quigley',
      role: isSpanish ? 'Atleta olímpico estadounidense' : 'US Olympic Athlete',
      badge: isSpanish ? 'Deportista' : 'ATHLETE',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=150&h=150&q=80'
    },
    {
      name: 'Genevieve Gregson',
      role: isSpanish ? 'Atleta olímpico australiano' : 'Australian Olympic Athlete',
      badge: isSpanish ? 'Entrenador de Carrera' : 'RUN COACH',
      badgeColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&h=150&q=80'
    },
    {
      name: 'Kayla Jeter',
      role: isSpanish ? 'Deportista y líder comunitario' : 'Athlete & Community Leader',
      badge: isSpanish ? 'Deportista' : 'ATHLETE',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      img: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=150&h=150&q=80'
    },
    {
      name: 'Andre Coggins',
      role: isSpanish ? 'Entrenador de running y líder comunitario' : 'Run Coach & Community Leader',
      badge: isSpanish ? 'Entrenador de Carrera' : 'RUN COACH',
      badgeColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      img: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&h=150&q=80'
    },
    {
      name: 'Louis Walcott',
      role: isSpanish ? 'Yoga Instructor' : 'Yoga Instructor',
      badge: isSpanish ? 'Instructor de Yoga' : 'YOGA INSTRUCTOR',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans antialiased relative overflow-hidden">
      {/* Background Image Watermark */}
      <div 
        className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.10] bg-cover bg-center z-0"
        style={{ 
          backgroundImage: "url('/images/coaches-bg.png')",
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
            <button onClick={() => navigate('/caracteristicas')} className="text-gray-300 hover:text-orange-400 transition duration-300 font-semibold">{t('landing.header.features')}</button>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-orange-400 transition duration-300 font-bold">{t('landing.header.coaches')}</button>
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
        
        {/* Title Section (Image 1 Nuestros entrenadores) */}
        <section className="text-center max-w-3xl mx-auto mb-16">
          <T.H1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 tracking-tight text-white leading-tight">
            {isSpanish ? 'Nuestros entrenadores' : 'Our world-class coaches'}
          </T.H1>
          <T.P className="text-sm md:text-base text-gray-400 mb-8 leading-relaxed max-w-2xl mx-auto">
            {isSpanish 
              ? 'En Fitnflai, nuestros entrenadores de talla mundial aportan décadas de experiencia en todas las distancias, desde los primeros 5 km hasta las ultramaratones de élite. No solo son expertos en rendimiento, sino que también les apasiona ayudar a cada atleta a alcanzar sus objetivos.'
              : 'At Fitnflai, our world-class coaches bring decades of experience across all distances, from first 5k runs to elite ultramarathons. They are performance experts passionate about helping you crush your goals.'}
          </T.P>
          <button
            onClick={() => handlePortalEntry('admin')}
            className="px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-full transition duration-300 text-base shadow-lg hover:scale-105 mb-4"
          >
            {isSpanish ? 'Comenzar prueba gratuita' : 'Start free trial'}
          </button>
          <T.P className="text-xs text-gray-500 font-bold uppercase">
            {isSpanish ? 'Primera semana gratis. Cancela cuando quieras.' : 'First week free. Cancel anytime.'}
          </T.P>
        </section>

        {/* Coaches Cards Grid (2 Rows of Coaches) */}
        <section className="max-w-5xl mx-auto mb-28">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12 items-start justify-center">
            {coaches.slice(0, 8).map((coach, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className="relative mb-4">
                  {/* Category Pill Tag above avatar */}
                  <span className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2.5 px-2.5 py-0.5 rounded-full text-[7px] font-black border uppercase tracking-wider ${coach.badgeColor} shrink-0 whitespace-nowrap`}>
                    {coach.badge}
                  </span>
                  <img
                    src={coach.img}
                    alt={coach.name}
                    className="w-24 h-24 md:w-28 md:h-24 rounded-full object-cover border-2 border-gray-800 shadow-md group-hover:scale-105 transition duration-300"
                  />
                </div>
                <T.H3 className="text-sm font-black text-white mb-0.5">{coach.name}</T.H3>
                <T.P className="text-[10px] text-gray-500 font-bold max-w-[130px] leading-tight">{coach.role}</T.P>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Coach Highlight Section ("Cómo te ayudan nuestros entrenadores") */}
        <section className="py-20 bg-[#141416]/50 backdrop-blur-md rounded-3xl p-8 md:p-12 max-w-5xl mx-auto mb-28 border border-gray-800/60 shadow-2xl">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Left side: Ben Parker and bubble */}
            <div className="w-full lg:w-2/5 flex flex-col items-center">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80"
                alt="Ben Parker"
                className="w-28 h-28 rounded-full object-cover border-2 border-orange-500 mb-2 shadow-lg"
              />
              <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest block mb-6">
                BEN PARKER, HEAD COACH
              </span>
              
              {/* Bubble quote */}
              <div className="bg-[#141416]/80 backdrop-blur-md border border-gray-800/60 p-5 rounded-2xl relative shadow-md text-left text-xs text-gray-300 leading-relaxed max-w-[280px]">
                <p>
                  "Hi! Welcome to your New to Running plan. You've taken the hardest step: getting started. Now, we'll build your fitness, confidence, and consistency one run at a time. No pressure, just progress. Stick with it, trust the process, and we'll get you across that 5K finish line together. You've got this!"
                </p>
                {/* Bubble tail pointing up */}
                <div className="absolute top-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-[#141416]/80 backdrop-blur-md border-t border-l border-gray-800/60 transform rotate-45"></div>
              </div>
            </div>

            {/* Right side: Detailed descriptions */}
            <div className="w-full lg:w-3/5 text-left">
              <T.H2 className="text-2xl md:text-3xl font-black text-white mb-6 leading-tight">
                {isSpanish ? 'Cómo' : 'How'}{' '}
                <span className="text-orange-500">{isSpanish ? 'te ayudan' : 'our coaches help'}</span>{' '}
                {isSpanish ? 'nuestros entrenadores' : 'you'}
              </T.H2>
              <div className="space-y-4 text-xs md:text-sm text-gray-300 leading-relaxed">
                <p>
                  {isSpanish 
                    ? 'En Fitnflai, entrenamos de forma diferente. En lugar de pagar costosas sesiones individuales con un solo entrenador, todos los planes de Fitnflai se crean y mejoran continuamente gracias a nuestro equipo de entrenadores expertos.'
                    : 'At Fitnflai, we train differently. Instead of paying for expensive one-on-one sessions with a single trainer, all Fitnflai plans are constructed and continuously improved by our expert coaching team.'}
                </p>
                <p>
                  {isSpanish 
                    ? 'A diferencia del entrenamiento tradicional, en el que tu experiencia depende únicamente de los conocimientos de una sola persona, cada plan de entrenamiento que sigues con Fitnflai combina la experiencia de varios entrenadores de talla mundial. Ya sea un plan para principiantes de 5 km o un programa de ultra trail, nuestros entrenadores trabajan juntos detrás de escena para garantizar que tu plan refleje los últimos avances científicos en materia de entrenamiento, los conocimientos de atletas reales y consejos prácticos que te ayudarán a mantener la motivación, la salud y a rendir al máximo.'
                    : 'Unlike traditional training, where your experience depends on just one person, every Fitnflai plan combines the expertise of multiple world-class coaches. Whether it\'s a beginner 5k or an ultra trail program, our coaches work behind the scenes to ensure your plan reflects the latest sports science and practical medical supervision.'}
                </p>
                <p>
                  {isSpanish 
                    ? 'No recibirás entrenamiento de una sola persona. En su lugar, te beneficias del conocimiento colectivo, la experiencia y la atención de todo el equipo. Significa que obtienes un nivel de apoyo y calidad difícil de encontrar en cualquier otro lugar, por una fracción del costo del entrenamiento individual tradicional.'
                    : 'You don\'t just get support from one person. Instead, you benefit from the collective knowledge and sports medicine background of the entire team, at a fraction of the cost of traditional personal training.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action for Professionals */}
        <section className="max-w-5xl mx-auto my-20 p-8 bg-gradient-to-r from-orange-600/60 to-red-600/60 backdrop-blur-md border border-orange-500/20 rounded-3xl text-center shadow-2xl transform hover:scale-105 transition-transform duration-500 ease-in-out">
          <div className="flex flex-col items-center justify-center space-y-6">
            <T.H2 className="text-3xl md:text-4xl font-black text-white leading-tight">
              {t('registerCoach.title')}
            </T.H2>
            <T.P className="text-lg text-white opacity-90 max-w-2xl">
              {t('registerCoach.subtitle')}
            </T.P>
            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="px-10 py-4 bg-white text-orange-600 font-black rounded-full shadow-lg hover:bg-gray-100 transition duration-300 transform hover:-translate-y-1 text-lg"
            >
              {t('registerCoach.ctaButton')} <IconArrowRight className="inline-block ml-2" size={20} />
            </button>
            <T.P className="text-sm text-white opacity-80">
              {t('registerCoach.alreadyRegistered')}{' '}
              <button
                onClick={() => handlePortalEntry('specialist')}
                className="font-bold underline hover:text-white transition"
              >
                {t('registerCoach.loginLink')}
              </button>
            </T.P>
          </div>
        </section>

      </main>

      <Footer />

      <RegisterProfessionalModal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} />
    </div>
  )
}
