import { useCallback, useEffect, useRef, useState } from 'react'
import { beep } from '../util'
import { useLang } from '../../../i18n'

/* ---------- nửa sân nhìn từ trên xuống ---------- */
function HalfCourt({ label, children }) {
  const { t } = useLang()
  return (
    <svg viewBox="0 0 260 300" className="ln-half" role="img" aria-label={label}>
      <rect x="0" y="0" width="260" height="300" rx="14" className="ln-hc-bg" />
      <g className="ln-hc-lines" fill="none">
        <rect x="14" y="20" width="232" height="255" />
        <line x1="14" y1="95" x2="246" y2="95" />
        <line x1="14" y1="246" x2="246" y2="246" />
        <line x1="130" y1="95" x2="130" y2="275" />
        <line x1="31.5" y1="20" x2="31.5" y2="275" />
        <line x1="228.5" y1="20" x2="228.5" y2="275" />
      </g>
      <line x1="6" y1="20" x2="254" y2="20" className="ln-hc-net" />
      <text x="130" y="13" className="ln-hc-label">{t('learn.court.netShort')}</text>
      {children}
    </svg>
  )
}

/* ---------- tập bộ pháp 6 góc ---------- */
const FW = [{ x: 62, y: 58 }, { x: 198, y: 58 }, { x: 42, y: 165 }, { x: 218, y: 165 }, { x: 62, y: 252 }, { x: 198, y: 252 }]

export function Footwork({ preset = '3000' }) {
  const { t } = useLang()
  const corners = t('learn.footwork.corners')
  const [n, setN] = useState('20')
  const [tempo, setTempo] = useState(preset)
  const [running, setRunning] = useState(false)
  const [active, setActive] = useState(-1)
  const [atBase, setAtBase] = useState(false)
  const [status, setStatus] = useState(null) // null → "Sẵn sàng"
  const [count, setCount] = useState(null) // null → hướng dẫn đứng giữa
  const timers = useRef([])

  const clearAll = useCallback(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setActive(-1)
    setAtBase(false)
  }, [])

  const stop = useCallback((msg) => {
    clearAll()
    setRunning(false)
    setStatus(msg ?? null)
  }, [clearAll])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const start = () => {
    if (running) { stop(t('learn.footwork.stopped')); return }
    setRunning(true)
    const total = +n
    const iv = +tempo
    const at = (ms, fn) => timers.current.push(setTimeout(fn, ms))
    ;[3, 2, 1].forEach((c, i) => at(i * 800, () => { setStatus(String(c)); beep(520, 0.1) }))
    let time = 2400
    let prev = -1
    for (let k = 0; k < total; k++) {
      let pick
      do { pick = Math.floor(Math.random() * 6) } while (pick === prev)
      prev = pick
      at(time, () => {
        setAtBase(false)
        setActive(pick)
        setStatus(corners[pick])
        setCount(t('learn.footwork.rep', { k: k + 1, n: total }))
        beep(880, 0.12)
      })
      at(time + iv * 0.55, () => {
        setActive(-1)
        setAtBase(true)
        setStatus(t('learn.footwork.back'))
      })
      time += iv
    }
    at(time, () => {
      stop(t('learn.footwork.done'))
      setCount(t('learn.footwork.summary', { n: total }))
      beep(660, 0.15)
      setTimeout(() => beep(990, 0.25), 180)
    })
  }

  return (
    <div>
      <HalfCourt label={t('learn.footwork.aria')}>
        {FW.map((p, i) => (
          <g key={i} className={`ln-fw-pt${active === i ? ' on' : ''}`}>
            <circle cx={p.x} cy={p.y} r="17" />
            <text x={p.x} y={p.y}>{i + 1}</text>
          </g>
        ))}
        <g className={`ln-fw-base${atBase ? ' on' : ''}`}><circle cx="130" cy="165" r="20" /></g>
      </HalfCourt>
      <div className="ln-fw-status" aria-live="polite">{status ?? t('learn.footwork.ready')}</div>
      <p className="ln-fw-count">{count ?? t('learn.footwork.hint')}</p>
      <div className="ln-ctrl">
        <label>{t('learn.footwork.reps')}
          <select value={n} onChange={(e) => setN(e.target.value)} disabled={running}>
            <option>10</option><option>20</option><option>30</option>
          </select>
        </label>
        <label>{t('learn.footwork.tempo')}
          <select value={tempo} onChange={(e) => setTempo(e.target.value)} disabled={running}>
            <option value="3000">{t('learn.footwork.slow')}</option>
            <option value="2200">{t('learn.footwork.medium')}</option>
            <option value="1600">{t('learn.footwork.fast')}</option>
          </select>
        </label>
        <button type="button" className="ln-btn primary" onClick={start}>
          {running ? t('learn.footwork.stop') : t('learn.footwork.start')}
        </button>
      </div>
    </div>
  )
}

/* ---------- cách cầm vợt ---------- */
const OCT = 'M95 40 L125 40 L150 75 L150 145 L125 180 L95 180 L70 145 L70 75 Z'

