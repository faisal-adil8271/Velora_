import { useVelora } from '../../context'
import {
  Users,
  CreditCard,
  LogOut,
} from 'lucide-react'

export default function TableBilling() {
  const { tables, orders, settleBill, clearTable } = useVelora()

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-zinc-900">Table Occupancy & Live Billing</h3>
        <p className="text-xs text-zinc-500">
          Monitor table dining status, settle pending Pay Later bills, and reset cleared tables.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tables.map((table) => {
          const activeOrder = orders.find(
            (o) =>
              o.tableNumber === table.number &&
              o.status !== 'served' &&
              o.status !== 'rejected'
          ) || orders.find((o) => o.tableNumber === table.number)

          const isOccupied = table.status === 'occupied' || !!activeOrder
          const hasPendingBill = activeOrder && activeOrder.paymentStatus === 'pending'

          return (
            <div
              key={table.id}
              className={`bg-white rounded-2xl border p-4 shadow-2xs flex flex-col justify-between ${
                hasPendingBill
                  ? 'border-amber-400 bg-amber-50/20 ring-1 ring-amber-300'
                  : isOccupied
                  ? 'border-zinc-300'
                  : 'border-zinc-200/80 bg-zinc-50/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold font-mono text-zinc-900">
                      Table {table.number < 10 ? `0${table.number}` : table.number}
                    </span>
                    <span className="text-xs text-zinc-400 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {table.capacity} Seats
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      isOccupied
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {isOccupied ? 'Occupied' : 'Available'}
                  </span>
                </div>

                <div className="py-3">
                  {activeOrder ? (
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Active Order:</span>
                        <span className="font-mono font-bold text-zinc-800">
                          {activeOrder.id}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Status:</span>
                        <span className="font-semibold uppercase text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700">
                          {activeOrder.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Items:</span>
                        <span className="text-zinc-700 font-medium">
                          {activeOrder.items.length} dishes
                        </span>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-zinc-100">
                        <span className="text-zinc-700 font-bold">Total Bill:</span>
                        <span className="font-mono font-extrabold text-zinc-900">
                          ₹{activeOrder.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-xs text-zinc-400">
                      Table is clean and ready for guests.
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-100 flex items-center gap-2">
                {hasPendingBill && (
                  <button
                    onClick={() => settleBill(activeOrder.id)}
                    className="flex-1 py-1.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-2xs"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Settle Bill</span>
                  </button>
                )}

                {isOccupied && (
                  <button
                    onClick={() => clearTable(table.number)}
                    className="py-1.5 px-3 rounded-xl border border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 text-xs font-semibold flex items-center justify-center gap-1 transition"
                    title="Mark Table Vacated & Cleaned"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Free Table</span>
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
