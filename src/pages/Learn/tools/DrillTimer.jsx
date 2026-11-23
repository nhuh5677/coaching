import { useEffect, useReducer, useRef } from 'react'
import { beep, fmtTime } from '../util'
import { useLang } from '../../../i18n'

const C = 2 * Math.PI * 52

/** Đồng hồ tập theo hiệp: tập work giây, nghỉ rest giây, lặp sets lần */
export default function DrillTimer({ sets, work, rest }) {
  const { t } = useLang()
  const [, rerender] = useReducer((x) => x + 1, 0)
  const st = useRef({ phase: 'idle', set: 1, remain: work * 1000, total: work * 1000, endAt: 0, running: false, lastSec: -1 })
  const iv = useRef(null)
  const s = st.current

  useEffect(() => () => clearInterval(iv.current), [])

  const startPhase = (p) => {
    s.phase = p
    s.total = s.remain = (p === 'work' ? work : rest) * 1000
    s.endAt = performance.now() + s.remain
    s.lastSec = -1
    beep(p === 'work' ? 990 : 620, 0.2)
  }

  const tick = () => {
    if (!s.running) return
    s.remain = s.endAt - performance.now()
    const sec = Math.ceil(s.remain / 1000)
    if (sec <= 3 && sec > 0 && sec !== s.lastSec) { s.lastSec = sec; beep(440, 0.08) }
    if (s.remain <= 0) {
      if (s.phase === 'work') {
        if (s.set < sets) startPhase('rest')
        else {
          s.phase = 'done'
          s.remain = 0
          s.running = false
          clearInterval(iv.current)
          beep(660, 0.15)
          setTimeout(() => beep(990, 0.3), 180)
        }
      } else if (s.phase === 'rest') {
        s.set += 1
        startPhase('work')
      }
    }
    rerender()
  }

  const toggle = () => {
    if (s.running) {
      s.running = false
      clearInterval(iv.current)
    } else {
      if (s.phase === 'idle' || s.phase === 'done') { s.set = 1; startPhase('work') }
      else s.endAt = performance.now() + s.remain
      s.running = true
      clearInterval(iv.current)
      iv.current = setInterval(tick, 200)
    }
    rerender()
  }

  const reset = () => {
    clearInterval(iv.current)
    Object.assign(s, { phase: 'idle', set: 1, remain: work * 1000, total: work * 1000, running: false })
    rerender()
  }

  const plan = t('learn.timer.plan', { sets, work: fmtTime(work), rest: fmtTime(rest) })
  let line = plan
  if (s.phase === 'done') line = t('learn.timer.finished', { sets })
  else if (s.phase !== 'idle') line = t('learn.timer.setOf', { k: s.set, n: sets })

  let btn = t('learn.timer.start')
  if (s.running) btn = t('learn.timer.pause')
  else if (s.phase === 'work' || s.phase === 'rest') btn = t('learn.timer.resume')

  return (
    <div>
      <div className={`ln-timer${s.phase === 'rest' ? ' rest' : ''}`}>
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle cx="60" cy="60" r="52" className="ln-ring-bg" />
          <circle
            cx="60" cy="60" r="52" className="ln-ring-fg" transform="rotate(-90 60 60)"
            strokeDasharray={C} strokeDashoffset={C * (1 - s.remain / s.total)}
          />
        </svg>
        <div className="ln-timer-read">
          <span className="ln-t-num">{fmtTime(s.remain / 1000)}</span>
          <span className="ln-t-phase">{t(`learn.timer.${s.phase}`)}</span>
        </div>
      </div>
      <p className="ln-t-set">{line}</p>
      <div className="ln-t-btns">
        <button type="button" className="ln-btn primary" onClick={toggle}>{btn}</button>
        <button type="button" className="ln-btn" onClick={reset}>{t('learn.timer.reset')}</button>
      </div>
    </div>
  )
}
