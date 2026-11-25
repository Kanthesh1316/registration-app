import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Dashboard.css'
import logo from './assets/logo.jpg'
import { API_URL } from '../config'

function Dashboard() {
  const [data, setData] = useState([])
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (!user?.token) {
      window.location.href = '/login'
      return
    }
    fetch(API_URL + '/api/details', {
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
      .then((json) => setData(Array.isArray(json) ? json : []))
      .catch(() => setError('Cannot reach server'))
  }, [])

  const logout = () => {
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  const isAdmin = JSON.parse(localStorage.getItem('user'))?.role === 'ADMIN'

  const q = query.trim().toLowerCase()
  const rows = q
    ? data.filter((d) => Object.values(d).join(' ').toLowerCase().includes(q))
    : data

  const initials = (name) =>
    (name || '?').trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase()

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
          <Link className="dash__link" to="/manage">Manage classes</Link>
          {isAdmin && <Link className="dash__link" to="/admin/users">Manage users</Link>}
          <button type="button" className="dash__logout" onClick={logout}>Log out</button>
        </nav>
      </header>

      <main className="dash__body">
        <div className="dash__head">
          <div>
            <h1 className="dash__title">
              Submitted forms
              <span className="dash__count">{data.length}</span>
            </h1>
            <p className="dash__sub">Every registration form your students have sent in.</p>
          </div>
          <div className="dash__search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            <input
              type="search"
              placeholder="Search forms"
              aria-label="Search forms"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {error && <p className="dash__error" role="alert">{error}</p>}

        <div className="dash__table-wrap">
          <table>
            <thead>
              <tr>
                <th className="col-id">ID</th>
                <th className="col-name">Full name</th>
                <th>Date of birth</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Address</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Health condition</th>
                <th>Height</th>
                <th>Weight</th>
                <th>Occupation</th>
                <th>Level</th>
                <th>Goals</th>
                <th>Emergency contact</th>
                <th>Emergency phone</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td className="dash__empty" colSpan={16}>
                    {data.length === 0
                      ? 'No forms submitted yet. New registrations will show up here.'
                      : 'No forms match your search. Try a different name, email or number.'}
                  </td>
                </tr>
              )}
              {rows.map((d) => (
                <tr key={d.id}>
                  <td className="col-id">{d.id}</td>
                  <td className="col-name">
                    <div className="dash__person">
                      <span className="dash__avatar" aria-hidden="true">{initials(d.fullName)}</span>
                      {d.fullName}
                    </div>
                  </td>
                  <td>{d.dateOfBirth}</td>
                  <td>{d.age}</td>
                  <td>{d.gender}</td>
                  <td><span className="dash__clip" title={d.address}>{d.address}</span></td>
                  <td><a className="dash__cell-link" href={`tel:${d.mobileNumber}`}>{d.mobileNumber}</a></td>
                  <td><a className="dash__cell-link" href={`mailto:${d.email}`}>{d.email}</a></td>
                  <td><span className="dash__clip" title={d.healthCondition}>{d.healthCondition}</span></td>
                  <td>{d.height}</td>
                  <td>{d.weight}</td>
                  <td>{d.occupation}</td>
                  <td>
                    {d.level && (
                      <span className={`level level--${String(d.level).toLowerCase()}`}>{d.level}</span>
                    )}
                  </td>
                  <td><span className="dash__clip" title={d.goals}>{d.goals}</span></td>
                  <td>{d.emergencyContactName}</td>
                  <td><a className="dash__cell-link" href={`tel:${d.emergencyContactPhone}`}>{d.emergencyContactPhone}</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
