import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAppStore } from '@/store/useAppStore'
import { useTranslation } from '@/i18n/useTranslation'
import { IconChevronDown, IconMenu2, IconX } from '@tabler/icons-react'

const SpainFlag = () => (
  <svg className="w-5 h-3.5 rounded-sm object-cover shadow-sm" viewBox="0 0 640 480">
    <path fill="#aa151b" d="M0 0h640v480H0z" />
    <path fill="#f1bf00" d="M0 120h640v240H0z" />
  </svg>
)

const USAFlag = () => (
  <svg className="w-5 h-3.5 rounded-sm object-cover shadow-sm" viewBox="0 0 640 480">
    <path fill="#bd3d44" d="M0 0h640v480H0z" />
    <path stroke="#fff" strokeWidth="37" d="M0 55.5h640M0 129.5h640M0 203.5h640M0 277.5h640M0 351.5h640M0 425.5h640" />
    <path fill="#192f5d" d="M0 0h256v259H0z" />
  </svg>
)

export function PublicHeader() {
  const navigate = useNavigate()
  const location = useLocation()
  const { language, setLanguage } = useAppStore()
  const { t } = useTranslation()
  const isSpanish = language === 'ES'

  const [isPlanesDropdownOpen, setIsPlanesDropdownOpen] = useState(false)
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isBlog = location.pathname.startsWith('/blog')

  return (
    <nav className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur-md shadow-lg border-b border-gray-800">
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

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex space-x-7 items-center">
          {/* Planes Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsPlanesDropdownOpen(!isPlanesDropdownOpen)}
              className="text-gray-300 hover:text-orange-400 transition duration-300 font-semibold flex items-center gap-1 text-sm"
            >
              <span>{t('landing.header.plans')}</span>
              <IconChevronDown
                size={14}
                className={`transform transition-transform ${isPlanesDropdownOpen ? 'rotate-180' : ''}`}
              />
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

          <button
            onClick={() => navigate('/precios')}
            className={`text-sm font-semibold transition duration-300 ${
              location.pathname === '/precios' ? 'text-orange-400 font-bold' : 'text-gray-300 hover:text-orange-400'
            }`}
          >
            {t('landing.header.pricing')}
          </button>

          <button
            onClick={() => navigate('/caracteristicas')}
            className={`text-sm font-semibold transition duration-300 ${
              location.pathname === '/caracteristicas' ? 'text-orange-400 font-bold' : 'text-gray-300 hover:text-orange-400'
            }`}
          >
            {t('landing.header.features')}
          </button>

          <button
            onClick={() => navigate('/coaches')}
            className={`text-sm font-semibold transition duration-300 ${
              location.pathname === '/coaches' ? 'text-orange-400 font-bold' : 'text-gray-300 hover:text-orange-400'
            }`}
          >
            {t('landing.header.coaches')}
          </button>

          {/* Blog Nav Link */}
          <button
            onClick={() => navigate('/blog')}
            className={`text-sm font-semibold transition duration-300 flex items-center gap-1.5 ${
              isBlog ? 'text-orange-400 font-bold' : 'text-gray-300 hover:text-orange-400'
            }`}
          >
            <span>Blog</span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-brand-orange/20 text-brand-orange">
              SEO
            </span>
          </button>

          <button
            onClick={() => navigate('/#soporte')}
            className="text-sm font-semibold text-gray-300 hover:text-orange-400 transition duration-300"
          >
            {t('landing.header.support')}
          </button>
        </div>

        {/* Right action & Lang */}
        <div className="flex items-center space-x-4">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="text-gray-300 hover:text-orange-400 transition duration-300 font-semibold flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-800/40 border border-transparent hover:border-gray-800 text-sm"
            >
              {isSpanish ? <SpainFlag /> : <USAFlag />}
              <span>{isSpanish ? 'ES' : 'EN'}</span>
              <IconChevronDown
                size={14}
                className={`transform transition-transform ${isLangDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl py-2 z-50">
                <button
                  onClick={() => {
                    setLanguage('ES')
                    setIsLangDropdownOpen(false)
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold hover:bg-gray-800 transition ${
                    isSpanish ? 'text-orange-400 font-bold' : 'text-gray-300'
                  }`}
                >
                  <SpainFlag />
                  <span>Español</span>
                </button>
                <button
                  onClick={() => {
                    setLanguage('EN')
                    setIsLangDropdownOpen(false)
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold hover:bg-gray-800 transition ${
                    !isSpanish ? 'text-orange-400 font-bold' : 'text-gray-300'
                  }`}
                >
                  <USAFlag />
                  <span>English</span>
                </button>
              </div>
            )}
          </div>

          {/* CTA Button */}
          <button
            onClick={() => navigate('/descargar')}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-lg bg-brand-orange text-white text-xs font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-500/20"
          >
            {isSpanish ? 'Descargar App' : 'Download App'}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-300 hover:text-white"
          >
            {isMobileMenuOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-950 border-b border-gray-800 px-6 py-4 flex flex-col space-y-3">
          <button
            onClick={() => {
              navigate('/precios')
              setIsMobileMenuOpen(false)
            }}
            className="text-left text-sm text-gray-300 hover:text-orange-400 font-semibold py-1"
          >
            {t('landing.header.pricing')}
          </button>
          <button
            onClick={() => {
              navigate('/caracteristicas')
              setIsMobileMenuOpen(false)
            }}
            className="text-left text-sm text-gray-300 hover:text-orange-400 font-semibold py-1"
          >
            {t('landing.header.features')}
          </button>
          <button
            onClick={() => {
              navigate('/coaches')
              setIsMobileMenuOpen(false)
            }}
            className="text-left text-sm text-gray-300 hover:text-orange-400 font-semibold py-1"
          >
            {t('landing.header.coaches')}
          </button>
          <button
            onClick={() => {
              navigate('/blog')
              setIsMobileMenuOpen(false)
            }}
            className="text-left text-sm text-orange-400 font-bold py-1"
          >
            Blog
          </button>
          <button
            onClick={() => {
              navigate('/descargar')
              setIsMobileMenuOpen(false)
            }}
            className="text-left text-sm text-gray-300 hover:text-orange-400 font-semibold py-1"
          >
            {isSpanish ? 'Descargar App' : 'Download App'}
          </button>
        </div>
      )}
    </nav>
  )
}
