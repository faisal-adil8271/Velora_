import { useVelora } from '../../context'
import {
  Smartphone,
  LayoutDashboard,
  ChefHat,
  Bell,
  LineChart,
  RotateCcw,
} from 'lucide-react'

export default function RoleSwitcher() {
  const {
    currentRole,
    setCurrentRole,
    orders,
    cart,
    selectedTable,
    resetDemoData,
  } = useVelora()

  const pendingApprovalCount = orders.filter((o) => o.status === 'pending_approval').length
  const kitchenTicketsCount = orders.filter(
    (o) => o.status === 'approved' || o.status === 'cooking'
  ).length
  const readyToServeCount = orders.filter((o) => o.status === 'ready').length
  const cartItemCount = Object.values(cart).reduce((a, b) => a + b, 0)

  const roles = [
    {
      id: 'customer',
      label: 'Customer',
      subtext: `Table ${selectedTable || '–'}`,
      icon: Smartphone,
      badge: cartItemCount > 0 ? `${cartItemCount}` : null,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      id: 'manager',
      label: 'Manager',
      subtext: 'Orders & Menu',
      icon: LayoutDashboard,
      badge: pendingApprovalCount > 0 ? `${pendingApprovalCount} New` : null,
      badgeColor: 'bg-amber-600 text-white animate-pulse',
    },
    {
      id: 'kitchen',
      label: 'Kitchen KDS',
      subtext: 'Ticket Board',
      icon: ChefHat,
      badge: kitchenTicketsCount > 0 ? `${kitchenTicketsCount} Active` : null,
      badgeColor: 'bg-amber-500 text-zinc-900 font-bold',
    },
    {
      id: 'waiter',
      label: 'Waiter View',
      subtext: 'Ready to Serve',
      icon: Bell,
      badge: readyToServeCount > 0 ? `${readyToServeCount} Ready` : null,
      badgeColor: 'bg-emerald-500 text-white animate-bounce',
    },
    {
      id: 'superadmin',
      label: 'Super Admin',
      subtext: 'Revenue & Trends',
      icon: LineChart,
      badge: null,
      badgeColor: '',
    },
  ]

  return (
    <aside
      aria-label="Demo Role Switcher"
      className="sticky top-0 z-40 bg-[#18181B] border-b border-zinc-800 text-white shadow-md"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 flex-shrink-0 pr-2 border-r border-zinc-800">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping inline-block" />
          <span className="font-extrabold text-sm sm:text-base tracking-tight text-white font-mono">
            velora<span className="text-amber-500">_</span>
          </span>
          <span className="hidden md:inline-block text-[11px] font-medium uppercase tracking-wider text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded-full">
            Role Switcher
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {roles.map((role) => {
            const Icon = role.icon
            const isActive = currentRole === role.id
            return (
              <button
                key={role.id}
                onClick={() => setCurrentRole(role.id)}
                className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-sm ring-1 ring-amber-400'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-800/90'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                <span className="whitespace-nowrap font-medium">{role.label}</span>
                {role.badge && (
                  <span
                    className={`ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none shadow-sm ${role.badgeColor}`}
                  >
                    {role.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <button
          onClick={resetDemoData}
          title="Reset to fresh demo orders & state"
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white px-2.5 py-1.5 rounded-md hover:bg-zinc-800 transition flex-shrink-0 ml-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden lg:inline text-[11px]">Reset Demo</span>
        </button>
      </div>
    </aside>
  )
}
