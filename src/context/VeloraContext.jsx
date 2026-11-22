import { useState, useEffect, useCallback } from 'react'
import { VeloraContext } from './context'
import { INITIAL_TABLES, INITIAL_MENU, INITIAL_ORDERS } from '../data/seedData'
import { playChime } from '../utils/audio'

const STORAGE_KEYS = {
  ORDERS: 'velora_orders_v1',
  MENU: 'velora_menu_v1',
  TABLES: 'velora_tables_v1',
  ROLE: 'velora_current_role_v1',
  SELECTED_TABLE: 'velora_selected_table_v1',
  CUSTOMER_ORDER_ID: 'velora_customer_order_id_v1',
}

export function VeloraProvider({ children }) {
  // Load persistent state or fall back to seed
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS)
      return saved ? JSON.parse(saved) : INITIAL_ORDERS
    } catch {
      return INITIAL_ORDERS
    }
  })

  const [menuItems, setMenuItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MENU)
      return saved ? JSON.parse(saved) : INITIAL_MENU
    } catch {
      return INITIAL_MENU
    }
  })

  const [tables, setTables] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TABLES)
      return saved ? JSON.parse(saved) : INITIAL_TABLES
    } catch {
      return INITIAL_TABLES
    }
  })

  const [currentRole, setCurrentRole] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ROLE)
      return saved || 'customer'
    } catch {
      return 'customer'
    }
  })

  const [selectedTable, setSelectedTable] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SELECTED_TABLE)
      return saved ? Number(saved) : 4
    } catch {
      return 4
    }
  })

  const [customerActiveOrderId, setCustomerActiveOrderId] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.CUSTOMER_ORDER_ID) || null
    } catch {
      return null
    }
  })

  // In-session cart state: { [itemId]: quantity }
  const [cart, setCart] = useState({})

  // Toast notifications
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((title, message, type = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6)
    const newToast = { id, title, message, type, timestamp: Date.now() }
    setToasts((prev) => [newToast, ...prev.slice(0, 4)])

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4500)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  // Persist state updates to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders))
    } catch (e) {
      console.error(e)
    }
  }, [orders])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(menuItems))
    } catch (e) {
      console.error(e)
    }
  }, [menuItems])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(tables))
    } catch (e) {
      console.error(e)
    }
  }, [tables])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ROLE, currentRole)
    } catch (e) {
      console.error(e)
    }
  }, [currentRole])

  useEffect(() => {
    try {
      if (selectedTable) {
        localStorage.setItem(STORAGE_KEYS.SELECTED_TABLE, String(selectedTable))
      } else {
        localStorage.removeItem(STORAGE_KEYS.SELECTED_TABLE)
      }
    } catch (e) {
      console.error(e)
    }
  }, [selectedTable])

  useEffect(() => {
    try {
      if (customerActiveOrderId) {
        localStorage.setItem(STORAGE_KEYS.CUSTOMER_ORDER_ID, customerActiveOrderId)
      } else {
        localStorage.removeItem(STORAGE_KEYS.CUSTOMER_ORDER_ID)
      }
    } catch (e) {
      console.error(e)
    }
  }, [customerActiveOrderId])

  // Cross-Tab Real-time Synchronizer
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEYS.ORDERS && e.newValue) {
        setOrders(JSON.parse(e.newValue))
      }
      if (e.key === STORAGE_KEYS.MENU && e.newValue) {
        setMenuItems(JSON.parse(e.newValue))
      }
      if (e.key === STORAGE_KEYS.TABLES && e.newValue) {
        setTables(JSON.parse(e.newValue))
      }
      if (e.key === STORAGE_KEYS.CUSTOMER_ORDER_ID) {
        setCustomerActiveOrderId(e.newValue || null)
      }
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Cart operations
  const addToCart = useCallback((item) => {
    setCart((prev) => {
      const count = (prev[item.id] || 0) + 1
      return { ...prev, [item.id]: count }
    })
  }, [])

  const removeFromCart = useCallback((itemId) => {
    setCart((prev) => {
      const current = prev[itemId] || 0
      if (current <= 1) {
        const next = { ...prev }
        delete next[itemId]
        return next
      }
      return { ...prev, [itemId]: current - 1 }
    })
  }, [])

  const clearCart = useCallback(() => {
    setCart({})
  }, [])

  // Place Customer Order
  const placeOrder = useCallback(
    ({ paymentMode = 'upi', specialNotes = '' }) => {
      if (!selectedTable) return null

      const orderItems = Object.entries(cart)
        .map(([id, qty]) => {
          const dish = menuItems.find((m) => m.id === id)
          if (!dish) return null
          return {
            id: dish.id,
            name: dish.name,
            price: dish.price,
            quantity: qty,
            isVeg: dish.isVeg,
          }
        })
        .filter(Boolean)

      if (orderItems.length === 0) return null

      const subtotal = orderItems.reduce((acc, i) => acc + i.price * i.quantity, 0)
      const tax = Math.round(subtotal * 0.05 * 100) / 100
      const grandTotal = Math.round((subtotal + tax) * 100) / 100

      const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`
      const isPaid = paymentMode !== 'pay_later'

      const newOrder = {
        id: orderId,
        tableNumber: selectedTable,
        guestName: `Table ${selectedTable} Guest`,
        createdAt: new Date().toISOString(),
        status: 'pending_approval',
        approvedAt: null,
        readyAt: null,
        servedAt: null,
        paymentMode,
        paymentStatus: isPaid ? 'paid' : 'pending',
        specialNotes,
        items: orderItems,
        subtotal,
        tax,
        grandTotal,
      }

      setOrders((prev) => [newOrder, ...prev])
      setCustomerActiveOrderId(orderId)
      clearCart()

      // Mark Table Occupied
      setTables((prev) =>
        prev.map((t) =>
          t.number === selectedTable
            ? { ...t, status: 'occupied', currentOrderId: orderId }
            : t
        )
      )

      playChime('order')
      addToast(
        'Order Placed!',
        `Order ${orderId} sent to Manager for approval. Table ${selectedTable}.`,
        'success'
      )

      return orderId
    },
    [cart, menuItems, selectedTable, clearCart, addToast]
  )

  // Manager Approves Order -> Moves to Kitchen
  const approveOrder = useCallback(
    (orderId) => {
      setOrders((prev) =>
        prev.map((ord) =>
          ord.id === orderId
            ? { ...ord, status: 'cooking', approvedAt: new Date().toISOString() }
            : ord
        )
      )
      const target = orders.find((o) => o.id === orderId)
      const table = target ? `Table ${target.tableNumber}` : ''
      playChime('order')
      addToast('Order Approved', `${orderId} (${table}) sent to Kitchen KDS.`, 'success')
    },
    [orders, addToast]
  )

  // Manager Rejects Order
  const rejectOrder = useCallback(
    (orderId, reason = 'Item unavailable / kitchen full') => {
      setOrders((prev) =>
        prev.map((ord) =>
          ord.id === orderId ? { ...ord, status: 'rejected', rejectReason: reason } : ord
        )
      )
      addToast('Order Rejected', `${orderId}: ${reason}`, 'warning')
    },
    [addToast]
  )

  // Kitchen Marks Food Ready -> Triggers Waiter alert
  const markFoodReady = useCallback(
    (orderId) => {
      setOrders((prev) =>
        prev.map((ord) =>
          ord.id === orderId
            ? { ...ord, status: 'ready', readyAt: new Date().toISOString() }
            : ord
        )
      )
      const target = orders.find((o) => o.id === orderId)
      const table = target ? `Table ${target.tableNumber}` : ''
      playChime('ready')
      addToast('Food Ready for Pickup!', `${orderId} (${table}) is plated. Waiter alerted.`, 'kds')
    },
    [orders, addToast]
  )

  // Waiter Marks Food Served -> Updates customer tracker
  const markFoodServed = useCallback(
    (orderId) => {
      setOrders((prev) =>
        prev.map((ord) =>
          ord.id === orderId
            ? { ...ord, status: 'served', servedAt: new Date().toISOString() }
            : ord
        )
      )
      const target = orders.find((o) => o.id === orderId)
      const table = target ? `Table ${target.tableNumber}` : ''
      addToast('Food Served!', `${orderId} delivered to ${table}.`, 'info')
    },
    [orders, addToast]
  )

  // Settle Bill (For Pay Later orders)
  const settleBill = useCallback(
    (orderId) => {
      setOrders((prev) =>
        prev.map((ord) =>
          ord.id === orderId ? { ...ord, paymentStatus: 'paid' } : ord
        )
      )
      addToast('Bill Settled', `${orderId} marked as PAID.`, 'success')
    },
    [addToast]
  )

  // Clear / Reset Table
  const clearTable = useCallback(
    (tableNumber) => {
      setTables((prev) =>
        prev.map((t) =>
          t.number === tableNumber
            ? { ...t, status: 'available', currentOrderId: null, guestName: null }
            : t
        )
      )
      addToast(`Table ${tableNumber} Vacated`, 'Table marked Available for new guests.', 'info')
    },
    [addToast]
  )

  // Menu Management
  const toggleStock = useCallback(
    (dishId) => {
      setMenuItems((prev) =>
        prev.map((dish) => {
          if (dish.id === dishId) {
            const nextStatus = !dish.inStock
            addToast(
              nextStatus ? 'Item In Stock' : 'Item Out of Stock',
              `${dish.name} is now ${nextStatus ? 'Available' : 'Unavailable'}.`,
              nextStatus ? 'success' : 'warning'
            )
            return { ...dish, inStock: nextStatus }
          }
          return dish
        })
      )
    },
    [addToast]
  )

  const updateMenuItem = useCallback(
    (updated) => {
      setMenuItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
      addToast('Dish Updated', `${updated.name} pricing & details saved.`, 'success')
    },
    [addToast]
  )

  const addMenuItem = useCallback(
    (newItem) => {
      const itemWithId = {
        ...newItem,
        id: `m_${Date.now()}`,
        inStock: true,
      }
      setMenuItems((prev) => [itemWithId, ...prev])
      addToast('New Dish Added', `${newItem.name} added to ${newItem.category}.`, 'success')
    },
    [addToast]
  )

  const deleteMenuItem = useCallback(
    (itemId) => {
      setMenuItems((prev) => prev.filter((item) => item.id !== itemId))
      addToast('Dish Removed', 'Item removed from active menu.', 'warning')
    },
    [addToast]
  )

  // Reset Everything to clean seed state
  const resetDemoData = useCallback(() => {
    localStorage.clear()
    setOrders(INITIAL_ORDERS)
    setMenuItems(INITIAL_MENU)
    setTables(INITIAL_TABLES)
    setCart({})
    setSelectedTable(4)
    setCustomerActiveOrderId(null)
    addToast('Demo Reset', 'Restored pristine seed data across all views.', 'info')
  }, [addToast])

  // Get active order for customer view
  const activeCustomerOrder = customerActiveOrderId
    ? orders.find((o) => o.id === customerActiveOrderId)
    : orders.find(
        (o) =>
          o.tableNumber === selectedTable &&
          o.status !== 'served' &&
          o.status !== 'rejected'
      ) || null

  return (
    <VeloraContext.Provider
      value={{
        orders,
        menuItems,
        tables,
        currentRole,
        setCurrentRole,
        selectedTable,
        setSelectedTable,
        customerActiveOrderId,
        setCustomerActiveOrderId,
        activeCustomerOrder,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        placeOrder,
        approveOrder,
        rejectOrder,
        markFoodReady,
        markFoodServed,
        settleBill,
        clearTable,
        toggleStock,
        updateMenuItem,
        addMenuItem,
        deleteMenuItem,
        toasts,
        addToast,
        removeToast,
        resetDemoData,
      }}
    >
      {children}
    </VeloraContext.Provider>
  )
}
