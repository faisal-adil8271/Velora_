import { useState, useMemo } from 'react'
import { useVelora } from '../../context'
import VegBadge from '../common/VegBadge'
import {
  Search,
  Plus,
  Minus,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react'

export default function MenuSection({ onOpenCart, onChangeTable, onOpenTracker }) {
  const {
    menuItems,
    cart,
    addToCart,
    removeFromCart,
    selectedTable,
    activeCustomerOrder,
  } = useVelora()

  const [activeCategory, setActiveCategory] = useState('Starters')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterVegOnly, setFilterVegOnly] = useState(false)

  const categories = ['Starters', 'Main Course', 'Desserts & Drinks']

  const filteredDishes = useMemo(() => {
    return menuItems.filter((dish) => {
      const matchCategory = dish.category === activeCategory
      const matchSearch =
        dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchVeg = filterVegOnly ? dish.isVeg : true
      return matchCategory && matchSearch && matchVeg
    })
  }, [menuItems, activeCategory, searchQuery, filterVegOnly])

  const totalCartCount = Object.values(cart).reduce((sum, q) => sum + q, 0)
  const cartSubtotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = menuItems.find((m) => m.id === id)
    return sum + (item ? item.price * qty : 0)
  }, 0)

  return (
    <div className="pb-28">
      <div className="sticky top-[103px] z-20 bg-white/95 backdrop-blur-md border-b border-zinc-200/80 px-4 py-2.5 shadow-xs">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200/90 rounded-full">
              <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
              <span className="text-xs font-bold text-amber-900 font-mono">
                Table {selectedTable < 10 ? `0${selectedTable}` : selectedTable}
              </span>
            </div>
            <button
              onClick={onChangeTable}
              className="text-[11px] font-semibold text-zinc-500 hover:text-zinc-800 underline underline-offset-2 transition"
            >
              Switch Table
            </button>
          </div>

          {activeCustomerOrder && (
            <button
              onClick={onOpenTracker}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
              <span>Track Live Order ({activeCustomerOrder.status})</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}

          <div className="flex items-center gap-2 w-full sm:w-auto mt-1 sm:mt-0">
            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-zinc-200 bg-zinc-50/70 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
              />
            </div>
            <button
              onClick={() => setFilterVegOnly(!filterVegOnly)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
                filterVegOnly
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              <VegBadge isVeg={true} size="sm" />
              <span>Veg Only</span>
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto flex items-center gap-2 mt-2.5 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#18181B] text-white shadow-sm'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {filteredDishes.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-zinc-200 p-8">
            <Filter className="w-10 h-10 text-zinc-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-zinc-800">No dishes match your filter</h3>
            <p className="text-xs text-zinc-500 mt-1">
              Try adjusting your search terms or toggling the Veg Only filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDishes.map((dish) => {
              const qty = cart[dish.id] || 0
              const isOutOfStock = !dish.inStock

              return (
                <div
                  key={dish.id}
                  className={`relative bg-white rounded-2xl border border-zinc-200/90 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between p-4 ${
                    isOutOfStock ? 'opacity-70 bg-zinc-50/70' : ''
                  }`}
                >
                  <div className="flex gap-4">
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden flex-shrink-0 bg-zinc-100">
                      <img
                        src={dish.image}
                        alt={dish.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {isOutOfStock && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-1 text-center">
                          <span className="text-[10px] font-bold uppercase text-white bg-red-600/90 px-1.5 py-0.5 rounded">
                            Sold Out
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <VegBadge isVeg={dish.isVeg} />
                        {dish.tags?.map((t, i) => (
                          <span
                            key={i}
                            className="text-[9px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <h3 className="text-sm font-bold text-zinc-900 leading-snug">
                        {dish.name}
                      </h3>
                      <p className="text-xs text-zinc-500 line-clamp-2 mt-1 leading-relaxed">
                        {dish.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-100">
                    <div className="text-sm sm:text-base font-extrabold text-zinc-900 font-mono">
                      ₹{dish.price.toLocaleString('en-IN')}
                    </div>

                    {isOutOfStock ? (
                      <span className="text-xs font-semibold text-zinc-400 bg-zinc-100 px-3 py-1.5 rounded-xl">
                        Unavailable
                      </span>
                    ) : qty === 0 ? (
                      <button
                        onClick={() => addToCart(dish)}
                        className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs hover:shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    ) : (
                      <div className="flex items-center bg-amber-50 border border-amber-300 rounded-xl p-0.5 shadow-xs">
                        <button
                          onClick={() => removeFromCart(dish.id)}
                          className="w-7 h-7 rounded-lg bg-white text-amber-900 hover:bg-amber-100 flex items-center justify-center transition"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-extrabold text-amber-900 font-mono">
                          {qty}
                        </span>
                        <button
                          onClick={() => addToCart(dish)}
                          className="w-7 h-7 rounded-lg bg-amber-600 text-white hover:bg-amber-700 flex items-center justify-center transition"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {totalCartCount > 0 && (
        <aside
          aria-label="Cart Overview"
          className="fixed bottom-4 left-4 right-4 max-w-md mx-auto z-30 animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <div className="bg-[#18181B] text-white rounded-2xl shadow-2xl p-3.5 flex items-center justify-between border border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-zinc-400 font-medium">
                  {totalCartCount} {totalCartCount === 1 ? 'item' : 'items'} in cart
                </div>
                <div className="text-base font-bold text-white font-mono">
                  ₹{cartSubtotal.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <button
              onClick={onOpenCart}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm transition cursor-pointer"
            >
              <span>View Cart & Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}
    </div>
  )
}
