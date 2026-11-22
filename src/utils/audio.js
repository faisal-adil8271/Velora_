// Native pleasant chime using browser Web Audio API
export const playChime = (type = 'ready') => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.connect(gain)
    gain.connect(ctx.destination)

    const now = ctx.currentTime
    if (type === 'ready') {
      osc.type = 'sine'
      osc.frequency.setValueAtTime(523.25, now)
      osc.frequency.setValueAtTime(659.25, now + 0.1)
      osc.frequency.setValueAtTime(783.99, now + 0.2)
      gain.gain.setValueAtTime(0.15, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7)
      osc.start(now)
      osc.stop(now + 0.7)
    } else if (type === 'order') {
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(880, now)
      gain.gain.setValueAtTime(0.1, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4)
      osc.start(now)
      osc.stop(now + 0.4)
    }
  } catch {
    // AudioContext blocked or not supported
  }
}
