import { useState, useMemo } from 'react'
import { Search, DollarSign, Crown, CalendarDays } from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import { Badge } from '@/components/ui/Badge'
import { useAppStore } from '@/store/useAppStore'
import { MOCK_APPOINTMENTS } from '@/services/mocks/agenda.mock'
import { cn } from '@/utils'

// Mock de transacciones de membresía
const MOCK_MEMBERSHIP_TXNS = [
  { id: 'TXN-M001', date: '2026-06-08', client: 'Alice Smith', type: 'membresia' as const, detail: 'Plan Pro (Mensual)', amount: 19.99, status: 'exitosa' as const },
  { id: 'TXN-M002', date: '2026-06-09', client: 'Bob Johnson', type: 'membresia' as const, detail: 'Plan Elite (Anual)', amount: 25.49, status: 'exitosa' as const },
  { id: 'TXN-M003', date: '2026-06-10', client: 'Charlie Brown', type: 'membresia' as const, detail: 'Plan Essential (Mensual)', amount: 9.99, status: 'pendiente' as const },
  { id: 'TXN-M004', date: '2026-06-11', client: 'Diana Prince', type: 'membresia' as const, detail: 'Plan Pro (Mensual)', amount: 19.99, status: 'cancelada' as const },
]

interface Transaction {
  id: string
  date: string
  client: string
  type: 'membresia' | 'cita'
  detail: string
  amount: number
  status: 'exitosa' | 'pendiente' | 'cancelada'
}

export function TransaccionesPage() {
  const { showToast } = useAppStore()
  const [filter, setFilter] = useState<'all' | 'membresia' | 'cita'>('all')
  const [search, setSearch] = useState('')

  const allTransactions = useMemo(() => {
    // Convert appointments into transactions (each is $19.99)
    const appointmentTxns: Transaction[] = MOCK_APPOINTMENTS.map((apt, index) => {
      let txnStatus: 'exitosa' | 'pendiente' | 'cancelada' = 'pendiente'
      if (apt.estado === 'confirmada' || apt.estado === 'completada') {
        txnStatus = 'exitosa'
      } else if (apt.estado === 'cancelada') {
        txnStatus = 'cancelada'
      }

      return {
        id: `TXN-A${(index + 1).toString().padStart(3, '0')}`,
        date: apt.fecha,
        client: apt.paciente.nombre,
        type: 'cita' as const,
        detail: `Cita con ${apt.profesional.nombre} (${apt.tipo})`,
        amount: 19.99,
        status: txnStatus,
      }
    })

    const combined = [...MOCK_MEMBERSHIP_TXNS, ...appointmentTxns]

    // Sort by date descending
    return combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [])

  const filteredTransactions = useMemo(() => {
    let result = allTransactions

    if (filter !== 'all') {
      result = result.filter(t => t.type === filter)
    }

    if (search.trim()) {
      const term = search.toLowerCase()
      result = result.filter(t =>
        t.client.toLowerCase().includes(term) ||
        t.detail.toLowerCase().includes(term) ||
        t.id.toLowerCase().includes(term)
      )
    }

    return result
  }, [allTransactions, filter, search])

  const kpis = useMemo(() => {
    const successful = allTransactions.filter(t => t.status === 'exitosa')
    const totalRev = successful.reduce((sum, t) => sum + t.amount, 0)
    const membershipRev = successful.filter(t => t.type === 'membresia').reduce((sum, t) => sum + t.amount, 0)
    const appointmentRev = successful.filter(t => t.type === 'cita').reduce((sum, t) => sum + t.amount, 0)

    return {
      totalRevenue: totalRev.toFixed(2),
      membershipRevenue: membershipRev.toFixed(2),
      appointmentRevenue: appointmentRev.toFixed(2),
      totalCount: allTransactions.length
    }
  }, [allTransactions])

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
        <StatCard label="Ingresos Totales" value={`$${kpis.totalRevenue}`} valueColor="#4CAF82" delta="Suma de cobros exitosos" />
        <StatCard label="Membresías" value={`$${kpis.membershipRevenue}`} valueColor="#9B59B6" delta="Suscripciones de alumnos" />
        <StatCard label="Citas Médicas" value={`$${kpis.appointmentRevenue}`} valueColor="#E8622A" delta="Valor por cita: $19.99" />
        <StatCard label="Total Transacciones" value={kpis.totalCount} delta="Registradas en el sistema" />
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
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/[0.015] border-b border-surface-border last:border-b-0">
                    <td className="p-2.5 font-medium text-surface-muted">{tx.date}</td>
                    <td className="p-2.5 font-mono text-[11px] text-white">{tx.id}</td>
                    <td className="p-2.5 font-semibold text-white">{tx.client}</td>
                    <td className="p-2.5">
                      <Badge variant={tx.type === 'membresia' ? 'purple' : 'blue'}>
                        {tx.type === 'membresia' ? 'Membresía' : 'Cita'}
                      </Badge>
                    </td>
                    <td className="p-2.5 text-surface-muted">{tx.detail}</td>
                    <td className="p-2.5 text-right font-bold text-white">${tx.amount.toFixed(2)}</td>
                    <td className="p-2.5 text-center">
                      <Badge variant={tx.status === 'exitosa' ? 'green' : tx.status === 'pendiente' ? 'orange' : 'red'}>
                        {tx.status === 'exitosa' ? 'Exitosa' : tx.status === 'pendiente' ? 'Pendiente' : 'Cancelada'}
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
    </div>
  )
}
