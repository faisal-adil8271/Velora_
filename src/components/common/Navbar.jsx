import { useVelora } from '../../context'
import { UtensilsCrossed, Sparkles } from 'lucide-react'

export default function Navbar() {
  const { currentRole, selectedTable } = useVelora()

  const roleTitles = {
    customer: `Guest Experience • Table ${selectedTable || '–'}`,
    manager: 'Manager Operations & Live Control',
    kitchen: 'Kitchen Display System (KDS)',
    waiter: 'Staff Waiter Interface',
    superadmin: 'Super Admin & Executive Analytics',
  }

  return (
    <header className="bg-white border-b border-zinc-200/80 sticky top-[45px] z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#18181B] text-amber-500 flex items-center justify-center shadow-inner">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-[#18181B] font-mono leading-none">
                velora<span className="text-amber-600">_</span>
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200/70 px-1.5 py-0.5 rounded-full">
                Haute Hospitality
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 font-medium">
              {roleTitles[currentRole]}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Real-time LocalSync</span>
          </div>
        </div>
      </div>
    </header>
  )
}
