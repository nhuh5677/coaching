import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLang } from '../../i18n'
import { LESSONS, PER_LEVEL } from './lessons'
import { useProgress } from './util'
import LearnLayout from './LearnLayout'
import Court from './tools/Court'

const HERO_SHOTS = ['clear', 'drop', 'smash', 'net', 'lift', 'drive', 'kill', 'block', 'high_serve', 'short_serve']

/** /hoc — trang giới thiệu + lộ trình 24 bài */
export default function Learn() {
  const { t } = useLang()
  const location = useLocation()
  const { done } = useProgress()
  const next = LESSONS.find((l) => !done[l.id])
  // Quay về từ một bài → mở đúng phần của bài đó; còn lại mở phần đang học dở
  const [level, setLevel] = useState(location.state?.lvl || next?.lvl || 'A')

  useEffect(() => { document.title = t('learn.docTitle') }, [t])

  useEffect(() => {
    if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView()
    if (location.state?.lvl) setLevel(location.state.lvl)
  }, [location])

  const doneAll = LESSONS.filter((l) => done[l.id]).length
  let cta = { to: '/hoc/a1', label: t('learn.hero.start') }
  if (!next) cta = { to: '/hoc/a1', label: t('learn.hero.review') }
  else if (doneAll > 0) cta = { to: `/hoc/${next.id}`, label: t('learn.hero.continue', { title: next.title }) }

  const list = LESSONS.filter((l) => l.lvl === level)
  const c = list.filter((l) => done[l.id]).length

  return (
    <LearnLayout done={done}>
      <main>
        <div className="ln-wrap ln-hero">
          <h1>{t('learn.hero.title')}</h1>
          <p className="ln-lead">{t('learn.hero.lead')}</p>
          <Court shots={HERO_SHOTS} />
          <div className="ln-hero-actions">
            <Link className="ln-btn primary" to={cta.to}>{cta.label}</Link>
            <a className="ln-btn" href="#lo-trinh">{t('learn.hero.all')}</a>
          </div>
        </div>

        <section className="ln-block" id="lo-trinh">
          <div className="ln-wrap">
            <h2 className="ln-sec">{t('learn.roadmap.title')}</h2>
            <p className="ln-sec-sub">{t('learn.roadmap.sub')}</p>
            <div className="ln-tabs" role="tablist" aria-label={t('learn.roadmap.pick')}>
              {['A', 'B'].map((lv) => (
                <button key={lv} type="button" role="tab" className="ln-tab" aria-selected={level === lv} onClick={() => setLevel(lv)}>
                  {t(lv === 'A' ? 'learn.part.A' : 'learn.part.B')}
                </button>
              ))}
            </div>
            <div className="ln-level-meter">
              <span>{t('learn.roadmap.doneCount', { n: c, total: PER_LEVEL })}</span>
              <div className="ln-bar"><i style={{ width: `${(c / PER_LEVEL) * 100}%` }} /></div>
            </div>
            <ol className="ln-lessons">
              {list.map((l) => (
                <li key={l.id} className={done[l.id] ? 'is-done' : ''}>
                  <Link to={`/hoc/${l.id}`}>
                    <span className="ln-num" aria-hidden="true">{done[l.id] ? '✓' : l.n}</span>
                    <span>
                      <span className="ln-l-title">{t('learn.lessonN', { n: l.n })} {l.title}</span>
                      <span className="ln-l-goal">{l.goal}</span>
                    </span>
                    <span className="ln-l-min">{t('learn.minutes', { n: l.min })}</span>
                  </Link>
                </li>
              ))}
            </ol>
            {c === PER_LEVEL && (
              <div className="ln-badge">{t(level === 'A' ? 'learn.roadmap.badgeA' : 'learn.roadmap.badgeB')}</div>
            )}
          </div>
        </section>
      </main>
    </LearnLayout>
  )
}
