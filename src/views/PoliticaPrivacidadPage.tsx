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

export function PoliticaPrivacidadPage() {
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
              {isSpanish ? 'POLÍTICA DE PRIVACIDAD' : 'PRIVACY POLICY'}
            </T.H1>
            <T.P className="text-orange-500 font-bold text-sm tracking-wide uppercase mb-2">
              {isSpanish ? 'Y DE PROTECCIÓN DE DATOS PERSONALES DE LA APLICACIÓN FITNFLAI' : 'AND PERSONAL DATA PROTECTION OF THE FITNFLAI APPLICATION'}
            </T.P>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6 text-xs text-gray-400 font-medium">
              <span><strong>{isSpanish ? 'Responsable:' : 'Controller:'}</strong> MEDICALHUB S.A.S. (en adelante, “FITNFLAI”)</span>
              <span><strong>{isSpanish ? 'Última actualización:' : 'Last update:'}</strong> {isSpanish ? 'Agosto 2026' : 'August 2026'}</span>
            </div>
          </div>

          {/* Legal Content */}
          <div className="space-y-8 text-sm md:text-base text-gray-300 leading-relaxed text-justify">
            
            {/* General Intro Paragraphs */}
            <p>
              FITNFLAI es una aplicación digital (en adelante, la "Aplicación") operada por MEDICALHUB S.A.S., orientada a ayudar a sus usuarios a entrenar de forma más inteligente, mediante la generación de rutinas y planes de entrenamiento personalizados a partir de la información física, de actividad y de preferencias que estos proporcionan y, cuando el Usuario lo autoriza expresamente, de determinada información relacionada con su condición de salud. La Aplicación permite, entre otras funcionalidades: crear un perfil; realizar una evaluación inicial; generar y actualizar planes de entrenamiento, cuya duración serán definidos por los usuarios en función de los objetivos y características definidos; registrar evaluaciones y tests periódicos; conectar dispositivos inteligentes (wearables); generar reportes semanales de progreso; vincular redes sociales; y acceder a los módulos de nutrición, progreso y configuración de cuenta, todo ello en las modalidades de Plan Básico y Plan Premium.
            </p>

            <p>
              FITNFLAI no presta servicios médicos, no realiza diagnósticos clínicos, no sustituye la valoración de un profesional de la salud y no está diseñada para el tratamiento, monitoreo o gestión de condiciones médicas. La información relativa a lesiones, cirugías, dolores crónicos o recurrentes, diagnósticos cardiovasculares e informes de bioimpedancia (InBody u otros) se solicita exclusivamente con fines de personalización y seguridad del entrenamiento (esto es, para adaptar o excluir ejercicios y ajustar la intensidad del plan) y no debe considerarse, ni será tratada, como un historial clínico completo o como una herramienta de diagnóstico. Se recomienda a todo Usuario que presente una condición de salud preexistente, o que tenga dudas sobre su aptitud física para el ejercicio, consultar previamente con un profesional de la salud antes de iniciar cualquier plan de entrenamiento generado por la Aplicación.
            </p>

            <p>
              En el marco de la presente Política, FITNFLAI actúa como responsable del tratamiento de todos los datos personales tratados a través de la Aplicación, incluyendo los datos de salud referidos en el párrafo anterior, dado que no existen profesionales o establecimientos de salud terceros que determinen las finalidades o los medios de dicho tratamiento dentro de la plataforma. Lo anterior, de conformidad con la Ley Orgánica de Protección de Datos Personales (en adelante, la "LOPDP"), su reglamento general y demás normativa aplicable en el Ecuador.
            </p>

            {/* Sections */}
            <div className="border-t border-gray-800/60 pt-8 space-y-10">
              
              {/* PRIMERA */}
              <div>
                <h2 className="text-lg md:text-xl font-bold text-white mb-4 border-l-2 border-orange-500 pl-3">
                  PRIMERA. TÉRMINOS Y DEFINICIONES
                </h2>
                <p className="mb-4">
                  Para efectos de la presente Política se aplicarán las definiciones establecidas en la LOPDP y su reglamento. Sin perjuicio de ello, y en atención al contexto específico de FITNFLAI, se establecen las siguientes definiciones operativas:
                </p>
                <ul className="list-disc list-inside space-y-2 pl-2">
                  <li><strong>Aplicación, App o FITNFLAI:</strong> Aplicación digital (web y/o móvil) que permite a los usuarios registrarse, crear un perfil, realizar una evaluación inicial, generar y seguir planes de entrenamiento, registrar evaluaciones periódicas, conectar dispositivos inteligentes y redes sociales, y acceder a los módulos de nutrición, progreso y configuración.</li>
                  <li><strong>Usuario o Titular:</strong> Persona natural mayor de edad que se registra y utiliza FITNFLAI.</li>
                  <li><strong>Datos personales:</strong> Toda información que identifica o hace identificable a una persona natural, directa o indirectamente.</li>
                  <li><strong>Datos de salud o sensibles:</strong> Información relativa a lesiones activas, cirugías recientes, dolores crónicos o recurrentes, diagnósticos de condiciones cardiovasculares, e informes de composición corporal o bioimpedancia (InBody u otros) cargados por el usuario, cuyo tratamiento indebido puede afectar los derechos fundamentales del titular.</li>
                  <li><strong>Datos antropométricos y de actividad física:</strong> Peso, altura, ciudad, altitud, frecuencia y tipo de actividad física, disponibilidad de tiempo, equipamiento disponible y días preferidos de entrenamiento.</li>
                  <li><strong>Evaluación o examen diagnóstico inicial:</strong> Cuestionario inicial de un par de minutos mediante el cual se recopila información relevante para el diseño del primer plan de entrenamiento.</li>
                  <li><strong>Plan de entrenamiento:</strong> Programa de ejercicios personalizado, generado a partir de la información proporcionada por el usuario, con una duración que varía dependiendo del usuario.</li>
                  <li><strong>Dispositivos conectados o wearables:</strong> Relojes inteligentes u otros dispositivos que el usuario puede vincular a su cuenta para el registro de datos como calorías, pasos, frecuencia cardíaca u otras métricas de actividad.</li>
                  <li><strong>Reporte semanal / test / evaluación periódica:</strong> Registros generados por la app o completados por el usuario para medir el progreso, la adherencia y el esfuerzo percibido (RPE) respecto del plan de entrenamiento.</li>
                  <li><strong>Plan Básico y Plan Premium:</strong> Modalidades de suscripción a la app. El Plan Premium desbloquea funcionalidades adicionales de experiencia de usuario, sin que ello implique un tratamiento de datos personales bajo estándares de protección distintos a los aquí establecidos.</li>
                  <li><strong>Responsable del tratamiento:</strong> Persona natural o jurídica que decide sobre la finalidad y los medios del tratamiento de datos personales; en el contexto de FITNFLAI, dicho rol corresponde a FITNFLAI.</li>
                  <li><strong>Encargado del tratamiento:</strong> Persona natural o jurídica que trata datos personales por cuenta de FITNFLAI, conforme a sus instrucciones documentadas (por ejemplo, proveedores de infraestructura tecnológica).</li>
                  <li><strong>Credenciales de acceso:</strong> Usuario, contraseña u otros mecanismos que permiten autenticar a un usuario dentro de la plataforma.</li>
                  <li><strong>Incidente de seguridad:</strong> Cualquier evento que comprometa o pueda comprometer la confidencialidad, integridad, disponibilidad o autenticidad de los datos personales tratados en la plataforma.</li>
                </ul>
              </div>

              {/* SEGUNDA */}
              <div>
                <h2 className="text-lg md:text-xl font-bold text-white mb-4 border-l-2 border-orange-500 pl-3">
                  SEGUNDA. FINALIDADES DEL TRATAMIENTO
                </h2>
                <p className="mb-4">
                  Los datos personales tratados a través de FITNFLAI serán utilizados para las siguientes finalidades determinadas, explícitas y legítimas:
                </p>
                <div className="space-y-4 pl-2">
                  <p><strong>a) Gestión de la cuenta y del perfil del usuario:</strong> Registro, creación, verificación y administración de la cuenta; autenticación y control de acceso a la plataforma; actualización y gestión de la información de perfil (nickname, ciudad, datos identificativos).</p>
                  <p><strong>b) Personalización de rutinas y planes de entrenamiento:</strong> Análisis de datos antropométricos (peso, altura, ciudad, altitud), de actividad física (frecuencia, tiempo, equipamiento disponible, días preferidos) y de objetivos (mejorar movilidad, ganar masa muscular, entre otros); diseño, ajuste y actualización del plan de entrenamiento, con una duración de hasta 52 semanas; procesamiento de las respuestas del examen diagnóstico inicial.</p>
                  <p><strong>c) Evaluación de aptitud física y seguridad del entrenamiento (datos sensibles):</strong> Recopilación de información general sobre lesiones activas, cirugías recientes, dolores crónicos o recurrentes y diagnósticos de condiciones cardiovasculares, exclusivamente con el fin de adaptar, excluir o ajustar ejercicios y niveles de intensidad; procesamiento de informes de bioimpedancia o composición corporal (InBody u otros) cargados voluntariamente por el usuario, para personalizar el plan. Estas finalidades requieren el consentimiento explícito, previo, libre, específico e informado del titular, conforme a lo previsto en la Cláusula Cuarta. En ningún caso esta información será utilizada con fines de marketing, publicidad o perfilamiento comercial.</p>
                  <p><strong>d) Seguimiento de progreso y evaluaciones periódicas:</strong> Registro de reportes semanales, tests, evaluaciones periódicas y del esfuerzo percibido (RPE) por el usuario; registro de si el usuario completó o no las sesiones de entrenamiento, con fines de ajuste del plan.</p>
                  <p><strong>e) Conexión con dispositivos inteligentes (wearables):</strong> Recepción e integración de datos como calorías, pasos, frecuencia cardíaca u otras métricas provistas por el dispositivo que el usuario decida vincular.</p>
                  <p><strong>f) Conexión con redes sociales:</strong> Vinculación de cuentas de redes sociales que el usuario decida conectar, para las funcionalidades habilitadas por dicha integración.</p>
                  <p><strong>g) Marketing y comunicaciones comerciales:</strong> Envío de comunicaciones sobre novedades, promociones, planes premium u otra información comercial de FITNFLAI o de terceros aliados; segmentación general de usuarios con base en datos de uso, identificativos y de suscripción (nunca con base en datos de salud). Esta finalidad requiere consentimiento separado, expreso y revocable en cualquier momento, sin que ello afecte la prestación del servicio principal.</p>
                  <p><strong>h) Seguridad de la información y de la plataforma:</strong> Monitoreo de accesos, prevención de accesos no autorizados y gestión de incidentes de seguridad.</p>
                  <p><strong>i) Mejora del servicio y experiencia del usuario:</strong> Análisis del uso de la plataforma y desarrollo de mejoras tecnológicas, incluyendo la diferenciación entre Plan Básico y Plan Premium.</p>
                  <p><strong>j) Gestión de la suscripción y facturación del Plan Premium:</strong> Procesamiento de pagos (a través de proveedores de pago especializados), gestión de la suscripción y soporte relacionado.</p>
                  <p><strong>k) Recordatorios y notificaciones:</strong> Envío de recordatorios de entrenamiento y notificaciones push relacionadas con el uso del servicio.</p>
                  <p><strong>l) Generación de estadísticas y mejora del servicio:</strong> Análisis agregado del uso de la plataforma para mejorar funcionalidades y desarrollar nuevas características.</p>
                  <p><strong>m) Seguridad de la información y de la plataforma de la App.</strong></p>
                  <p><strong>n) Cumplimiento de obligaciones legales:</strong> Atención de requerimientos de autoridades competentes y gestión de solicitudes de derechos de los titulares.</p>
                </div>
                <p className="mt-4 text-xs text-orange-500 font-semibold">
                  Limitación de finalidad: los datos personales no serán tratados para finalidades distintas a las descritas, salvo que exista una base jurídica que lo legitime conforme a la normativa aplicable.
                </p>
              </div>

              {/* TERCERA */}
              <div>
                <h2 className="text-lg md:text-xl font-bold text-white mb-4 border-l-2 border-orange-500 pl-3">
                  TERCERA. CATEGORÍAS DE DATOS PERSONALES TRATADOS
                </h2>
                <ul className="list-disc list-inside space-y-3 pl-2">
                  <li><strong>Datos identificativos:</strong> nombres, apellidos, fecha de nacimiento, género, nickname o apodo, correo electrónico, número telefónico y ciudad.</li>
                  <li><strong>Datos antropométricos y de entrenamiento:</strong> peso, altura, altitud de la ciudad de residencia, nivel y frecuencia de actividad física, tiempo disponible, equipamiento con el que cuenta el usuario y días preferidos para entrenar.</li>
                  <li><strong>Datos de salud (sensibles):</strong> existencia y descripción general de lesiones activas, cirugías recientes, dolores crónicos o recurrentes, diagnósticos de condiciones cardiovasculares, e informes de bioimpedancia o composición corporal (InBody u otros) cargados por el usuario.</li>
                  <li><strong>Datos de evaluación y desempeño:</strong> respuestas del examen diagnóstico inicial, objetivos de entrenamiento, resultados de tests y evaluaciones periódicas, nivel de esfuerzo percibido (RPE), grado de cumplimiento de las sesiones y reportes semanales de progreso.</li>
                  <li><strong>Datos de dispositivos conectados:</strong> calorías, pasos, frecuencia cardíaca y demás métricas provistas por wearables u otros dispositivos vinculados por el usuario.</li>
                  <li><strong>Datos de redes sociales:</strong> información básica de perfil provista por la red social que el usuario decida conectar (por ejemplo, nombre y foto de perfil), conforme a las autorizaciones otorgadas en dicha red.</li>
                  <li><strong>Datos digitales y técnicos:</strong> dirección IP, fecha y hora de acceso, tipo de dispositivo, sistema operativo, navegador, ubicación geográfica (cuando esté habilitada), cookies técnicas y logs de actividad.</li>
                  <li><strong>Datos de suscripción y facturación:</strong> plan contratado (Básico o Premium), historial de pagos, sin que FITNFLAI almacene los datos completos de la tarjeta de pago, los cuales son procesados por el proveedor de pagos correspondiente.</li>
                </ul>
              </div>

              {/* CUARTA */}
              <div>
                <h2 className="text-lg md:text-xl font-bold text-white mb-4 border-l-2 border-orange-500 pl-3">
                  CUARTA. BASES LEGALES DEL TRATAMIENTO
                </h2>
                <p className="mb-4">
                  El tratamiento de datos personales realizado a través de FITNFLAI se fundamenta en:
                </p>
                <ul className="list-disc list-inside space-y-2 pl-2">
                  <li><strong>Ejecución de la relación contractual:</strong> para la creación y gestión de la cuenta, la autenticación, el uso de las funcionalidades de la app y la generación de planes de entrenamiento a partir de datos antropométricos y de actividad física no sensibles.</li>
                  <li><strong>Consentimiento explícito del titular:</strong> para el tratamiento de datos de salud (lesiones, cirugías, dolores crónicos, diagnósticos cardiovasculares e informes de bioimpedancia), el cual es previo, libre, específico, informado, inequívoco y revocable en cualquier momento. Asimismo, aplica para el envío de comunicaciones de marketing y publicidad, revocable en cualquier momento sin afectar el servicio principal.</li>
                  <li><strong>Ejecución contractual:</strong> para el procesamiento de pagos y gestión de la suscripción al Plan Premium.</li>
                  <li><strong>Interés legítimo de FITNFLAI:</strong> para la detección y prevención de fraude, la seguridad de la plataforma y la generación de estadísticas agregadas, siempre que no prevalezcan los derechos y libertades del Titular.</li>
                  <li><strong>Cumplimiento de obligaciones legales:</strong> para la atención de requerimientos de autoridades competentes y el ejercicio de derechos de los titulares.</li>
                </ul>
                <p className="mt-4 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl text-xs md:text-sm text-gray-300">
                  <strong>Consecuencia de la negativa o revocatoria del consentimiento sobre datos de salud:</strong> el Usuario podrá utilizar FITNFLAI sin proporcionar dicha información; sin embargo, el plan de entrenamiento generado no podrá considerar dichas condiciones para efectos de ajuste o exclusión de ejercicios, por lo que el Usuario asume la responsabilidad de evaluar su propia aptitud física o de consultar a un profesional de la salud antes de entrenar.
                </p>
                <p className="mt-4 text-xs text-gray-400 italic">
                  Todos los tratamientos se realizan respetando los principios de licitud, lealtad, transparencia, minimización y limitación de la finalidad.
                </p>
              </div>

              {/* QUINTA */}
              <div>
                <h2 className="text-lg md:text-xl font-bold text-white mb-4 border-l-2 border-orange-500 pl-3">
                  QUINTA. DESTINATARIOS Y TRANSFERENCIAS DE DATOS
                </h2>
                <p className="mb-4">
                  Para el funcionamiento de la Aplicación y el cumplimiento de las finalidades descritas en esta Política, FITNFLAI podrá permitir el acceso, comunicar o transferir datos personales a las siguientes categorías de destinatarios:
                </p>
                <div className="space-y-4 pl-2">
                  <p><strong>a)</strong> Proveedores de infraestructura tecnológica, incluidos servicios de alojamiento en la nube, almacenamiento, respaldo, mantenimiento, soporte técnico, ciberseguridad y gestión de incidencias, en la medida estrictamente necesaria para garantizar el funcionamiento, disponibilidad y seguridad de la Aplicación.</p>
                  <p><strong>b)</strong> Proveedores de analítica y medición, para obtener información estadística sobre el uso, rendimiento y funcionamiento de la Aplicación, siempre que exista una base de legitimación aplicable y se apliquen medidas de minimización, agregación o seudonimización cuando resulte procedente.</p>
                  <p><strong>c)</strong> Proveedores de autenticación, notificaciones y distribución, incluidos, según las funcionalidades utilizadas, Firebase, Google y Apple, para gestionar el registro o inicio de sesión, enviar notificaciones, prestar servicios tecnológicos o distribuir la Aplicación mediante sus respectivas tiendas.</p>
                  <p><strong>d)</strong> Plataformas de redes sociales, incluida Meta, únicamente cuando el Usuario decida vincular voluntariamente su cuenta o utilizar las funcionalidades de autenticación ofrecidas por dichas plataformas. Antes de realizar esta vinculación, se informará al Usuario sobre los datos que serán compartidos o recibidos.</p>
                  <p><strong>e)</strong> Proveedores de dispositivos inteligentes y plataformas de salud o actividad física, cuando el Usuario autorice expresamente su vinculación con la Aplicación. En estos casos, se intercambiarán únicamente los datos necesarios para prestar la funcionalidad solicitada. Cada tercero será responsable de los tratamientos que realice por cuenta propia conforme a sus respectivas políticas de privacidad, sin perjuicio de las obligaciones que correspondan a FITNFLAI respecto de los tratamientos efectuados bajo su responsabilidad.</p>
                  <p><strong>f)</strong> Proveedores de servicios de pago y facturación, para gestionar el cobro de las suscripciones, validar las transacciones, prevenir operaciones fraudulentas, emitir los comprobantes correspondientes y atender solicitudes de devolución o reclamos.</p>
                  <p><strong>g)</strong> Asesores profesionales, auditores y proveedores especializados, cuando su intervención sea necesaria para el cumplimiento de obligaciones legales, contractuales, contables, tributarias, técnicas o de seguridad, sujetos a deberes de confidencialidad y protección de datos personales.</p>
                  <p><strong>h)</strong> Autoridades administrativas, judiciales, tributarias o de control, cuando la comunicación sea necesaria para cumplir una obligación legal, una orden judicial o un requerimiento válido emitido por autoridad competente.</p>
                </div>
                <p className="mt-4">
                  Los proveedores que traten datos personales por cuenta de FITNFLAI actuarán como encargados del tratamiento y deberán hacerlo exclusivamente conforme a sus instrucciones documentadas, dentro de los límites de la finalidad contratada y bajo obligaciones de confidencialidad, seguridad, devolución o eliminación de la información y demás condiciones exigidas por la normativa aplicable. Cuando un tercero determine autónomamente los fines y medios de su tratamiento, actuará como responsable independiente y deberá cumplir las obligaciones que le correspondan conforme a la legislación aplicable.
                </p>
                <p className="mt-4">
                  Algunos destinatarios podrán encontrarse o almacenar información fuera del Ecuador. En consecuencia, podrán producirse transferencias internacionales de datos personales. FITNFLAI verificará, antes de efectuarlas, que exista un mecanismo habilitante y garantías adecuadas de protección, tales como decisiones de nivel adecuado, instrumentos jurídicamente vinculantes, cláusulas contractuales, normas corporativas vinculantes, consentimiento explícito cuando legalmente corresponda u otros mecanismos reconocidos por la LOPDP, su Reglamento General y las disposiciones emitidas por la Autoridad de Protección de Datos Personales.
                </p>
                <p className="mt-4">
                  FITNFLAI aplicará medidas técnicas, organizativas y contractuales razonables para preservar la confidencialidad, integridad y disponibilidad de los datos transferidos, y realizará las verificaciones necesarias sobre los proveedores involucrados, atendiendo a la naturaleza de la información y a los riesgos del tratamiento.
                </p>
                <p className="mt-4 text-orange-500 font-bold">
                  FITNFLAI no vende ni comercializa los datos personales de los Usuarios.
                </p>
              </div>

              {/* SEXTA */}
              <div>
                <h2 className="text-lg md:text-xl font-bold text-white mb-4 border-l-2 border-orange-500 pl-3">
                  SEXTA. PAGOS, SUSCRIPCIONES Y FACTURACIÓN
                </h2>
                <p>
                  Los pagos correspondientes a la suscripción del Plan Premium serán procesados por proveedores externos de servicios de pago o, cuando corresponda, por las tiendas de aplicaciones de Google o Apple.
                </p>
                <p className="mt-3">
                  FITNFLAI no almacena ni tiene acceso a los datos completos de las tarjetas de crédito o débito del Usuario. Esta información es recopilada, procesada y custodiada directamente por el proveedor de pagos correspondiente, bajo sus propias medidas de seguridad y conforme a la normativa aplicable.
                </p>
              </div>

              {/* SÉPTIMA */}
              <div>
                <h2 className="text-lg md:text-xl font-bold text-white mb-4 border-l-2 border-orange-500 pl-3">
                  SÉPTIMA. DERECHOS DE LOS TITULARES
                </h2>
                <p className="mb-4">
                  Los titulares podrán ejercer ante FITNFLAI, respecto de los tratamientos realizados bajo su responsabilidad, los derechos reconocidos en la Ley Orgánica de Protección de Datos Personales, entre ellos:
                </p>
                <div className="space-y-4 pl-2">
                  <p><strong>a) Derecho de información:</strong> conocer de manera clara, transparente y accesible cómo y para qué se tratan sus datos personales.</p>
                  <p><strong>b) Derecho de acceso:</strong> conocer y obtener información sobre los datos personales que FITNFLAI mantiene y trata.</p>
                  <p><strong>c) Derecho de rectificación y actualización:</strong> solicitar la corrección o actualización de datos personales inexactos, incompletos o desactualizados.</p>
                  <p><strong>d) Derecho de eliminación:</strong> solicitar la supresión de sus datos personales, incluidos los datos de salud proporcionados voluntariamente, cuando se cumplan las condiciones previstas en la normativa aplicable.</p>
                  <p><strong>e) Derecho de oposición:</strong> oponerse al tratamiento de sus datos personales en los casos establecidos por la ley, especialmente cuando estos sean utilizados para actividades de marketing directo.</p>
                  <p><strong>f) Derecho a la suspensión o limitación del tratamiento:</strong> solicitar que el tratamiento de sus datos sea suspendido o limitado mientras se verifica la exactitud de la información, la legitimidad del tratamiento o la procedencia de una solicitud previamente presentada.</p>
                  <p><strong>g) Derecho a la portabilidad:</strong> recibir sus datos personales en un formato estructurado, de uso común, interoperable y lectura mecánica, o solicitar su transmisión a otro responsable, cuando sea técnicamente posible y legalmente procedente.</p>
                  <p><strong>h) Derecho a no ser objeto de decisiones basadas única o parcialmente en valoraciones automatizadas:</strong> solicitar información, presentar observaciones, requerir la intervención humana y cuestionar decisiones automatizadas o perfiles que produzcan efectos jurídicos o afecten significativamente sus derechos.</p>
                  <p><strong>i) Derecho a revocar el consentimiento:</strong> retirar en cualquier momento el consentimiento otorgado, especialmente respecto del tratamiento de datos de salud, la vinculación con dispositivos o plataformas de terceros y el envío de comunicaciones comerciales. La revocatoria no afectará la licitud de los tratamientos realizados con anterioridad a su retiro.</p>
                </div>

                <div className="mt-6 border-t border-gray-800/40 pt-4">
                  <h3 className="font-bold text-white mb-3">{isSpanish ? 'Procedimiento para ejercer los derechos' : 'Procedure to exercise rights'}</h3>
                  <p className="mb-4">
                    Las solicitudes deberán enviarse al correo electrónico señalado en la Cláusula Décima Octava y contener, al menos:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 pl-2 mb-4">
                    <li>Nombres y apellidos del titular.</li>
                    <li>Identificación del derecho que desea ejercer.</li>
                    <li>Descripción clara de la solicitud.</li>
                    <li>Datos de contacto para recibir la respuesta.</li>
                    <li>Documentación de respaldo, cuando resulte necesaria.</li>
                  </ul>
                  <p className="mb-4">
                    FITNFLAI podrá solicitar información adicional únicamente cuando sea indispensable para verificar razonablemente la identidad del solicitante, aclarar el alcance de la petición o impedir el acceso no autorizado a datos personales. Cuando la solicitud sea presentada por un representante, deberá acreditarse la representación conforme a la normativa aplicable.
                  </p>
                  <p className="mb-4">
                    Las solicitudes serán atendidas de manera gratuita, clara y motivada, dentro de los plazos establecidos en la LOPDP y demás normativa aplicable. Cuando una solicitud sea negada total o parcialmente, FITNFLAI comunicará al titular las razones jurídicas y técnicas que sustenten su decisión, así como los mecanismos disponibles para presentar un reclamo.
                  </p>
                  <p className="mb-4">
                    El titular podrá presentar una reclamación ante la Superintendencia de Protección de Datos Personales cuando considere que el tratamiento de sus datos personales vulnera la normativa aplicable o que su solicitud no ha sido atendida adecuadamente.
                  </p>
                  <p className="text-xs text-gray-400 italic">
                    <strong>Limitaciones:</strong> el ejercicio de los derechos podrá estar sujeto a limitaciones cuando exista una obligación legal de conservar los datos, se afecten derechos de terceros, o se trate de información que deba mantenerse por razones de interés público o cumplimiento normativo. Estas limitaciones serán aplicadas de manera restrictiva, proporcional y debidamente motivada. Cuando no sea posible eliminar inmediatamente la información, FITNFLAI podrá bloquearla o restringir su tratamiento durante el periodo de conservación legal aplicable.
                  </p>
                </div>
              </div>

              {/* OCTAVA */}
              <div>
                <h2 className="text-lg md:text-xl font-bold text-white mb-4 border-l-2 border-orange-500 pl-3">
                  OCTAVA. MEDIDAS DE SEGURIDAD TÉCNICAS Y ORGANIZATIVAS
                </h2>
                <p>
                  FITNFLAI implementa medidas técnicas, organizativas y administrativas apropiadas para proteger los datos personales tratados, en especial los datos de salud, conforme a la LOPDP, orientadas a garantizar la confidencialidad, integridad, disponibilidad, autenticidad y trazabilidad de la información. Entre dichas medidas se incluyen, entre otras: el cifrado de datos en tránsito y en reposo; mecanismos de autenticación segura; control de accesos basado en roles; monitoreo mediante registros (logs); copias de seguridad periódicas; y capacitación continua del personal. Asimismo, FITNFLAI exige contractualmente a sus proveedores y encargados del tratamiento el cumplimiento de obligaciones equivalentes en materia de confidencialidad y protección de datos personales.
                </p>
                <p className="mt-3">
                  El acceso a los datos personales estará limitado al personal que lo requiera para el cumplimiento de sus funciones, quien deberá actuar bajo obligaciones de confidencialidad, incluso después de finalizada su relación laboral, profesional o contractual con FITNFLAI.
                </p>
                <p className="mt-3">
                  FITNFLAI exigirá a sus encargados y subencargados del tratamiento la adopción de medidas de seguridad adecuadas y obligaciones contractuales equivalentes. Asimismo, realizará verficiaciones razonables sobre su capacidad para proteger los datos personales y supervisará su cumplimiento conforme al nivel de riesgo del servicio contratado.
                </p>
              </div>

              {/* NOVENA */}
              <div>
                <h2 className="text-lg md:text-xl font-bold text-white mb-4 border-l-2 border-orange-500 pl-3">
                  NOVENA. USO DE COOKIES Y TECNOLOGÍAS DE RASTREO
                </h2>
                <p>
                  FITNFLAI utiliza cookies y tecnologías similares con fines técnicos (autenticación, gestión de sesiones, seguridad) y, adicionalmente, con fines de analítica y marketing (por ejemplo, medición de uso de la Aplicación y personalización de comunicaciones comerciales generales), estas últimas sujetas al consentimiento del Usuario a través del panel de configuración de privacidad disponible en la Aplicación. En ningún caso las cookies de analítica o marketing se combinan con los datos de salud del Usuario. El Usuario podrá gestionar o revocar estas preferencias desde la bandeja de configuraciones de la Aplicación o desde su dispositivo o navegador, sin perjuicio de que la desactivación de ciertos mecanismos técnicos pueda afectar el funcionamiento de la plataforma.
                </p>
              </div>

              {/* DÉCIMA */}
              <div>
                <h2 className="text-lg md:text-xl font-bold text-white mb-4 border-l-2 border-orange-500 pl-3">
                  DÉCIMA. TRANSFERENCIAS INTERNACIONALES Y SUBENCARGADOS
                </h2>
                <p>
                  FITNFLAI podrá recurrir a proveedores externos que actúen como encargados o subencargados del tratamiento, dentro o fuera del territorio ecuatoriano, cuando ello sea necesario para la disponibilidad, seguridad y correcto funcionamiento de la app. En caso de transferencias internacionales, estas se realizarán conforme a la normativa aplicable, garantizando un nivel adecuado de protección mediante mecanismos contractuales o jurídicos apropiados. Los subencargados no podrán tratar los datos para fines propios ni transferirlos a terceros sin autorización previa, expresa y documentada de FITNFLAI.
                </p>
              </div>

              {/* DÉCIMA PRIMERA */}
              <div>
                <h2 className="text-lg md:text-xl font-bold text-white mb-4 border-l-2 border-orange-500 pl-3">
                  DÉCIMA PRIMERA. GESTIÓN DE INCIDENTES DE SEGURIDAD
                </h2>
                <p>
                  FITNFLAI cuenta con procedimientos internos de gestión de incidentes de seguridad que incluyen detección temprana, evaluación del alcance y riesgos, contención, remediación y restauración segura de los sistemas. FITNFLAI documentará los incidentes relevantes y, cuando corresponda, notificará a las autoridades competentes y a los titulares afectados conforme a la normativa aplicable, a partir del momento en que tenga conocimiento efectivo del incidente.
                </p>
              </div>

              {/* DÉCIMA SEGUNDA */}
              <div>
                <h2 className="text-lg md:text-xl font-bold text-white mb-4 border-l-2 border-orange-500 pl-3">
                  DÉCIMA SEGUNDA. DISPOSITIVOS CONECTADOS Y SERVICIOS DE TERCEROS
                </h2>
                <p>
                  La conexión de relojes inteligentes u otros dispositivos, así como la vinculación de redes sociales, es siempre voluntaria y requiere la autorización expresa del usuario mediante los mecanismos de autenticación provistos por dichos terceros. Una vez importados a FITNFLAI, los datos recibidos se rigen por la presente Política; sin embargo, FITNFLAI no controla ni es responsable de las prácticas de privacidad del proveedor del dispositivo o de la red social conectada, las cuales se rigen por sus propias políticas. El usuario puede desconectar estos servicios en cualquier momento desde la bandeja de configuraciones.
                </p>
              </div>

              {/* DÉCIMA TERCERA */}
              <div>
                <h2 className="text-lg md:text-xl font-bold text-white mb-4 border-l-2 border-orange-500 pl-3">
                  DÉCIMA TERCERA. NATURALEZA DE LA INFORMACIÓN DE SALUD Y LIMITACIÓN DE RESPONSABILIDAD
                </h2>
                <p>
                  La información sobre lesiones, cirugías, dolores crónicos o recurrentes, diagnósticos cardiovasculares e informes de bioimpedancia es recopilada con fines exclusivos de personalización y seguridad del entrenamiento, y no constituye ni sustituye una valoración médica. FITNFLAI no verifica la exactitud clínica de la información proporcionada por el usuario y no asume responsabilidad por lesiones, complicaciones de salud o eventos adversos derivados de información inexacta, incompleta o desactualizada proporcionada por el usuario, ni por la falta de consulta previa a un profesional de la salud cuando esta resulte aconsejable. El usuario es responsable de la veracidad de la información suministrada y de evaluar su propia aptitud física antes de iniciar o continuar cualquier plan de entrenamiento.
                </p>
              </div>

              {/* DÉCIMA CUARTA */}
              <div>
                <h2 className="text-lg md:text-xl font-bold text-white mb-4 border-l-2 border-orange-500 pl-3">
                  DÉCIMA CUARTA. MENORES DE EDAD
                </h2>
                <p>
                  FITNFLAI está dirigida exclusivamente a personas mayores de 18 años. FITNFLAI no recopila conscientemente datos personales de menores de edad. En caso de detectarse una cuenta perteneciente a un menor de edad, FITNFLAI podrá suspender o eliminar dicha cuenta y la información asociada.
                </p>
              </div>

              {/* DÉCIMA QUINTA */}
              <div>
                <h2 className="text-lg md:text-xl font-bold text-white mb-4 border-l-2 border-orange-500 pl-3">
                  DÉCIMA QUINTA. CONSERVACIÓN DE DATOS
                </h2>
                <p>
                  Los datos personales serán conservados durante el tiempo necesario para cumplir con las finalidades descritas en la presente Política, así como para el cumplimiento de obligaciones legales, contractuales y regulatorias aplicables. Los datos de la cuenta se conservarán mientras esta se mantenga activa y, posteriormente, por el tiempo necesario para atender responsabilidades legales o solicitudes de los titulares. Los datos de salud proporcionados voluntariamente podrán ser eliminados por el usuario en cualquier momento desde la app, sin perjuicio de la conservación de registros mínimos que resulten necesarios por obligaciones legales. Los datos técnicos y logs podrán conservarse por periodos adicionales con fines de seguridad y auditoría.
                </p>
              </div>

              {/* DÉCIMA SEXTA */}
              <div>
                <h2 className="text-lg md:text-xl font-bold text-white mb-4 border-l-2 border-orange-500 pl-3">
                  DÉCIMA SEXTA. PLAN BÁSICO Y PLAN PREMIUM
                </h2>
                <p>
                  Las categorías de datos personales, finalidades y medidas de protección descritas en la presente Política aplican por igual a los usuarios del Plan Básico y del Plan Premium. La contratación del Plan Premium podrá implicar el tratamiento adicional de datos de facturación y suscripción, así como el acceso a funcionalidades adicionales de la app, sin que ello modifique el nivel de protección aplicable a los datos personales del usuario.
                </p>
              </div>

              {/* DÉCIMA SÉTIMA */}
              <div>
                <h2 className="text-lg md:text-xl font-bold text-white mb-4 border-l-2 border-orange-500 pl-3">
                  DÉCIMA SÉTIMA. INTEGRACIÓN NORMATIVA Y CONTRACTUAL
                </h2>
                <p>
                  La presente Política de Privacidad forma parte integral del marco jurídico que regula el uso de FITNFLAI y se complementa con los Términos y Condiciones de Uso y demás documentos contractuales o políticas aplicables. La utilización de la app implica el conocimiento y aceptación de dichas disposiciones.
                </p>
              </div>

              {/* DÉCIMA OCTAVA */}
              <div>
                <h2 className="text-lg md:text-xl font-bold text-white mb-4 border-l-2 border-orange-500 pl-3">
                  DÉCIMA OCTAVA. MODIFICACIONES A LA POLÍTICA DE PRIVACIDAD
                </h2>
                <p>
                  FITNFLAI se reserva el derecho de modificar la presente Política en cualquier momento, con el fin de adaptarla a cambios normativos, tecnológicos o en los servicios ofrecidos. Cualquier modificación será comunicada a los usuarios a través de la app o por los medios disponibles, indicando la fecha de su última actualización.
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
