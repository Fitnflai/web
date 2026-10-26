import { useState, useMemo } from 'react'
import {
  BookOpen, Plus, Search, Edit2, Trash2, Languages,
  Sparkles, RefreshCw, CheckCircle2, AlertTriangle, X,
  FileText, Copy, Check, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { glossaryService, type GlossaryTerm, type SearchInTextResult } from '@/services/endpoints/glossary'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { StatCard } from '@/components/ui/StatCard'
import { toast } from '@/components/ui/Toast'
import { cn } from '@/utils'

export function GlosarioPage() {
  const queryClient = useQueryClient()

  // State
  const [activeTab, setActiveTab] = useState<'terms' | 'extractor'>('terms')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const PAGE_SIZE = 20

  // Create / Edit modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null)
  const [termForm, setTermForm] = useState({
    termino: '',
    descripcion_es: '',
    descripcion_en: '',
  })
  const [formError, setFormError] = useState<string | null>(null)

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [termToDelete, setTermToDelete] = useState<GlossaryTerm | null>(null)

  // Extractor / Search In Text state
  const [extractorText, setExtractorText] = useState('')
  const [extractorLang, setExtractorLang] = useState<'es' | 'en'>('es')
  const [extractorResults, setExtractorResults] = useState<SearchInTextResult[] | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Fetch terms
  const {
    data: terms = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['adminGlossaryTerms'],
    queryFn: glossaryService.getTerms,
    staleTime: 1000 * 60 * 5,
  })

  // Mutations
  const saveMutation = useMutation({
    mutationFn: glossaryService.saveTerm,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['adminGlossaryTerms'] })
      const isEdit = Boolean(variables.id)
      toast.show(
        isEdit ? 'Término actualizado correctamente' : 'Término creado correctamente',
        'success'
      )
      closeFormModal()
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.detail || err?.response?.data?.message || 'Error al guardar el término'
      toast.show(msg, 'error')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => glossaryService.deleteTerm(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminGlossaryTerms'] })
      toast.show('Término eliminado del glosario exitosamente', 'success')
      closeDeleteModal()
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.detail || err?.response?.data?.message || 'Error al eliminar el término'
      toast.show(msg, 'error')
    },
  })

  const extractorMutation = useMutation({
    mutationFn: glossaryService.searchTermsInText,
    onSuccess: (data) => {
      setExtractorResults(data)
      toast.show(`Se identificaron ${data.length} término(s) en el texto`, 'success')
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.detail || err?.response?.data?.message || 'Error al analizar el texto'
      toast.show(msg, 'error')
    },
  })

  // Filtered terms
  const filteredTerms = useMemo(() => {
    if (!searchQuery.trim()) return terms
    const q = searchQuery.toLowerCase().trim()
    return terms.filter(
      (t) =>
        t.termino?.toLowerCase().includes(q) ||
        t.descripcion_es?.toLowerCase().includes(q) ||
        t.descripcion_en?.toLowerCase().includes(q)
    )
  }, [terms, searchQuery])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredTerms.length / PAGE_SIZE))
  const safePage = Math.min(Math.max(1, currentPage), totalPages)
  const startIndex = (safePage - 1) * PAGE_SIZE
  const endIndex = Math.min(startIndex + PAGE_SIZE, filteredTerms.length)

  const paginatedTerms = useMemo(() => {
    return filteredTerms.slice(startIndex, endIndex)
  }, [filteredTerms, startIndex, endIndex])

  // Handlers for modal
  const openCreateModal = () => {
    setModalMode('create')
    setSelectedTerm(null)
    setTermForm({ termino: '', descripcion_es: '', descripcion_en: '' })
    setFormError(null)
    setIsModalOpen(true)
  }

  const openEditModal = (term: GlossaryTerm) => {
    setModalMode('edit')
    setSelectedTerm(term)
    setTermForm({
      termino: term.termino || '',
      descripcion_es: term.descripcion_es || '',
      descripcion_en: term.descripcion_en || '',
    })
    setFormError(null)
    setIsModalOpen(true)
  }

  const closeFormModal = () => {
    setIsModalOpen(false)
    setSelectedTerm(null)
    setFormError(null)
  }

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault()
    if (!termForm.termino.trim()) {
      setFormError('El nombre del término es obligatorio.')
      return
    }
    if (!termForm.descripcion_es.trim()) {
      setFormError('La definición en español es obligatoria.')
      return
    }
    if (!termForm.descripcion_en.trim()) {
      setFormError('La definición en inglés es obligatoria.')
      return
    }

    setFormError(null)
    saveMutation.mutate({
      id: modalMode === 'edit' ? selectedTerm?.id : undefined,
      termino: termForm.termino.trim(),
      descripcion_es: termForm.descripcion_es.trim(),
      descripcion_en: termForm.descripcion_en.trim(),
    })
  }

  // Handlers for delete
  const openDeleteModal = (term: GlossaryTerm) => {
    setTermToDelete(term)
    setIsDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setTermToDelete(null)
  }

  const handleConfirmDelete = () => {
    if (termToDelete?.id) {
      deleteMutation.mutate(termToDelete.id)
    }
  }

  // Extractor handlers
  const handleAnalyzeText = (e: React.FormEvent) => {
    e.preventDefault()
    if (!extractorText.trim()) {
      toast.show('Por favor ingresa un texto para analizar', 'warning')
      return
    }
    extractorMutation.mutate({
      texto: extractorText.trim(),
      lang: extractorLang,
    })
  }

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Administración del Glosario</h1>
            <Badge variant="orange">Admin</Badge>
          </div>
          <p className="text-[12px] text-surface-muted mt-1">
            Gestiona los términos clave y sus definiciones bilingües (Español / Inglés) para el ecosistema y la IA.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="ghost"
            size="md"
            onClick={() => refetch()}
            disabled={isFetching}
            className="text-surface-muted hover:text-white"
          >
            <RefreshCw size={13} className={cn('mr-1.5', isFetching && 'animate-spin')} />
            Actualizar
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={openCreateModal}
            className="shadow-lg shadow-brand-orange/20"
          >
            <Plus size={15} className="mr-1" />
            Nuevo Término
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard
          label="Términos Registrados"
          value={isLoading ? '...' : terms.length}
          delta="Total en base de datos"
          deltaUp={true}
          valueColor="#E8622A"
        />
        <StatCard
          label="Idiomas Soportados"
          value="2"
          delta="Español (ES) e Inglés (EN)"
          deltaUp={true}
          valueColor="#4A90E2"
        />
        <StatCard
          label="Términos Filtrados"
          value={isLoading ? '...' : filteredTerms.length}
          delta={searchQuery ? `Coincidencias para "${searchQuery}"` : 'Todos los términos listados'}
          valueColor="#4CAF82"
        />
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center justify-between border-b border-surface-border pb-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('terms')}
            className={cn(
              'flex items-center gap-2 px-3 py-2 text-[12px] font-medium rounded-t-lg transition-colors border-b-2',
              activeTab === 'terms'
                ? 'border-brand-orange text-brand-orange font-semibold bg-brand-orange/5'
                : 'border-transparent text-surface-muted hover:text-white hover:border-surface-border'
            )}
          >
            <BookOpen size={14} />
            <span>Lista de Términos ({terms.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('extractor')}
            className={cn(
              'flex items-center gap-2 px-3 py-2 text-[12px] font-medium rounded-t-lg transition-colors border-b-2',
              activeTab === 'extractor'
                ? 'border-brand-orange text-brand-orange font-semibold bg-brand-orange/5'
                : 'border-transparent text-surface-muted hover:text-white hover:border-surface-border'
            )}
          >
            <Sparkles size={14} />
            <span>Probador de Extractor de Términos</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Terms List */}
      {activeTab === 'terms' && (
        <div className="space-y-4">
          {/* Search bar */}
          <div className="flex items-center justify-between gap-3 bg-surface-panel p-3 rounded-xl border border-surface-border">
            <div className="relative flex-1 max-w-md">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-muted" />
              <input
                type="text"
                placeholder="Buscar término o palabra clave en definiciones..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full bg-surface-card border border-surface-border rounded-lg pl-9 pr-8 py-1.5 text-[12px] text-white placeholder-surface-muted focus:outline-none focus:border-brand-orange"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setCurrentPage(1)
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-surface-muted hover:text-white"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            <div className="text-[11px] text-surface-muted">
              Mostrando <span className="font-semibold text-white">{filteredTerms.length}</span> de{' '}
              <span className="font-semibold text-white">{terms.length}</span> términos
            </div>
          </div>

          {/* Table */}
          <div className="card-base p-0 overflow-hidden border border-surface-border rounded-xl">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[12px]">
                <thead>
                  <tr className="bg-surface-card/60">
                    <th className="text-left p-3 text-[10px] text-surface-muted uppercase tracking-[0.8px] border-b border-surface-border font-semibold w-[220px]">
                      Término
                    </th>
                    <th className="text-left p-3 text-[10px] text-surface-muted uppercase tracking-[0.8px] border-b border-surface-border font-semibold">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="text-[12px]">🇪🇸</span> Definición en Español
                      </span>
                    </th>
                    <th className="text-left p-3 text-[10px] text-surface-muted uppercase tracking-[0.8px] border-b border-surface-border font-semibold">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="text-[12px]">🇺🇸</span> Definición en Inglés
                      </span>
                    </th>
                    <th className="text-right p-3 text-[10px] text-surface-muted uppercase tracking-[0.8px] border-b border-surface-border font-semibold w-[110px]">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="p-10 text-center text-surface-muted text-[13px]">
                        <RefreshCw size={22} className="animate-spin mx-auto mb-2 text-brand-orange" />
                        Cargando términos del glosario...
                      </td>
                    </tr>
                  ) : isError ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-brand-red text-[12px]">
                        <AlertTriangle size={24} className="mx-auto mb-2 text-brand-red" />
                        Ocurrió un error al cargar el glosario. Revisa la conexión con el servidor.
                        <div className="mt-3">
                          <Button size="sm" variant="ghost" onClick={() => refetch()}>
                            Reintentar
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ) : filteredTerms.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-10 text-center text-surface-muted">
                        <BookOpen size={30} className="mx-auto mb-2 opacity-40 text-surface-muted" />
                        <div className="font-medium text-white text-[13px]">
                          {searchQuery ? 'No se encontraron términos coincidentes' : 'Aún no hay términos registrados'}
                        </div>
                        <div className="text-[11px] text-surface-muted mt-1">
                          {searchQuery
                            ? 'Intenta con otra palabra clave o limpia el filtro de búsqueda.'
                            : 'Haz clic en "Nuevo Término" para registrar el primero.'}
                        </div>
                        {!searchQuery && (
                          <Button size="sm" variant="primary" onClick={openCreateModal} className="mt-4">
                            <Plus size={13} className="mr-1" /> Crear Primer Término
                          </Button>
                        )}
                      </td>
                    </tr>
                  ) : (
                    paginatedTerms.map((t) => (
                      <tr
                        key={t.id || t.termino}
                        className="hover:bg-white/[0.02] transition-colors group"
                      >
                        <td className="p-3 align-top">
                          <div className="flex items-start gap-2">
                            <div className="w-7 h-7 rounded-lg bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center flex-shrink-0 text-brand-orange font-bold text-[11px] mt-0.5">
                              {t.termino ? t.termino.charAt(0).toUpperCase() : 'T'}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-white text-[13px]">{t.termino}</div>
                              {t.id && (
                                <button
                                  type="button"
                                  onClick={() => handleCopy(t.id, t.id)}
                                  className="text-[9px] text-surface-muted font-mono flex items-center gap-1 mt-0.5 hover:text-brand-orange transition-colors"
                                  title="Copiar ID UUID"
                                >
                                  <span className="truncate max-w-[130px]">{t.id}</span>
                                  {copiedId === t.id ? <Check size={10} className="text-brand-green" /> : <Copy size={10} />}
                                </button>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="p-3 align-top text-surface-muted leading-relaxed text-[12px]">
                          <div className="line-clamp-3 group-hover:line-clamp-none transition-all duration-200">
                            {t.descripcion_es}
                          </div>
                        </td>

                        <td className="p-3 align-top text-surface-muted leading-relaxed text-[12px]">
                          <div className="line-clamp-3 group-hover:line-clamp-none transition-all duration-200 italic">
                            {t.descripcion_en}
                          </div>
                        </td>

                        <td className="p-3 align-top text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openEditModal(t)}
                              title="Editar término"
                              className="p-1.5 rounded-lg text-surface-muted hover:text-brand-orange hover:bg-brand-orange/10 transition-colors"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => openDeleteModal(t)}
                              title="Eliminar término"
                              className="p-1.5 rounded-lg text-surface-muted hover:text-brand-red hover:bg-brand-red/10 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Toolbar */}
            {filteredTerms.length > 0 && (
              <div className="p-3 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-3 bg-surface-card/30">
                <div className="text-[11px] text-surface-muted">
                  Mostrando <span className="font-semibold text-white">{startIndex + 1}</span> a{' '}
                  <span className="font-semibold text-white">{endIndex}</span> de{' '}
                  <span className="font-semibold text-white">{filteredTerms.length}</span> términos
                  {totalPages > 1 && (
                    <span className="ml-1 text-surface-muted">
                      (Página <span className="font-semibold text-white">{safePage}</span> de{' '}
                      <span className="font-semibold text-white">{totalPages}</span>)
                    </span>
                  )}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={safePage <= 1}
                      className="p-1.5 text-[11px] rounded-lg bg-surface-card border border-surface-border text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-card2 transition-colors"
                      title="Primera página"
                    >
                      <ChevronsLeft size={14} />
                    </button>

                    <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={safePage <= 1}
                      className="flex items-center gap-1 px-2.5 py-1 text-[11px] rounded-lg bg-surface-card border border-surface-border text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-card2 transition-colors"
                    >
                      <ChevronLeft size={13} />
                      <span>Anterior</span>
                    </button>

                    <div className="flex items-center gap-1 px-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                        .map((p, idx, arr) => {
                          const prev = arr[idx - 1]
                          const showEllipsis = prev && p - prev > 1

                          return (
                            <div key={p} className="flex items-center gap-1">
                              {showEllipsis && (
                                <span className="text-[11px] text-surface-muted px-1">...</span>
                              )}
                              <button
                                onClick={() => setCurrentPage(p)}
                                className={cn(
                                  'min-w-[28px] h-7 px-2 text-[11px] rounded-lg font-medium transition-colors',
                                  safePage === p
                                    ? 'bg-brand-orange text-white shadow-sm font-bold'
                                    : 'bg-surface-card border border-surface-border text-surface-muted hover:text-white hover:bg-surface-card2'
                                )}
                              >
                                {p}
                              </button>
                            </div>
                          )
                        })}
                    </div>

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      disabled={safePage >= totalPages}
                      className="flex items-center gap-1 px-2.5 py-1 text-[11px] rounded-lg bg-surface-card border border-surface-border text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-card2 transition-colors"
                    >
                      <span>Siguiente</span>
                      <ChevronRight size={13} />
                    </button>

                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={safePage >= totalPages}
                      className="p-1.5 text-[11px] rounded-lg bg-surface-card border border-surface-border text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-card2 transition-colors"
                      title="Última página"
                    >
                      <ChevronsRight size={14} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Extractor Tester */}
      {activeTab === 'extractor' && (
        <div className="space-y-5">
          <div className="card-base p-5 border border-surface-border rounded-xl space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles size={16} className="text-brand-orange" />
                  Escanear Texto con el Motor de Glosario
                </h2>
                <p className="text-[12px] text-surface-muted mt-1">
                  Pega cualquier texto, reporte médico o notas de entrenamiento para extraer y vincular automáticamente los términos definidos en el glosario.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-surface-card p-1 rounded-lg border border-surface-border">
                <button
                  type="button"
                  onClick={() => setExtractorLang('es')}
                  className={cn(
                    'px-2.5 py-1 text-[11px] rounded font-medium transition-colors flex items-center gap-1',
                    extractorLang === 'es'
                      ? 'bg-brand-orange text-white'
                      : 'text-surface-muted hover:text-white'
                  )}
                >
                  <span>🇪🇸</span> Español
                </button>
                <button
                  type="button"
                  onClick={() => setExtractorLang('en')}
                  className={cn(
                    'px-2.5 py-1 text-[11px] rounded font-medium transition-colors flex items-center gap-1',
                    extractorLang === 'en'
                      ? 'bg-brand-orange text-white'
                      : 'text-surface-muted hover:text-white'
                  )}
                >
                  <span>🇺🇸</span> English
                </button>
              </div>
            </div>

            <form onSubmit={handleAnalyzeText} className="space-y-3">
              <div>
                <textarea
                  rows={4}
                  value={extractorText}
                  onChange={(e) => setExtractorText(e.target.value)}
                  placeholder="Ejemplo: Hola este es un texto para obtener la palabra glucógeno y vo2 máx si se puede y más..."
                  className="w-full bg-surface-card border border-surface-border rounded-xl p-3 text-[12px] text-white placeholder-surface-muted focus:outline-none focus:ring-1 focus:ring-brand-orange focus:border-brand-orange resize-y"
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setExtractorText(
                      'Hola este es un texto para obtener la palabra glucógeno y vo2 máx si se puede y más'
                    )
                  }}
                  className="text-[11px] text-brand-orange hover:underline flex items-center gap-1"
                >
                  <FileText size={12} /> Cargar texto de ejemplo
                </button>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={extractorMutation.isPending}
                >
                  <Sparkles size={14} className="mr-1.5" />
                  Escanear Términos
                </Button>
              </div>
            </form>
          </div>

          {/* Results section */}
          {extractorResults !== null && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[13px] font-semibold text-white flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-brand-green" />
                  Términos Detectados ({extractorResults.length})
                </h3>
              </div>

              {extractorResults.length === 0 ? (
                <div className="card-base p-6 text-center text-surface-muted border border-surface-border rounded-xl">
                  No se detectaron términos del glosario en el texto analizado para el idioma seleccionado ({extractorLang.toUpperCase()}).
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {extractorResults.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="card-base p-4 border border-surface-border hover:border-brand-orange/40 rounded-xl space-y-2 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-[13px] flex items-center gap-1.5">
                          <BookOpen size={14} className="text-brand-orange" />
                          {item.termino}
                        </span>
                        <Badge variant="green">Coincidencia</Badge>
                      </div>
                      <p className="text-[12px] text-surface-muted leading-relaxed">
                        {item.descripcion}
                      </p>
                      {item.id && (
                        <div className="text-[10px] text-surface-muted font-mono pt-1 border-t border-surface-border/50">
                          ID: {item.id}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeFormModal}
        title={modalMode === 'create' ? 'Nuevo Término del Glosario' : 'Editar Término del Glosario'}
        className="max-w-lg"
      >
        <form onSubmit={handleSubmitForm} className="space-y-4">
          {formError && (
            <div className="p-2.5 rounded-lg bg-brand-red/10 border border-brand-red/20 text-brand-red text-[11px] flex items-center gap-2">
              <AlertTriangle size={14} className="flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div>
            <label className="text-[11px] font-bold text-surface-muted uppercase tracking-wider block mb-1">
              Término / Concepto *
            </label>
            <input
              type="text"
              required
              value={termForm.termino}
              onChange={(e) => setTermForm({ ...termForm, termino: e.target.value })}
              placeholder="Ej: VO2 Máx, Glucógeno, HIIT..."
              className="w-full bg-surface-card border border-surface-border rounded-lg px-3 py-2 text-[12px] text-white focus:outline-none focus:ring-1 focus:ring-brand-orange focus:border-brand-orange"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-surface-muted uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <span>🇪🇸</span> Significado en Español (ES) *
            </label>
            <textarea
              required
              rows={3}
              value={termForm.descripcion_es}
              onChange={(e) => setTermForm({ ...termForm, descripcion_es: e.target.value })}
              placeholder="Escribe la explicación clara y técnica en español..."
              className="w-full bg-surface-card border border-surface-border rounded-lg p-2.5 text-[12px] text-white focus:outline-none focus:ring-1 focus:ring-brand-orange focus:border-brand-orange resize-y"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-surface-muted uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <span>🇺🇸</span> Significado en Inglés (EN) *
            </label>
            <textarea
              required
              rows={3}
              value={termForm.descripcion_en}
              onChange={(e) => setTermForm({ ...termForm, descripcion_en: e.target.value })}
              placeholder="Write the clear technical explanation in English..."
              className="w-full bg-surface-card border border-surface-border rounded-lg p-2.5 text-[12px] text-white focus:outline-none focus:ring-1 focus:ring-brand-orange focus:border-brand-orange resize-y"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-border">
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={closeFormModal}
              disabled={saveMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={saveMutation.isPending}
            >
              {modalMode === 'create' ? 'Crear Término' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        title="Eliminar Término del Glosario"
        className="max-w-md"
      >
        <div className="space-y-4">
          <div className="p-3 bg-brand-red/10 border border-brand-red/20 rounded-xl flex items-start gap-3">
            <AlertTriangle size={18} className="text-brand-red flex-shrink-0 mt-0.5" />
            <div className="text-[12px] text-white">
              ¿Estás seguro de que deseas eliminar el término{' '}
              <span className="font-bold text-brand-red">"{termToDelete?.termino}"</span>?
              <div className="text-surface-muted text-[11px] mt-1">
                Esta acción es irreversible y eliminará las definiciones en español e inglés permanentemente.
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-border">
            <Button
              variant="ghost"
              size="md"
              onClick={closeDeleteModal}
              disabled={deleteMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              size="md"
              onClick={handleConfirmDelete}
              isLoading={deleteMutation.isPending}
            >
              <Trash2 size={14} className="mr-1" />
              Eliminar Término
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
