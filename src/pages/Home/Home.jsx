import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import SiteNav from '../../components/SiteNav'
import { BagIcon, TikTokIcon, ZaloIcon } from '../../components/Icons'
import { CONTACT } from '../../lib/config'
import { useReveal } from '../../lib/useReveal'
import HeroCanvas from './HeroCanvas'
import coachPhoto from '../../assets/image1.jpg'
import './home.css'

const SECTIONS = ['hero', 'about', 'skills', 'testimonials', 'pricing', 'contact']

const SKILLS = [
  { icon: '🏸', title: 'Kỹ thuật cơ bản', text: 'Cách cầm vợt, di chuyển chân, các cú đánh nền tảng được xây từ gốc — đúng tư thế từ ngày đầu.' },
  { icon: '🧠', title: 'Chiến thuật thi đấu', text: 'Đọc cầu, kiểm soát nhịp trận, tâm lý thi đấu và cách xây dựng điểm số có chủ đích.' },
  { icon: '⚡', title: 'Thể lực & Phong trào', text: 'Bài tập thể lực chuyên biệt: tốc độ phản xạ, sức bền sân, linh hoạt — kết hợp vui, không nhàm chán.' },
  { icon: '🎯', title: 'Video phân tích', text: 'Quay lại và phân tích từng buổi tập. Bạn thấy đúng lỗi mình mắc — tiến bộ nhanh gấp đôi.' },
  { icon: '🤝', title: 'Đấu tập & giao lưu', text: 'Cộng đồng học viên tích cực. Tổ chức đấu giao lưu nội bộ hàng tháng để thực chiến kỹ năng.' },
]

const TESTIMONIALS = [
  { initials: 'MT', name: 'Minh Tuấn', role: 'Nhân viên văn phòng', text: '"Lúc trước tự chơi cũng được gần 1 năm, kiểu đánh kh đúng kỹ thuật nên trình cứ dậm tại chỗ. Từ khi học ở đây cảm giác đánh đúng kỹ thuâht đường cầu nét hơn nhẹ nhàng khi phát lực mà toàn cuối sân."' },
  { initials: 'PA', name: 'Phương Anh', role: 'Sinh viên', text: '"Xưa cứ nghĩ nhìn video là chơi được, mà thật sự học vô mới biết nên học từ sớm hơn để nhanh lên trình hạn chế chấn thương á."' },
  { initials: 'TH', name: 'Thanh Hoa', role: 'Phụ huynh học viên nhỏ tuổi', text: '"Cô dạy có tâm, tận tình chỉnh sửa từng động tác sai. 10 điểm."' },
]

const PLANS = [
  { name: 'Cơ bản', featured: true, features: ['Toàn bộ kỹ thuật Cơ Bản', 'Chiến thuật & thực chiến', 'Phân tích video buổi tập', 'Đấu giao lưu hàng tháng'] },
  { name: 'Nâng cao', features: ['Kỹ thuật nâng cao', 'Sửa lỗi chuyên sâu', 'Chương trình riêng biệt', 'Phù hợp chuẩn bị thi đấu'] },
]

const CHIPS = ['Cử nhân Đại học TDTT', 'Thạc sĩ Giáo dục học', 'Chuyên sâu cầu lông', '7+ năm kinh nghiệm', 'Nam và Nữ', 'Dạy kèm ≤ 5 người', 'Đà Nẵng']

function SideDots() {
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
          aria-label={`Tới mục ${id}`}
          className={`dot${active === id ? ' active' : ''}`}
          onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
        />
      ))}
    </div>
  )
}

