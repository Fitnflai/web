import { useState } from 'react'
import { StatCard } from '@/components/ui/StatCard'
import { Toggle } from '@/components/ui/Toggle'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/utils'

type MTab = 'planes' | 'comparativa'

const PLANS = [
  { key:'ess', name:'Essential', icon:'🧠', desc:'Plan 100% IA', color:'#4CAF82', tagText:'21 días gratis', tagVariant:'green' as const, priceM:9.99, priceA:8.49, trial:21, users:1213, usersPct:62,
    features:['Plan personalizado por IA','Seguimiento de progreso','Ajuste automático del plan','Adaptación por altitud','Registro de lesiones'] },
  { key:'pro', name:'Pro', icon:'🥗', desc:'+ nutrición e hidratación IA', color:'#E8622A', tagText:'Más popular', tagVariant:'orange' as const, priceM:19.99, priceA:16.99, trial:0, users:634, usersPct:33,
    features:['Todo lo de Essential','Plan nutricional por IA','Guía de hidratación','Sincronización nutrición + sesión','Ajustes según carga y recuperación'] },
  { key:'elite', name:'Elite', icon:'🛡️', desc:'+ validación de deportólogo', color:'#F5C842', tagText:'Premium', tagVariant:'yellow' as const, priceM:29.99, priceA:25.49, trial:0, users:89, usersPct:5,
    features:['Todo lo de Pro','Revisión semanal por deportólogo','Ajuste manual de tablas','Canal directo con deportólogo','Monitoreo riesgo de lesión'] },
]

const COMPARE = [
  {feat:'Plan de entrenamiento IA', ess:true, pro:true, elite:true},
  {feat:'Seguimiento y progreso',    ess:true, pro:true, elite:true},
  {feat:'Altitud inteligente',       ess:true, pro:true, elite:true},
  {feat:'Plan nutricional IA',       ess:false,pro:true, elite:true},
  {feat:'Guía de hidratación',       ess:false,pro:true, elite:true},
  {feat:'Validación deportólogo',    ess:false,pro:false,elite:true},
  {feat:'Canal con deportólogo',     ess:false,pro:false,elite:true},
]


