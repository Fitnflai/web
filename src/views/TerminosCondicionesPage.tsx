import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store/useAppStore'
import { useTranslation } from '@/i18n/useTranslation'
import { T } from '@/components/ui/Typography'
import { Footer } from '@/components/layout/Footer'
import { IconChevronDown } from '@tabler/icons-react'

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

export function TerminosCondicionesPage() {
  const navigate = useNavigate()
  const { language, setLanguage } = useAppStore()
  const { t } = useTranslation()

  const [isPlanesDropdownOpen, setIsPlanesDropdownOpen] = useState(false)
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false)

  const isSpanish = language === 'ES'

  const handlePortalEntry = (role: 'admin' | 'specialist') => {
    navigate('/descargar')
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans antialiased relative overflow-hidden">
      {/* Background Watermark */}
      <div 
        className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.08] bg-cover bg-center z-0"
        style={{ 
          backgroundImage: "url('/images/home-bg.png')",
          backgroundAttachment: 'fixed'
        }}
      />

      {/* Header */}
      <nav className="sticky top-0 z-50 bg-gray-900 bg-opacity-80 backdrop-blur-md shadow-lg border-b border-gray-900">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
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

          <div className="hidden md:flex space-x-8 items-center">
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

      {/* Main Content */}
      <main className="py-16 md:py-24 px-6 relative z-10">
        <div className="container mx-auto max-w-4xl bg-gray-900/40 backdrop-blur-md border border-gray-800/80 rounded-3xl p-8 md:p-12 shadow-2xl">
          
          {/* Header Title Section */}
          <div className="border-b border-gray-800 pb-8 mb-10 text-center md:text-left">
            <T.H1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight text-white leading-tight">
              {isSpanish ? 'TÉRMINOS Y CONDICIONES' : 'TERMS AND CONDITIONS'}
            </T.H1>
            <T.P className="text-orange-500 font-bold text-sm tracking-wide uppercase mb-2">
              {isSpanish ? 'TÉRMINOS Y CONDICIONES GENERALES DE USO DE FITNFLAI' : 'GENERAL TERMS AND CONDITIONS OF USE FOR FITNFLAI'}
            </T.P>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6 text-xs text-gray-400 font-medium">
              <span><strong>{isSpanish ? 'Operado por:' : 'Operated by:'}</strong> MEDICALHUB S.A.S. (en adelante, “FITNFLAI”)</span>
              <span><strong>{isSpanish ? 'Última actualización:' : 'Last update:'}</strong> {isSpanish ? 'Agosto 2026' : 'August 2026'}</span>
            </div>
          </div>

          {/* Legal Content */}
          <div className="space-y-8 text-sm md:text-base text-gray-300 leading-relaxed text-justify">
            
            <p>
              Bienvenido a FITNFLAI. Los presentes Términos y Condiciones de Uso (en adelante, los "Términos") regulan el acceso, registro y uso de la aplicación digital, sitio web y servicios móviles de FITNFLAI (en adelante, la "Aplicación"), de propiedad y operada por MEDICALHUB S.A.S., una compañía legalmente constituida en la República del Ecuador.
            </p>

            <p>
              Al registrarse, acceder o utilizar la Aplicación, usted (en adelante, el "Usuario") declara bajo juramento ser mayor de edad, contar con la capacidad legal suficiente y acepta quedar plenamente vinculado por los presentes Términos en su totalidad. Si no está de acuerdo con alguna de las disposiciones establecidas en este documento, le rogamos que se abstenga de registrarse o utilizar la plataforma.
            </p>

            {/* Sections */}
            <div className="border-t border-gray-800/60 pt-8 space-y-10">
              
              {/* PRIMERA */}
              <div>
                <h2 className="text-lg md:text-xl font-bold text-white mb-4 border-l-2 border-orange-500 pl-3">
                  PRIMERA. OBJETO Y DESCRIPCIÓN DEL SERVICIO
                </h2>
                <p>
                  FITNFLAI es una plataforma tecnológica orientada a brindar entrenamientos deportivos adaptativos. El servicio principal de la Aplicación consiste en la generación, actualización y seguimiento de rutinas y planes de entrenamiento físico personalizados, diseñados sobre la base de los datos antropométricos (como peso y altura), objetivos deportivos, disponibilidad de tiempo, días de entrenamiento, tipo de actividad física y equipamiento que el Usuario proporciona de manera voluntaria. El servicio está disponible bajo la modalidad de suscripciones gratuitas (Plan Básico) y de pago (Plan Premium), detalladas en la Cláusula Quinta.
                </p>
              </div>

              {/* SEGUNDA */}
              <div>
                <h2 className="text-lg md:text-xl font-bold text-white mb-4 border-l-2 border-orange-500 pl-3">
                  SEGUNDA. DESCARGO DE RESPONSABILIDAD MÉDICA Y DE SALUD (CRITICAL)
                </h2>
                <p className="mb-4">
                  <strong>FITNFLAI NO PRESTA SERVICIOS MÉDICOS, NO ES UN CENTRO DE SALUD, NO REALIZA DIAGNÓSTICOS CLÍNICOS, NO EMITE PRESCRIPCIONES TERAPÉUTICAS Y NO SUSTITUYE LA VALORACIÓN, CONSEJO O TRATAMIENTO DE UN PROFESIONAL DE LA SALUD CALIFICADO.</strong>
                </p>
                <div className="space-y-3 pl-2">
                  <p><strong>1. Finalidad Deportiva y de Bienestar:</strong> Los planes de entrenamiento generados por la Aplicación tienen un fin exclusivamente deportivo y de acondicionamiento físico. En ningún caso deben ser interpretados como tratamientos clínicos, rehabilitaciones de lesiones o recetas médicas.</p>
                  <p><strong>2. Tratamiento de Datos de Salud para Seguridad:</strong> Cualquier información que el Usuario comparta voluntariamente sobre su estado de salud, lesiones activas, dolores recurrentes o informes de composición corporal (como bioimpedancia o InBody) es procesada con el único y exclusivo fin de personalizar la rutina para su seguridad (por ejemplo, excluyendo ejercicios de alta carga o adaptando la intensidad). Esta información no constituye una historia clínica completa ni una herramienta diagnóstica.</p>
                  <p><strong>3. Responsabilidad del Usuario y Consulta Previa:</strong> Es responsabilidad exclusiva del Usuario evaluar su propia aptitud física antes de comenzar cualquier rutina. Si el Usuario presenta condiciones preexistentes, cardiopatías, cirugías recientes, embarazo, dolores crónicos o dudas sobre su estado físico, tiene la obligación y se le recomienda enfáticamente consultar con un profesional de la salud acreditado antes de iniciar cualquier entrenamiento.</p>
                  <p><strong>4. Asunción de Riesgos:</strong> La práctica de cualquier actividad física conlleva riesgos de lesiones. El Usuario asume voluntariamente dichos riesgos al realizar las rutinas y exime a MEDICALHUB S.A.S. de cualquier responsabilidad por complicaciones de salud derivadas de la omisión de consultas médicas previas, o de la inserción de datos inexactos o incompletos dentro de la Aplicación.</p>
                </div>
              </div>

              {/* TERCERA */}
              <div>
                <h2 className="text-lg md:text-xl font-bold text-white mb-4 border-l-2 border-orange-500 pl-3">
                  TERCERA. REQUISITOS DE CAPACIDAD Y REGISTRO DE CUENTA
                </h2>
                <p className="mb-4">
                  Para utilizar FITNFLAI y registrar una cuenta, se deben cumplir los siguientes requisitos:
                </p>
                <ul className="list-disc list-inside space-y-2 pl-2">
                  <li><strong>Mayoría de edad:</strong> El Usuario debe tener al menos dieciocho (18) años de edad cumplidos. FITNFLAI no recopila datos de menores de edad ni permite su registro.</li>
                  <li><strong>Veracidad de la información:</strong> El Usuario se compromete a ingresar información exacta, actual y verídica en su perfil, especialmente en lo que respecta a sus métricas físicas y antecedentes antropométricos.</li>
                  <li><strong>Seguridad de credenciales:</strong> Las credenciales de acceso (usuario y contraseña) son personales, confidenciales e intransferibles. El Usuario es el único responsable de mantener la confidencialidad de sus claves y de todas las actividades que ocurran bajo su cuenta. Ante sospechas de vulneraciones, debe notificar inmediatamente a FITNFLAI.</li>
                </ul>
              </div>

              {/* CUARTA */}
              <div>
                <h2 className="text-lg md:text-xl font-bold text-white mb-4 border-l-2 border-orange-500 pl-3">
                  CUARTA. PROTECCIÓN DE DATOS PERSONALES (LOPDP)
                </h2>
                <p>
                  De conformidad con la Ley Orgánica de Protección de Datos Personales (LOPDP) de la República del Ecuador, MEDICALHUB S.A.S. actúa como responsable del tratamiento de los datos del Usuario. Los datos antropométricos y de actividad física se procesan para la ejecución de la relación contractual, mientras que el tratamiento de datos sensibles de salud (lesiones, cirugías recientes o composición corporal) requiere su consentimiento explícito separado, el cual puede ser revocado en cualquier momento desde la Aplicación sin que ello afecte la prestación principal del servicio. Puede revisar el tratamiento detallado de sus datos en nuestra <strong>Política de Privacidad y de Protección de Datos Personales</strong>, así como ejercer sus derechos de acceso, rectificación, eliminación y oposición siguiendo nuestro <strong>Protocolo para el Ejercicio de Derechos de los Titulares</strong>.
                </p>
              </div>

              {/* QUINTA */}
              <div>
                <h2 className="text-lg md:text-xl font-bold text-white mb-4 border-l-2 border-orange-500 pl-3">
                  QUINTA. PLAN BÁSICO Y PLAN PREMIUM (PAGOS Y FACTURACIÓN)
                </h2>
                <p className="mb-4">
                  FITNFLAI ofrece dos modalidades de suscripción:
                </p>
                <div className="space-y-4 pl-2">
                  <p><strong>1. Plan Básico:</strong> Brinda acceso a las funcionalidades estándar de generación de perfiles y planes de entrenamiento, sujeto a limitaciones publicitarias o funcionales generales.</p>
                  <p><strong>2. Plan Premium (Suscripciones de Pago):</strong> Desbloquea herramientas adicionales de análisis, informes detallados, composición corporal avanzada, nutrición y acompañamiento. Las tarifas vigentes se publican de forma transparente en la sección de "Precios" de la plataforma.</p>
                  <p><strong>3. Pagos y Datos Financieros:</strong> El procesamiento de cobros de las suscripciones Premium se realiza mediante plataformas de pasarelas de pago de terceros especializadas (como Stripe, PayPal o las pasarelas de Google Play y Apple App Store). FITNFLAI no recopila ni almacena los datos de tarjetas de crédito o cuentas bancarias completas del Usuario; dicho tratamiento es gestionado de manera segura y directa por el proveedor financiero correspondiente.</p>
                </div>
              </div>

              {/* SEXTA */}
              <div>
                <h2 className="text-lg md:text-xl font-bold text-white mb-4 border-l-2 border-orange-500 pl-3">
                  SEXTA. VINCULACIÓN DE WEARABLES Y SERVICIOS DE TERCEROS
                </h2>
                <p>
                  La Aplicación permite a los usuarios conectar de manera voluntaria dispositivos inteligentes y relojes inteligentes (como Garmin, Strava, Apple Health, Huawei Health u otros wearables). El intercambio de datos (como calorías quemadas, pasos o frecuencia cardíaca) se realiza únicamente tras la autorización expresa del Usuario en su respectivo dispositivo. Una vez importados, el tratamiento se rige por la Política de Privacidad de FITNFLAI; no obstante, el funcionamiento de dichos dispositivos y el tratamiento que los terceros hagan antes de la importación se rige bajo sus respectivos términos independientes.
                </p>
              </div>

              {/* SÉPTIMA */}
              <div>
                <h2 className="text-lg md:text-xl font-bold text-white mb-4 border-l-2 border-orange-500 pl-3">
                  SÉPTIMA. PROPIEDAD INTELECTUAL
                </h2>
                <p>
                  Todos los contenidos de la Aplicación, incluidos los algoritmos de personalización de entrenamiento, código de software, diseños, logotipos, interfaces, textos, ilustraciones, bases de datos y marcas comerciales son de propiedad exclusiva de MEDICALHUB S.A.S. Queda terminantemente prohibido reproducir, distribuir, realizar ingeniería inversa, modificar o explotar de manera no autorizada cualquier componente de la plataforma sin el consentimiento previo y por escrito de FITNFLAI.
                </p>
              </div>

              {/* OCTAVA */}
              <div>
                <h2 className="text-lg md:text-xl font-bold text-white mb-4 border-l-2 border-orange-500 pl-3">
                  OCTAVA. USO ACEPTO Y PROHIBICIONES
                </h2>
                <p className="mb-4">
                  El Usuario se obliga a utilizar la plataforma con estricto apego a la ley, la moral y las buenas costumbres. Queda expresamente prohibido:
                </p>
                <ul className="list-disc list-inside space-y-2 pl-2">
                  <li>Registrar información de terceros o suplantar identidades de otros atletas.</li>
                  <li>Utilizar herramientas automáticas, bots, crawlers o scripts para extraer datos de la plataforma de forma masiva.</li>
                  <li>Introducir código malicioso, troyanos o virus destinados a alterar, vulnerar o dañar los servidores o la seguridad de FITNFLAI.</li>
                  <li>Utilizar las rutinas, consejos o planes con fines de lucro o comercialización comercial de manera independiente sin la debida licencia de FITNFLAI.</li>
                </ul>
              </div>

              {/* NOVENA */}
              <div>
                <h2 className="text-lg md:text-xl font-bold text-white mb-4 border-l-2 border-orange-500 pl-3">
                  NOVENA. SUSPENSIÓN Y TERMINACIÓN DE CUENTAS
                </h2>
                <p>
                  FITNFLAI se reserva el derecho de suspender de forma temporal, restringir o cancelar de manera definitiva y permanente el acceso a la cuenta de cualquier Usuario que incumpla las disposiciones de los presentes Términos, que realice actividades fraudulentas, falsifique información de salud, infrinja derechos de propiedad intelectual, o cuando se determine que el Usuario es menor de 18 años. Esta medida se aplicará de forma motivada para preservar la seguridad de la comunidad de atletas.
                </p>
              </div>

              {/* DÉCIMA */}
              <div>
                <h2 className="text-lg md:text-xl font-bold text-white mb-4 border-l-2 border-orange-500 pl-3">
                  DÉCIMA. MODIFICACIONES DE LOS TÉRMINOS
                </h2>
                <p>
                  FITNFLAI podrá actualizar o modificar los presentes Términos en cualquier momento para adaptarlos a mejoras operativas, cambios normativos o nuevas condiciones de servicio. Las modificaciones serán notificadas de manera oportuna a los usuarios mediante alertas dentro de la Aplicación o correo electrónico, indicando la fecha de última actualización. El uso continuado del servicio posterior a la notificación constituirá su conocimiento y aceptación.
                </p>
              </div>

              {/* DÉCIMA PRIMERA */}
              <div>
                <h2 className="text-lg md:text-xl font-bold text-white mb-4 border-l-2 border-orange-500 pl-3">
                  DÉCIMA PRIMERA. LEGISLACIÓN APLICABLE Y RESOLUCIÓN DE DISPUTAS
                </h2>
                <p>
                  Los presentes Términos se rigen e interpretan bajo las leyes de la República del Ecuador. Para cualquier controversia, disputa o reclamo derivado de la interpretación, validez o ejecución de los presentes Términos, el Usuario y FITNFLAI renuncian a su fuero y se someten a la resolución de tribunales competentes en la ciudad de Quito, Pichincha, República del Ecuador.
                </p>
              </div>

            </div>

          </div>

          {/* Bottom Action / Return Button */}
          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <T.P className="text-xs text-gray-500 text-center md:text-left">
              {isSpanish ? 'MEDICALHUB S.A.S. — Todos los derechos reservados.' : 'MEDICALHUB S.A.S. — All rights reserved.'}
            </T.P>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2.5 bg-gray-800 hover:bg-orange-500 text-white hover:text-white font-bold rounded-full transition-all duration-300 text-xs shadow-md border border-gray-700 hover:border-orange-500 hover:scale-105"
            >
              {isSpanish ? 'Volver al Inicio' : 'Return to Home'}
            </button>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
