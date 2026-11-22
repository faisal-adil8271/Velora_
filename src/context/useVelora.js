import { useContext } from 'react'
import { VeloraContext } from './context'

export function useVelora() {
  const context = useContext(VeloraContext)
  if (!context) {
    throw new Error('useVelora must be used within a VeloraProvider')
  }
  return context
}
