import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store/useAppStore'
import { useTranslation } from '@/i18n/useTranslation'
import { T } from '@/components/ui/Typography'
import { Footer } from '@/components/layout/Footer'
import { IconBrandApple, IconBrandGooglePlay, IconArrowLeft, IconQrcode, IconChevronDown } from '@tabler/icons-react'

const SpainFlag = () => (
  <svg viewBox="0 0 750 500" className="w-4.5 h-3 rounded-sm object-cover shadow-sm inline-block shrink-0">
    <rect width="750" height="500" fill="#c60b1e" />
    <rect y="125" width="750" height="250" fill="#fbe122" />
    <rect x="150" y="175" width="50" height="120" fill="#c60b1e" rx="5" />
    <path d="M140 175 h70 v20 h-70 z" fill="#fbe122" />
  </svg>
)

const USAFlag = () => (
  <svg viewBox="0 0 7410 3900" className="w-4.5 h-3 rounded-sm object-cover shadow-sm inline-block shrink-0">
    <rect width="7410" height="3900" fill="#3c3b6e" />
    <rect y="300" width="7410" height="300" fill="#b22234" />
    <rect y="900" width="7410" height="300" fill="#b22234" />
    <rect y="1500" width="7410" height="300" fill="#b22234" />
    <rect y="2100" width="7410" height="300" fill="#b22234" />
    <rect y="2700" width="7410" height="300" fill="#b22234" />
    <rect y="3300" width="7410" height="300" fill="#b22234" />
    <g fill="#fff">
      <rect x="150" y="150" width="300" height="300" />
    </g>
  </svg>
)

export function DownloadPage() {
  const navigate = useNavigate()
  const { language, setLanguage } = useAppStore()
  const { t } = useTranslation()
  const isSpanish = language === 'ES'
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false)

  return (
    <div className="min-h-screen text-white font-sans antialiased relative overflow-hidden flex flex-col justify-between">
      {/* Background Image Watermark (Identical to Home/Landing page) */}
      <div
        className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.20] bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('/images/home-bg.png')",
          backgroundAttachment: 'fixed'
        }}
      />

      {/* Header/Navbar matching general design */}
      <nav className="sticky top-0 z-50 bg-gray-900 bg-opacity-80 backdrop-blur-md shadow-lg border-b border-gray-900 relative">
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

          {/* Right Controls */}
          <div className="flex items-center space-x-6">
            <button
              onClick={() => navigate('/')}
              className="hidden sm:flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-300 hover:text-orange-400 transition-colors duration-300 cursor-pointer"
            >
              <IconArrowLeft size={16} />
              {isSpanish ? 'Volver al Inicio' : 'Back to Home'}
            </button>

            {/* Language Selector */}
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

      {/* Main Content Content */}
      <main className="flex-grow flex items-center justify-center py-20 relative z-10">
        {/* Background Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-6 max-w-4xl relative z-10 text-center">
          {/* Badge */}
          <span className="inline-block px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-black uppercase tracking-widest text-orange-400 mb-6 animate-pulse">
            {isSpanish ? '🎁 ¡21 días de prueba gratis!' : '🎁 21-day free trial!'}
          </span>

          {/* Title */}
          <T.H1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-none mb-6 max-w-3xl mx-auto">
            {isSpanish ? 'Superá tus límites con la App' : 'Beat your limits with our App'}
          </T.H1>

          {/* Subtitle */}
          <div className="max-w-xl mx-auto mb-12">
            <T.P className="text-base sm:text-lg text-gray-400 leading-relaxed">
              {isSpanish 
                ? 'Descargá la app de Fitnflai en tu teléfono celular para arrancar con tus planes de entrenamiento y nutrición personalizados.' 
                : 'Download the Fitnflai app on your mobile phone to kickstart your personalized training and nutrition plans.'}
            </T.P>
            <T.P className="text-lg sm:text-xl text-white font-black mt-5 block uppercase tracking-wide">
              {isSpanish 
                ? '¡Tu prueba gratuita de 21 días comienza hoy!' 
                : 'Your 21-day free trial begins today!'}
            </T.P>
          </div>

          {/* Download & QR Grid inside beautiful translucent cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto items-stretch mb-8 text-left">
            {/* Left Box: Store Buttons */}
            <div className="flex flex-col justify-center gap-5 bg-[#141416]/80 rounded-3xl border border-gray-800/80 p-8 shadow-2xl">
              <h3 className="text-xs font-black uppercase tracking-wider text-orange-400 mb-2">
                {isSpanish ? 'Tiendas Oficiales' : 'Official App Stores'}
              </h3>
              
              {/* App Store */}
              <a 
                href="https://apps.apple.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-gray-950/60 border border-gray-800 hover:border-orange-500/50 hover:bg-gray-900 px-6 py-3.5 rounded-2xl transition-all duration-300 group cursor-pointer shadow-lg"
              >
                <IconBrandApple size={36} className="text-white group-hover:text-orange-500 transition-colors" />
                <div className="text-left">
                  <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block leading-none">
                    {isSpanish ? 'Descargar de' : 'Download on the'}
                  </span>
                  <span className="text-lg font-extrabold text-white block mt-1 leading-none">
                    App Store
                  </span>
                </div>
              </a>

              {/* Google Play Store */}
              <a 
                href="https://play.google.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-gray-950/60 border border-gray-800 hover:border-orange-500/50 hover:bg-gray-900 px-6 py-3.5 rounded-2xl transition-all duration-300 group cursor-pointer shadow-lg"
              >
                <IconBrandGooglePlay size={36} className="text-white group-hover:text-orange-500 transition-colors" />
                <div className="text-left">
                  <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block leading-none">
                    {isSpanish ? 'Disponible en' : 'Get it on'}
                  </span>
                  <span className="text-lg font-extrabold text-white block mt-1 leading-none">
                    Google Play
                  </span>
                </div>
              </a>
            </div>

            {/* Right Box: Scan QR code */}
            <div className="flex flex-col items-center justify-center text-center bg-[#141416]/80 rounded-3xl border border-gray-800/80 p-8 shadow-2xl">
              <h3 className="text-xs font-black uppercase tracking-wider text-orange-400 mb-4">
                {isSpanish ? 'Escanea para descargar' : 'Scan to Download'}
              </h3>
              
              {/* QR Code Icon/Representation styled beautifully */}
              <div className="p-4 bg-white rounded-2xl shadow-xl flex items-center justify-center w-36 h-36 border border-gray-200">
                <IconQrcode size={110} className="text-gray-950" />
              </div>
              
              <T.P className="text-xs text-gray-400 mt-5 max-w-[200px] leading-relaxed">
                {isSpanish 
                  ? 'Apunta con la cámara de tu celular al código QR para descargar la app al instante.' 
                  : 'Point your mobile camera at the QR code to download the app instantly.'}
              </T.P>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