export function MembresíasPage() {
  const { showToast } = useAppStore()
  const [plans, setPlans] = useState(() => PLANS)
  const [compareRows, setCompareRows] = useState(() => COMPARE)
  const [tab, setTab] = useState<MTab>('planes')
  const [billing, setBilling] = useState<'m'|'a'>('m')
  const [disc, setDisc] = useState(15)
  const [prices, setPrices] = useState({ ess: 9.99, pro: 19.99, elite: 29.99 })
  const [active, setActive] = useState({ ess: true, pro: true, elite: true })

  const handleAddFeature = (planKey: string) => {
    const text = prompt('Nueva característica para el plan:')
    if (text && text.trim()) {
      setPlans(prev => prev.map(p => {
        if (p.key === planKey) {
          return { ...p, features: [...p.features, text.trim()] }
        }
        return p
      }))
      showToast('Característica agregada con éxito')
    }
  }

  const handleAddCompareRow = () => {
    const text = prompt('Nueva característica comparativa:')
    if (text && text.trim()) {
      if (compareRows.some(r => r.feat.toLowerCase() === text.trim().toLowerCase())) {
        showToast('Esta característica ya existe en la comparativa')
        return
      }
      setCompareRows(prev => [
        ...prev,
        { feat: text.trim(), ess: false, pro: false, elite: false }
      ])
      showToast('Fila agregada con éxito')
    }
  }

  const handleDeleteCompareRow = (featName: string) => {
    setCompareRows(prev => prev.filter(r => r.feat !== featName))
    showToast('Fila eliminada con éxito')
  }

  const handleToggleCompareCell = (featName: string, key: 'ess' | 'pro' | 'elite') => {
    setCompareRows(prev => prev.map(r => {
      if (r.feat === featName) {
        return { ...r, [key]: !(r as any)[key] }
      }
      return r
    }))
  }

  const revenue = Math.round(1213 * prices.ess + 634 * prices.pro + 89 * prices.elite)
  const saving = (prices.pro * disc / 100 * 12).toFixed(2)

  const tabs: {id:MTab;label:string}[] = [{id:'planes',label:'Planes'},{id:'comparativa',label:'Comparativa'}]

  return (
    <div>
      <div className="flex items-start justify-between mb-5 gap-3 flex-wrap">
        <div><h2 className="text-lg font-bold">Membresías</h2><p className="text-[12px] text-surface-muted mt-0.5">Estadísticas y configuración de planes</p></div>
        <Button onClick={() => showToast('Cambios guardados')} variant="primary">💾 Guardar</Button>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-5">
        <StatCard label="Ingresos este mes" value={`$${revenue.toLocaleString()}`} valueColor="#4CAF82" delta="↑ +18%" deltaUp />
        <StatCard label="Essential" value="1,213" delta="activos" />
        <StatCard label="Pro" value="634" valueColor="#E8622A" delta="↑ popular" deltaUp />
        <StatCard label="Elite" value="89" valueColor="#F5C842" />
      </div>

      <div className="flex gap-0.5 border-b border-surface-border mb-5 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={cn('px-3.5 py-2 text-[12px] cursor-pointer border-0 bg-transparent whitespace-nowrap transition-all border-b-2 -mb-px', tab === t.id ? 'text-brand-orange border-brand-orange font-medium' : 'text-surface-muted border-transparent hover:text-white')}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'planes' && (
        <div>
          {/* Controls */}
          <div className="flex items-center gap-4 mb-5 flex-wrap">
            <div className="flex bg-surface-card2 border border-surface-border rounded-lg p-0.5 gap-0.5">
              <button onClick={() => setBilling('m')} className={cn('px-3 py-1 rounded-md text-[12px] cursor-pointer border-0 transition-all', billing==='m' ? 'bg-brand-orange text-white' : 'text-surface-muted')}>Mensual</button>
              <button onClick={() => setBilling('a')} className={cn('px-3 py-1 rounded-md text-[12px] cursor-pointer border-0 transition-all flex items-center gap-1', billing==='a' ? 'bg-brand-orange text-white' : 'text-surface-muted')}>
                Anual <span className="text-[10px] bg-brand-green/20 text-brand-green px-1.5 rounded-full">−15%</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-surface-muted">Descuento anual:</span>
              <div className="flex items-center bg-surface-card2 border border-surface-border rounded-lg overflow-hidden">
                <input type="number" value={disc} onChange={e => setDisc(Number(e.target.value))} className="bg-transparent border-0 outline-none text-[13px] font-bold text-white w-12 text-center py-1.5 px-1" min={0} max={50} />
                <span className="px-2 text-surface-muted text-[12px] border-l border-surface-border">%</span>
              </div>
              <span className="text-[11px] text-brand-green">ahorro ${saving}/año en Pro</span>
            </div>
          </div>

          {/* Plans grid */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            {plans.map((p) => {
              const priceKey = p.key as 'ess'|'pro'|'elite'
              const price = billing === 'm' ? prices[priceKey] : (prices[priceKey] * (1 - disc/100))
              return (
                <div key={p.key} className={cn('card-base p-0 overflow-hidden', p.key === 'pro' && 'border-brand-orange border-2')}>
                  <div className="px-4 py-3 border-b border-surface-border flex items-center justify-between gap-2 flex-wrap" style={{borderTop:`3px solid ${p.color}`}}>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0" style={{background:`${p.color}22`}}>{p.icon}</div>
                      <div><div className="text-[14px] font-bold">{p.name}</div><div className="text-[10px] text-surface-muted">{p.desc}</div></div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={p.tagVariant}>{p.tagText}</Badge>
                      <div className="flex items-center gap-1.5 text-[11px] text-surface-muted">Activo<Toggle checked={active[priceKey]} onChange={v => setActive(prev=>({...prev,[priceKey]:v}))} /></div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div>
                        <div className="form-label">Precio {billing==='m'?'mensual':'anual/mes'}</div>
                        <div className="flex items-center bg-surface-card2 border border-surface-border rounded-lg overflow-hidden focus-within:border-brand-orange">
                          <span className="px-2 text-surface-muted text-[12px] border-r border-surface-border py-1.5">$</span>
                          <input type="number" value={price.toFixed(2)} onChange={e => setPrices(prev=>({...prev,[priceKey]:Number(e.target.value)}))} className="bg-transparent border-0 outline-none text-[13px] font-bold text-white w-full px-2 py-1.5" step="0.01" />
                        </div>
                      </div>
                      <div>
                        <div className="form-label">Días prueba gratis</div>
                        <input type="number" defaultValue={p.trial} className="form-input" />
                      </div>
                      <div className="col-span-2">
                        <div className="form-label">Descripción</div>
                        <input type="text" defaultValue={p.desc} className="form-input" />
                      </div>
                    </div>
                    <div className="text-[10px] text-surface-muted uppercase tracking-[0.7px] font-semibold mb-2">Características</div>
                    {p.features.map(f => (
                      <div key={f} className="flex items-center gap-2 py-1.5 border-b border-surface-border last:border-0 text-[12px]">
                        <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-[10px]" style={{background:`${p.color}22`,color:p.color}}>✓</div>
                        {f}
                      </div>
                    ))}
                    <Button onClick={() => handleAddFeature(p.key)} className="w-full mt-3 py-1.5 text-[11px]" variant="ghost">+ Agregar característica</Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {tab === 'comparativa' && (
        <div className="card-base p-0 overflow-hidden">
          <div className="p-3.5 border-b border-surface-border flex items-center justify-between">
            <span className="text-[13px] font-semibold">Tabla comparativa</span>
            <Button onClick={handleAddCompareRow} variant="primary" size="sm">+ Fila</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[12px]">
              <thead>
                <tr>
                  <th className="text-left p-2.5 text-[10px] text-surface-muted uppercase border-b border-surface-border font-medium min-w-40">Característica</th>
                  <th className="text-center p-2.5 text-[10px] text-surface-muted uppercase border-b border-surface-border font-medium min-w-14">ESS</th>
                  <th className="text-center p-2.5 text-[10px] uppercase border-b border-surface-border font-medium min-w-14 text-brand-orange">PRO</th>
                  <th className="text-center p-2.5 text-[10px] text-surface-muted uppercase border-b border-surface-border font-medium min-w-14">ELITE</th>
                  <th className="p-2.5 border-b border-surface-border w-10"></th>
                </tr>
              </thead>
              <tbody>
                {compareRows.map((r) => (
                  <tr key={r.feat} className="hover:bg-white/[0.015]">
                    <td className="p-2.5 border-b border-surface-border">{r.feat}</td>
                    {['ess','pro','elite'].map(k => {
                      const val = (r as any)[k]
                      return (
                        <td key={k} className="p-2.5 border-b border-surface-border text-center">
                          <button 
                            onClick={() => handleToggleCompareCell(r.feat, k as 'ess'|'pro'|'elite')}
                            className="bg-transparent border-0 outline-none cursor-pointer hover:scale-110 transition-transform active:opacity-50 inline-block"
                            title={`Alternar ${r.feat} para ${k.toUpperCase()}`}
                          >
                            {val ? <span style={{color:k==='pro'?'#E8622A':'#4CAF82',fontSize:16}}>✓</span> : <span className="text-surface-muted">—</span>}
                          </button>
                        </td>
                      )
                    })}
                    <td className="p-2.5 border-b border-surface-border">
                      <Button onClick={() => handleDeleteCompareRow(r.feat)} variant="danger" size="sm">✕</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  )
}
