import { useState } from 'react'
import { useVelora } from '../../context'
import VegBadge from '../common/VegBadge'
import PaymentModal from './PaymentModal'
import {
  X,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  QrCode,
  UtensilsCrossed,
  ArrowRight,
} from 'lucide-react'

export default function CartDrawer({ isOpen, onClose, onOrderPlaced }) {
  const {
    cart,
    menuItems,
    addToCart,
    removeFromCart,
    clearCart,
    placeOrder,
    selectedTable,
  } = useVelora()

  const [paymentMode, setPaymentMode] = useState('pay_later')
  const [specialNotes, setSpecialNotes] = useState('')
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)

  if (!isOpen) return null

  const cartEntries = Object.entries(cart)
    .map(([id, qty]) => {
      const item = menuItems.find((m) => m.id === id)
      return item ? { ...item, quantity: qty } : null
    })
    .filter(Boolean)

  const subtotal = cartEntries.reduce((acc, it) => acc + it.price * it.quantity, 0)
  const gst = Math.round(subtotal * 0.05 * 100) / 100
  const grandTotal = Math.round((subtotal + gst) * 100) / 100

  const handleCheckoutClick = () => {
    if (paymentMode === 'pay_before') {
      setIsPaymentModalOpen(true)
    } else {
      const orderId = placeOrder({ paymentMode: 'pay_later', specialNotes })
      if (orderId) {
        onClose()
        onOrderPlaced(orderId)
      }
    }
  }

  const handlePayBeforeSuccess = () => {
    const orderId = placeOrder({ paymentMode: 'upi', specialNotes })
    if (orderId) {
      onClose()
      onOrderPlaced(orderId)
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
        <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          <div className="p-4 sm:p-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-zinc-900">Your Dining Cart</h3>
                <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                  Table {selectedTable}
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                {cartEntries.length} {cartEntries.length === 1 ? 'dish' : 'dishes'} selected
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 transition"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cartEntries.length === 0 ? (
              <div className="text-center py-16">
                <UtensilsCrossed className="w-12 h-12 text-zinc-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-zinc-800">Your cart is empty</h4>
                <p className="text-xs text-zinc-500 mt-1">
                  Add appetizing dishes from the menu to place an order.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {cartEntries.map((dish) => (
                    <div
                      key={dish.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-zinc-200/90 bg-zinc-50/50"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <VegBadge isVeg={dish.isVeg} size="sm" />
                        <div className="min-w-0 flex-1 pr-2">
                          <h4 className="text-xs sm:text-sm font-bold text-zinc-900 truncate">
                            {dish.name}
                          </h4>
                          <span className="text-xs font-mono text-zinc-500">
                            ₹{dish.price} each
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="flex items-center bg-white border border-zinc-200 rounded-lg p-0.5 shadow-2xs">
                          <button
                            onClick={() => removeFromCart(dish.id)}
                            className="w-6 h-6 rounded text-zinc-600 hover:bg-zinc-100 flex items-center justify-center transition"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold font-mono text-zinc-800">
                            {dish.quantity}
                          </span>
                          <button
                            onClick={() => addToCart(dish)}
                            className="w-6 h-6 rounded text-amber-600 hover:bg-amber-50 flex items-center justify-center transition"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="w-16 text-right font-mono font-bold text-xs sm:text-sm text-zinc-900">
                          ₹{(dish.price * dish.quantity).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-200/70">
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Special Cooking Request / Allergies
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Less oil, extra spicy, no peanuts..."
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-zinc-200 bg-zinc-50/60 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition resize-none"
                  />
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-200/70">
                  <label className="block text-xs font-bold text-zinc-700 mb-2">
                    Select Payment Preference
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMode('pay_before')}
                      className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                        paymentMode === 'pay_before'
                          ? 'border-amber-600 bg-amber-50/80 ring-2 ring-amber-500/30'
                          : 'border-zinc-200 bg-zinc-50/60 hover:bg-zinc-100'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-amber-700 mb-1">
                        <QrCode className="w-4 h-4" />
                        <span className="text-xs font-bold">Pay Before</span>
                      </div>
                      <span className="text-[10px] text-zinc-500 leading-tight">
                        Instant UPI / Card. Marked Paid immediately.
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMode('pay_later')}
                      className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                        paymentMode === 'pay_later'
                          ? 'border-amber-600 bg-amber-50/80 ring-2 ring-amber-500/30'
                          : 'border-zinc-200 bg-zinc-50/60 hover:bg-zinc-100'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-zinc-800 mb-1">
                        <CreditCard className="w-4 h-4 text-amber-600" />
                        <span className="text-xs font-bold">Pay After Meal</span>
                      </div>
                      <span className="text-[10px] text-zinc-500 leading-tight">
                        Order now, settle bill at end of dining.
                      </span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {cartEntries.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-zinc-200 bg-zinc-50">
              <div className="space-y-1.5 text-xs text-zinc-600 mb-3 font-medium">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-zinc-800">
                    ₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>GST (5%)</span>
                  <span className="font-mono text-zinc-800">
                    ₹{gst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-zinc-200/80 text-sm font-bold text-zinc-900">
                  <span>Grand Total</span>
                  <span className="font-mono text-base text-amber-900">
                    ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={clearCart}
                  className="p-3 rounded-xl border border-zinc-300 text-zinc-500 hover:text-red-600 hover:bg-red-50 transition"
                  title="Clear Cart"
                  aria-label="Clear all items from cart"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCheckoutClick}
                  className="flex-1 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition cursor-pointer"
                >
                  <span>
                    {paymentMode === 'pay_before'
                      ? 'Pay & Confirm Order'
                      : 'Place Order (Pay Later)'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        totalAmount={grandTotal}
        tableNumber={selectedTable}
        onPaymentSuccess={handlePayBeforeSuccess}
      />
    </>
  )
}
