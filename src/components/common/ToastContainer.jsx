import { useVelora } from '../../context'
import { CheckCircle2, AlertCircle, ChefHat, Bell, Info, X } from 'lucide-react'

export default function ToastContainer() {
  const { toasts, removeToast } = useVelora()

  if (!toasts.length) return null

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
      case 'kds':
        return <ChefHat className="w-5 h-5 text-amber-400 flex-shrink-0 animate-bounce" />
      case 'waiter':
        return <Bell className="w-5 h-5 text-emerald-400 flex-shrink-0 animate-pulse" />
      default:
        return <Info className="w-5 h-5 text-sky-400 flex-shrink-0" />
    }
  }

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-[#18181B] text-white border border-zinc-700/80 rounded-xl shadow-2xl p-3.5 flex items-start gap-3 transition-all duration-300 transform translate-y-0"
        >
          <div className="mt-0.5">{getIcon(toast.type)}</div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              {toast.title}
            </h4>
            <p className="text-sm font-medium text-zinc-100 mt-0.5 leading-snug">
              {toast.message}
            </p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-zinc-400 hover:text-white p-1 rounded transition"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
