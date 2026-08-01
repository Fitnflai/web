import { useState } from 'react'
import { Upload } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { toast } from '@/components/ui/Toast'

export function ConfiguracionPage() {
  const [nombre, setNombre] = useState('Administrador Fitnflai')
  const [email, setEmail] = useState('admin@fitnflai.com')
  const [telefono, setTelefono] = useState('+57 300 000 0000')
  const [descripcion, setDescripcion] = useState('Administrador principal de la plataforma Fitnflai. Encargado de la supervisión, control de accesos y gestión global de la academia.')

  return (
    <div>
      <div className="flex items-start justify-between mb-5 gap-3 flex-wrap">
        <div>
          <h2 className="text-lg font-bold">Mi Perfil</h2>
          <p className="text-[12px] text-surface-muted mt-0.5">Tu información personal y datos de contacto</p>
        </div>
        <Button onClick={() => toast.show('Perfil actualizado con éxito', 'success')} variant="primary">💾 Guardar</Button>
      </div>

      <div className="card-base p-5 bg-surface-card border border-surface-border rounded-xl mt-5">
        <div className="flex flex-col md:flex-row gap-5 items-start mb-5">
          {/* Left Avatar Section */}
          <div className="flex flex-col items-center justify-center shrink-0">
            <div className="relative">
              <Avatar initials="AD" color="#E8622A" size="lg" className="w-16 h-16 text-xl border-[3px] border-surface-card" />
              <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full flex items-center justify-center cursor-pointer border border-surface-card bg-brand-orange">
                <Upload size={10} className="text-white"/>
              </div>
            </div>
          </div>
          {/* Right Description Section */}
          <div className="flex-1 w-full text-left">
            <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">BIOGRAFÍA / DESCRIPCIÓN</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Escribe tu biografía..."
              className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange min-h-[80px] resize-none"
            />
          </div>
        </div>

        {/* Bottom details grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 border-t border-surface-border pt-4 text-left">
          {/* Nombre completo input */}
          <div>
            <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">Nombre completo</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange"
            />
          </div>
          {/* Email input */}
          <div>
            <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange"
            />
          </div>
          {/* Teléfono input */}
          <div>
            <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">Teléfono</label>
            <input
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="form-input w-full bg-surface-card2 border border-surface-border rounded-lg px-3 py-2 text-[12px] outline-none transition-colors focus:border-brand-orange"
            />
          </div>
        </div>
      </div>

    </div>
  )
}