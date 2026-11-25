import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Dashboard.css'
import './MyClasses.css'
import logo from './assets/logo.jpg'
import { API_URL } from '../config'

const STATUS_LABEL = { ONGOING: 'Ongoing', ON_HOLD: 'On hold', COMPLETED: 'Completed' }

// A class that started less than an hour ago still counts as upcoming,
// so students can join one that is already running.
const GRACE_MS = 60 * 60 * 1000

function ClassCard({ c, past }) {
  const start = new Date(c.startTime)
  const status = c.batch?.status
  const link = c.batch?.meetLink
  const canJoin = status === 'ONGOING' && link

  let note = 'Link coming soon'
  if (status === 'ON_HOLD') note = 'This batch is on hold'
  if (status === 'COMPLETED') note = 'This batch has finished'

  return (
    <li className={`cls-card${past ? ' cls-card--past' : ''}`}>
      <div className="cls-date" aria-hidden="true">
        <span className="cls-date__day">{start.getDate()}</span>
        <span className="cls-date__month">{start.toLocaleDateString([], { month: 'short' })}</span>
      </div>

      <div>
        <h3 className="cls-title">{c.title}</h3>
        <p className="cls-when">
          {start.toLocaleDateString([], { weekday: 'long' })} at{' '}
          {start.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
        </p>
        {c.batch?.name && <p className="cls-batch">{c.batch.name}</p>}
      </div>

      <div className="cls-side">
        {status && (
          <span className={`cls-status cls-status--${String(status).toLowerCase()}`}>
            {STATUS_LABEL[status] || String(status).replace('_', ' ')}
          </span>
        )}
        {canJoin ? (
          <a className="cls-join" href={link} target="_blank" rel="noreferrer">Join class</a>
        ) : (
          <span className="cls-note">{note}</span>
        )}
      </div>
    </li>
  )
}

function MyClasses() {
  const [classes, setClasses] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (!user?.token) {
      window.location.href = '/login'
      return
    }
    fetch(API_URL + '/api/classes/my', {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('user')
          window.location.href = '/login'
          return []
        }
        return res.json()
      })
      .then((json) => setClasses(Array.isArray(json) ? json : []))
      .catch(() => setError('Cannot reach server'))
      .finally(() => setLoading(false))
  }, [])

  const logout = () => {
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  const now = Date.now()
  const sorted = [...classes].sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
  const upcoming = sorted.filter((c) => new Date(c.startTime).getTime() >= now - GRACE_MS)
  const earlier = sorted.filter((c) => new Date(c.startTime).getTime() < now - GRACE_MS).reverse()

  return (
    <div className="dash">
      <header className="dash__bar">
        <div className="dash__brand">
          <div className="dash__logo">
            <img src={logo} alt="" />
          </div>
          <span className="dash__brand-name">Yoga Kirana Studio</span>
        </div>
        <nav className="dash__nav">
          <Link className="dash__link" to="/details">My profile</Link>
          <button type="button" className="dash__logout" onClick={logout}>Log out</button>
        </nav>
      </header>

      <main className="dash__body cls-body">
        <div className="dash__head">
          <div>
            <h1 className="dash__title">My classes</h1>
            <p className="dash__sub">Your sessions and the links to join them.</p>
          </div>
        </div>

        {error && <p className="dash__error" role="alert">{error}</p>}

        {!loading && !error && classes.length === 0 && (
          <div className="cls-empty">
            <strong>No classes scheduled yet</strong>
            When your trainer schedules a class, it will show up here.
          </div>
        )}

        {upcoming.length > 0 && (
          <section className="cls-section">
            <h2>Upcoming</h2>
            <ul className="cls-list">
              {upcoming.map((c) => <ClassCard key={c.id} c={c} />)}
            </ul>
          </section>
        )}

        {earlier.length > 0 && (
          <section className="cls-section">
            <h2>Earlier</h2>
            <ul className="cls-list">
              {earlier.map((c) => <ClassCard key={c.id} c={c} past />)}
            </ul>
          </section>
        )}
      </main>
    </div>
  )
}

export default MyClasses
