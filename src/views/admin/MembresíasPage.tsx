import { useEffect, useState } from 'react'
import { StatCard } from '@/components/ui/StatCard'
import { Toggle } from '@/components/ui/Toggle'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/utils'
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query'
import { UpdatePlanPayload, MembershipBenefit } from '@/types'
import { membershipsService } from '@/services/endpoints/memberships'
import { Modal } from '@/components/ui/Modal'

const MEMBERSHIP_BENEFITS_QUERY_KEY = ['adminBenefitsInfo']

export const PLAN_AESTHETICS: Record<string, {
  icon: string
  color: string
  tagText: string
  tagVariant: 'green' | 'orange' | 'yellow' | 'blue' | 'red' | 'purple' | 'muted'
  descDefault: string
}> = {
  ess: {
    icon: '🧠',
    color: '#4CAF82',
    tagText: '21 días gratis',
    descDefault: 'Plan 100% IA',
    tagVariant: 'green',
  },
  pro: {
    icon: '🥗',
    color: '#E8622A',
    tagText: 'Más popular',
    descDefault: '+ nutrición e hidratación IA',
    tagVariant: 'orange',
  },
  elite: {
    icon: '🛡️',
    color: '#F5C842',
    tagText: 'Premium',
    descDefault: '+ validación de deportólogo',
    tagVariant: 'yellow',
  }
}

const normalizePlanId = (p: any): 'ess' | 'pro' | 'elite' => {
  const id = String(p.id_plan || p.key || p.nombre || '').toLowerCase();
  if (id.includes('ess')) return 'ess';
  if (id.includes('pro')) return 'pro';
  if (id.includes('elite')) return 'elite';
  return 'ess';
};

type MTab = 'planes' | 'comparativa'

