import { useState } from 'react'
import { useVelora } from '../../context'
import { QrCode, Sparkles, Users, Check, ArrowRight, ShieldCheck } from 'lucide-react'

export default function TableSelector({ onTableConfirmed }) {
  const { tables, selectedTable, setSelectedTable } = useVelora()
  const [isScanning, setIsScanning] = useState(false)

  const handleSimulateScan = () => {
    setIsScanning(true)
    setTimeout(() => {
      const avail = tables.find((t) => t.status === 'available')?.number || 4
      setSelectedTable(avail)
      setIsScanning(false)
    }, 1200)
  }

  const handleSelectTable = (num) => {
    setSelectedTable(num)
  }

  const handleProceed = () => {
    if (selectedTable) {
      onTableConfirmed(selectedTable)
    }
  }

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-8 max-w-xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          Velora Dining Lounge
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#18181B] font-mono">
          velora<span className="text-amber-600">_</span>
        </h1>
        <p className="text-sm text-zinc-500 mt-2 max-w-md mx-auto">
          Scan the QR code placed on your dining table or pick your table number below to start ordering.
        </p>
      </div>

      <div className="w-full bg-white rounded-2xl border border-zinc-200/90 shadow-sm p-6 mb-6 text-center">
        <div className="relative mx-auto w-32 h-32 rounded-2xl bg-zinc-900 border-2 border-amber-500/80 flex items-center justify-center p-3 shadow-inner overflow-hidden">
          {isScanning ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/90">
              <div className="w-full h-1 bg-amber-500 shadow-[0_0_12px_#D97706] animate-pulse" />
              <span className="text-[11px] font-mono text-amber-400 mt-2">Scanning QR...</span>
            </div>
          ) : (
            <div className="text-white flex flex-col items-center justify-center">
              <QrCode className="w-16 h-16 text-amber-400" />
              <span className="text-[10px] font-mono text-zinc-400 mt-1">velora://t-{selectedTable || '04'}</span>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-col items-center">
          <button
            onClick={handleSimulateScan}
            disabled={isScanning}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#18181B] text-white hover:bg-zinc-800 transition shadow-sm cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-amber-400" />
            {isScanning ? 'Simulating Scan...' : 'Simulate Camera QR Scan'}
          </button>
          <span className="text-[11px] text-zinc-400 mt-1.5 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Contactless verified dining
          </span>
        </div>
      </div>

      <div className="w-full bg-white rounded-2xl border border-zinc-200/90 shadow-sm p-5 sm:p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-zinc-900">Select Your Table</h3>
            <p className="text-xs text-zinc-500">Pick from 12 interactive dining tables</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-zinc-600">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Available
            </span>
            <span className="flex items-center gap-1 text-zinc-600">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Occupied
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {tables.map((table) => {
            const isSelected = selectedTable === table.number
            const isAvailable = table.status === 'available'

            return (
              <button
                key={table.id}
                onClick={() => handleSelectTable(table.number)}
                className={`relative p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-600 bg-amber-50/70 shadow-sm ring-2 ring-amber-500/40'
                    : isAvailable
                    ? 'border-zinc-200 bg-zinc-50/50 hover:border-zinc-300 hover:bg-zinc-100/60'
                    : 'border-zinc-200 bg-amber-50/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono font-bold text-zinc-800">
                    T-{table.number < 10 ? `0${table.number}` : table.number}
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isAvailable ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  />
                </div>
                <div className="flex items-center gap-1 text-[11px] text-zinc-500">
                  <Users className="w-3 h-3" />
                  <span>{table.capacity}p</span>
                </div>
                {isSelected && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-600 text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <button
        onClick={handleProceed}
        disabled={!selectedTable}
        className="w-full max-w-md py-3.5 px-6 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition cursor-pointer disabled:opacity-50"
      >
        <span>Enter Menu as Table {selectedTable || '04'}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  )
}
