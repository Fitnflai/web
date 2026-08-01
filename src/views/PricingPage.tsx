import React, { useState } from 'react'
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
  IconArrowRight, 
  IconLayoutDashboard, 
  IconUser,
  IconSparkles
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



export function PricingPage() {
  const navigate = useNavigate()
  const { language, setLanguage, setPage, setUserRole } = useAppStore()
  const { t } = useTranslation()

  const [billingCycle, setBillingCycle] = useState<'annual' | 'monthly'>('annual')
  const [isPlanesDropdownOpen, setIsPlanesDropdownOpen] = useState(false)
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false)

  const isSpanish = language === 'ES'

  const handlePortalEntry = (role: 'admin' | 'specialist') => {
    navigate('/descargar')
  }

  // Features list per phone column (Image 1 "Lo que se incluye")
  const includedFeatures = {
    customPlans: [
      isSpanish ? 'Entrena para cualquier distancia' : 'Train for any distance',
      isSpanish ? 'Planes personalizados para cada carrera' : 'Personalized plans for every race',
      isSpanish ? 'Se adapta a tu rendimiento' : 'Adapts to your dynamic progress',
      isSpanish ? 'Asistencia integral antes, durante y después de tu plan' : 'Comprehensive support before, during, and after your plan'
    ],
    expertCoaching: [
      isSpanish ? 'Planes elaborados por entrenadores de élite' : 'Plans designed by elite coaches',
      isSpanish ? 'Experiencia de nivel olímpico incluida en todos los planes' : 'Olympic-level expertise included in all plans',
      isSpanish ? 'Asesoramiento experto sobre ritmo, programación y mucho más' : 'Expert advice on pacing, scheduling, and much more',
      isSpanish ? 'Apoyo del equipo Fitnflai cuando lo necesites' : 'Support from the Fitnflai team whenever you need it'
    ],
    techIntegration: [
      isSpanish ? 'Sincroniza con tus dispositivos favoritos' : 'Sync with your favorite devices',
      isSpanish ? 'Apple Watch, Garmin, Health Connect, Huawei Health y más' : 'Apple Watch, Garmin, Health Connect, Huawei Health, and more',
      isSpanish ? 'Conecta con Strava' : 'Connect seamlessly with Strava',
      isSpanish ? 'Estadísticas del entrenamiento y monitorización del progreso' : 'Workout analytics and automated progress tracking'
    ],
    exclusivePerks: [
      isSpanish ? 'Desbloquea descuentos en marcas cuidadosamente seleccionadas' : 'Unlock discounts on carefully selected premium brands',
      isSpanish ? 'Coach de fuerza gratis' : 'Free strength and mobility coach',
      isSpanish ? 'Acceso a nuevas funciones desde el momento del lanzamiento' : 'Early access to new features from launch date',
      isSpanish ? 'Eventos exclusivos y sorteos de premios' : 'Exclusive virtual events and prize giveaways'
    ]
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans antialiased relative overflow-hidden">
      {/* Background Image Watermark */}
      <div 
        className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.20] bg-cover bg-center z-0"
        style={{ 
          backgroundImage: "url('/images/pricing-bg.png')",
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

          {/* Navigation Links (Goes back to home section anchors) */}
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
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-orange-400 transition duration-300 font-bold">{t('landing.header.pricing')}</button>
            <button onClick={() => navigate('/caracteristicas')} className="text-gray-300 hover:text-orange-400 transition duration-300 font-semibold">{t('landing.header.features')}</button>
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
        
        {/* Title Section (Image 1 Conviértete en un Runna) */}
        <section className="text-center max-w-3xl mx-auto mb-16">
          <T.H1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 tracking-tight text-white leading-tight">
            {isSpanish ? 'Conviértete en un Fitnflai' : 'Become a Fitnflai'}
          </T.H1>
          <T.P className="text-lg md:text-xl text-gray-400 mb-8 leading-relaxed max-w-xl mx-auto">
            {isSpanish 
              ? 'Libera tu potencial con un plan personalizado. Impulsa tu progreso con un entrenamiento de élite. Forma parte de algo grande. Conviértete en un Fitnflai.'
              : 'Unlock your potential with a custom training plan. Fuel your progress with elite coaching. Be part of something great. Become a Fitnflai.'}
          </T.P>
          <button
            onClick={() => handlePortalEntry('admin')}
            className="px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-full transition duration-300 text-lg shadow-lg hover:scale-105"
          >
            {isSpanish ? 'Join Now' : 'Join Now'}
          </button>
        </section>

        {/* Pricing Card & Cycle Switcher (Image 1 style) */}
        <section className="flex flex-col items-center mb-28">
          
          {/* Cycle Switcher Capsule */}
          <div className="flex items-center bg-[#111112] border border-gray-850 p-1.5 rounded-full mb-8 select-none">
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 ${billingCycle === 'annual' ? 'bg-[#1c2536] text-white shadow-md' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <span>{isSpanish ? 'Anual' : 'Annual'}</span>
              <span className="bg-orange-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full lowercase tracking-normal">
                {isSpanish ? 'Ahorra 15%' : 'Save 15%'}
              </span>
            </button>
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 ${billingCycle === 'monthly' ? 'bg-[#1c2536] text-white shadow-md' : 'text-gray-500 hover:text-gray-300'}`}
            >
              {isSpanish ? 'Monthly' : 'Monthly'}
            </button>
          </div>

          {/* 3-Column Pricing Grid (Essential, Pro, Elite) based on Screenshots */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl w-full mx-auto">
            
            {/* Card 1: Essential */}
            <div className="bg-[#141416]/80 backdrop-blur-md border border-gray-800/60 rounded-3xl p-8 shadow-2xl flex flex-col justify-between text-left relative hover:border-blue-500/30 transition duration-300">
              <div>
                {/* 2-Column Header Layout */}
                <div className="flex justify-between items-center mb-6 gap-4">
                  {/* Left Column: Badge & Name */}
                  <div className="flex flex-col items-start gap-2">
                    <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider whitespace-nowrap">
                      {isSpanish ? 'Incluido gratis' : 'Included free'}
                    </span>
                    <T.H2 className="text-3xl font-black text-white leading-none mt-1">Essential</T.H2>
                  </div>
                  {/* Right Column: Massive Shield */}
                  <div className="shrink-0">
                    <img 
                      src="/images/plan-essential.png" 
                      alt="Essential Icon" 
                      className="w-28 h-28 md:w-36 md:h-36 object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.4)] transform hover:scale-115 transition-transform duration-300" 
                    />
                  </div>
                </div>
                
                <T.P className="text-xs text-gray-400 mb-6 leading-tight">
                  {isSpanish ? 'Plan de entrenamiento 100% IA' : '100% AI-driven training plans'}
                </T.P>

                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-black text-white tracking-tighter">
                    {billingCycle === 'annual' ? '$101.90' : '$9.99'}
                  </span>
                  <span className="text-gray-500 font-bold text-xs">
                    /{billingCycle === 'annual' ? (isSpanish ? 'año' : 'year') : (isSpanish ? 'mes' : 'month')}
                  </span>
                </div>
                
                <span className="text-xs font-semibold text-blue-400 block mb-6">
                  {billingCycle === 'annual' 
                    ? (isSpanish ? 'Eso es solo $8.49/mes - Ahorra 15%' : 'That\'s only $8.49/mo - Save 15%') 
                    : (isSpanish ? '21 días gratis • luego $9.99/mes' : '21-day free trial • then $9.99/mo')}
                </span>

                <ul className="space-y-3 text-xs text-gray-300 border-t border-gray-850 pt-6 mb-8">
                  <li className="flex items-center">
                    <IconCheck className="text-emerald-400 mr-2 flex-shrink-0" size={16} />
                    <span>{isSpanish ? 'Plan personalizado por IA' : 'AI-personalized training plan'}</span>
                  </li>
                  <li className="flex items-center">
                    <IconCheck className="text-emerald-400 mr-2 flex-shrink-0" size={16} />
                    <span>{isSpanish ? 'Seguimiento de progreso' : 'Progress tracking metrics'}</span>
                  </li>
                  <li className="flex items-center">
                    <IconCheck className="text-emerald-400 mr-2 flex-shrink-0" size={16} />
                    <span>{isSpanish ? 'Adaptación por altitud' : 'Smart altitude adaptation'}</span>
                  </li>
                  <li className="flex items-center">
                    <IconCheck className="text-emerald-400 mr-2 flex-shrink-0" size={16} />
                    <span>{isSpanish ? 'Registro de lesiones' : 'Injury logging and baseline'}</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handlePortalEntry('admin')}
                className="w-full py-3 bg-transparent hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/40 text-white font-extrabold text-xs rounded-lg border border-gray-700 tracking-wider uppercase transition duration-300"
              >
                {isSpanish ? 'Comenzar gratis' : 'Start free'}
              </button>
            </div>

            {/* Card 2: Pro (Highlighted with purple border) */}
            <div className="bg-[#141416]/80 backdrop-blur-md border-2 border-purple-500/60 rounded-3xl p-8 shadow-2xl flex flex-col justify-between text-left relative transform lg:scale-105 transition duration-300">
              <div>
                {/* 2-Column Header Layout */}
                <div className="flex justify-between items-center mb-6 gap-4">
                  {/* Left Column: Badge & Name */}
                  <div className="flex flex-col items-start gap-2">
                    <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider whitespace-nowrap">
                      {isSpanish ? 'Más popular' : 'Most popular'}
                    </span>
                    <T.H2 className="text-3xl font-black text-white leading-none mt-1">Pro</T.H2>
                  </div>
                  {/* Right Column: Massive Shield */}
                  <div className="shrink-0">
                    <img 
                      src="/images/plan-pro.png" 
                      alt="Pro Icon" 
                      className="w-32 h-32 md:w-40 md:h-40 object-contain filter drop-shadow-[0_12px_24px_rgba(232,98,42,0.3)] transform hover:scale-115 transition-transform duration-300" 
                    />
                  </div>
                </div>
                
                <T.P className="text-xs text-gray-400 mb-6 leading-tight">
                  {isSpanish ? 'Entrenamiento avanzado con soporte' : 'Advanced training with custom support'}
                </T.P>

                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-black text-white tracking-tighter">
                    {billingCycle === 'annual' ? '$203.90' : '$19.99'}
                  </span>
                  <span className="text-gray-500 font-bold text-xs">
                    /{billingCycle === 'annual' ? (isSpanish ? 'año' : 'year') : (isSpanish ? 'mes' : 'month')}
                  </span>
                </div>
                
                <span className="text-xs font-semibold text-purple-400 block mb-6">
                  {billingCycle === 'annual' 
                    ? (isSpanish ? 'Eso es solo $16.99/mes - Ahorra 15%' : 'That\'s only $16.99/mo - Save 15%') 
                    : (isSpanish ? 'Por mes' : 'Billed monthly')}
                </span>

                <ul className="space-y-3 text-xs text-gray-300 border-t border-gray-850 pt-6 mb-8">
                  <li className="flex items-center">
                    <IconCheck className="text-emerald-400 mr-2 flex-shrink-0" size={16} />
                    <span>{isSpanish ? 'Plan personalizado por IA' : 'AI-personalized training plan'}</span>
                  </li>
                  <li className="flex items-center">
                    <IconCheck className="text-emerald-400 mr-2 flex-shrink-0" size={16} />
                    <span>{isSpanish ? 'Seguimiento de progreso' : 'Progress tracking metrics'}</span>
                  </li>
                  <li className="flex items-center">
                    <IconCheck className="text-emerald-400 mr-2 flex-shrink-0" size={16} />
                    <span>{isSpanish ? 'Adaptación por altitud' : 'Smart altitude adaptation'}</span>
                  </li>
                  <li className="flex items-center">
                    <IconCheck className="text-emerald-400 mr-2 flex-shrink-0" size={16} />
                    <span>{isSpanish ? 'Registro de lesiones' : 'Injury logging and baseline'}</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handlePortalEntry('admin')}
                className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white font-extrabold text-xs rounded-lg tracking-wider uppercase transition duration-300 shadow-lg"
              >
                {isSpanish ? 'Suscribirme al Pro' : 'Subscribe to Pro'}
              </button>
            </div>

            {/* Card 3: Elite */}
            <div className="bg-[#141416]/80 backdrop-blur-md border border-gray-800/60 rounded-3xl p-8 shadow-2xl flex flex-col justify-between text-left relative hover:border-yellow-500/30 transition duration-300">
              <div>
                {/* 2-Column Header Layout */}
                <div className="flex justify-between items-center mb-6 gap-4">
                  {/* Left Column: Badge & Name */}
                  <div className="flex flex-col items-start gap-2">
                    <span className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider whitespace-nowrap">
                      {isSpanish ? 'Máximo rendimiento' : 'Max performance'}
                    </span>
                    <T.H2 className="text-3xl font-black text-white leading-none mt-1">Elite</T.H2>
                  </div>
                  {/* Right Column: Massive Shield */}
                  <div className="shrink-0">
                    <img 
                      src="/images/plan-elite.png" 
                      alt="Elite Icon" 
                      className="w-32 h-32 md:w-40 md:h-40 object-contain filter drop-shadow-[0_12px_24px_rgba(232,98,42,0.3)] transform hover:scale-115 transition-transform duration-300" 
                    />
                  </div>
                </div>
                
                <T.P className="text-xs text-gray-400 mb-6 leading-tight">
                  {isSpanish ? 'Máximo rendimiento y seguimiento personalizado' : 'Peak performance and custom supervision'}
                </T.P>

                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-black text-white tracking-tighter">
                    {billingCycle === 'annual' ? '$305.90' : '$29.99'}
                  </span>
                  <span className="text-gray-500 font-bold text-xs">
                    /{billingCycle === 'annual' ? (isSpanish ? 'año' : 'year') : (isSpanish ? 'mes' : 'month')}
                  </span>
                </div>
                
                <span className="text-xs font-semibold text-yellow-400 block mb-6">
                  {billingCycle === 'annual' 
                    ? (isSpanish ? 'Eso es solo $25.49/mes - Ahorra 15%' : 'That\'s only $25.49/mo - Save 15%') 
                    : (isSpanish ? 'Por mes' : 'Billed monthly')}
                </span>

                <ul className="space-y-3 text-xs text-gray-300 border-t border-gray-850 pt-6 mb-4">
                  <li className="flex items-center">
                    <IconCheck className="text-emerald-400 mr-2 flex-shrink-0" size={16} />
                    <span>{isSpanish ? 'Plan personalizado por IA' : 'AI-personalized training plan'}</span>
                  </li>
                  <li className="flex items-center">
                    <IconCheck className="text-emerald-400 mr-2 flex-shrink-0" size={16} />
                    <span>{isSpanish ? 'Seguimiento de progreso' : 'Progress tracking metrics'}</span>
                  </li>
                  <li className="flex items-center">
                    <IconCheck className="text-emerald-400 mr-2 flex-shrink-0" size={16} />
                    <span>{isSpanish ? 'Adaptación por altitud' : 'Smart altitude adaptation'}</span>
                  </li>
                  <li className="flex items-center">
                    <IconCheck className="text-emerald-400 mr-2 flex-shrink-0" size={16} />
                    <span>{isSpanish ? 'Registro de lesiones' : 'Injury logging and baseline'}</span>
                  </li>
                </ul>

                {/* Highlighted Blue Card Banner (Image 1 style) */}
                <div className="bg-blue-950/40 border border-blue-900/40 rounded-xl p-3 mb-6 flex gap-2 text-[10px] text-blue-300 leading-normal font-medium text-left">
                  <IconSparkles size={20} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                  <p>
                    {isSpanish 
                      ? 'La IA genera el plan y el deportólogo lo revisa, valida y personaliza antes de que llegue a ti.'
                      : 'The AI builds the plan, then our sports doctors review, validate, and tailor it before it reaches you.'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handlePortalEntry('admin')}
                className="w-full py-3 bg-transparent hover:bg-yellow-500/10 hover:text-yellow-400 hover:border-yellow-500/40 text-white font-extrabold text-xs rounded-lg border border-gray-700 tracking-wider uppercase transition duration-300"
              >
                {isSpanish ? 'Suscribirme al Elite' : 'Subscribe to Elite'}
              </button>
            </div>

          </div>

        </section>

        {/* Comparative Membership Table Section */}
        <section className="max-w-5xl mx-auto mb-28" id="funciones">
          <T.H2 className="text-2xl md:text-3xl font-black mb-10 tracking-tight text-white text-center leading-tight">
            {isSpanish ? 'Lo que se incluye en cada membresía' : 'What\'s included in each membership'}
          </T.H2>

          {/* Table Container */}
          <div className="bg-[#141416]/80 border border-gray-800/80 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md">
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full border-collapse text-left text-sm">
                {/* Table Header */}
                <thead>
                  <tr className="border-b border-gray-800 bg-black/40">
                    <th className="p-5 font-extrabold text-white w-[40%] text-base">{isSpanish ? 'Características y Funciones' : 'Features & Functions'}</th>
                    <th className="p-5 font-black text-center text-gray-300 text-sm tracking-wide w-[20%] uppercase text-xs md:text-sm">Essential</th>
                    <th className="p-5 font-black text-center text-orange-500 text-sm tracking-wide w-[20%] uppercase bg-orange-500/5 relative text-xs md:text-sm">
                      {/* Popular Badge */}
                      <span className="absolute top-1 left-1/2 transform -translate-x-1/2 text-[8px] bg-orange-500 text-white font-extrabold px-2 py-0.5 rounded-full tracking-widest leading-none">POPULAR</span>
                      <span className="block mt-2">Pro</span>
                    </th>
                    <th className="p-5 font-black text-center text-gray-300 text-sm tracking-wide w-[20%] uppercase text-xs md:text-sm">Elite</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const categories = [
                      {
                        name: isSpanish ? 'Planes de Entrenamiento Adaptativos' : 'Adaptive Training Plans',
                        features: [
                          { name: isSpanish ? 'Planes personalizados según tu nivel y objetivo' : 'Personalized plans built for your level & goals', plans: [true, true, true] },
                          { name: isSpanish ? 'Algoritmo dinámico diario ajustable según fatiga' : 'Dynamic daily adjustments based on your fatigue', plans: [true, true, true] },
                          { name: isSpanish ? 'Rutinas de fuerza y movilidad integradas' : 'Integrated strength & mobility routines', plans: [true, true, true] },
                          { name: isSpanish ? 'Preparación específica para montaña/desnivel' : 'Elevation & technical mountain preparation', plans: [true, true, true] },
                        ]
                      },
                      {
                        name: isSpanish ? 'Sincronización y Tecnología' : 'Sync & Technology',
                        features: [
                          { name: isSpanish ? 'Sincronización automática de relojes (Garmin, Apple Watch, etc.)' : 'Automated smartwatch sync (Garmin, Apple Watch, etc.)', plans: [true, true, true] },
                          { name: isSpanish ? 'Integración completa con Strava y Health Connect' : 'Full integration with Strava and Health Connect', plans: [true, true, true] },
                          { name: isSpanish ? 'Análisis avanzado de rendimiento y métricas de carrera' : 'Advanced workout analytics and running metrics', plans: [true, true, true] },
                        ]
                      },
                      {
                        name: isSpanish ? 'Nutrición Deportiva de Élite' : 'Sport Nutrition',
                        features: [
                          { name: isSpanish ? 'Planificación nutricional personalizada semanal' : 'Weekly personalized sport nutrition calendar', plans: [false, true, true] },
                          { name: isSpanish ? 'Canal de chat directo con nutricionistas calificados' : 'Direct chat channel with qualified sport nutritionists', plans: [false, true, true] },
                        ]
                      },
                      {
                        name: isSpanish ? 'Soporte Clínico Holístico' : 'Clinical Support & Medical Backing',
                        features: [
                          { name: isSpanish ? 'Canal de chat directo con deportólogos y fisioterapeutas' : 'Direct chat channel with sports doctors & physiotherapists', plans: [false, false, true] },
                          { name: isSpanish ? 'Prioridad en análisis clínico, biométrico y de lesiones' : 'Priority clinical, biometric, and injury prevention analysis', plans: [false, false, true] },
                        ]
                      },
                      {
                        name: isSpanish ? 'Ventajas y Perks Exclusivos' : 'Exclusive Perks & Rewards',
                        features: [
                          { name: isSpanish ? 'Descuentos exclusivos en marcas de equipamiento' : 'Exclusive discounts on selected premium gear brands', plans: [true, true, true] },
                          { name: isSpanish ? 'Acceso anticipado a nuevas funciones de la app' : 'Early access to new application features from launch', plans: [false, true, true] },
                          { name: isSpanish ? 'Soporte VIP prioritario con respuestas en menos de 2 horas' : 'Priority VIP support with response times under 2 hours', plans: [false, false, true] },
                        ]
                      }
                    ];

                    return categories.map((cat, catIdx) => (
                      <React.Fragment key={catIdx}>
                        {/* Category Row */}
                        <tr className="bg-gray-900/40 border-b border-gray-800/80">
                          <td colSpan={4} className="px-5 py-3 font-extrabold text-xs tracking-wider uppercase text-gray-400">
                            {cat.name}
                          </td>
                        </tr>
                        {/* Features Rows */}
                        {cat.features.map((feat, featIdx) => (
                          <tr key={featIdx} className="border-b border-gray-800/50 hover:bg-white/[0.01] transition-colors">
                            <td className="p-5 font-medium text-gray-300 text-xs md:text-sm">{feat.name}</td>
                            {feat.plans.map((included, planIdx) => (
                              <td 
                                key={planIdx} 
                                className={`p-5 text-center text-sm ${planIdx === 1 ? 'bg-orange-500/[0.02]' : ''}`}
                              >
                                {included ? (
                                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 font-extrabold">✓</span>
                                ) : (
                                  <span className="text-gray-600 font-bold">—</span>
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </React.Fragment>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* "Cómo funciona" (How it works) Steps Section (Image 1 style) */}
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

          {/* 4 Steps Grid with Orange Icons */}
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


        {/* Pre-Footer CTA (Image 1 style) */}
        <section className="container mx-auto px-6 max-w-5xl py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            {/* Left Side: Overlapping Mockups (Phones & Watches) */}
            <div className="md:w-1/2 relative flex justify-center items-center h-[400px] w-full">
              <div className="absolute w-48 h-[340px] transform -rotate-12 z-10 flex items-center justify-center">
                <img src="/images/mockup_01.png" alt="Mockup 1" className="max-w-full max-h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]" />
              </div>
              <div className="absolute w-52 h-[380px] transform rotate-6 z-20 flex items-center justify-center">
                <img src="/images/mockup_02.png" alt="Mockup 2" className="max-w-full max-h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.4)]" />
              </div>
            </div>

            {/* Right Side: Copy & Buttons */}
            <div className="md:w-1/2 text-center md:text-left">
              <T.H2 className="text-2xl md:text-3xl font-extrabold leading-tight tracking-tight text-white mb-4">
                {isSpanish ? 'Lleva tu running al siguiente nivel' : 'Take your training to the next level'}
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
                  {isSpanish ? 'Encuentra tu plan' : 'Find Your Plan'}
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
