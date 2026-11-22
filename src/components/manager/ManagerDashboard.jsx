import { useState } from 'react'
import { useVelora } from '../../context'
import IncomingOrders from './IncomingOrders'
import MenuManager from './MenuManager'
import TableBilling from './TableBilling'
import {
  Inbox,
  BookOpen,
  LayoutGrid,
  TrendingUp,
  Utensils,
} from 'lucide-react'

export default function ManagerDashboard() {
  const { orders, tables } = useVelora()
  const [activeTab, setActiveTab] = useState('incoming')

  const pendingOrders = orders.filter((o) => o.status === 'pending_approval')
  const occupiedTables = tables.filter((t) => t.status === 'occupied').length
  const todayRevenue = orders
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.grandTotal, 0)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl border border-zinc-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Orders</span>
            <Inbox className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-zinc-900 font-mono">
            {pendingOrders.length}
          </div>
          <span className="text-[11px] text-amber-700 font-medium">Needs manager review</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-zinc-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Tables</span>
            <LayoutGrid className="w-4 h-4 text-zinc-700" />
          </div>
          <div className="text-2xl font-extrabold text-zinc-900 font-mono">
            {occupiedTables} / 12
          </div>
          <span className="text-[11px] text-zinc-500">Currently seated</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-zinc-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Paid Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-zinc-900 font-mono">
            ₹{todayRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
          <span className="text-[11px] text-emerald-700 font-medium">Settled today</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-zinc-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Kitchen Load</span>
            <Utensils className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-zinc-900 font-mono">
            {orders.filter((o) => o.status === 'cooking').length}
          </div>
          <span className="text-[11px] text-zinc-500">Tickets in prep</span>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-zinc-200 mb-6 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('incoming')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
            activeTab === 'incoming'
              ? 'bg-[#18181B] text-white shadow-sm'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Incoming Order Queue</span>
          {pendingOrders.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-mono text-[10px] flex items-center justify-center font-bold">
              {pendingOrders.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('menu')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
            activeTab === 'menu'
              ? 'bg-[#18181B] text-white shadow-sm'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Menu & Price Catalog</span>
        </button>

        <button
          onClick={() => setActiveTab('tables')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
            activeTab === 'tables'
              ? 'bg-[#18181B] text-white shadow-sm'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span>Active Tables & Billing</span>
        </button>
      </div>

      {activeTab === 'incoming' && <IncomingOrders />}
      {activeTab === 'menu' && <MenuManager />}
      {activeTab === 'tables' && <TableBilling />}
    </div>
  )
}
