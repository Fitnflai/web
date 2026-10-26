import { useState } from 'react'
import {
  IconMail,
  IconSend,
  IconCheck,
  IconCopy,
  IconMessageCircle,
  IconUser,
  IconHelpCircle,
  IconAlertCircle,
} from '@tabler/icons-react'
import { useTranslation } from '@/i18n/useTranslation'
import { useAppStore } from '@/store/useAppStore'

const SUPPORT_EMAIL = 'info@fitnflai.com'

export function SupportForm() {
  const { language } = useAppStore()
  const isSpanish = language === 'ES'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [category, setCategory] = useState(
    isSpanish ? 'Soporte Técnico / Error en la App' : 'Technical Support / App Issue'
  )
  const [message, setMessage] = useState('')

  const [copied, setCopied] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const categories = isSpanish
    ? [
        'Soporte Técnico / Error en la App',
        'Facturación o Suscripción',
        'Consulta sobre Planes y Especialistas',
        'Dispositivos y Sincronización (Garmin, Strava, Apple)',
        'Otro motivo',
      ]
    : [
        'Technical Support / App Issue',
        'Billing or Subscription',
        'Plans & Specialists Inquiry',
        'Devices & Sync (Garmin, Strava, Apple)',
        'Other Inquiry',
      ]

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(SUPPORT_EMAIL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMessage(
        isSpanish
          ? 'Por favor completa todos los campos requeridos.'
          : 'Please fill in all required fields.'
      )
      return
    }

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage(
        isSpanish
          ? 'Por favor ingresa un correo electrónico válido.'
          : 'Please enter a valid email address.'
      )
      return
    }

    const subject = `[Soporte Fitnflai] ${category} - ${name.trim()}`
    const body = `Hola equipo de Fitnflai,

Solicitud de asistencia de:
• Nombre: ${name.trim()}
• Correo de contacto: ${email.trim()}
• Categoría: ${category}
• Fecha: ${new Date().toLocaleString()}

Mensaje / Descripción del problema:
${message.trim()}

---
Enviado desde el formulario de soporte web de Fitnflai.`

    const mailtoUrl = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`

    // Trigger user's mail client
    window.location.href = mailtoUrl
    setSubmitted(true)
  }

  return (
    <div className="w-full bg-gray-900/80 border border-gray-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-sm">
      {/* Decorative accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

      {submitted ? (
        <div className="text-center py-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
            <IconCheck size={32} />
          </div>

          <h3 className="text-2xl font-extrabold text-white">
            {isSpanish ? '¡Mensaje preparado para envío!' : 'Support Request Prepared!'}
          </h3>

          <p className="text-gray-300 text-sm max-w-lg mx-auto leading-relaxed">
            {isSpanish ? (
              <>
                Se ha generado tu solicitud y abierto tu gestor de correo predeterminado dirigido a{' '}
                <strong className="text-orange-400 font-mono">{SUPPORT_EMAIL}</strong>. Si tu cliente
                de correo no abrió automáticamente, puedes enviárnoslo directamente a esa dirección.
              </>
            ) : (
              <>
                Your message has been formatted and opened in your email client directed to{' '}
                <strong className="text-orange-400 font-mono">{SUPPORT_EMAIL}</strong>. If your client
                did not open automatically, you can email us directly.
              </>
            )}
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <button
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-bold transition border border-gray-700"
            >
              {copied ? <IconCheck size={16} className="text-emerald-400" /> : <IconCopy size={16} />}
              <span>{copied ? (isSpanish ? '¡Copiado!' : 'Copied!') : (isSpanish ? 'Copiar correo' : 'Copy Email')}</span>
            </button>

            <button
              onClick={() => {
                setSubmitted(false)
                setMessage('')
              }}
              className="px-5 py-2.5 rounded-xl bg-brand-orange hover:bg-orange-600 text-white text-xs font-bold transition"
            >
              {isSpanish ? 'Enviar otra consulta' : 'Send Another Request'}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-6">
            <div>
              <span className="text-xs font-extrabold text-brand-orange uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <IconMessageCircle size={16} />
                {isSpanish ? 'Canal Oficial de Asistencia' : 'Official Assistance Channel'}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {isSpanish ? 'Escríbenos a Soporte' : 'Contact Support'}
              </h3>
            </div>

            <div className="flex items-center gap-2 bg-gray-950/70 border border-gray-800 px-3.5 py-2 rounded-xl text-xs text-gray-300">
              <IconMail size={16} className="text-brand-orange shrink-0" />
              <span className="font-mono text-gray-200">{SUPPORT_EMAIL}</span>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="ml-1 p-1 hover:text-white text-gray-400 transition"
                title="Copiar correo"
              >
                {copied ? <IconCheck size={14} className="text-emerald-400" /> : <IconCopy size={14} />}
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <IconAlertCircle size={16} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">
                {isSpanish ? 'Nombre completo *' : 'Full Name *'}
              </label>
              <div className="relative flex items-center">
                <IconUser size={16} className="absolute left-3 text-gray-500 pointer-events-none" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isSpanish ? 'Ej. Juan Pérez' : 'e.g. John Doe'}
                  className="w-full bg-gray-950/90 border border-gray-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">
                {isSpanish ? 'Correo electrónico *' : 'Email Address *'}
              </label>
              <div className="relative flex items-center">
                <IconMail size={16} className="absolute left-3 text-gray-500 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="w-full bg-gray-950/90 border border-gray-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition"
                />
              </div>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1.5">
              {isSpanish ? 'Motivo de consulta / Asunto' : 'Subject / Reason for Inquiry'}
            </label>
            <div className="relative flex items-center">
              <IconHelpCircle size={16} className="absolute left-3 text-gray-500 pointer-events-none" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-gray-950/90 border border-gray-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c} value={c} className="bg-gray-900 text-white">
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1.5">
              {isSpanish ? '¿Cómo podemos ayudarte? Detalla tu consulta *' : 'How can we help you? Describe your issue *'}
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                isSpanish
                  ? 'Describe qué ocurrió, en qué dispositivo o plan estás, o qué duda tienes...'
                  : 'Describe what happened, what device or plan you have, or what you need...'
              }
              className="w-full bg-gray-950/90 border border-gray-800 rounded-xl p-3.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition leading-relaxed resize-none"
            />
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <p className="text-[11px] text-gray-500 leading-normal max-w-sm">
              {isSpanish
                ? 'Respondemos todas las consultas en un plazo promedio de 12 a 24 horas hábiles.'
                : 'We respond to all inquiries within 12 to 24 business hours.'}
            </p>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-brand-orange hover:bg-orange-600 text-white text-xs font-bold transition shadow-lg shadow-orange-500/20 cursor-pointer"
            >
              <IconSend size={15} />
              <span>{isSpanish ? 'Enviar a info@fitnflai.com' : 'Send to info@fitnflai.com'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
