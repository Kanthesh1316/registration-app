import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Dashboard.css'
import './Details.css'
import logo from './assets/logo.jpg'
import { API_URL } from '../config'

const empty = {
  fullName: '',
  dateOfBirth: '',
  age: '',
  gender: '',
  address: '',
  mobileNumber: '',
  healthCondition: '',
  height: '',
  weight: '',
  occupation: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  level: '',
  goals: ''
}

function Field({ name, label, full, children }) {
  return (
    <div className={`fld${full ? ' fld--full' : ''}`}>
      <label htmlFor={`f-${name}`}>{label}</label>
      {children}
    </div>
  )
}

function Details() {
  const user = JSON.parse(localStorage.getItem('user'))
  const [form, setForm] = useState(empty)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${user?.token}`
  }

  useEffect(() => {
    if (!user?.token) {
      window.location.href = '/login'
      return
    }
    fetch(API_URL + '/api/profile', { headers })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('user')
          window.location.href = '/login'
          return null
        }
        return res.status === 200 ? res.json() : null
      })
      .then((json) => {
        if (json) {
          const clean = {}
          Object.keys(empty).forEach((k) => {
            clean[k] = json[k] ?? ''
          })
          setForm(clean)
        }
      })
      .catch(() => {
        setMessage('Cannot reach server')
        setIsError(true)
      })
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const num = (v) => (v === '' ? null : Number(v))

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(API_URL + '/api/profile', {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          ...form,
          dateOfBirth: form.dateOfBirth || null,
          age: num(form.age),
          height: num(form.height),
          weight: num(form.weight)
        })
      })
      if (res.ok) {
        setMessage('Profile saved')
        setIsError(false)
      } else {
        setMessage(await res.text())
        setIsError(true)
      }
    } catch (err) {
      setMessage('Cannot reach server')
      setIsError(true)
    }
  }

  const logout = () => {
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

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
          <Link className="dash__link" to="/my-classes">Back to my classes</Link>
          <button type="button" className="dash__logout" onClick={logout}>Log out</button>
        </nav>
      </header>

      <main className="dash__body prf-body">
        <div className="dash__head">
          <div>
            <h1 className="dash__title">My profile</h1>
            <p className="dash__sub">Your details help your trainers plan safe, suitable classes.</p>
            {user?.email && <span className="prf-email">Signed in as {user.email}</span>}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <section className="prf-card">
            <h2>About you</h2>
            <p className="prf-hint">The basics we use to set up your place in a batch.</p>
            <div className="prf-grid">
              <Field name="fullName" label="Full name" full>
                <input id="f-fullName" name="fullName" placeholder="Your full name" autoComplete="name" value={form.fullName} onChange={handleChange} required />
              </Field>
              <Field name="dateOfBirth" label="Date of birth">
                <input id="f-dateOfBirth" name="dateOfBirth" type="date" autoComplete="bday" value={form.dateOfBirth} onChange={handleChange} required />
              </Field>
              <Field name="age" label="Age">
                <input id="f-age" name="age" type="number" placeholder="Age in years" value={form.age} onChange={handleChange} required />
              </Field>
              <Field name="gender" label="Gender">
                <select id="f-gender" name="gender" value={form.gender} onChange={handleChange} required>
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </Field>
              <Field name="occupation" label="Occupation">
                <input id="f-occupation" name="occupation" placeholder="What you do for work" value={form.occupation} onChange={handleChange} required />
              </Field>
            </div>
          </section>

          <section className="prf-card">
            <h2>Contact</h2>
            <p className="prf-hint">How the studio can reach you.</p>
            <div className="prf-grid">
              <Field name="mobileNumber" label="Mobile number" full>
                <input id="f-mobileNumber" name="mobileNumber" type="tel" placeholder="Your mobile number" autoComplete="tel" value={form.mobileNumber} onChange={handleChange} required />
              </Field>
              <Field name="address" label="Address" full>
                <textarea id="f-address" name="address" placeholder="Where you live" autoComplete="street-address" value={form.address} onChange={handleChange} required />
              </Field>
            </div>
          </section>

          <section className="prf-card">
            <h2>Your practice</h2>
            <p className="prf-hint">Tell us about your body and what you want from yoga.</p>
            <div className="prf-grid">
              <Field name="level" label="Yoga level" full>
                <select id="f-level" name="level" value={form.level} onChange={handleChange} required>
                  <option value="">Select your level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </Field>
              <Field name="height" label="Height (cm)">
                <input id="f-height" name="height" type="number" placeholder="For example, 165" value={form.height} onChange={handleChange} required />
              </Field>
              <Field name="weight" label="Weight (kg)">
                <input id="f-weight" name="weight" type="number" placeholder="For example, 60" value={form.weight} onChange={handleChange} required />
              </Field>
              <Field name="healthCondition" label="Health conditions or injuries" full>
                <input id="f-healthCondition" name="healthCondition" placeholder="Write None if you have none" value={form.healthCondition} onChange={handleChange} required />
              </Field>
              <Field name="goals" label="Your goals (optional)" full>
                <textarea id="f-goals" name="goals" placeholder="For example, flexibility, strength or stress relief" value={form.goals} onChange={handleChange} />
              </Field>
            </div>
          </section>

          <section className="prf-card">
            <h2>Emergency contact</h2>
            <p className="prf-hint">Someone we can call if you need help during a class.</p>
            <div className="prf-grid">
              <Field name="emergencyContactName" label="Contact name">
                <input id="f-emergencyContactName" name="emergencyContactName" placeholder="Their full name" value={form.emergencyContactName} onChange={handleChange} required />
              </Field>
              <Field name="emergencyContactPhone" label="Contact phone">
                <input id="f-emergencyContactPhone" name="emergencyContactPhone" type="tel" placeholder="Their phone number" value={form.emergencyContactPhone} onChange={handleChange} required />
              </Field>
            </div>
          </section>

          <div className="prf-actions">
            {message && (
              <p className={`prf-msg ${isError ? 'prf-msg--error' : 'prf-msg--success'}`} role="status" aria-live="polite">
                {message}
              </p>
            )}
            <button type="submit" className="prf-save">Save profile</button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default Details
