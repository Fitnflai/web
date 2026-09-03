import { useState, useMemo, useEffect } from 'react'
import { Search, DollarSign, Crown, CalendarDays } from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import { Badge } from '@/components/ui/Badge'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/utils'
import { useQuery } from '@tanstack/react-query'
import { transactionsService } from '@/services/endpoints/transactions'

// Mock de transacciones de membresía




export function TransaccionesPage() {
  const { showToast } = useAppStore()
  const [filter, setFilter] = useState<'all' | 'membresia' | 'cita'>('all')
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data: summary, isLoading: isSummaryLoading, isError: isSummaryError } = useQuery({
    queryKey: ['adminTransactionSummary'],
    queryFn: transactionsService.getSummary,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  const [search, setSearch] = useState('')

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);





  const mappedTab = useMemo((): 'todas' | 'membresias' | 'citas' => {
    if (filter === 'membresia') return 'membresias';
    if (filter === 'cita') return 'citas';
    return 'todas';
  }, [filter]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filter]);

  const limit = 20;
  const offset = (page - 1) * limit;

  const {
    data: fetchedTransactions = [],
    isLoading: isHistoryLoading,
    isError: isHistoryError,
    refetch: refetchHistory,
  } = useQuery({
    queryKey: ['adminTransactionHistory', { tab: mappedTab, search: debouncedSearch, limit, offset }],
    queryFn: () =>
      transactionsService.getHistory({
        tab: mappedTab,
        search: debouncedSearch.trim() || undefined,
        limit,
        offset,
      }),
    retry: 1,
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-5 gap-3 flex-wrap">
        <div>
          <h2 className="text-lg font-bold">Transacciones</h2>
          <p className="text-[12px] text-surface-muted mt-0.5">Control financiero, cobros de membresías y citas médicas</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {isSummaryLoading && (
          <>
            <div className="h-24 animate-pulse bg-surface-card rounded-lg"></div>
            <div className="h-24 animate-pulse bg-surface-card rounded-lg"></div>
            <div className="h-24 animate-pulse bg-surface-card rounded-lg"></div>
            <div className="h-24 animate-pulse bg-surface-card rounded-lg"></div>
          </>
        )}

        {isSummaryError && (
          <div className="col-span-4 bg-red-900/20 text-red-400 p-3 rounded-lg text-sm text-center">
            No se pudieron cargar las estadísticas de transacciones.
          </div>
        )}

        {!isSummaryLoading && !isSummaryError && summary && (
          <>
            <StatCard
              label="Ingresos Totales"
              value={`$${(summary.ingresos_totales ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              valueColor="#4CAF82"
              delta="Suma de cobros exitosos"
            />
            <StatCard
              label="Membresías"
              value={summary.membresias.toLocaleString() || "0"}
              valueColor="#9B59B6"
              delta="Suscripciones cobradas"
            />
            <StatCard
              label="Citas Médicas"
              value={summary.citas_medicas.toLocaleString() || "0"}
              valueColor="#E8622A"
              delta="Citas médicas cobradas"
            />
            <StatCard
              label="Total Transacciones"
              value={summary.total_transacciones.toLocaleString() || "0"}
              valueColor="#007BFF" // Added a default color for consistency
              delta="Operaciones registradas"
            />
          </>
        )}
      </div>

      {/* Toolbar & Filters */}
      <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
        {/* Search */}
        <div className="flex items-center gap-2 bg-surface-card border border-surface-border rounded-lg px-2.5 py-1.5 w-72">
          <Search size={14} className="text-surface-muted" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por ID, cliente o detalle..."
            className="bg-transparent border-0 outline-none text-[12px] w-full text-white placeholder:text-surface-muted"
          />
        </div>

        {/* Type Badges */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              'px-3 py-1.5 rounded-xl text-[11px] font-medium border cursor-pointer transition-all',
              filter === 'all' ? 'border-brand-orange text-white bg-brand-orange/10' : 'border-surface-border text-surface-muted hover:border-surface-muted'
            )}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter('membresia')}
            className={cn(
              'px-3 py-1.5 rounded-xl text-[11px] font-medium border cursor-pointer transition-all flex items-center gap-1',
              filter === 'membresia' ? 'border-brand-orange text-white bg-brand-orange/10' : 'border-surface-border text-surface-muted hover:border-surface-muted'
            )}
          >
            <Crown size={11} /> Membresías
          </button>
          <button
            onClick={() => setFilter('cita')}
            className={cn(
              'px-3 py-1.5 rounded-xl text-[11px] font-medium border cursor-pointer transition-all flex items-center gap-1',
              filter === 'cita' ? 'border-brand-orange text-white bg-brand-orange/10' : 'border-surface-border text-surface-muted hover:border-surface-muted'
            )}
          >
            <CalendarDays size={11} /> Citas
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card-base p-0 overflow-hidden mb-5">
        <div className="p-3.5 border-b border-surface-border">
          <span className="text-[13px] font-semibold">Historial de Transacciones</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[12px]">
            <thead>
              <tr className="border-b border-surface-border">
                <th className="text-left p-2.5 text-[10px] text-surface-muted uppercase tracking-[0.7px] font-medium">Fecha</th>
                <th className="text-left p-2.5 text-[10px] text-surface-muted uppercase tracking-[0.7px] font-medium">ID Transacción</th>
                <th className="text-left p-2.5 text-[10px] text-surface-muted uppercase tracking-[0.7px] font-medium">Cliente</th>
                <th className="text-left p-2.5 text-[10px] text-surface-muted uppercase tracking-[0.7px] font-medium">Tipo</th>
                <th className="text-left p-2.5 text-[10px] text-surface-muted uppercase tracking-[0.7px] font-medium">Detalle</th>
                <th className="text-right p-2.5 text-[10px] text-surface-muted uppercase tracking-[0.7px] font-medium">Monto</th>
                <th className="text-center p-2.5 text-[10px] text-surface-muted uppercase tracking-[0.7px] font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {isHistoryLoading ? (
                // Pulsing Skeletons loading state
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="border-b border-surface-border last:border-b-0">
                    <td className="p-2.5">
                      <div className="h-4 bg-surface-card rounded animate-pulse w-24"></div>
                    </td>
                    <td className="p-2.5">
                      <div className="h-4 bg-surface-card rounded animate-pulse w-32"></div>
                    </td>
                    <td className="p-2.5">
                      <div className="h-4 bg-surface-card rounded animate-pulse w-40"></div>
                    </td>
                    <td className="p-2.5">
                      <div className="h-4 bg-surface-card rounded animate-pulse w-20"></div>
                    </td>
                    <td className="p-2.5">
                      <div className="h-4 bg-surface-card rounded animate-pulse w-48"></div>
                    </td>
                    <td className="p-2.5">
                      <div className="h-4 bg-surface-card rounded animate-pulse w-20 float-right"></div>
                    </td>
                    <td className="p-2.5">
                      <div className="h-4 bg-surface-card rounded animate-pulse w-20 mx-auto"></div>
                    </td>
                  </tr>
                ))
              ) : isHistoryError ? (
                // Local error warning
                <tr>
                  <td colSpan={7} className="p-8 text-center text-red-400">
                    Error al cargar el historial de transacciones.
                    <button
                      onClick={() => refetchHistory()}
                      className="ml-2 px-3 py-1 text-xs font-medium rounded-lg bg-red-700 hover:bg-red-600 transition-colors"
                    >
                      Reintentar
                    </button>
                  </td>
                </tr>
              ) : fetchedTransactions.length > 0 ? (
                // Dynamic List Mapping
                fetchedTransactions.map((tx, idx) => (
                  <tr key={tx.id_transaccion || `tx-${idx}`} className="hover:bg-white/[0.015] border-b border-surface-border last:border-b-0">
                    <td className="p-2.5 font-medium text-surface-muted">{tx.fecha}</td>
                    <td className="p-2.5 font-mono text-[11px] text-white">{tx.id_transaccion}</td>
                    <td className="p-2.5 font-semibold text-white">{tx.cliente}</td>
                    <td className="p-2.5">
                      <Badge variant={tx.tipo === 'membresia' ? 'purple' : 'blue'}>
                        {tx.tipo === 'membresia' ? 'Membresía' : 'Cita'}
                      </Badge>
                    </td>
                    <td className="p-2.5 text-surface-muted">{tx.detalle}</td>
                    <td className="p-2.5 text-right font-bold text-white">${tx.monto.toFixed(2)}</td>
                    <td className="p-2.5 text-center">
                      <Badge variant={tx.estado === 'exitosa' ? 'green' : tx.estado === 'pendiente' ? 'orange' : 'red'}>
                        {tx.estado === 'exitosa' ? 'Exitosa' : tx.estado === 'pendiente' ? 'Pendiente' : 'Cancelada'}
                      </Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-surface-muted italic">
                    No se encontraron transacciones que coincidan con los filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Pagination Controls */}
      <div className="flex items-center justify-between mt-4 px-3">
        <button
          onClick={() => setPage(p => Math.max(p - 1, 1))}
          disabled={page === 1 || isHistoryLoading}
          className="px-4 py-2 text-sm font-medium rounded-lg border border-surface-border text-surface-muted hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Anterior
        </button>
        <span className="text-sm text-white">Página {page}</span>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={fetchedTransactions.length < limit || isHistoryLoading}
          className="px-4 py-2 text-sm font-medium rounded-lg border border-surface-border text-surface-muted hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Siguiente
        </button>
      </div>
    </div>
  )
}
