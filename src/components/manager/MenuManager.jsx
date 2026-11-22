import { useState } from 'react'
import { useVelora } from '../../context'
import VegBadge from '../common/VegBadge'
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  X,
} from 'lucide-react'

export default function MenuManager() {
  const {
    menuItems,
    toggleStock,
    updateMenuItem,
    addMenuItem,
    deleteMenuItem,
  } = useVelora()

  const [search, setSearch] = useState('')
  const [editingItem, setEditingItem] = useState(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const [newDish, setNewDish] = useState({
    name: '',
    category: 'Starters',
    price: '',
    description: '',
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    tags: ['New'],
  })

  const filteredItems = menuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  )

  const handleSaveEdit = (e) => {
    e.preventDefault()
    if (!editingItem) return
    updateMenuItem({
      ...editingItem,
      price: Number(editingItem.price),
    })
    setEditingItem(null)
  }

  const handleCreateDish = (e) => {
    e.preventDefault()
    if (!newDish.name || !newDish.price) return
    addMenuItem({
      ...newDish,
      price: Number(newDish.price),
      tags: typeof newDish.tags === 'string' ? newDish.tags.split(',') : newDish.tags,
    })
    setIsAddModalOpen(false)
    setNewDish({
      name: '',
      category: 'Starters',
      price: '',
      description: '',
      isVeg: true,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      tags: ['New'],
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-zinc-900">Menu & Price Catalog</h3>
          <p className="text-xs text-zinc-500">
            Edit dish prices, description, and toggle live 86 / In-Stock status instantly.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter dishes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-zinc-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
            />
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Dish</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((dish) => (
          <div
            key={dish.id}
            className={`bg-white rounded-2xl border p-4 shadow-2xs hover:shadow-sm transition flex flex-col justify-between ${
              dish.inStock ? 'border-zinc-200/90' : 'border-zinc-200 bg-zinc-50/70'
            }`}
          >
            <div>
              <div className="flex items-start gap-3">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-16 h-16 rounded-xl object-cover flex-shrink-0 bg-zinc-100"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <VegBadge isVeg={dish.isVeg} size="sm" />
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      {dish.category}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-zinc-900 truncate">
                    {dish.name}
                  </h4>
                  <p className="text-[11px] text-zinc-500 line-clamp-2 mt-0.5">
                    {dish.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-zinc-400 block">Dine-in Price</span>
                <span className="text-sm font-bold text-zinc-900 font-mono">
                  ₹{dish.price.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleStock(dish.id)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold transition ${
                    dish.inStock
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      : 'bg-zinc-200 text-zinc-600 hover:bg-zinc-300'
                  }`}
                  title="Toggle In Stock / Out of Stock"
                >
                  {dish.inStock ? (
                    <>
                      <ToggleRight className="w-4 h-4 text-emerald-600" />
                      <span>In Stock</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-4 h-4 text-zinc-500" />
                      <span>Sold Out</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setEditingItem(dish)}
                  className="p-1.5 rounded-lg border border-zinc-200 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50 transition"
                  title="Edit Dish"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => deleteMenuItem(dish.id)}
                  className="p-1.5 rounded-lg border border-zinc-200 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  title="Delete Dish"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-zinc-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-zinc-900">Edit Dish Details</h3>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Dish Name</label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Category</label>
                  <select
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  >
                    <option value="Starters">Starters</option>
                    <option value="Main Course">Main Course</option>
                    <option value="Desserts & Drinks">Desserts & Drinks</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingItem.description}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, description: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 resize-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="flex-1 py-2 rounded-xl border border-zinc-200 text-zinc-600 hover:bg-zinc-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-zinc-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-zinc-900">Add New Dish to Menu</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDish} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Dish Name</label>
                <input
                  type="text"
                  placeholder="e.g. Saffron Risotto"
                  value={newDish.name}
                  onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 595"
                    value={newDish.price}
                    onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Category</label>
                  <select
                    value={newDish.category}
                    onChange={(e) => setNewDish({ ...newDish, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  >
                    <option value="Starters">Starters</option>
                    <option value="Main Course">Main Course</option>
                    <option value="Desserts & Drinks">Desserts & Drinks</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4 py-1">
                <label className="font-bold text-zinc-700">Type:</label>
                <button
                  type="button"
                  onClick={() => setNewDish({ ...newDish, isVeg: true })}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-semibold ${
                    newDish.isVeg ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'border-zinc-200 text-zinc-500'
                  }`}
                >
                  <VegBadge isVeg={true} size="sm" /> Veg
                </button>
                <button
                  type="button"
                  onClick={() => setNewDish({ ...newDish, isVeg: false })}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-semibold ${
                    !newDish.isVeg ? 'bg-rose-50 border-rose-300 text-rose-800' : 'border-zinc-200 text-zinc-500'
                  }`}
                >
                  <VegBadge isVeg={false} size="sm" /> Non-Veg
                </button>
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Appetizing description of ingredients and culinary style..."
                  value={newDish.description}
                  onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 resize-none"
                  required
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-zinc-200 text-zinc-600 hover:bg-zinc-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-sm"
                >
                  Add to Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
