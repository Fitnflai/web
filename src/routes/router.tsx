import { createBrowserRouter } from 'react-router-dom'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { AdminApp } from '@/views/shared/AdminApp'
import { LandingPage } from '@/views/LandingPage'
import { PricingPage } from '@/views/PricingPage'
import { FeaturesPage } from '@/views/FeaturesPage'
import { CoachesPage } from '@/views/CoachesPage'
import { PlanDetailPage } from '@/views/PlanDetailPage'
import { LoginPage } from '@/views/LoginPage'
import { PoliticaPrivacidadPage } from '@/views/PoliticaPrivacidadPage'
import { TerminosCondicionesPage } from '@/views/TerminosCondicionesPage'
import { DownloadPage } from '@/views/DownloadPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/precios',
    element: <PricingPage />,
  },
  {
    path: '/caracteristicas',
    element: <FeaturesPage />,
  },
  {
    path: '/coaches',
    element: <CoachesPage />,
  },
  {
    path: '/planes/:planId',
    element: <PlanDetailPage />,
  },
  {
    path: '/politica-privacidad',
    element: <PoliticaPrivacidadPage />,
  },
  {
    path: '/terminos-condiciones',
    element: <TerminosCondicionesPage />,
  },
  {
    path: '/descargar',
    element: <DownloadPage />,
  },
  {
    path: '/portal',
    element: (
      <AdminLayout>
        <AdminApp />
      </AdminLayout>
    ),
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '*',
    element: (
      <div className="min-h-screen bg-surface-bg flex items-center justify-center text-surface-muted">
        <div className="text-center">
          <div className="text-6xl mb-4">404</div>
          <div className="text-[14px]">Página no encontrada</div>
          <a href="/" className="mt-4 inline-block text-brand-orange hover:underline text-[12px]">Volver al inicio</a>
        </div>
      </div>
    ),
  },
])
