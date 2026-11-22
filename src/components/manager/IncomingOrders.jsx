import { useVelora } from '../../context'
import VegBadge from '../common/VegBadge'
import { useCurrentTime, formatElapsedMinutes } from '../../utils/time'
import {
  Clock,
  CheckCircle2,
  XCircle,
  MessageSquare,
  ChefHat,
} from 'lucide-react'

export default function IncomingOrders() {
  const { orders, approveOrder, rejectOrder } = useVelora()
  const currentTime = useCurrentTime(10000)

  const pendingOrders = orders.filter((o) => o.status === 'pending_approval')
  const approvedRecentOrders = orders.filter(
    (o) => o.status === 'approved' || o.status === 'cooking'
  )

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <span>Incoming Orders Awaiting Approval</span>
              {pendingOrders.length > 0 && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white animate-pulse">
                  {pendingOrders.length} New
                </span>
              )}
            </h3>
            <p className="text-xs text-zinc-500">
              Review guest orders, verify kitchen capacity, and send to KDS.
            </p>
          </div>
        </div>

        {pendingOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-zinc-300 p-8 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-zinc-800">All caught up!</h4>
            <p className="text-xs text-zinc-500 mt-1">
              No orders waiting in queue. As customers place orders, they appear here live.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingOrders.map((ord) => {
              const isPaid = ord.paymentStatus === 'paid'

              return (
                <div
                  key={ord.id}
                  className="bg-white rounded-2xl border-2 border-amber-500/60 shadow-md p-4 sm:p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between pb-3 border-b border-zinc-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-extrabold font-mono text-zinc-900">
                            Table {ord.tableNumber < 10 ? `0${ord.tableNumber}` : ord.tableNumber}
                          </span>
                          <span className="text-[11px] font-mono text-zinc-400">
                            #{ord.id}
                          </span>
                        </div>
                        <div className="text-[11px] text-zinc-500 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-zinc-400" />
                          <span>{formatElapsedMinutes(ord.createdAt, currentTime)}</span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          isPaid
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                            : 'bg-amber-50 text-amber-700 border border-amber-300'
                        }`}
                      >
                        {isPaid ? 'PAID' : 'PAY LATER'}
                      </span>
                    </div>

                    <div className="py-3 space-y-2 border-b border-zinc-100">
                      {ord.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs text-zinc-700"
                        >
                          <div className="flex items-center gap-1.5 min-w-0 pr-2">
                            <span className="font-bold text-amber-900 font-mono w-4">
                              {item.quantity}x
                            </span>
                            <VegBadge isVeg={item.isVeg} size="sm" />
                            <span className="font-medium truncate">{item.name}</span>
                          </div>
                          <span className="font-mono text-zinc-600 font-semibold flex-shrink-0">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>

                    {ord.specialNotes && (
                      <div className="py-2.5 px-3 bg-amber-50/70 border border-amber-200/80 rounded-xl my-2.5 text-xs flex items-start gap-1.5 text-amber-900">
                        <MessageSquare className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <span className="italic">{ord.specialNotes}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3">
                    <div className="flex items-center justify-between mb-3 text-xs">
                      <span className="text-zinc-500">Total Bill</span>
                      <span className="text-base font-extrabold text-zinc-900 font-mono">
                        ₹{ord.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => rejectOrder(ord.id)}
                        className="py-2 px-3 rounded-xl border border-zinc-200 text-zinc-600 hover:text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>

                      <button
                        onClick={() => approveOrder(ord.id)}
                        className="py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition"
                      >
                        <ChefHat className="w-3.5 h-3.5" />
                        <span>Approve to KDS</span>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {approvedRecentOrders.length > 0 && (
        <div className="pt-4 border-t border-zinc-200">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3 flex items-center gap-2">
            <ChefHat className="w-4 h-4 text-amber-600" />
            <span>Currently in Kitchen ({approvedRecentOrders.length} active)</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {approvedRecentOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-3 bg-white border border-zinc-200 rounded-xl shadow-2xs flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-xs text-zinc-900 font-mono">
                    Table {ord.tableNumber} • {ord.id}
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    {ord.items.length} items • ₹{ord.grandTotal}
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  {ord.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
