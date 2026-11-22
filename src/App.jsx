import { VeloraProvider, useVelora } from './context'
import RoleSwitcher from './components/common/RoleSwitcher'
import Navbar from './components/common/Navbar'
import ToastContainer from './components/common/ToastContainer'
import CustomerView from './components/customer/CustomerView'
import ManagerDashboard from './components/manager/ManagerDashboard'
import KitchenKDS from './components/kitchen/KitchenKDS'
import WaiterMobile from './components/waiter/WaiterMobile'
import SuperAdminPanel from './components/admin/SuperAdminPanel'

function AppContent() {
  const { currentRole } = useVelora()

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#18181B] flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      <RoleSwitcher />
      <Navbar />
      <main className="flex-1">
        {currentRole === 'customer' && <CustomerView />}
        {currentRole === 'manager' && <ManagerDashboard />}
        {currentRole === 'kitchen' && <KitchenKDS />}
        {currentRole === 'waiter' && <WaiterMobile />}
        {currentRole === 'superadmin' && <SuperAdminPanel />}
      </main>
      <ToastContainer />
    </div>
  )
}

export default function App() {
  return (
    <VeloraProvider>
      <AppContent />
    </VeloraProvider>
  )
}
