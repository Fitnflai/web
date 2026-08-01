import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store/useAppStore'
import { toast } from '@/components/ui/Toast'
import { Eye, EyeOff, Mail, Lock, UserCheck } from 'lucide-react'
import { authService } from '@/services/endpoints/auth'

export function LoginPage() {
  const navigate = useNavigate()
  const { setUserRole, setPage, language } = useAppStore()
  const isSpanish = language === 'ES'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState<'admin' | 'specialist'>('admin')
  const [autoDetected, setAutoDetected] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  // Ensure clean authentication state on page load (removes ghost/stale sessions)
  useEffect(() => {
    localStorage.removeItem('access_token')
  }, [])

  // Auto-detect role based on email input
  useEffect(() => {
    const lower = email.toLowerCase()
    if (lower.includes('admin')) {
      setSelectedRole('admin')
      setAutoDetected(true)
    } else if (
      lower.includes('garcia') || 
      lower.includes('martinez') || 
      lower.includes('rodriguez') || 
      lower.includes('coach') || 
      lower.includes('especialista') ||
      lower.includes('doctor')
    ) {
      setSelectedRole('specialist')
      setAutoDetected(true)
    } else {
      setAutoDetected(false)
    }
  }, [email])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast.show(
        isSpanish ? 'Por favor completa todos los campos' : 'Please fill in all fields',
        'error'
      )
      return
    }

    setIsSubmitting(true)

    try {
      // Call live login API
      const res = await authService.login(email, password)

      // Store live JWT token
      localStorage.setItem('access_token', res.token.access_token)
      setUserRole(selectedRole)
      setPage(selectedRole === 'admin' ? 'dashboard' : 'dashboard-especialista')

      toast.show(
        isSpanish 
          ? `¡Sesión iniciada con éxito como ${selectedRole === 'admin' ? 'Administrador' : 'Especialista'}!` 
          : `Successfully logged in as ${selectedRole === 'admin' ? 'Administrator' : 'Specialist'}!`,
        'success'
      )

      navigate('/portal')
    } catch (error: any) {
      console.error('Login error detailed:', error)
      
      // Extract the detailed error message from the backend API response if present
      const detailedMsg = error.response?.data?.detail 
        ? (typeof error.response.data.detail === 'string' 
            ? error.response.data.detail 
            : JSON.stringify(error.response.data.detail))
        : (error.message || 'Error de conexión');

      toast.show(
        isSpanish 
          ? `Error de ingreso: ${detailedMsg}` 
          : `Login error: ${detailedMsg}`,
        'error'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans antialiased flex items-center justify-center relative px-4 overflow-hidden">
      {/* Dynamic Full-Width Artistic Line-Art Background */}
      <div
        className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.08] bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('/images/pricing-bg.png')",
          backgroundAttachment: 'fixed'
        }}
      />

      <div className="relative w-full max-w-md bg-[#141416]/80 border border-gray-800/80 rounded-3xl p-8 shadow-2xl backdrop-blur-md z-10 text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img 
            src="/images/logo.png" 
            alt="Fitnflai Logo" 
            className="h-10 object-contain transform hover:scale-105 transition-transform duration-300"
          />
        </div>

        <h2 className="text-xl font-bold mb-1 text-white leading-tight">
          {isSpanish ? '¡Bienvenido de vuelta!' : 'Welcome back!'}
        </h2>
        <p className="text-xs text-gray-400 mb-8">
          {isSpanish 
            ? 'Ingresa tus credenciales para acceder a la plataforma corporativa' 
            : 'Enter your credentials to access the corporate platform'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">
              {isSpanish ? 'Correo Electrónico' : 'Email Address'}
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-gray-500">
                <Mail size={16} />
              </span>
              <input 
                type="email"
                value={email}
                disabled={isSubmitting}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@fitnflai.com o garcia@fitnflai.com"
                className="w-full bg-[#0a0a0c]/80 border border-gray-800 focus:border-orange-500 rounded-xl py-3 pl-11 pr-4 text-sm text-white outline-none transition-colors disabled:opacity-50"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">
              {isSpanish ? 'Contraseña' : 'Password'}
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-gray-500">
                <Lock size={16} />
              </span>
              <input 
                type={showPassword ? 'text' : 'password'}
                value={password}
                disabled={isSubmitting}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0a0a0c]/80 border border-gray-800 focus:border-orange-500 rounded-xl py-3 pl-11 pr-11 text-sm text-white outline-none transition-colors disabled:opacity-50"
                required
              />
              <button 
                type="button"
                disabled={isSubmitting}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-gray-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Role selection & detection indicator */}
          <div className="space-y-2 pt-2 border-t border-gray-900">
            <div className="flex justify-between items-center">
              <label className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">
                {isSpanish ? 'Tipo de Usuario' : 'User Role'}
              </label>
              {autoDetected && (
                <span className={`inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                  selectedRole === 'admin' 
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                    : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                }`}>
                  <UserCheck size={10} /> {isSpanish ? 'Auto-detectado' : 'Auto-detected'}
                </span>
              )}
            </div>
            
            {/* Custom Role Toggles */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setSelectedRole('admin')}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold text-center border transition-all cursor-pointer ${
                  selectedRole === 'admin' 
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/40 shadow-[0_0_10px_rgba(59,130,246,0.1)]' 
                    : 'bg-[#0a0a0c]/40 text-gray-500 border-gray-800 hover:border-gray-700'
                }`}
              >
                {isSpanish ? 'Administrador' : 'Administrator'}
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setSelectedRole('specialist')}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold text-center border transition-all cursor-pointer ${
                  selectedRole === 'specialist' 
                    ? 'bg-purple-500/10 text-purple-400 border-purple-500/40 shadow-[0_0_10px_rgba(139,92,246,0.1)]' 
                    : 'bg-[#0a0a0c]/40 text-gray-500 border-gray-800 hover:border-gray-700'
                }`}
              >
                {isSpanish ? 'Especialista' : 'Specialist'}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm rounded-xl transition-all shadow-lg hover:scale-[1.02] tracking-wider uppercase cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting 
              ? (isSpanish ? 'Iniciando sesión...' : 'Signing In...')
              : (isSpanish ? 'Ingresar' : 'Sign In')}
          </button>
        </form>

        {/* Support Link */}
        <p className="text-[10px] text-gray-500 mt-6 leading-relaxed">
          {isSpanish 
            ? 'Para soporte corporativo contacta a soporte@fitnflai.com' 
            : 'For corporate support contact support@fitnflai.com'}
        </p>
      </div>
    </div>
  )
}
