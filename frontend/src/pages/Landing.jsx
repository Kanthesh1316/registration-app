import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Landing.css'
import logo from './assets/logo.jpg'
import { API_URL } from '../config'

/* ------------------------------------------------------------------
   Edit this block to make the page yours.
   The social links go to each site's home page until you paste in
   your real profile addresses. The contact details are placeholders.
------------------------------------------------------------------ */

const CONTACT = {
  address: 'Add your studio address here',
  phone: '+91 00000 00000',
  phoneLink: 'tel:+910000000000',
  email: 'hello@example.com'
}

const SOCIAL = [
  { name: 'Instagram', href: 'https://www.instagram.com/' },
  { name: 'Facebook', href: 'https://www.facebook.com/' },
  { name: 'YouTube', href: 'https://www.youtube.com/' },
  { name: 'WhatsApp', href: 'https://wa.me/910000000000' },
  { name: 'X', href: 'https://x.com/' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/' }
]

/* Free trial bookings are sent here with a POST request.
   The backend is not built yet, so until it exists the form will show
   "Cannot reach server". Expected JSON body:
   {
     "fullName": "Asha Rao",
     "mobileNumber": "9876543210",
     "email": "asha@example.com",
     "mode": "ONLINE" or "STUDIO",
     "level": "Beginner" | "Intermediate" | "Advanced" | null
   }
   Reply with a 2xx status on success, or an error status with a text message. */
const TRIAL_ENDPOINT = API_URL + '/api/trial'

const emptyTrial = { fullName: '', mobileNumber: '', email: '', mode: 'ONLINE', level: '' }

const STYLES = [
  { title: 'Hatha', text: 'Slow, steady postures that build strength and body awareness.' },
  { title: 'Vinyasa flow', text: 'Movement linked to breath, for energy and flexibility.' },
  { title: 'Pranayama', text: 'Breathing practices that calm the mind and steady your energy.' },
  { title: 'Meditation', text: 'Quiet guided sits to ease stress and sharpen your focus.' },
  { title: 'Beginner foundations', text: 'Learn alignment and breath at your own pace.' },
  { title: 'Restorative', text: 'Gentle, supported poses for deep rest and recovery.' }
]

const FAQ = [
  {
    q: 'Is there a free trial class?',
    a: 'Yes. Fill in the free trial form on this page, choose online or in the studio, and we will contact you to confirm your slot.'
  },
  {
    q: 'Do I need experience to join?',
    a: 'Not at all. Choose your level in your profile and your trainer will plan the practice around it. Beginners are always welcome.'
  },
  {
    q: 'How do online classes work?',
    a: 'Your trainer adds a Google Meet link to your batch. When a class is live, a Join class button appears in My classes, so you never have to hunt for a link.'
  },
  {
    q: 'I have an injury or health condition. Can I still practise?',
    a: 'Yes. Add it to your profile so your trainer knows before your first class. If you are unsure, check with your doctor before you start.'
  },
  {
    q: 'How do I get into a batch?',
    a: 'Create an account and share the email you used with the studio. Your trainer adds you to a batch, and your classes show up in your account.'
  },
  {
    q: 'Where is the studio?',
    a: 'You will find our address and contact details in the footer below. Message us first if you would like to visit.'
  }
]

/* ------------------------------------------------------------------ */

function Icon({ children, size = 20, fill = 'none' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

const Check = () => (
  <Icon size={18}>
    <path d="M5 12l5 5L20 7" />
  </Icon>
)

const SOCIAL_ICONS = {
  Instagram: (
    <Icon>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </Icon>
  ),
  Facebook: (
    <Icon>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </Icon>
  ),
  YouTube: (
    <Icon>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </Icon>
  ),
  WhatsApp: (
    <Icon>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </Icon>
  ),
  X: (
    <Icon>
      <path d="M4 4l16 16M20 4L4 20" />
    </Icon>
  ),
  LinkedIn: (
    <Icon>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </Icon>
  )
}

function Landing() {
  const [trial, setTrial] = useState(emptyTrial)
  const [trialState, setTrialState] = useState({ status: 'idle', message: '' })

  const changeTrial = (e) => {
    setTrial({ ...trial, [e.target.name]: e.target.value })
  }

  const bookTrial = async (e) => {
    e.preventDefault()
    setTrialState({ status: 'sending', message: '' })
    try {
      const res = await fetch(TRIAL_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...trial, level: trial.level || null })
      })
      if (res.ok) {
        setTrialState({
          status: 'success',
          message: 'Thank you! Your free trial request is in. We will contact you soon to confirm your slot.'
        })
        setTrial(emptyTrial)
      } else {
        const text = await res.text()
        setTrialState({ status: 'error', message: text || 'Something went wrong. Please try again.' })
      }
    } catch (err) {
      setTrialState({ status: 'error', message: 'Cannot reach server. Please try again in a moment.' })
    }
  }

  return (
    <div className="home">
      {/* ---------- Header ---------- */}
      <header className="hm-nav">
        <div className="hm-wrap">
          <a className="hm-brand" href="#top">
            <span className="hm-logo">
              <img src={logo} alt="" />
            </span>
            <span className="hm-brand-name">Yoga Kirana Studio</span>
          </a>
          <nav className="hm-links" aria-label="Main">
            <a href="#ways">Online and studio</a>
            <a href="#practice">Classes</a>
            <a href="#how">How it works</a>
            <a href="#trial">Free trial</a>
            <a href="#faq">Questions</a>
          </nav>
          <div className="hm-nav__actions">
            <Link className="hm-btn hm-btn--ghost" to="/login">Log in</Link>
            <Link className="hm-btn hm-btn--primary" to="/register">Join now</Link>
          </div>
        </div>
      </header>

      <main id="top">
        {/* ---------- Hero ---------- */}
        <section className="hm-hero">
          <div className="hm-wrap">
            <div className="hm-hero__text">
              <h1>Yoga online and in the studio, taught with care.</h1>
              <p className="hm-hero__lead">
                Join live classes from home or practise in person at Yoga Kirana Studio.
                Every batch is planned around your level, your goals and your health.
              </p>
              <div className="hm-hero__cta">
                <a className="hm-btn hm-btn--primary" href="#trial">Book a free trial class</a>
                <Link className="hm-btn hm-btn--ghost" to="/register">Join the studio</Link>
              </div>
              <ul className="hm-points">
                <li><Check />Free trial class</li>
                <li><Check />Live online classes</li>
                <li><Check />In-studio batches</li>
                <li><Check />Every level welcome</li>
              </ul>
            </div>

            <div className="hm-stage">
              <span className="hm-halo" aria-hidden="true" />
              <span className="hm-halo" aria-hidden="true" />
              <span className="hm-halo" aria-hidden="true" />
              <div className="hm-logo">
                <img src={logo} alt="Yoga Kirana Studio" />
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Online and studio ---------- */}
        <section className="hm-section" id="ways">
          <div className="hm-wrap">
            <div className="hm-head">
              <h2>Two ways to practise</h2>
              <p>Pick the one that fits your week, and keep every class in one place.</p>
            </div>
            <div className="hm-ways">
              <article className="hm-way hm-way--online">
                <span className="hm-way__icon">
                  <Icon size={24}>
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <path d="M8 21h8M12 17v4" />
                  </Icon>
                </span>
                <h3>Online</h3>
                <p>Join live from your living room. No commute, and the same attention from your trainer.</p>
                <ul className="hm-checks">
                  <li><Check />Live classes on Google Meet</li>
                  <li><Check />Join with one tap from My classes</li>
                  <li><Check />Practise anywhere you have room to stretch</li>
                </ul>
              </article>

              <article className="hm-way hm-way--studio">
                <span className="hm-way__icon">
                  <Icon size={24}>
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </Icon>
                </span>
                <h3>In the studio</h3>
                <p>Practise in person at Yoga Kirana Studio, in a calm room set up for your practice.</p>
                <ul className="hm-checks">
                  <li><Check />Hands-on guidance from your trainer</li>
                  <li><Check />A quiet space away from screens</li>
                  <li><Check />Practise alongside your batch</li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        {/* ---------- Classes ---------- */}
        <section className="hm-section hm-section--tint" id="practice">
          <div className="hm-wrap">
            <div className="hm-head">
              <h2>Find the practice that fits you</h2>
              <p>From gentle breathing to flowing movement, there is a class for every stage of your journey.</p>
            </div>
            <div className="hm-grid3">
              {STYLES.map((s) => (
                <article className="hm-card" key={s.title}>
                  <span className="hm-petal" aria-hidden="true" />
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- How it works ---------- */}
        <section className="hm-section" id="how">
          <div className="hm-wrap">
            <div className="hm-head">
              <h2>Start in three steps</h2>
              <p>It takes a few minutes, and your trainer takes it from there.</p>
            </div>
            <ol className="hm-steps">
              <li className="hm-step">
                <span className="hm-step__num" aria-hidden="true">1</span>
                <h3>Create your account</h3>
                <p>Sign up with your name, email and phone number.</p>
              </li>
              <li className="hm-step">
                <span className="hm-step__num" aria-hidden="true">2</span>
                <h3>Fill in your profile</h3>
                <p>Share your level, goals and any injuries so your trainer can plan safely.</p>
              </li>
              <li className="hm-step">
                <span className="hm-step__num" aria-hidden="true">3</span>
                <h3>Join your batch</h3>
                <p>Find your classes in My classes, then join online or come to the studio.</p>
              </li>
            </ol>
          </div>
        </section>

        {/* ---------- Free trial ---------- */}
        <section className="hm-section hm-section--tint" id="trial">
          <div className="hm-wrap hm-trial">
            <div className="hm-trial__copy">
              <div className="hm-head">
                <h2>Try a class on us</h2>
                <p>Book a free trial class, online or in the studio, and see how it feels before you join.</p>
              </div>
              <ul className="hm-checks">
                <li><Check />Choose online or in the studio</li>
                <li><Check />Tell us your level so we place you well</li>
                <li><Check />We contact you to confirm your slot</li>
              </ul>
            </div>

            <form className="hm-trial__form" onSubmit={bookTrial}>
              <h3>Book your free class</h3>

              <div className="hm-field">
                <label htmlFor="trial-name">Full name</label>
                <input
                  id="trial-name"
                  name="fullName"
                  placeholder="Your name"
                  autoComplete="name"
                  value={trial.fullName}
                  onChange={changeTrial}
                  required
                />
              </div>

              <div className="hm-field-row">
                <div className="hm-field">
                  <label htmlFor="trial-phone">Mobile number</label>
                  <input
                    id="trial-phone"
                    name="mobileNumber"
                    type="tel"
                    placeholder="Your mobile number"
                    autoComplete="tel"
                    value={trial.mobileNumber}
                    onChange={changeTrial}
                    required
                  />
                </div>
                <div className="hm-field">
                  <label htmlFor="trial-email">Email</label>
                  <input
                    id="trial-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    value={trial.email}
                    onChange={changeTrial}
                    required
                  />
                </div>
              </div>

              <fieldset className="hm-field hm-choices">
                <legend>How would you like to practise?</legend>
                <label className="hm-choice">
                  <input type="radio" name="mode" value="ONLINE" checked={trial.mode === 'ONLINE'} onChange={changeTrial} />
                  <span>Online</span>
                </label>
                <label className="hm-choice">
                  <input type="radio" name="mode" value="STUDIO" checked={trial.mode === 'STUDIO'} onChange={changeTrial} />
                  <span>In the studio</span>
                </label>
              </fieldset>

              <div className="hm-field">
                <label htmlFor="trial-level">Your yoga level (optional)</label>
                <select id="trial-level" name="level" value={trial.level} onChange={changeTrial}>
                  <option value="">Not sure yet</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <button type="submit" className="hm-btn hm-btn--primary hm-trial__submit" disabled={trialState.status === 'sending'}>
                {trialState.status === 'sending' ? 'Sending your request' : 'Book my free class'}
              </button>

              {trialState.message && (
                <p
                  className={`hm-trial__msg ${trialState.status === 'success' ? 'hm-trial__msg--ok' : 'hm-trial__msg--error'}`}
                  role="status"
                  aria-live="polite"
                >
                  {trialState.message}
                </p>
              )}
            </form>
          </div>
        </section>

        {/* ---------- Planned around you ---------- */}
        <section className="hm-section hm-band">
          <div className="hm-wrap">
            <div className="hm-head">
              <h2>Planned around you</h2>
              <p>Good yoga starts with knowing the person on the mat.</p>
            </div>
            <div className="hm-grid3">
              <article className="hm-card">
                <span className="hm-petal" aria-hidden="true" />
                <h3>Your level and goals on file</h3>
                <p>Tell us your experience and what you want from yoga, and your trainer plans with that in mind.</p>
              </article>
              <article className="hm-card">
                <span className="hm-petal" aria-hidden="true" />
                <h3>Your health, taken seriously</h3>
                <p>Share injuries and conditions up front so every session is safe for you.</p>
              </article>
              <article className="hm-card">
                <span className="hm-petal" aria-hidden="true" />
                <h3>Every class in one place</h3>
                <p>Your schedule and Join class buttons live in My classes, ready when you are.</p>
              </article>
            </div>
          </div>
        </section>

        {/* ---------- FAQ ---------- */}
        <section className="hm-section" id="faq">
          <div className="hm-wrap">
            <div className="hm-head">
              <h2>Questions, answered</h2>
            </div>
            <div className="hm-faq">
              {FAQ.map((item) => (
                <details key={item.q}>
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Final call to action ---------- */}
        <section className="hm-cta">
          <div className="hm-wrap">
            <h2>Your first class is one sign-up away</h2>
            <p>Create your account in a minute, add your details and your trainer will take it from there.</p>
            <div className="hm-cta__actions">
              <Link className="hm-btn hm-btn--light" to="/register">Create your account</Link>
              <Link className="hm-btn hm-btn--ghost" to="/login">Log in</Link>
            </div>
          </div>
        </section>
      </main>

      {/* ---------- Footer ---------- */}
      <footer className="hm-footer">
        <div className="hm-wrap">
          <div className="hm-footer__grid">
            <div>
              <a className="hm-brand" href="#top">
                <span className="hm-logo">
                  <img src={logo} alt="" />
                </span>
                <span className="hm-brand-name">Yoga Kirana Studio</span>
              </a>
              <p>Yoga online and in the studio, taught with care for every level.</p>
              <div className="hm-social" aria-label="Follow us on social media">
                {SOCIAL.map((s) => (
                  <a key={s.name} href={s.href} target="_blank" rel="noreferrer noopener" aria-label={s.name} title={s.name}>
                    {SOCIAL_ICONS[s.name]}
                  </a>
                ))}
              </div>
            </div>

            <nav aria-label="Explore">
              <h3>Explore</h3>
              <ul>
                <li><a href="#ways">Online and studio</a></li>
                <li><a href="#practice">Classes</a></li>
                <li><a href="#how">How it works</a></li>
                <li><a href="#trial">Free trial class</a></li>
                <li><a href="#faq">Questions</a></li>
              </ul>
            </nav>

            <nav aria-label="Your account">
              <h3>Your account</h3>
              <ul>
                <li><Link to="/login">Log in</Link></li>
                <li><Link to="/register">Create an account</Link></li>
                <li><Link to="/my-classes">My classes</Link></li>
                <li><Link to="/details">My profile</Link></li>
              </ul>
            </nav>

            <div>
              <h3>Visit or get in touch</h3>
              <ul className="hm-footer__contact">
                <li>
                  <Icon size={18}>
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </Icon>
                  <span>{CONTACT.address}</span>
                </li>
                <li>
                  <Icon size={18}>
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </Icon>
                  <a href={CONTACT.phoneLink}>{CONTACT.phone}</a>
                </li>
                <li>
                  <Icon size={18}>
                    <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
                    <path d="M22 6l-10 7L2 6" />
                  </Icon>
                  <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="hm-footer__bar">
          <div className="hm-wrap">
            <span>&copy; {new Date().getFullYear()} Yoga Kirana Studio. All rights reserved.</span>
            <span>Yoga online and offline, for every level.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
