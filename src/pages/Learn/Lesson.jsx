import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useLang } from '../../i18n'
import { LESSONS, PER_LEVEL } from './lessons'
import { beep, useProgress } from './util'
import LearnLayout from './LearnLayout'
import Court from './tools/Court'
import DrillTimer from './tools/DrillTimer'
import { TOOLS } from './tools/Trainers'

function Quiz({ quiz }) {
  const { t } = useLang()
  const [picked, setPicked] = useState(null)
  const answered = picked !== null
  const ok = picked === quiz.a

  const choose = (i) => {
    setPicked(i)
    beep(i === quiz.a ? 990 : 300, 0.15)
  }

  return (
    <div className="ln-quiz">
      <p className="ln-q">{quiz.q}</p>
      <div className="ln-opts">
        {quiz.o.map((o, i) => {
          let cls = 'ln-opt'
          if (answered && i === quiz.a) cls += ' right'
          else if (answered && i === picked) cls += ' wrong'
          return <button key={o} type="button" className={cls} disabled={answered} onClick={() => choose(i)}>{o}</button>
        })}
      </div>
      <div className="ln-fb" aria-live="polite">
        {answered && (
          <>
            <b>{t(ok ? 'learn.lesson.right' : 'learn.lesson.wrong')}</b>
            {quiz.why}
          </>
        )}
      </div>
    </div>
  )
}

/** /hoc/:id — một bài học */
export default function Lesson() {
  const { id } = useParams()
  const { t } = useLang()
  const { done, toggle } = useProgress()
  const l = LESSONS.find((x) => x.id === id)

  useEffect(() => {
    document.title = l ? `${l.title} — ${t('learn.brand')}` : t('learn.docTitle')
  }, [l, t])

  if (!l) {
    return (
      <LearnLayout done={done}>
        <main className="ln-wrap ln-lesson">
          <h1>{t('learn.lesson.notFound')}</h1>
          <Link className="ln-btn primary" to="/hoc">{t('learn.lesson.back')}</Link>
        </main>
      </LearnLayout>
    )
  }

  const prev = LESSONS[l.idx - 1]
  const next = LESSONS[l.idx + 1]
  const Tool = l.tool ? TOOLS[l.tool] : null
  const isDone = !!done[l.id]
  const back = { pathname: '/hoc', hash: 'lo-trinh' }

  return (
    <LearnLayout done={done}>
      {/* key: đổi bài → dựng lại toàn bộ (dừng đồng hồ, xoá đáp án quiz) */}
      <main className="ln-wrap ln-lesson" key={l.id}>
        <Link className="ln-back" to={back} state={{ lvl: l.lvl }}>← {t('learn.lesson.back')}</Link>
        <p className="ln-kicker">
          {t('learn.lesson.kicker', { part: t(`learn.part.${l.lvl}`), n: l.n, total: PER_LEVEL, min: l.min })}
        </p>
        <h1>{l.title}</h1>
        <p className="ln-goal">{l.goal}</p>

        <div className="ln-lesson-grid">
          <div className="ln-lesson-main">
            {l.shots && <Court shots={l.shots} />}
            {Tool && (
              <div className="ln-tool" style={{ marginTop: l.shots ? 24 : 0 }}>
                <Tool preset={l.toolPreset} />
              </div>
            )}

            <h2>{t('learn.lesson.steps')}</h2>
            <ol className="ln-steps">
              {l.steps.map((s) => <li key={s}>{s}</li>)}
            </ol>

            <h2>{t('learn.lesson.mistakes')}</h2>
            <div className="ln-mistakes">
              {l.mis.map(([e, f]) => (
                <div className="ln-mis" key={e}>
                  <span className="e">{t('learn.lesson.mistake')} {e}</span>
                  <span className="f">{t('learn.lesson.fix')} {f}</span>
                </div>
              ))}
            </div>

            <h2>{t('learn.lesson.quiz')}</h2>
            <Quiz quiz={l.quiz} />
          </div>

          <aside className="ln-drill">
            <h2>{t('learn.lesson.drill')}</h2>
            <p className="ln-dname">{l.drill.name}</p>
            <p className="ln-ddesc">{l.drill.desc}</p>
            <DrillTimer sets={l.drill.sets} work={l.drill.work} rest={l.drill.rest} />
            <button
              type="button"
              className={`ln-btn ln-mark${isDone ? ' done' : ''}`}
              aria-pressed={isDone}
              onClick={() => toggle(l.id)}
            >
              {t(isDone ? 'learn.lesson.marked' : 'learn.lesson.mark')}
            </button>
            <p className="ln-safety">{t('learn.lesson.safety')}</p>
          </aside>
        </div>

        <nav className="ln-pager" aria-label={t('learn.lesson.pager')}>
          {prev ? <Link className="ln-btn" to={`/hoc/${prev.id}`}>{t('learn.lesson.prev', { title: prev.title })}</Link> : <span />}
          {next
            ? <Link className="ln-btn primary" to={`/hoc/${next.id}`}>{t('learn.lesson.next', { title: next.title })}</Link>
            : <Link className="ln-btn primary" to={back} state={{ lvl: l.lvl }}>{t('learn.lesson.back')}</Link>}
        </nav>
      </main>
    </LearnLayout>
  )
}
