import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import SiteNav from '../../components/SiteNav'
import { BagIcon, TikTokIcon, ZaloIcon } from '../../components/Icons'
import { CONTACT } from '../../lib/config'
import { useReveal } from '../../lib/useReveal'
import { useLang } from '../../i18n'
import LangSwitch from '../../components/LangSwitch'
import HeroCanvas from './HeroCanvas'
import coachPhoto from '../../assets/image1.jpg'
import './home.css'

const SECTIONS = ['hero', 'about', 'skills', 'testimonials', 'pricing', 'contact']

// Phần không cần dịch; text nằm trong src/i18n/vi.js & en.js (mục home)
const SKILL_ICONS = ['🏸', '🧠', '⚡', '🎯', '🤝']
const STUDENTS = [
  { initials: 'MT', name: 'Minh Tuấn' },
  { initials: 'PA', name: 'Phương Anh' },
  { initials: 'TH', name: 'Thanh Hoa' },
]

function SideDots() {
  const { t } = useLang()
  const [active, setActive] = useState('hero')

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id) })
    }, { threshold: 0.4 })
    SECTIONS.forEach((id) => { const el = document.getElementById(id); if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, [])

  return (
    <div id="side-dots">
      {SECTIONS.map((id) => (
        <button
          key={id}
          type="button"
          aria-label={t('home.goTo', { id })}
          className={`dot${active === id ? ' active' : ''}`}
          onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
        />
      ))}
    </div>
  )
}

export default function Home() {
  const heroRef = useRef(null)
  const { lang, t } = useLang()
  // Đổi ngôn ngữ → React vẽ lại các phần tử .reveal, cần quan sát lại để chúng hiện ra
  useReveal([lang])

  useEffect(() => { document.title = t('home.docTitle') }, [t])

  useEffect(() => {
    // Vào từ link dạng "/#contact" → cuộn tới đúng mục sau khi render
    if (window.location.hash) {
      document.getElementById(window.location.hash.slice(1))?.scrollIntoView()
    }
  }, [])

  return (
    <div className="home">
      <SiteNav
        links={(
          <ul className="nav-links">
            <li><a href="#about">{t('home.nav.about')}</a></li>
            <li><a href="#skills">{t('home.nav.skills')}</a></li>
            <li><a href="#testimonials">{t('home.nav.testimonials')}</a></li>
            <li><a href="#pricing">{t('home.nav.pricing')}</a></li>
          </ul>
        )}
        right={(
          <>
            <LangSwitch />
            <Link to="/shop" className="nav-shop"><BagIcon /> {t('home.nav.shop')}</Link>
            <a href="#contact" className="nav-cta">{t('home.nav.signup')}</a>
          </>
        )}
      />

      <SideDots />

      {/* HERO */}
      <section id="hero" ref={heroRef}>
        <HeroCanvas heroRef={heroRef} />
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="hero-eyebrow">{t('home.hero.eyebrow')}</p>
          <h1 className="hero-title">
            <span>{t('home.hero.title1')}</span>
            <em>{t('home.hero.title2')}</em>
          </h1>
          <p className="hero-sub">{t('home.hero.sub')}</p>
          <div className="hero-actions">
            <a href="#contact" className="btn-primary">{t('home.hero.cta')}</a>
            <a href="#about" className="btn-ghost">{t('home.hero.more')}</a>
          </div>
        </div>
        <div className="scroll-hint">
          <span>{t('home.hero.scroll')}</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* ABOUT */}
      <section id="about">
        <div className="about-inner">
          <div className="about-photo-wrap reveal">
            <img src={coachPhoto} alt={t('home.about.photoAlt')} />
          </div>
          <div className="reveal">
            <p className="section-tag">{t('home.about.tag')}</p>
            <h2 className="section-title">
              <span>{t('home.about.title1')}</span><br />
              <em style={{ color: 'var(--mint)', fontStyle: 'normal' }}>{t('home.about.title2')}</em>
            </h2>
            <p className="about-quote">{t('home.about.quote')}</p>
            <p className="about-text">{t('home.about.text')}</p>
            <div className="about-chips">
              {t('home.about.chips').map((c) => <span key={c} className="chip">{c}</span>)}
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills">
        <div className="skills-inner">
          <div className="skills-header reveal">
            <p className="section-tag">{t('home.skills.tag')}</p>
            <h2 className="section-title">{t('home.skills.title')}</h2>
          </div>
          <div className="skills-grid">
            {t('home.skills.items').map((s, i) => (
              <div key={s.title} className="skill-card reveal">
                <span className="skill-icon">{SKILL_ICONS[i]}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials">
        <div className="test-inner">
          <div className="test-header reveal">
            <p className="section-tag">{t('home.testimonials.tag')}</p>
            <h2 className="section-title">{t('home.testimonials.title')}</h2>
          </div>
          <div className="test-grid">
            {t('home.testimonials.items').map((item, i) => (
              <div key={STUDENTS[i].name} className="test-card reveal">
                <div className="test-stars">★★★★★</div>
                <p className="test-text">{item.text}</p>
                <div className="test-author">
                  <div className="test-avatar">{STUDENTS[i].initials}</div>
                  <div>
                    <div className="test-name">{STUDENTS[i].name}</div>
                    <div className="test-role">{item.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing">
        <div className="pricing-inner">
          <div className="pricing-header reveal">
            <p className="section-tag">{t('home.pricing.tag')}</p>
            <h2 className="section-title">{t('home.pricing.title')}</h2>
          </div>
          <div className="pricing-grid">
            {t('home.pricing.plans').map((p, i) => (
              <div key={p.name} className={`price-card reveal${i === 0 ? ' featured' : ''}`}>
                {i === 0 && <div className="price-badge">{t('home.pricing.popular')}</div>}
                <h3 className="price-name">{p.name}</h3>
                <ul className="price-features">
                  {p.features.map((f) => <li key={f}>{f}</li>)}
                </ul>
                <a href="#contact" className="price-btn price-btn-solid">{t('home.pricing.cta')}</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact">
        <div className="contact-inner">
          <p className="section-tag reveal" style={{ textAlign: 'center' }}>{t('home.contact.tag')}</p>
          <h2 className="contact-title reveal">
            <span>{t('home.contact.title1')}</span>
            <span style={{ color: 'var(--mint)' }}>{t('home.contact.title2')}</span>
            <span>{t('home.contact.title3')}</span>
          </h2>
          <p className="contact-sub reveal">{t('home.contact.sub')}</p>
          <div className="contact-btns reveal">
            <a href={CONTACT.zalo} target="_blank" rel="noreferrer" className="zalo-btn">
              <ZaloIcon />
              <span>{t('home.contact.zalo')}</span>
            </a>
            <a href={CONTACT.tel} className="phone-btn">📞 {CONTACT.phone}</a>
            <a href={CONTACT.tiktok} target="_blank" rel="noreferrer" className="tiktok-btn">
              <TikTokIcon size={18} />
              <span>TikTok {CONTACT.tiktokHandle}</span>
            </a>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <p>
          © {new Date().getFullYear()} {t('home.footer.coach')} · <Link to="/shop">{t('home.footer.shop')}</Link>
          {' · '}<a href={CONTACT.tiktok} target="_blank" rel="noreferrer">TikTok {CONTACT.tiktokHandle}</a>
        </p>
        <p><a href="#hero">{t('home.footer.top')}</a></p>
      </footer>
    </div>
  )
}
