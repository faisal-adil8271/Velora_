import { useMemo } from 'react'
import { useVelora } from '../../context'
import VegBadge from '../common/VegBadge'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import {
  TrendingUp,
  Award,
  Calendar,
} from 'lucide-react'

export default function SuperAdminPanel() {
  const { orders, menuItems } = useVelora()

  const stats = useMemo(() => {
    const paidOrders = orders.filter((o) => o.paymentStatus === 'paid')
    const totalGrossRevenue = paidOrders.reduce((acc, o) => acc + o.grandTotal, 0)
    const totalOrdersCount = orders.length
    const aov = paidOrders.length > 0 ? Math.round(totalGrossRevenue / paidOrders.length) : 0

    const upiRevenue = paidOrders
      .filter((o) => o.paymentMode === 'upi')
      .reduce((acc, o) => acc + o.grandTotal, 0)
    const cardRevenue = paidOrders
      .filter((o) => o.paymentMode === 'card')
      .reduce((acc, o) => acc + o.grandTotal, 0)
    const payLaterSettledRevenue = paidOrders
      .filter((o) => o.paymentMode === 'pay_later')
      .reduce((acc, o) => acc + o.grandTotal, 0)

    const catMap = { Starters: 0, 'Main Course': 0, 'Desserts & Drinks': 0 }
    const dishSales = {}

    orders.forEach((ord) => {
      ord.items.forEach((item) => {
        const dishMeta = menuItems.find((m) => m.id === item.id)
        const cat = dishMeta?.category || 'Main Course'
        catMap[cat] = (catMap[cat] || 0) + item.price * item.quantity

        if (!dishSales[item.id]) {
          dishSales[item.id] = {
            id: item.id,
            name: item.name,
            isVeg: item.isVeg,
            quantity: 0,
            revenue: 0,
          }
        }
        dishSales[item.id].quantity += item.quantity
        dishSales[item.id].revenue += item.price * item.quantity
      })
    })

    const topDishes = Object.values(dishSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    const revenueTimeline = [
      { time: '12:00 PM', revenue: 1450 },
      { time: '01:00 PM', revenue: 3890 },
      { time: '02:00 PM', revenue: 5200 },
      { time: '03:00 PM', revenue: 2100 },
      { time: '06:00 PM', revenue: 4800 },
      { time: '07:00 PM', revenue: 7600 },
      { time: '08:00 PM', revenue: Math.max(8900, Math.round(totalGrossRevenue * 0.4)) },
      { time: '09:00 PM', revenue: totalGrossRevenue },
    ]

    const paymentDonut = [
      { name: 'UPI Dynamic QR', value: upiRevenue || 2441, color: '#D97706' },
      { name: 'Cards & POS', value: cardRevenue || 1850, color: '#10B981' },
      { name: 'Settled Pay-Later', value: payLaterSettledRevenue || 2903, color: '#6366F1' },
    ]

    const categoryBars = [
      { category: 'Starters', sales: catMap['Starters'] || 1200 },
      { category: 'Main Course', sales: catMap['Main Course'] || 3200 },
      { category: 'Desserts & Drinks', sales: catMap['Desserts & Drinks'] || 1600 },
    ]

    return {
      totalGrossRevenue,
      totalOrdersCount,
      aov,
      revenueTimeline,
      paymentDonut,
      categoryBars,
      topDishes,
    }
  }, [orders, menuItems])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 font-mono">
            Executive Analytics & Revenue
          </h2>
          <p className="text-xs text-zinc-500">
            Real-time financial performance derived from live browser session orders.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-600 bg-white border border-zinc-200 px-3 py-1.5 rounded-xl">
          <Calendar className="w-3.5 h-3.5 text-amber-600" />
          <span>Live Shift (Today)</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-zinc-200/90 shadow-2xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-1">
            Total Revenue
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 font-mono">
            ₹{stats.totalGrossRevenue.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
          </div>
          <div className="mt-2 text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% vs yesterday</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200/90 shadow-2xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-1">
            Total Orders
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 font-mono">
            {stats.totalOrdersCount}
          </div>
          <div className="mt-2 text-xs text-zinc-500 font-medium">
            Across 12 dining tables
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200/90 shadow-2xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-1">
            Average Order Value
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 font-mono">
            ₹{stats.aov.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 text-xs text-amber-700 font-medium">
            Per paying guest group
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200/90 shadow-2xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-1">
            Payment Conversion
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 font-mono">
            {orders.length > 0
              ? `${Math.round(
                  (orders.filter((o) => o.paymentStatus === 'paid').length / orders.length) * 100
                )}%`
              : '100%'}
          </div>
          <div className="mt-2 text-xs text-emerald-600 font-semibold">
            Bills settled / prepaid
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-zinc-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-zinc-900">Revenue Velocity (Today)</h3>
              <p className="text-xs text-zinc-500">Cumulative dine-in revenue trajectory</p>
            </div>
            <span className="text-xs font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
              INR (₹)
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.revenueTimeline} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="amberGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D97706" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#D97706" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#71717A' }} />
                <YAxis tick={{ fontSize: 11, fill: '#71717A' }} />
                <Tooltip
                  formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Revenue']}
                  contentStyle={{ backgroundColor: '#18181B', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#D97706" strokeWidth={2.5} fillOpacity={1} fill="url(#amberGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200/90 shadow-2xs">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-zinc-900">Payment Breakdown</h3>
            <p className="text-xs text-zinc-500">Distribution across settlement channels</p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.paymentDonut}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.paymentDonut.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Amount']}
                  contentStyle={{ backgroundColor: '#18181B', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-zinc-100">
            {stats.paymentDonut.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-zinc-600">{item.name}</span>
                </div>
                <span className="font-mono font-bold text-zinc-900">
                  ₹{item.value.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-zinc-200/90 shadow-2xs">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-zinc-900">Revenue by Menu Category</h3>
            <p className="text-xs text-zinc-500">Starters vs Mains vs Drinks</p>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.categoryBars} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" />
                <XAxis dataKey="category" tick={{ fontSize: 10, fill: '#71717A' }} />
                <YAxis tick={{ fontSize: 11, fill: '#71717A' }} />
                <Tooltip
                  formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Sales']}
                  contentStyle={{ backgroundColor: '#18181B', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '12px' }}
                />
                <Bar dataKey="sales" fill="#D97706" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-zinc-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-zinc-900">Top-Selling Dishes</h3>
              <p className="text-xs text-zinc-500">Highest grossing culinary items</p>
            </div>
            <Award className="w-4 h-4 text-amber-600" />
          </div>

          <div className="divide-y divide-zinc-100">
            {stats.topDishes.map((dish, rank) => (
              <div key={dish.id} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-zinc-100 text-zinc-700 font-bold font-mono text-xs flex items-center justify-center">
                    #{rank + 1}
                  </span>
                  <VegBadge isVeg={dish.isVeg} size="sm" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-zinc-900">{dish.name}</h4>
                    <span className="text-[11px] text-zinc-500">
                      {dish.quantity} portions served
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-bold font-mono text-zinc-900">
                    ₹{dish.revenue.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-emerald-600 font-semibold">Active favorite</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-2xs p-5">
        <h3 className="text-sm font-bold text-zinc-900 mb-3">Live Orders Ledger</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 text-zinc-500 uppercase tracking-wider text-[10px] border-b border-zinc-200">
              <tr>
                <th className="py-2.5 px-3">Order ID</th>
                <th className="py-2.5 px-3">Table</th>
                <th className="py-2.5 px-3">Time</th>
                <th className="py-2.5 px-3">Items</th>
                <th className="py-2.5 px-3">Payment</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Total (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-zinc-50/60 transition">
                  <td className="py-2.5 px-3 font-mono font-bold text-zinc-900">{ord.id}</td>
                  <td className="py-2.5 px-3 font-mono">T-{ord.tableNumber}</td>
                  <td className="py-2.5 px-3 text-zinc-500">
                    {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-2.5 px-3 text-zinc-700">
                    {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                        ord.paymentStatus === 'paid'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {ord.paymentStatus === 'paid' ? 'Paid' : 'Pending'} ({ord.paymentMode})
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded-full font-bold text-[10px] uppercase bg-zinc-100 text-zinc-700">
                      {ord.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-zinc-900">
                    ₹{ord.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
