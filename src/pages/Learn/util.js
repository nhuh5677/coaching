import { useCallback, useState } from 'react'

/* ---------- âm báo nhỏ cho đồng hồ / bài tập ---------- */
let actx = null
export function beep(freq = 880, dur = 0.12) {
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)()
    if (actx.state === 'suspended') actx.resume()
    const o = actx.createOscillator()
    const g = actx.createGain()
    const t = actx.currentTime
    o.frequency.value = freq
    g.gain.setValueAtTime(0.18, t)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    o.connect(g)
    g.connect(actx.destination)
    o.start(t)
    o.stop(t + dur + 0.02)
  } catch { /* trình duyệt không hỗ trợ âm thanh */ }
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/** 75 → "1:15" */
export function fmtTime(sec) {
  const s = Math.max(0, Math.ceil(sec))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

/* ---------- tiến độ học, lưu trên trình duyệt ---------- */
const KEY = 'learn-progress-v1'

function readProgress() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {} } catch { return {} }
}

export function useProgress() {
  const [done, setDone] = useState(readProgress)
  const toggle = useCallback((id) => {
    setDone((prev) => {
      const next = { ...prev }
      if (next[id]) delete next[id]
      else next[id] = 1
      try { localStorage.setItem(KEY, JSON.stringify(next)) } catch { /* bị chặn lưu trữ */ }
      return next
    })
  }, [])
  return { done, toggle }
}
