import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { SHOTS } from '../lessons'
import { prefersReducedMotion } from '../util'
import { useLang } from '../../../i18n'

// Sân nhìn ngang: 13,4 m chiều dài → 700px, độ cao 1 m → 38px
const MX = (m) => 50 + m * (700 / 13.4)
const HY = (h) => 330 - h * 38
const FLOOR = 330

/** Người cầm vợt (que), vợt chạm cầu tại (m, h) */
function Figure({ m, h, opp }) {
  const dir = opp ? -1 : 1
  const cx = MX(m), cy = HY(h), px = MX(m - 0.45 * dir)
  const head = HY(1.62), sh = HY(1.38), hip = HY(0.92)
  const hx = px + (cx - px) * 0.55, hy = sh + (cy - sh) * 0.55
  const ang = (Math.atan2(cy - hy, cx - hx) * 180) / Math.PI
  return (
    <g className={opp ? 'ln-opp' : undefined}>
      <circle cx={px} cy={head} r="9" className="ln-fig" />
      <line x1={px} y1={head + 9} x2={px} y2={hip} className="ln-limb" />
      <line x1={px} y1={hip} x2={px - 14 * dir} y2={FLOOR} className="ln-limb" />
      <line x1={px} y1={hip} x2={px + 16 * dir} y2={FLOOR} className="ln-limb" />
      <line x1={px} y1={sh} x2={px - 16 * dir} y2={sh + 18} className="ln-limb" />
      <line x1={px} y1={sh} x2={hx} y2={hy} className="ln-limb" />
      <line x1={hx} y1={hy} x2={cx} y2={cy} className="ln-shaft" />
      <ellipse cx={cx} cy={cy} rx="10" ry="6" transform={`rotate(${ang} ${cx} ${cy})`} className="ln-rhead" />
    </g>
  )
}

/**
 * Minh hoạ quỹ đạo cầu. shots: danh sách khoá trong SHOTS.
 * Bấm vào tên cú đánh để xem cầu bay.
 */
export default function Court({ shots, autoplay = true }) {
  const { t } = useLang()
  const meshId = `mesh${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  // n tăng mỗi lần bấm để bấm lại cùng cú đánh vẫn phát lại hoạt hình
  const [run, setRun] = useState({ k: null, n: 0 })
  const cur = run.k
  const [landed, setLanded] = useState(false)
  const trailRef = useRef(null)
  const shuttleRef = useRef(null)
  const raf = useRef(0)

  const play = useCallback((k) => {
    setRun((r) => ({ k, n: r.n + 1 }))
    setLanded(false)
  }, [])

  // Chạy hoạt hình mỗi khi đổi cú đánh (sau khi path quỹ đạo đã render)
  useEffect(() => {
    if (!run.k) return undefined
    const s = SHOTS[run.k]
    const trail = trailRef.current
    const sh = shuttleRef.current
    const len = trail.getTotalLength()
    const endOnFloor = s.pts[3][1] === 0
    let lastAng = 0
    trail.style.strokeDasharray = len
    trail.style.strokeDashoffset = len

    const place = (f) => {
      const p = trail.getPointAtLength(len * f)
      const q = trail.getPointAtLength(Math.min(len, len * f + 3))
      if (q.x !== p.x || q.y !== p.y) lastAng = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI
      sh.setAttribute('transform', `translate(${p.x} ${p.y}) rotate(${lastAng})`)
      trail.style.strokeDashoffset = len * (1 - f)
    }

    if (prefersReducedMotion()) {
      place(1)
      if (endOnFloor) setLanded(true)
      return undefined
    }
    const t0 = performance.now()
    const step = (now) => {
      const u = Math.min(1, (now - t0) / s.dur)
      place(1 - Math.pow(1 - u, 1.6))
      if (u < 1) raf.current = requestAnimationFrame(step)
      else if (endOnFloor) setLanded(true)
    }
    raf.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf.current)
  }, [run])

  useEffect(() => {
    if (!autoplay) return undefined
    const id = setTimeout(() => play(shots[0]), 350)
    return () => clearTimeout(id)
  }, [autoplay, play, shots])

  const s = cur ? SHOTS[cur] : null
  const P = s ? s.pts.map(([m, h]) => [MX(m), HY(h)]) : null
  const ticks = [[0, t('learn.court.back')], [4.72, t('learn.court.short')], [8.68, t('learn.court.short')], [13.4, t('learn.court.back')]]
  const netTop = HY(1.55)

  return (
    <div>
      <div className="ln-court-wrap">
        <svg viewBox="0 0 800 380" className="ln-court" role="img" aria-label={t('learn.court.aria')}>
          <defs>
            <pattern id={meshId} width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M0 0 L8 8 M8 0 L0 8" stroke="var(--l-courtline)" strokeWidth="0.8" opacity="0.55" />
            </pattern>
          </defs>
          <rect x="0" y={FLOOR} width="800" height="50" className="ln-c-floor" />
          <line x1="0" y1={FLOOR} x2="800" y2={FLOOR} className="ln-c-line" />
          {ticks.map(([m, label], i) => (
            <g key={i}>
              <line x1={MX(m)} y1="326" x2={MX(m)} y2="338" className="ln-c-tick" />
              <text x={MX(m)} y="356" textAnchor="middle" className="ln-c-lbl">{label}</text>
            </g>
          ))}
          <line x1="400" y1={FLOOR} x2="400" y2={netTop} className="ln-c-post" />
          <rect x="394" y={netTop} width="12" height={HY(0.79) - netTop} fill={`url(#${meshId})`} />
          <line x1="392" y1={netTop} x2="408" y2={netTop} className="ln-c-tape" />
          <text x="400" y={netTop - 10} textAnchor="middle" className="ln-c-lbl">{t('learn.court.net')}</text>
          <text x={MX(3)} y="40" textAnchor="middle" className="ln-c-lbl">{t('learn.court.mine')}</text>
          <text x={MX(10.4)} y="40" textAnchor="middle" className="ln-c-lbl">{t('learn.court.theirs')}</text>
          <Figure m={11.2} h={1.9} opp />

          {s && <Figure m={s.pts[0][0]} h={s.pts[0][1]} />}
          <path
            ref={trailRef}
            className="ln-trail"
            d={P ? `M${P[0].join(' ')} C${P[1].join(' ')} ${P[2].join(' ')} ${P[3].join(' ')}` : 'M0 0'}
          />
          {P && <circle cx={P[3][0]} cy={P[3][1]} r="10" className={`ln-land${landed ? ' on' : ''}`} />}
          <g ref={shuttleRef} transform="translate(-50 -50)">
            <polygon points="2,-3 2,3 -13,8 -13,-8" className="ln-sk" />
            <circle cx="4" cy="0" r="4" className="ln-ck" />
          </g>
        </svg>
      </div>

      <div className="ln-chips" role="group" aria-label={t('learn.court.pick')}>
        {shots.map((k) => (
          <button key={k} type="button" className="ln-chip" aria-pressed={cur === k} onClick={() => play(k)}>
            {SHOTS[k].short}
          </button>
        ))}
      </div>
      <div className="ln-shot-info" aria-live="polite">
        {s && (
          <>
            <strong>{s.name}</strong>
            <p><b>{t('learn.court.use')}</b> {s.use}</p>
            <p><b>{t('learn.court.cue')}</b> {s.cue}</p>
          </>
        )}
      </div>
    </div>
  )
}
