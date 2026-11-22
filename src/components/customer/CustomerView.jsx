import { useState } from 'react'
import { useVelora } from '../../context'
import TableSelector from './TableSelector'
import MenuSection from './MenuSection'
import CartDrawer from './CartDrawer'
import OrderTracker from './OrderTracker'

export default function CustomerView() {
  const { selectedTable, setSelectedTable, activeCustomerOrder } = useVelora()
  const [viewState, setViewState] = useState(
    selectedTable ? (activeCustomerOrder ? 'tracker' : 'menu') : 'table-select'
  )
  const [isCartOpen, setIsCartOpen] = useState(false)

  const handleTableConfirmed = (tableNum) => {
    setSelectedTable(tableNum)
    setViewState(activeCustomerOrder ? 'tracker' : 'menu')
  }

  const handleOrderPlaced = () => {
    setViewState('tracker')
  }

  if (viewState === 'table-select') {
    return <TableSelector onTableConfirmed={handleTableConfirmed} />
  }

  return (
    <div className="min-h-[90vh]">
      {viewState === 'tracker' ? (
        <OrderTracker onOrderMore={() => setViewState('menu')} />
      ) : (
        <MenuSection
          onOpenCart={() => setIsCartOpen(true)}
          onChangeTable={() => setViewState('table-select')}
          onOpenTracker={() => setViewState('tracker')}
        />
      )}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOrderPlaced={handleOrderPlaced}
      />
    </div>
  )
}
