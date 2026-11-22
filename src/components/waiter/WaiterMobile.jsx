import { useState } from 'react'
import { useVelora } from '../../context'
import VegBadge from '../common/VegBadge'
import { useCurrentTime, formatElapsedMinutes } from '../../utils/time'
import {
  Bell,
  CheckCircle2,
  Clock,
  Users,
} from 'lucide-react'

export default function WaiterMobile() {
  const { orders, markFoodServed, tables } = useVelora()
  const [activeTab, setActiveTab] = useState('ready')
  const currentTime = useCurrentTime(10000)

  const readyOrders = orders.filter((o) => o.status === 'ready')

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {readyOrders.length > 0 && (
        <div className="bg-emerald-600 text-white rounded-2xl p-4 mb-6 shadow-lg flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wide">
                Food Ready for Service!
              </h3>
              <p className="text-xs text-emerald-100">
                {readyOrders.length} {readyOrders.length === 1 ? 'order' : 'orders'} waiting at the pass
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold bg-white text-emerald-900 px-3 py-1 rounded-full shadow-2xs">
            PICKUP NOW
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 bg-zinc-200/80 p-1 rounded-2xl mb-6">
        <button
          onClick={() => setActiveTab('ready')}
          className={`py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
            activeTab === 'ready'
              ? 'bg-[#18181B] text-white shadow-sm'
              : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          <Bell className="w-4 h-4 text-emerald-400" />
          <span>Ready to Serve</span>
          {readyOrders.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-mono text-[10px] flex items-center justify-center font-bold">
              {readyOrders.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('tables')}
          className={`py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
            activeTab === 'tables'
              ? 'bg-[#18181B] text-white shadow-sm'
              : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          <Users className="w-4 h-4 text-amber-500" />
          <span>Table Overview</span>
        </button>
      </div>

      {activeTab === 'ready' && (
        <div className="space-y-4">
          {readyOrders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-zinc-300 p-10 text-center">
              <CheckCircle2 className="w-10 h-10 text-zinc-300 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-zinc-800">No food waiting at pass</h4>
              <p className="text-xs text-zinc-500 mt-1">
                When kitchen finishes plating an order, it will appear here with an instant alert.
              </p>
            </div>
          ) : (
            readyOrders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white rounded-2xl border-2 border-emerald-500/80 shadow-md p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-black font-mono text-zinc-900">
                        TABLE {ord.tableNumber < 10 ? `0${ord.tableNumber}` : ord.tableNumber}
                      </span>
                      <span className="text-xs font-mono text-zinc-400">
                        #{ord.id}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formatElapsedMinutes(ord.readyAt, currentTime)}</span>
                    </div>
                  </div>

                  <div className="py-3 space-y-2">
                    {ord.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs sm:text-sm text-zinc-800"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded">
                            {item.quantity}x
                          </span>
                          <VegBadge isVeg={item.isVeg} size="sm" />
                          <span className="font-semibold">{item.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {ord.specialNotes && (
                    <div className="p-2.5 bg-zinc-50 rounded-xl text-xs text-zinc-600 mb-3 italic">
                      Note: {ord.specialNotes}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-zinc-100">
                  <button
                    onClick={() => markFoodServed(ord.id)}
                    className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>MARK SERVED TO TABLE {ord.tableNumber}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'tables' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {tables.map((table) => {
            const isOccupied = table.status === 'occupied'

            return (
              <div
                key={table.id}
                className={`p-3.5 rounded-2xl border transition ${
                  isOccupied
                    ? 'bg-amber-50/50 border-amber-300'
                    : 'bg-white border-zinc-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-black font-mono text-zinc-900">
                    T-{table.number < 10 ? `0${table.number}` : table.number}
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isOccupied ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'
                    }`}
                  />
                </div>
                <div className="text-[11px] text-zinc-500">
                  Capacity: {table.capacity} guests
                </div>
                <div
                  className={`mt-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-center ${
                    isOccupied
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {isOccupied ? 'Seated' : 'Available'}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
