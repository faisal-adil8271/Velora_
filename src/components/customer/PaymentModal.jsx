import { useState } from 'react'
import { QrCode, CreditCard, ShieldCheck, CheckCircle2, X } from 'lucide-react'

export default function PaymentModal({
  isOpen,
  onClose,
  totalAmount,
  orderId,
  tableNumber,
  onPaymentSuccess,
}) {
  const [paymentType, setPaymentType] = useState('upi')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  if (!isOpen) return null

  const handleSimulatePayment = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setIsSuccess(true)
      setTimeout(() => {
        setIsSuccess(false)
        onPaymentSuccess()
        onClose()
      }, 1000)
    }, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-zinc-200 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-zinc-900">Settle & Pay Bill</h3>
            <p className="text-xs text-zinc-500">
              {orderId ? `Order ${orderId} • Table ${tableNumber}` : `Table ${tableNumber}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3.5 text-center mb-4">
          <span className="text-xs text-amber-800 font-medium">Grand Total Payable</span>
          <div className="text-2xl font-extrabold text-amber-900 font-mono mt-0.5">
            ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-100 rounded-xl mb-4">
          <button
            onClick={() => setPaymentType('upi')}
            className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
              paymentType === 'upi'
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <QrCode className="w-3.5 h-3.5 text-amber-600" /> UPI Dynamic QR
          </button>
          <button
            onClick={() => setPaymentType('card')}
            className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
              paymentType === 'card'
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-zinc-700" /> Cards & POS
          </button>
        </div>

        {paymentType === 'upi' ? (
          <div className="flex flex-col items-center py-2 text-center">
            <div className="relative p-3 bg-white border-2 border-dashed border-amber-400 rounded-2xl shadow-sm mb-3">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=upi://pay?pa=velora.hospitality@bank&pn=VeloraLounge&am=${totalAmount}&cu=INR`}
                alt="UPI Payment QR"
                className="w-36 h-36 rounded-lg"
              />
              <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-amber-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Scan with any UPI
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 mb-1">
              Supports GPay, PhonePe, Paytm, CRED & BHIM
            </p>
          </div>
        ) : (
          <div className="py-3 space-y-3">
            <div className="p-3 bg-zinc-900 text-white rounded-xl shadow-inner font-mono text-xs">
              <div className="flex justify-between text-zinc-400 text-[10px] mb-2">
                <span>VELORA PRIVILEGE</span>
                <span>NFC TAP / CHIP</span>
              </div>
              <div className="text-sm font-semibold tracking-wider">•••• •••• •••• 8842</div>
              <div className="flex justify-between text-[10px] text-zinc-400 mt-2">
                <span>EXP: 08/29</span>
                <span>CVV: •••</span>
              </div>
            </div>
            <p className="text-[11px] text-zinc-500 text-center">
              Simulated tap-to-pay or handheld POS integration
            </p>
          </div>
        )}

        <div className="mt-4">
          <button
            onClick={handleSimulatePayment}
            disabled={isProcessing || isSuccess}
            className={`w-full py-3 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md ${
              isSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-600 hover:bg-amber-700 text-white'
            }`}
          >
            {isSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Payment Confirmed!</span>
              </>
            ) : isProcessing ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Authorizing ₹{totalAmount}...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Simulate Successful Payment</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
