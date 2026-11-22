export default function VegBadge({ isVeg, size = 'sm' }) {
  const containerSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'
  const dotSize = size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5'

  if (isVeg) {
    return (
      <span
        title="Vegetarian"
        className={`inline-flex items-center justify-center ${containerSize} border border-emerald-600 rounded-[3px] p-[1.5px] bg-white flex-shrink-0`}
      >
        <span className={`${dotSize} rounded-full bg-emerald-600 block`} />
      </span>
    )
  }

  return (
    <span
      title="Non-Vegetarian"
      className={`inline-flex items-center justify-center ${containerSize} border border-rose-600 rounded-[3px] p-[1.5px] bg-white flex-shrink-0`}
    >
      <span
        className={`w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[7px] border-b-rose-600 block`}
      />
    </span>
  )
}
