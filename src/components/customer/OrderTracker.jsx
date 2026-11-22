import { useState, useEffect } from 'react'
import { useVelora } from '../../context'
import PaymentModal from './PaymentModal'
import {
  Clock,
  CheckCircle2,
  ChefHat,
  UtensilsCrossed,
  Sparkles,
  CreditCard,
  ShoppingBag,
} from 'lucide-react'

export default function OrderTracker({ onOrderMore }) {
  const {
    activeCustomerOrder,
    settleBill,
    selectedTable,
    setCustomerActiveOrderId,
  } = useVelora()
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  useEffect(() => {
    if (!activeCustomerOrder?.createdAt) return
    const update = () => {
      const diff = Math.max(
        0,
        Math.floor((Date.now() - new Date(activeCustomerOrder.createdAt).getTime()) / 1000)
      )
      setElapsedSeconds(diff)
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [activeCustomerOrder?.createdAt])

  if (!activeCustomerOrder) {
    return (
      <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-sm p-6 text-center max-w-lg mx-auto my-6">
        <UtensilsCrossed className="w-10 h-10 text-zinc-300 mx-auto mb-2" />
        <h3 className="text-base font-bold text-zinc-900">No Active Order</h3>
        <p className="text-xs text-zinc-500 mt-1 mb-4">
          Table {selectedTable} currently has no pending or live orders.
        </p>
        <button
          onClick={onOrderMore}
          className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-semibold hover:bg-amber-700 transition"
        >
          Browse Menu & Order
        </button>
      </div>
    )
  }

  const {
    id,
    status,
    tableNumber,
    items,
    grandTotal,
    paymentStatus,
  } = activeCustomerOrder

  const stages = [
    {
      key: 'pending_approval',
      title: 'Order Placed',
      description: 'Manager review & validation',
      icon: Clock,
    },
    {
      key: 'approved',
      title: 'Manager Approved',
      description: 'Accepted & routed to kitchen',
      icon: CheckCircle2,
    },
    {
      key: 'cooking',
      title: 'Cooking in Kitchen',
      description: 'Chefs are crafting your dishes',
      icon: ChefHat,
    },
    {
      key: 'ready',
      title: 'Ready for Pickup',
      description: 'Plated & waiter dispatched',
      icon: Sparkles,
    },
    {
      key: 'served',
      title: 'Served',
      description: 'Delivered to your table. Bon Appétit!',
      icon: UtensilsCrossed,
    },
  ]

  const getStageIndex = (currentStatus) => {
    switch (currentStatus) {
      case 'pending_approval':
        return 0
      case 'approved':
        return 1
      case 'cooking':
        return 2
      case 'ready':
        return 3
      case 'served':
        return 4
      case 'rejected':
        return -1
      default:
        return 0
    }
  }

  const currentIndex = getStageIndex(status)

  const formatTimer = (totalSec) => {
    const mins = Math.floor(totalSec / 60)
    const secs = totalSec % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-sm overflow-hidden mb-6">
        <div className="bg-[#18181B] text-white p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                  {id}
                </span>
                <span className="text-zinc-400">•</span>
                <span className="text-xs font-semibold text-zinc-300">
                  Table {tableNumber}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold mt-1 text-white">
                Live Order Tracking
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800 border border-zinc-700 text-xs font-mono text-amber-300">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTimer(elapsedSeconds)}</span>
              </div>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                  paymentStatus === 'paid'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}
              >
                {paymentStatus === 'paid' ? 'PAID' : 'PAY LATER (PENDING)'}
              </span>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6 border-b border-zinc-100">
          <div className="space-y-6">
            {stages.map((stage, idx) => {
              const Icon = stage.icon
              const isPast = currentIndex > idx
              const isCurrent = currentIndex === idx

              return (
                <div key={stage.key} className="flex items-start gap-4 relative">
                  {idx !== stages.length - 1 && (
                    <div
                      className={`absolute left-4 top-8 -bottom-6 w-0.5 transition-colors ${
                        isPast ? 'bg-emerald-500' : 'bg-zinc-200'
                      }`}
                    />
                  )}

                  <div
                    className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isPast
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-amber-600 text-white ring-4 ring-amber-100 shadow-sm animate-pulse'
                        : 'bg-zinc-100 text-zinc-400 border border-zinc-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-sm font-bold ${
                          isCurrent
                            ? 'text-amber-800'
                            : isPast
                            ? 'text-zinc-900'
                            : 'text-zinc-400'
                        }`}
                      >
                        {stage.title}
                      </h4>
                      {isCurrent && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          Active Stage
                        </span>
                      )}
                      {isPast && (
                        <span className="text-[10px] font-bold text-emerald-600">
                          Completed
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-xs mt-0.5 ${
                        isCurrent ? 'text-zinc-600' : 'text-zinc-400'
                      }`}
                    >
                      {stage.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="p-5 sm:p-6 bg-zinc-50/60">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">
            Item Breakdown ({items.length} items)
          </h4>
          <div className="space-y-2 mb-4">
            {items.map((it, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-xs sm:text-sm text-zinc-700"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-zinc-200 text-zinc-800 font-bold flex items-center justify-center text-[10px]">
                    {it.quantity}x
                  </span>
                  <span className="font-medium text-zinc-800">{it.name}</span>
                </div>
                <span className="font-mono font-semibold text-zinc-900">
                  ₹{(it.price * it.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-zinc-200/80 flex items-center justify-between">
            <div>
              <span className="text-xs text-zinc-500">Grand Total (incl. GST)</span>
              <div className="text-lg font-bold text-zinc-900 font-mono">
                ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>

            {paymentStatus === 'pending' ? (
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Settle Bill Now</span>
              </button>
            ) : (
              <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Bill Paid</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-white border-t border-zinc-100 flex flex-wrap gap-3">
          <button
            onClick={onOrderMore}
            className="flex-1 py-2.5 px-4 rounded-xl border border-zinc-300 hover:bg-zinc-50 text-zinc-800 text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            <ShoppingBag className="w-4 h-4 text-amber-600" />
            <span>Order More Dishes</span>
          </button>
          {status === 'served' && (
            <button
              onClick={() => setCustomerActiveOrderId(null)}
              className="py-2.5 px-4 rounded-xl bg-[#18181B] text-white text-xs font-semibold hover:bg-zinc-800 transition"
            >
              Start New Order
            </button>
          )}
        </div>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        totalAmount={grandTotal}
        orderId={id}
        tableNumber={tableNumber}
        onPaymentSuccess={() => settleBill(id)}
      />
    </div>
  )
}
