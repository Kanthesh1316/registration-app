import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Login.css'
import logo from './assets/logo.jpg'
import { API_URL } from '../config'

function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(API_URL + '/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (!res.ok) {
        setMessage(await res.text())
        setIsError(true)
        return
      }
      const user = await res.json()
      localStorage.setItem('user', JSON.stringify(user))
      if (user.role === 'ADMIN' || user.role === 'MANAGER') {
        navigate('/dashboard')
      } else if (user.role === 'TRAINER') {
        navigate('/manage')
      } else {
        navigate('/my-classes')
      }
    } catch (err) {
      setMessage('Cannot reach server')
      setIsError(true)
    }
  }

  return (
    <div className="auth">
      <aside className="auth__aside">
        <div className="auth__stage">
          <span className="auth__halo" aria-hidden="true" />
          <span className="auth__halo" aria-hidden="true" />
          <span className="auth__halo" aria-hidden="true" />
          <div className="auth__logo">
            <img src={logo} alt="Yoga Kirana Studio" />
          </div>
        </div>
        <div className="auth__brand">
          <h2>Breathe in. Begin again.</h2>
          <p>Your classes, your teachers and your practice, all in one calm place.</p>
        </div>
      </aside>

      <main className="auth__main">
        <form className="auth__card" onSubmit={handleSubmit}>
          <h1>Welcome back</h1>
          <p className="auth__lead">Sign in to see your classes and bookings.</p>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <div className="field__control">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="field__toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M17.94 17.94A10.9 10.9 0 0 1 12 20c-7 0-10-8-10-8a18.4 18.4 0 0 1 4.06-5.06M9.9 4.24A10.4 10.4 0 0 1 12 4c7 0 10 8 10 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22" />
                    <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="auth__btn">Sign in</button>

          {message && (
            <p className={`auth__msg ${isError ? 'error' : 'success'}`} role="status" aria-live="polite">
              {message}
            </p>
          )}

          <p className="auth__alt">
            New to the institute? <Link to="/register">Create an account</Link>
          </p>
        </form>
      </main>
    </div>
  )
}

export default Login
