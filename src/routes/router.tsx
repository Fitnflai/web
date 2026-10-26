import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'

// Minimalist, accessible fallback loader for smooth transitions
function RouteFallback() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center">
      <div className="w-8 h-8 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
    </div>
  )
}

function withSuspense(Component: React.ComponentType) {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Component />
    </Suspense>
  )
}

// Lazy loaded views (Code-Splitting)
const LandingPage = lazy(() => import('@/views/LandingPage').then((m) => ({ default: m.LandingPage })))
const PricingPage = lazy(() => import('@/views/PricingPage').then((m) => ({ default: m.PricingPage })))
const FeaturesPage = lazy(() => import('@/views/FeaturesPage').then((m) => ({ default: m.FeaturesPage })))
const CoachesPage = lazy(() => import('@/views/CoachesPage').then((m) => ({ default: m.CoachesPage })))
const PlanDetailPage = lazy(() => import('@/views/PlanDetailPage').then((m) => ({ default: m.PlanDetailPage })))
const PoliticaPrivacidadPage = lazy(() => import('@/views/PoliticaPrivacidadPage').then((m) => ({ default: m.PoliticaPrivacidadPage })))
const TerminosCondicionesPage = lazy(() => import('@/views/TerminosCondicionesPage').then((m) => ({ default: m.TerminosCondicionesPage })))
const DownloadPage = lazy(() => import('@/views/DownloadPage').then((m) => ({ default: m.DownloadPage })))
const BlogPage = lazy(() => import('@/views/BlogPage').then((m) => ({ default: m.BlogPage })))
const BlogPostDetailPage = lazy(() => import('@/views/BlogPostDetailPage').then((m) => ({ default: m.BlogPostDetailPage })))
const LoginPage = lazy(() => import('@/views/LoginPage').then((m) => ({ default: m.LoginPage })))

// Lazy loaded admin bundle
const AdminLayout = lazy(() => import('@/components/layout/AdminLayout').then((m) => ({ default: m.AdminLayout })))
const AdminApp = lazy(() => import('@/views/shared/AdminApp').then((m) => ({ default: m.AdminApp })))

export const router = createBrowserRouter([
  {
    path: '/',
    element: withSuspense(LandingPage),
  },
  {
    path: '/precios',
    element: withSuspense(PricingPage),
  },
  {
    path: '/caracteristicas',
    element: withSuspense(FeaturesPage),
  },
  {
    path: '/coaches',
    element: withSuspense(CoachesPage),
  },
  {
    path: '/planes/:planId',
    element: withSuspense(PlanDetailPage),
  },
  {
    path: '/politica-privacidad',
    element: withSuspense(PoliticaPrivacidadPage),
  },
  {
    path: '/terminos-condiciones',
    element: withSuspense(TerminosCondicionesPage),
  },
  {
    path: '/descargar',
    element: withSuspense(DownloadPage),
  },
  {
    path: '/blog',
    element: withSuspense(BlogPage),
  },
  {
    path: '/blog/:slug',
    element: withSuspense(BlogPostDetailPage),
  },
  {
    path: '/portal',
    element: (
      <Suspense fallback={<RouteFallback />}>
        <AdminLayout>
          <AdminApp />
        </AdminLayout>
      </Suspense>
    ),
  },
  {
    path: '/login',
    element: withSuspense(LoginPage),
  },
  {
    path: '*',
    element: (
      <div className="min-h-screen bg-surface-bg flex items-center justify-center text-surface-muted">
        <div className="text-center">
          <div className="text-6xl mb-4">404</div>
          <div className="text-[14px]">Página no encontrada</div>
          <a href="/" className="mt-4 inline-block text-brand-orange hover:underline text-[12px]">
            Volver al inicio
          </a>
        </div>
      </div>
    ),
  },
])
