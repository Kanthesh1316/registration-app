import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Login.css'
import logo from './assets/logo.jpg'
import { API_URL } from '../config'

function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  })
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(API_URL + '/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const text = await res.text()
      setMessage(text)
      setIsError(!res.ok)
      if (res.ok) {
        setForm({ name: '', email: '', password: '', phone: '' })
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
          <h2>Your practice starts here.</h2>
          <p>Create an account to book classes, meet your teachers and follow your progress.</p>
        </div>
      </aside>

      <main className="auth__main">
        <form className="auth__card" onSubmit={handleSubmit}>
          <h1>Create your account</h1>
          <p className="auth__lead">It takes a minute. Then you can book your first class.</p>

          <div className="field">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              name="name"
              placeholder="Your name"
              autoComplete="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

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
                placeholder="Create a password"
                autoComplete="new-password"
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

          <div className="field">
            <label htmlFor="phone">Phone number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Your mobile number"
              autoComplete="tel"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="auth__btn">Create account</button>

          {message && (
            <p className={`auth__msg ${isError ? 'error' : 'success'}`} role="status" aria-live="polite">
              {message}
            </p>
          )}

          <p className="auth__alt">
            Already a member? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </main>
    </div>
  )
}

export default Register