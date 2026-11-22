import { useState } from 'react'
import { useVelora } from '../../context'
import VegBadge from '../common/VegBadge'
import { useCurrentTime } from '../../utils/time'
import {
  ChefHat,
  Clock,
  AlertTriangle,
  Sparkles,
  Check,
} from 'lucide-react'

export default function KitchenKDS() {
  const { orders, markFoodReady } = useVelora()
  const [checkedItems, setCheckedItems] = useState({})
  const currentTime = useCurrentTime(1000)

  const kdsTickets = orders.filter(
    (o) => o.status === 'approved' || o.status === 'cooking'
  )

  const toggleCheckItem = (ticketId, itemIdx) => {
    const key = `${ticketId}_${itemIdx}`
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const getElapsedTime = (approvedAt, createdAt) => {
    const startTime = approvedAt || createdAt
    if (!startTime) return { minutes: 0, text: '0m', urgency: 'normal' }
    const elapsedMs = currentTime - new Date(startTime).getTime()
    const minutes = Math.floor(elapsedMs / 60000)
    const seconds = Math.floor((elapsedMs % 60000) / 1000)

    let urgency = 'normal'
    if (minutes >= 20) urgency = 'critical'
    else if (minutes >= 10) urgency = 'warning'

    return {
      minutes,
      seconds,
      text: `${minutes}m ${seconds < 10 ? '0' : ''}${seconds}s`,
      urgency,
    }
  }

  return (
    <div className="min-h-[85vh] bg-zinc-950 text-white p-4 sm:p-6">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-zinc-800 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white font-mono">
                Kitchen Display System (KDS)
              </h2>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-xs text-zinc-400">
              Live prep station • {kdsTickets.length} active tickets in queue
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> &lt; 10m
          </div>
          <div className="flex items-center gap-1.5 text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> 10-20m
          </div>
          <div className="flex items-center gap-1.5 text-rose-400">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> &gt; 20m Urg
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {kdsTickets.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/40">
            <ChefHat className="w-12 h-12 text-zinc-700 mx-auto mb-2" />
            <h3 className="text-base font-bold text-zinc-300">Station Clear</h3>
            <p className="text-xs text-zinc-500 mt-1">
              No pending kitchen tickets. Orders approved by the manager will flash here instantly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {kdsTickets.map((ticket) => {
              const timer = getElapsedTime(ticket.approvedAt, ticket.createdAt)

              const headerBg =
                timer.urgency === 'critical'
                  ? 'bg-rose-950/80 border-b border-rose-800'
                  : timer.urgency === 'warning'
                  ? 'bg-amber-950/80 border-b border-amber-800'
                  : 'bg-zinc-900 border-b border-zinc-800'

              const timerBadge =
                timer.urgency === 'critical'
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
                  : timer.urgency === 'warning'
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'

              return (
                <div
                  key={ticket.id}
                  className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-xl overflow-hidden flex flex-col justify-between transition-all hover:border-zinc-700"
                >
                  <div>
                    <div className={`p-4 ${headerBg}`}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-black font-mono text-white tracking-tight">
                            TABLE {ticket.tableNumber < 10 ? `0${ticket.tableNumber}` : ticket.tableNumber}
                          </span>
                        </div>
                        <span
                          className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${timerBadge}`}
                        >
                          <Clock className="w-3 h-3" />
                          {timer.text}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                        <span>{ticket.id}</span>
                        <span>{ticket.items.reduce((s, i) => s + i.quantity, 0)} items</span>
                      </div>
                    </div>

                    {ticket.specialNotes && (
                      <div className="p-3 bg-amber-500/10 border-b border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-[10px] uppercase block tracking-wider text-amber-400">
                            Kitchen Note
                          </span>
                          <span className="italic">{ticket.specialNotes}</span>
                        </div>
                      </div>
                    )}

                    <div className="p-4 space-y-2.5 divide-y divide-zinc-800/60">
                      {ticket.items.map((item, idx) => {
                        const isDone = !!checkedItems[`${ticket.id}_${idx}`]

                        return (
                          <div
                            key={idx}
                            onClick={() => toggleCheckItem(ticket.id, idx)}
                            className={`pt-2.5 first:pt-0 flex items-start justify-between gap-2 cursor-pointer transition select-none ${
                              isDone ? 'opacity-40 line-through' : 'opacity-100'
                            }`}
                          >
                            <div className="flex items-start gap-2.5 min-w-0">
                              <span
                                className={`w-5 h-5 rounded-md flex items-center justify-center border transition flex-shrink-0 mt-0.5 ${
                                  isDone
                                    ? 'bg-emerald-600 border-emerald-500 text-white'
                                    : 'border-zinc-700 bg-zinc-800 text-transparent'
                                }`}
                              >
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </span>
                              <div className="min-w-0">
                                <div className="text-sm font-bold text-zinc-100 leading-snug">
                                  {item.name}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                              <VegBadge isVeg={item.isVeg} size="sm" />
                              <span className="text-base font-black font-mono text-amber-400 px-2 py-0.5 rounded bg-zinc-800">
                                {item.quantity}x
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="p-4 bg-zinc-950 border-t border-zinc-800">
                    <button
                      onClick={() => markFoodReady(ticket.id)}
                      className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition cursor-pointer active:scale-[0.98]"
                    >
                      <Sparkles className="w-4 h-4 text-emerald-200" />
                      <span>MARK FOOD READY</span>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
