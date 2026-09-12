import { useState, useRef, useEffect } from 'react'
import { Upload } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { toast } from '@/components/ui/Toast'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { profileService, UpdateAdminProfilePayload } from '@/services/endpoints/users'

const formatFastApiError = (error: any): string => {
  if (error.response?.data?.detail && Array.isArray(error.response.data.detail)) {
    return error.response.data.detail
      .map((err: any) => {
        const field = err.loc && err.loc.length > 1 ? err.loc[1] : 'unknown field';
        return `[${field}] ${err.msg}`;
      })
      .join(' | ');
  }
  return error.message || 'Error desconocido';
};

const getDisplayAvatarUrl = (url: string | null): string | undefined => {
  if (!url) return undefined;
  if (url.startsWith('blob:') || url.startsWith('data:')) return url;
  const separator = url.includes('?') ? '&' : '?';
  // Add dynamic timestamp to prevent browser image caching
  return `${url}${separator}t=${new Date().getTime()}`;
};

export function ConfiguracionPage() {
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data: profileData, isLoading, isError } = useQuery({
    queryKey: ['adminProfile'],
    queryFn: () => profileService.getAdminProfile(),
  })

  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [descripcion, setDescripcion] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    if (profileData?.admin) {
      setNombre(profileData.admin.nombre)
      setEmail(profileData.admin.email)
      setTelefono(profileData.admin.telefono ?? '')
      setDescripcion(profileData.admin.biografia || '')
      setAvatarUrl(profileData.admin.avatar_url || null)
    }
  }, [profileData])

  const updateProfileMutation = useMutation({
    mutationFn: (payload: UpdateAdminProfilePayload) => profileService.updateAdminProfile(payload),
    onSuccess: (data: any) => {
      const message = typeof data === 'string' ? data : 'Perfil actualizado con éxito';
      toast.show(message, 'success');
      queryClient.invalidateQueries({ queryKey: ['adminProfile'] });
    },
    onError: (error: any) => {
      const errorMessage = formatFastApiError(error);
      toast.show(`Error al actualizar el perfil: ${errorMessage}`, 'error');
    },
  })

  const uploadAvatarMutation = useMutation({
    mutationFn: (file: File) => profileService.updateAdminAvatar(file),
    onSuccess: (data: any) => {
      const newAvatarUrl = typeof data === 'string'
        ? data
        : (data.foto_url || data.avatar_url || data.url || null);
      setAvatarUrl(newAvatarUrl);
      toast.show('Avatar actualizado con éxito', 'success');
      queryClient.invalidateQueries({ queryKey: ['adminProfile'] });
    },
    onError: (error: any) => {
      const errorMessage = formatFastApiError(error);
      toast.show(`Error al subir el avatar: ${errorMessage}`, 'error');
    },
  })

  const handleUpdateProfile = () => {
    const payload: UpdateAdminProfilePayload = {
      nombre,
      email,
      telefono: telefono === '' ? null : telefono,
      biografia: descripcion,
    };
    updateProfileMutation.mutate(payload);
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      uploadAvatarMutation.mutate(event.target.files[0]);
      event.target.value = '';
    }
  }

  if (isLoading) {
    return <div className="text-center py-10">Cargando perfil...</div>
  }

  if (isError) {
    return <div className="text-center py-10 text-red-500">Error al cargar el perfil.</div>
  }

  const isSaving = updateProfileMutation.isPending || uploadAvatarMutation.isPending

  return (
    <div>
      <div className="flex items-start justify-between mb-5 gap-3 flex-wrap">
        <div>
          <h2 className="text-lg font-bold">Mi Perfil</h2>
          <p className="text-[12px] text-surface-muted mt-0.5">Tu información personal y datos de contacto</p>
        </div>
        <Button onClick={handleUpdateProfile} variant="primary" disabled={isSaving}>💾 {isSaving ? 'Guardando...' : 'Guardar'}</Button>
      </div>

      <div className="card-base p-5 bg-surface-card border border-surface-border rounded-xl mt-5">
        <div className="flex flex-col md:flex-row gap-5 items-start mb-5">
          {/* Left Avatar Section */}
          <div className="flex flex-col items-center justify-center shrink-0">
            <div className="relative cursor-pointer" onClick={handleAvatarClick}>
              {avatarUrl ? (
                <img src={getDisplayAvatarUrl(avatarUrl)} alt="Admin Avatar" className="w-16 h-16 rounded-full object-cover border-[3px] border-surface-card" />
              ) : (
                <Avatar initials="AD" color="#E8622A" size="lg" className="w-16 h-16 text-xl border-[3px] border-surface-card" />
              )}
              <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full flex items-center justify-center cursor-pointer border border-surface-card bg-brand-orange">
                <Upload size={10} className="text-white"/>
            </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

            </div>
          </div>
          {/* Right Description Section */}
          <div className="flex-1 w-full text-left">
            <label className="form-label block text-[10px] text-surface-muted uppercase tracking-[0.6px] mb-1">BIOGRAFÍA / DESCRIPCIÓN</label>
            <textarea
              value={descripcion || ''}
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
              readOnly={true}
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