const MEMBERSHIP_STATS_QUERY_KEY = ['adminMembershipStats']
const MEMBERSHIP_PLANS_QUERY_KEY = ['adminPlansInfo']

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
  const [compareRows, setCompareRows] = useState(() => COMPARE)
  const [tab, setTab] = useState<MTab>('planes')
  const [billing, setBilling] = useState<'m'|'a'>('m')
    const [disc, setDisc] = useState(15)
    const [planDrafts, setPlanDrafts] = useState<Record<string, Partial<UpdatePlanPayload>>>({})

  const handleUpdateDraft = (id_plan: string, field: keyof UpdatePlanPayload, value: any) => {
    setPlanDrafts(prev => {
      const existing = prev[id_plan] || { id_plan };
      return {
        ...prev,
        [id_plan]: {
          ...existing,
          [field]: value
        }
      };
    });
  };

  const getPlanMonthlyPrice = (p: any) => {
    if (!p) return 0;
    const draft = planDrafts[p.id_plan] || {};
    if (draft.monto !== undefined) return draft.monto;
    return p.precios?.find((pr: any) => pr.frecuencia === 'mensual')?.precio ?? 0;
  };

  const [activeLinkPlanId, setActiveLinkPlanId] = useState<string | null>(null)
  const [selectedBenefitId, setSelectedBenefitId] = useState<string>('')
  const [isNewBenefit, setIsNewBenefit] = useState<boolean>(false)
  const [newBenefitName, setNewBenefitName] = useState<string>('')
  const [newBenefitDesc, setNewBenefitDesc] = useState<string>('')

  const queryClient = useQueryClient();

  const updatePlanMutation = useMutation({
    mutationFn: membershipsService.updatePlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEMBERSHIP_PLANS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: MEMBERSHIP_STATS_QUERY_KEY });
      showToast('Cambios guardados con éxito');
    },
    onError: (error: any) => {
      showToast(`Error al guardar cambios: ${error.message || error}`);
    }
  });

  const { data: benefits, isLoading: isLoadingBenefits } = useQuery<MembershipBenefit[]>({
    queryKey: MEMBERSHIP_BENEFITS_QUERY_KEY,
    queryFn: membershipsService.getBenefitsInfo,
    enabled: activeLinkPlanId !== null,
  });

  const linkBenefitMutation = useMutation({
    mutationFn: membershipsService.linkBenefit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEMBERSHIP_PLANS_QUERY_KEY });
      setActiveLinkPlanId(null);
      setSelectedBenefitId('');
      setNewBenefitName('');
      setNewBenefitDesc('');
      setIsNewBenefit(false);
      showToast('Beneficio vinculado con éxito');
    },
    onError: (error: any) => {
      showToast(`Error al vincular beneficio: ${error.message || error}`);
    }
  });

  // Queries
  const { data: stats, isLoading: isLoadingStats, isError: isErrorStats, refetch: refetchStats, error: errorStats } = useQuery({
    queryKey: MEMBERSHIP_STATS_QUERY_KEY,
    queryFn: membershipsService.getMembershipStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  const { data: plans, isLoading: isLoadingPlans, isError: isErrorPlans, refetch: refetchPlans, error: errorPlans } = useQuery({
    queryKey: MEMBERSHIP_PLANS_QUERY_KEY,
    queryFn: membershipsService.getPlansInfo,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

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

  // Calculate revenue based on fetched stats and plans
  const revenue = stats && plans ? Math.round(
    stats.essential_activos * getPlanMonthlyPrice(plans.find((p: any) => normalizePlanId(p) === 'ess')) +
    stats.pro_activos * getPlanMonthlyPrice(plans.find((p: any) => normalizePlanId(p) === 'pro')) +
    stats.elite_activos * getPlanMonthlyPrice(plans.find((p: any) => normalizePlanId(p) === 'elite'))
  ) : 0
  const saving = plans ? (((getPlanMonthlyPrice(plans.find((p: any) => normalizePlanId(p) === 'pro')) * disc / 100 * 12).toFixed(2))) : '0.00'

  const tabs: {id:MTab;label:string}[] = [{id:'planes',label:'Planes'},{id:'comparativa',label:'Comparativa'}]

  return (
    <div>
      <div className="flex items-start justify-between mb-5 gap-3 flex-wrap">
        <div><h2 className="text-lg font-bold">Membresías</h2><p className="text-[12px] text-surface-muted mt-0.5">Estadísticas y configuración de planes</p></div>
        <Button onClick={async () => {
          if (Object.keys(planDrafts).length === 0) {
            showToast("No hay cambios pendientes para guardar");
            return;
          }

          for (const draft of Object.values(planDrafts)) {
            if (draft.monto !== undefined && draft.monto < 0) {
              showToast("El precio no puede ser negativo");
              return;
            }
            if (draft.dias_prueba !== undefined && draft.dias_prueba < 0) {
              showToast("Los días de prueba no pueden ser negativos");
              return;
            }
          }

          const draftsArray = Object.values(planDrafts);
          try {
            await Promise.all(draftsArray.map(draft => updatePlanMutation.mutateAsync(draft as UpdatePlanPayload)));
            setPlanDrafts({}); // Clear local drafts on success
            showToast("Todos los cambios se guardaron con éxito");
          } catch (err) {
            // Error handled in mutation onError
          }
        }} variant="primary">💾 Guardar</Button>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-5">
        {isLoadingStats ? (
          <>
            <div className="card-base h-24 animate-pulse bg-surface-card" />
            <div className="card-base h-24 animate-pulse bg-surface-card" />
            <div className="card-base h-24 animate-pulse bg-surface-card" />
            <div className="card-base h-24 animate-pulse bg-surface-card" />
          </>
        ) : isErrorStats ? (
          <div className="col-span-4 card-base p-4 text-center text-red-400 bg-red-950/10 border border-red-900/20 text-xs">
            Error al cargar estadísticas: {(errorStats as any)?.message || 'Error de conexión'}
          </div>
        ) : (
          <>
            <StatCard label="Ingresos este mes" value={`$${revenue.toLocaleString()}`} valueColor="#4CAF82" delta={stats?.crecimiento_porcentaje !== undefined ? `↑ +${stats.crecimiento_porcentaje}%` : '↑ +0%'} deltaUp />
            <StatCard label="Essential" value={stats?.essential_activos.toLocaleString() || '0'} delta="activos" />
            <StatCard label="Pro" value={stats?.pro_activos.toLocaleString() || '0'} valueColor="#E8622A" delta="activos" />
            <StatCard label="Elite" value={stats?.elite_activos.toLocaleString() || '0'} valueColor="#F5C842" />
          </>
        )}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {isLoadingPlans ? (
              <>
                <div className="card-base h-80 animate-pulse bg-surface-card rounded-xl" />
                <div className="card-base h-80 animate-pulse bg-surface-card rounded-xl" />
                <div className="card-base h-80 animate-pulse bg-surface-card rounded-xl" />
              </>
            ) : isErrorPlans ? (
              <div className="col-span-3 card-base p-6 text-center text-red-400 bg-red-950/10 border border-red-900/20 text-xs rounded-xl">
                Error al cargar los planes: {(errorPlans as any)?.message || 'Error de conexión'}
              </div>
            ) : plans && plans.length > 0 ? (
              plans.map((p: any) => {
                const planKey = normalizePlanId(p)
                const aesthetics = PLAN_AESTHETICS[planKey] || PLAN_AESTHETICS.ess
                const draft = planDrafts[p.id_plan] || {}
                
                const baseMonthlyPrice = draft.monto !== undefined ? draft.monto : (p.precios?.find((pr: any) => pr.frecuencia === 'mensual')?.precio ?? 0)
                const displayTrial = draft.dias_prueba !== undefined ? draft.dias_prueba : (p.dias_prueba ?? 0)
                const displayDesc = draft.descripcion !== undefined ? draft.descripcion : (p.descripcion || '')
                const displayActive = draft.activo !== undefined ? draft.activo : (p.activo ?? p.estado ?? true)
                
                return (
                  <div key={p.id_plan} className={cn('card-base p-0 overflow-hidden bg-surface-card border border-surface-border rounded-xl flex flex-col justify-between', planKey === 'pro' && 'border-brand-orange border-2')}>
                    <div>
                      {/* Top Header line colored */}
                      <div className="px-4 py-3 border-b border-surface-border flex items-center justify-between gap-2 flex-wrap" style={{borderTop:'3px solid '+aesthetics.color}}>
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0" style={{background:'' + aesthetics.color + '22'}}>{aesthetics.icon}</div>
                          <div>
                            <div className="text-[14px] font-bold text-white">{p.nombre}</div>
                            <div className="text-[10px] text-surface-muted line-clamp-1">{displayDesc}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant={aesthetics.tagVariant}>{aesthetics.tagText}</Badge>
                          <div className="flex items-center gap-1.5 text-[11px] text-surface-muted">
                            Activo
                            <Toggle 
                              checked={displayActive} 
                              onChange={v => handleUpdateDraft(p.id_plan, 'activo', v)} 
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Form Details */}
                      <div className="p-4">
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          <div>
                            <div className="form-label text-[10px] text-surface-muted mb-1">Precio base mensual</div>
                            <div className="flex items-center bg-surface-card2 border border-surface-border rounded-lg overflow-hidden focus-within:border-brand-purple">
                              <span className="px-2 text-surface-muted text-[12px] border-r border-surface-border py-1.5">$</span>
                              <input 
                                type="number" 
                                value={baseMonthlyPrice} 
                                onChange={e => handleUpdateDraft(p.id_plan, 'monto', Number(e.target.value))} 
                                className="bg-transparent border-0 outline-none text-[13px] font-bold text-white w-full px-2 py-1.5" 
                                step="0.01" 
                                min="0"
                              />
                            </div>
                          </div>
                          <div>
                            <div className="form-label text-[10px] text-surface-muted mb-1">Días prueba gratis</div>
                            <input 
                              type="number" 
                              value={displayTrial} 
                              onChange={e => handleUpdateDraft(p.id_plan, 'dias_prueba', Number(e.target.value))} 
                              className="form-input bg-surface-card2 border border-surface-border rounded-lg text-[13px] font-bold text-white w-full px-2.5 py-1.5 outline-none focus:border-brand-purple" 
                              min="0"
                            />
                          </div>
                          <div className="col-span-2">
                            <div className="form-label text-[10px] text-surface-muted mb-1">Descripción</div>
                            <input 
                              type="text" 
                              value={displayDesc} 
                              onChange={e => handleUpdateDraft(p.id_plan, 'descripcion', e.target.value)} 
                              className="form-input bg-surface-card2 border border-surface-border rounded-lg text-[12px] text-white w-full px-2.5 py-1.5 outline-none focus:border-brand-purple" 
                            />
                          </div>
                        </div>

                        {/* Calculated pricing shorthand info */}
                        <div className="text-[11px] mb-4 bg-surface-card2/50 border border-surface-border/30 rounded-lg p-2 text-surface-muted">
                          {billing === 'm' ? (
                            <span>💳 Facturado mensual: <strong className="text-white">${baseMonthlyPrice.toFixed(2)}/mes</strong></span>
                          ) : (
                            <span>📅 Facturado anual (-{p.descuento_anual || 15}% desc): <strong className="text-brand-green">${(baseMonthlyPrice * (1 - (p.descuento_anual || 15)/100)).toFixed(2)}/mes</strong></span>
                          )}
                        </div>
                        
                        {/* Characteristics */}
                        <div className="text-[10px] text-surface-muted uppercase tracking-[0.7px] font-semibold mb-2">Características</div>
                        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                          {(p.caracteristicas || []).map((f: string) => (
                            <div key={f} className="flex items-center gap-2 py-1 border-b border-surface-border last:border-0 text-[12px]">
                              <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-[9px]" style={{background:'' + aesthetics.color + '22',color:aesthetics.color}}>✓</div>
                              <span className="text-white/90 text-[11px]">{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <Button 
                        onClick={() => setActiveLinkPlanId(p.id_plan)} 
                        className="w-full py-1.5 text-[11px] border border-surface-border hover:bg-white/[0.02]" 
                        variant="ghost"
                      >
                        + Vincular característica
                      </Button>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="col-span-3 card-base p-6 text-center text-surface-muted italic text-xs rounded-xl">
                No se encontraron planes configurados.
              </div>
            )}
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
                  <th className="text-center p-2.5 text-[10px] uppercase border-b border-surface-border font-medium min-w-14">PRO</th>
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

      <Modal
        isOpen={activeLinkPlanId !== null}
        onClose={() => { setActiveLinkPlanId(null); setIsNewBenefit(false); setNewBenefitName(''); setNewBenefitDesc(''); setSelectedBenefitId(''); }}
        title="Vincular Característica / Beneficio"
      >
        <div className="flex items-center justify-center gap-4 mb-4">
          <Button
            variant={!isNewBenefit ? 'primary' : 'ghost'}
            onClick={() => setIsNewBenefit(false)}
            className="w-1/2"
          >
            Seleccionar beneficio existente
          </Button>
          <Button
            variant={isNewBenefit ? 'primary' : 'ghost'}
            onClick={() => setIsNewBenefit(true)}
            className="w-1/2"
          >
            Crear nuevo beneficio
          </Button>
        </div>

        {!isNewBenefit ? (
          <div className="mb-4">
            <label htmlFor="benefit-select" className="form-label">Seleccionar Beneficio</label>
            <select
              id="benefit-select"
              className="form-select w-full"
              value={selectedBenefitId}
              onChange={(e) => setSelectedBenefitId(e.target.value)}
            >
              <option value="">{isLoadingBenefits ? 'Cargando beneficios...' : 'Selecciona un beneficio'}</option>
              {benefits?.map((b) => (
                <option key={b.id_beneficio} value={b.id_beneficio}>{b.nombre}</option>
              ))}
            </select>
          </div>
        ) : (
          <div className="mb-4">
            <div className="form-label">Nombre del nuevo beneficio <span className="text-red-500">*</span></div>
            <input
              type="text"
              className="form-input w-full mb-2"
              value={newBenefitName}
              onChange={(e) => setNewBenefitName(e.target.value)}
              placeholder="Ej: Soporte 24/7"
            />
            <div className="form-label">Descripción (opcional)</div>
            <textarea
              className="form-textarea w-full"
              value={newBenefitDesc}
              onChange={(e) => setNewBenefitDesc(e.target.value)}
              placeholder="Una breve descripción del beneficio"
            />
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            onClick={() => { setActiveLinkPlanId(null); setIsNewBenefit(false); setNewBenefitName(''); setNewBenefitDesc(''); setSelectedBenefitId(''); }}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              if (isNewBenefit) {
                if (!newBenefitName.trim()) {
                  showToast("El nombre del nuevo beneficio no puede estar vacío");
                  return;
                }
                linkBenefitMutation.mutate({
                  id_plan: activeLinkPlanId!,
                  nuevo_nombre: newBenefitName.trim(),
                  nueva_descripcion: newBenefitDesc.trim(),
                });
              } else {
                if (!selectedBenefitId) {
                  showToast("Selecciona un beneficio para vincular");
                  return;
                }
                linkBenefitMutation.mutate({
                  id_plan: activeLinkPlanId!,
                  id_beneficio: selectedBenefitId,
                });
              }
            }}
            disabled={linkBenefitMutation.isPending}
          >
            {linkBenefitMutation.isPending ? 'Vinculando...' : 'Vincular'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}