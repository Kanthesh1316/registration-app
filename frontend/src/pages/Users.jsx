import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Dashboard.css'
import './Users.css'
import logo from './assets/logo.jpg'
import { API_URL } from '../config'

const API = API_URL + '/api/admin'

function Users() {
  const me = JSON.parse(localStorage.getItem('user'))
  const [users, setUsers] = useState([])
  const [message, setMessage] = useState('')
  const [query, setQuery] = useState('')

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${me?.token}`
  }

  const load = () => {
    fetch(`${API}/users`, { headers })
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((json) => setUsers(Array.isArray(json) ? json : []))
      .catch((status) => setMessage(`Could not load users (status: ${status}). Log in again as admin.`))
  }

  useEffect(() => {
    if (!me?.token) {
      window.location.href = '/login'
      return
    }
    load()
  }, [])

  const changeRole = async (id, role) => {
    const res = await fetch(`${API}/users/${id}/role`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ role })
    })
    setMessage(res.ok ? 'Role updated' : await res.text())
    load()
  }

  const logout = () => {
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  const q = query.trim().toLowerCase()
  const rows = q
    ? users.filter((u) => [u.name, u.email, u.phone, u.role].join(' ').toLowerCase().includes(q))
    : users

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
          <Link className="dash__link" to="/dashboard">Back to dashboard</Link>
          <button type="button" className="dash__logout" onClick={logout}>Log out</button>
        </nav>
      </header>

      <main className="dash__body">
        <div className="dash__head">
          <div>
            <h1 className="dash__title">
              Manage users
              <span className="dash__count">{users.length}</span>
            </h1>
            <p className="dash__sub">Choose what each person can do in the studio.</p>
          </div>
          <div className="dash__search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            <input
              type="search"
              placeholder="Search users"
              aria-label="Search users"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {message && <p className="dash__msg" role="status" aria-live="polite">{message}</p>}

        <div className="dash__table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td className="dash__empty" colSpan={4}>
                    {users.length === 0
                      ? 'No users yet. People appear here after they create an account.'
                      : 'No users match your search. Try a different name, email or role.'}
                  </td>
                </tr>
              )}
              {rows.map((u) => {
                const isMe = u.email === me?.email
                return (
                  <tr key={u.id}>
                    <td>
                      <div className="dash__person">
                        <span className="dash__avatar" aria-hidden="true">{initials(u.name)}</span>
                        {u.name}
                        {isMe && <span className="dash__you">You</span>}
                      </div>
                    </td>
                    <td><a className="dash__cell-link" href={`mailto:${u.email}`}>{u.email}</a></td>
                    <td>
                      {u.phone && <a className="dash__cell-link" href={`tel:${u.phone}`}>{u.phone}</a>}
                    </td>
                    <td>
                      <select
                        className={`role-select role--${String(u.role).toLowerCase()}`}
                        value={u.role}
                        disabled={isMe}
                        title={isMe ? 'You cannot change your own role' : undefined}
                        aria-label={`Role for ${u.name}`}
                        onChange={(e) => changeRole(u.id, e.target.value)}
                      >
                        <option value="USER">User</option>
                        <option value="TRAINER">Trainer</option>
                        <option value="MANAGER">Manager</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

export default Users