export function Grip() {
  const { t } = useLang()
  const [g, setG] = useState('fh')
  return (
    <div>
      <div className="ln-center">
        <div className="ln-seg" role="group" aria-label={t('learn.grip.aria')}>
          <button type="button" aria-pressed={g === 'fh'} onClick={() => setG('fh')}>{t('learn.grip.fh')}</button>
          <button type="button" aria-pressed={g === 'bh'} onClick={() => setG('bh')}>{t('learn.grip.bh')}</button>
        </div>
      </div>
      <svg viewBox="0 0 220 220" className="ln-half" role="img" aria-label={t('learn.grip.svg')}>
        <line x1="110" y1="4" x2="110" y2="216" className="ln-grip-face" />
        <text x="116" y="16" className="ln-grip-muted">{t('learn.grip.frame')}</text>
        <g className="ln-grip-rot" style={{ transform: `rotate(${g === 'bh' ? -18 : 0}deg)` }}>
          <path d={OCT} className="ln-grip-oct" />
          <text x="110" y="114" textAnchor="middle" className="ln-grip-muted">{t('learn.grip.handle')}</text>
        </g>
        <g className="ln-grip-mark" style={{ opacity: g === 'fh' ? 1 : 0 }}>
          <path d="M100 22 L110 38 L120 22" className="ln-grip-v" />
          <text x="128" y="32" className="ln-grip-txt">{t('learn.grip.v')}</text>
        </g>
        <g className="ln-grip-mark" style={{ opacity: g === 'bh' ? 1 : 0 }}>
          <rect x="56" y="80" width="12" height="56" rx="6" className="ln-grip-thumb" />
          <text x="8" y="156" className="ln-grip-txt">{t('learn.grip.thumb')}</text>
        </g>
      </svg>
      <ul className="ln-grip-list">
        {t(`learn.grip.${g}Steps`).map((s) => <li key={s}>{s}</li>)}
      </ul>
    </div>
  )
}

/* ---------- đội hình đánh đôi ---------- */
const DBL = { atk: { a: [130, 82], b: [130, 222] }, def: { a: [72, 165], b: [188, 165] } }

export function Doubles() {
  const { t } = useLang()
  const [f, setF] = useState('atk')
  const pos = (p) => ({ transform: `translate(${p[0]}px,${p[1]}px)` })
  return (
    <div>
      <div className="ln-center">
        <div className="ln-seg" role="group" aria-label={t('learn.doubles.aria')}>
          <button type="button" aria-pressed={f === 'atk'} onClick={() => setF('atk')}>{t('learn.doubles.atk')}</button>
          <button type="button" aria-pressed={f === 'def'} onClick={() => setF('def')}>{t('learn.doubles.def')}</button>
        </div>
      </div>
      <HalfCourt label={t('learn.doubles.svg')}>
        <g className="ln-dbl-p ln-dbl-a" style={pos(DBL[f].a)}><circle r="16" /><text>A</text></g>
        <g className="ln-dbl-p ln-dbl-b" style={pos(DBL[f].b)}><circle r="16" /><text>B</text></g>
      </HalfCourt>
      <p className="ln-tool-cap">{t(`learn.doubles.${f}Cap`)}</p>
    </div>
  )
}

/* ---------- bảng tính điểm ---------- */
const NEW_GAME = { me: 0, op: 0, srv: 'me', over: false }

export function Score() {
  const { t } = useLang()
  const [s, setS] = useState(NEW_GAME)

  const win = (w) => setS((prev) => {
    if (prev.over) return prev
    const next = { ...prev, [w]: prev[w] + 1, srv: w }
    const hi = Math.max(next.me, next.op)
    if ((hi >= 21 && Math.abs(next.me - next.op) >= 2) || hi === 30) next.over = true
    return next
  })

  let note
  if (s.over) {
    note = t('learn.score.won', {
      who: t(s.me > s.op ? 'learn.score.you' : 'learn.score.opp'),
      hi: Math.max(s.me, s.op),
      lo: Math.min(s.me, s.op),
    })
  } else {
    const p = s.srv === 'me' ? s.me : s.op
    note = t('learn.score.serve', {
      who: t(s.srv === 'me' ? 'learn.score.you' : 'learn.score.opp'),
      side: t(p % 2 === 0 ? 'learn.score.right' : 'learn.score.left'),
    })
  }

  return (
    <div>
      <div className="ln-score-board">
        <div className={s.srv === 'me' ? 'serving' : ''}>
          <div className="who">{t('learn.score.you')}</div>
          <div className="pts">{s.me}</div>
        </div>
        <div className="who">–</div>
        <div className={s.srv === 'op' ? 'serving' : ''}>
          <div className="who">{t('learn.score.opp')}</div>
          <div className="pts">{s.op}</div>
        </div>
      </div>
      <p className="ln-score-note" aria-live="polite">{note}</p>
      <div className="ln-ctrl">
        <button type="button" className="ln-btn primary" onClick={() => win('me')}>{t('learn.score.meWin')}</button>
        <button type="button" className="ln-btn" onClick={() => win('op')}>{t('learn.score.oppWin')}</button>
        <button type="button" className="ln-btn" onClick={() => setS(NEW_GAME)}>{t('learn.score.reset')}</button>
      </div>
    </div>
  )
}

export const TOOLS = { footwork: Footwork, grip: Grip, doubles: Doubles, score: Score }