export default function Home() {
  const heroRef = useRef(null)
  useReveal()

  useEffect(() => {
    document.title = 'Phan Võ Huỳnh Như — HLV Cầu Lông'
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
            <li><a href="#about">Về tôi</a></li>
            <li><a href="#skills">Chương trình</a></li>
            <li><a href="#testimonials">Học viên</a></li>
            <li><a href="#pricing">Lộ trình học</a></li>
          </ul>
        )}
        right={(
          <>
            <Link to="/shop" className="nav-shop"><BagIcon /> Shop</Link>
            <a href="#contact" className="nav-cta">Đăng ký</a>
          </>
        )}
      />

      <SideDots />

      {/* HERO */}
      <section id="hero" ref={heroRef}>
        <HeroCanvas heroRef={heroRef} />
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="hero-eyebrow">HLV Cầu Lông · Đà Nẵng</p>
          <h1 className="hero-title">
            <span>Đánh đúng kỹ thuật.</span>
            <em>Nâng cao sức khoẻ.</em>
          </h1>
          <p className="hero-sub">Hơn 7 năm kinh nghiệm — tôi giúp bạn xây nền kỹ thuật vững chắc, đánh cầu có tư duy, và yêu môn thể thao này theo cách hoàn toàn mới.</p>
          <div className="hero-actions">
            <a href="#contact" className="btn-primary">Đăng ký học</a>
            <a href="#about" className="btn-ghost">Tìm hiểu thêm</a>
          </div>
        </div>
        <div className="scroll-hint">
          <span>Cuộn xuống</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* ABOUT */}
      <section id="about">
        <div className="about-inner">
          <div className="about-photo-wrap reveal">
            <img src={coachPhoto} alt="HLV Huỳnh Như" />
          </div>
          <div className="reveal">
            <p className="section-tag">Về tôi</p>
            <h2 className="section-title">
              <span>Không chỉ dạy đánh —</span><br />
              <em style={{ color: 'var(--mint)', fontStyle: 'normal' }}>tôi dạy bạn hiểu cầu.</em>
            </h2>
            <p className="about-quote">"Kỹ thuật tốt không đến từ luyện tập nhiều — mà từ tập luyện đúng."</p>
            <p className="about-text">Là một Cử nhân/Thạc sĩ chuyên ngành Giáo dục Thể chất. Từ kiến thức chính quy và thực tiễn, tôi hiểu rằng: mỗi lỗi kỹ thuật nhỏ – từ cách cầm vợt, di chuyển, bước chân – đều ảnh hưởng trực tiếp đến hiệu quả thi đấu và nguy cơ chấn thương. Tôi giúp bạn đánh đúng, đánh hay, đồng thời nâng cao sức khỏe một cách khoa học, an toàn.</p>
            <div className="about-chips">
              {CHIPS.map((c) => <span key={c} className="chip">{c}</span>)}
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills">
        <div className="skills-inner">
          <div className="skills-header reveal">
            <p className="section-tag">Chương trình học</p>
            <h2 className="section-title">Bạn sẽ học được gì?</h2>
          </div>
          <div className="skills-grid">
            {SKILLS.map((s) => (
              <div key={s.title} className="skill-card reveal">
                <span className="skill-icon">{s.icon}</span>
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
            <p className="section-tag">Học viên nói gì</p>
            <h2 className="section-title">Kết quả thật từ người thật</h2>
          </div>
          <div className="test-grid">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="test-card reveal">
                <div className="test-stars">★★★★★</div>
                <p className="test-text">{t.text}</p>
                <div className="test-author">
                  <div className="test-avatar">{t.initials}</div>
                  <div>
                    <div className="test-name">{t.name}</div>
                    <div className="test-role">{t.role}</div>
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
            <p className="section-tag">Học phí</p>
            <h2 className="section-title">Chọn lộ trình phù hợp</h2>
          </div>
          <div className="pricing-grid">
            {PLANS.map((p) => (
              <div key={p.name} className={`price-card reveal${p.featured ? ' featured' : ''}`}>
                {p.featured && <div className="price-badge">Phổ biến nhất</div>}
                <h3 className="price-name">{p.name}</h3>
                <ul className="price-features">
                  {p.features.map((f) => <li key={f}>{f}</li>)}
                </ul>
                <a href="#contact" className="price-btn price-btn-solid">Đăng ký ngay</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact">
        <div className="contact-inner">
          <p className="section-tag reveal" style={{ textAlign: 'center' }}>Bắt đầu ngay hôm nay</p>
          <h2 className="contact-title reveal">
            <span>Sẵn sàng</span>
            <span style={{ color: 'var(--mint)' }}> lên sân</span>
            <span> chưa?</span>
          </h2>
          <p className="contact-sub reveal">Chỉ cần bạn mang vợt và tinh thần sẵn sàng thử thách bản thân.</p>
          <div className="contact-btns reveal">
            <a href={CONTACT.zalo} target="_blank" rel="noreferrer" className="zalo-btn">
              <ZaloIcon />
              <span>Nhắn Zalo ngay</span>
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
          © {new Date().getFullYear()} HLV Huỳnh Như · <Link to="/shop">Shop đồ cầu lông</Link>
          {' · '}<a href={CONTACT.tiktok} target="_blank" rel="noreferrer">TikTok {CONTACT.tiktokHandle}</a>
        </p>
        <p><a href="#hero">Lên đầu trang ↑</a></p>
      </footer>
    </div>
  )
}
