import { LANGS, useLang } from '../i18n'

/** Nút VI | EN ở góc thanh menu */
export default function LangSwitch({ className = '' }) {
  const { lang, setLang, t } = useLang()
  return (
    <div className={`lang-switch ${className}`} role="group" aria-label={t('langSwitch')}>
      {LANGS.map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          aria-pressed={lang === l}
          className={lang === l ? 'active' : ''}
          onClick={() => setLang(l)}
          title={l === 'vi' ? 'Tiếng Việt' : 'English'}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
