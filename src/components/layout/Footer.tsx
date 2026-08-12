import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store/useAppStore'
import { useTranslation } from '@/i18n/useTranslation'
import { T } from '@/components/ui/Typography'
import { IconBrandFacebook, IconBrandX, IconBrandInstagram, IconBrandTiktok, IconBrandYoutube } from '@tabler/icons-react'

export function Footer() {
  const navigate = useNavigate()
  const { language } = useAppStore()
  const isSpanish = language === 'ES'

  return (
    <footer className="bg-gray-950/70 text-gray-500 py-16 border-t border-gray-900 relative z-10">
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 items-center lg:items-end gap-12 lg:gap-0">
        {/* Left Column (Logo & Socials) */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-6">
          {/* Logo */}
          <div className="flex items-center select-none cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img 
              src="/images/logo.png" 
              alt="Fitnflai Logo" 
              className="h-8 object-contain transform hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Social Icons Row (underneath the logo) */}
          <div className="flex space-x-5 text-gray-400">
            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors duration-300">
              <IconBrandFacebook size={20} />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors duration-300">
              <IconBrandX size={20} />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors duration-300">
              <IconBrandInstagram size={20} />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors duration-300">
              <IconBrandTiktok size={20} />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors duration-300">
              <IconBrandYoutube size={20} />
            </a>
          </div>
        </div>

        {/* Right Column (Copyright & Legal links aligned right on desktop) */}
        <div className="flex flex-col items-center lg:items-end text-center lg:text-right gap-2">
          <T.P className="text-sm text-gray-500">
            {isSpanish ? '© 2026 Fitnflai. Todos los derechos reservados.' : '© 2026 Fitnflai. All rights reserved.'}
          </T.P>
          <div className="flex flex-wrap justify-center lg:justify-end gap-4 lg:gap-6 text-sm">
            <button
              onClick={() => navigate('/terminos-condiciones')}
              className="text-gray-400 hover:text-orange-400 transition cursor-pointer font-semibold"
            >
              {isSpanish ? 'Términos y Condiciones' : 'Terms & Conditions'}
            </button>
            <button
              onClick={() => navigate('/politica-privacidad')}
              className="text-gray-400 hover:text-orange-400 transition cursor-pointer font-semibold"
            >
              {isSpanish ? 'Política de Privacidad' : 'Privacy Policy'}
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
