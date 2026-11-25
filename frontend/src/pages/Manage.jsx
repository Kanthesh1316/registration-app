import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Manage.css'
import logo from './assets/logo.jpg'
import { API_URL } from '../config'

const API = API_URL + '/api'

function BatchRow({ batch, headers, setMessage, reload }) {
  const [link, setLink] = useState(batch.meetLink || '')

  const changeStatus = async (e) => {
    const res = await fetch(`${API}/batches/${batch.id}/status`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ status: e.target.value })
    })
    setMessage(res.ok ? 'Status updated' : await res.text())
    reload()
  }

  const saveLink = async () => {
    const res = await fetch(`${API}/batches/${batch.id}/link`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ meetLink: link })
    })
    setMessage(res.ok ? 'Link updated' : await res.text())
    reload()
  }

  return (
    <tr>
      <td className="mng__batch-name">{batch.name}</td>
      <td>
        <select
          className={`status status--${String(batch.status).toLowerCase()}`}
          value={batch.status}
          onChange={changeStatus}
          aria-label={`Status for ${batch.name}`}
        >
          <option value="ONGOING">Ongoing</option>
          <option value="ON_HOLD">On hold</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </td>
      <td>
        <input
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://meet.google.com/..."
          aria-label={`Meet link for ${batch.name}`}
        />
      </td>
      <td>
        <button
          type="button"
          className="mng__btn mng__btn--ghost"
          onClick={saveLink}
          disabled={link === (batch.meetLink || '')}
        >
          Save link
        </button>
      </td>
    </tr>
  )
}

function Manage() {
  const user = JSON.parse(localStorage.getItem('user'))
  const [batches, setBatches] = useState([])
  const [message, setMessage] = useState('')
  const [batchName, setBatchName] = useState('')
  const [student, setStudent] = useState({ batchId: '', email: '' })
  const [cls, setCls] = useState({ batchId: '', title: '', meetLink: '', startTime: '' })

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${user?.token}`
  }

  const loadBatches = () => {
    fetch(`${API}/batches`, { headers })
      .then((res) => res.json())
      .then((json) => setBatches(Array.isArray(json) ? json : []))
  }

  useEffect(() => {
    if (!user?.token) {
      window.location.href = '/login'
      return
    }
    loadBatches()
  }, [])

  const createBatch = async (e) => {
    e.preventDefault()
    const res = await fetch(`${API}/batches`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ name: batchName })
    })
    if (res.ok) {
      setMessage('Batch created')
      setBatchName('')
      loadBatches()
    } else {
      setMessage(await res.text())
    }
  }

  const addStudent = async (e) => {
    e.preventDefault()
    const res = await fetch(`${API}/batches/${student.batchId}/students`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email: student.email })
    })
    setMessage(await res.text())
    if (res.ok) setStudent({ ...student, email: '' })
  }

  const schedule = async (e) => {
    e.preventDefault()
    const res = await fetch(`${API}/classes`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ ...cls, batchId: Number(cls.batchId) })
    })
    if (res.ok) {
      setMessage('Class scheduled')
      loadBatches()
      setCls({ batchId: '', title: '', meetLink: '', startTime: '' })
    } else {
      setMessage(await res.text())
    }
  }

  const logout = () => {
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  const canSeeDashboard = user?.role === 'ADMIN' || user?.role === 'MANAGER'

  return (
    <div className="mng">
      <header className="mng__bar">
        <div className="mng__brand">
          <div className="mng__logo">
            <img src={logo} alt="" />
          </div>
          <span className="mng__brand-name">Yoga Kirana Studio</span>
        </div>
        <nav className="mng__nav">
          {canSeeDashboard && <Link className="mng__link" to="/dashboard">Dashboard</Link>}
          <button type="button" className="mng__logout" onClick={logout}>Log out</button>
        </nav>
      </header>

      <main className="mng__body">
        <h1 className="mng__title">Manage classes</h1>
        <p className="mng__sub">Create batches, add students and schedule classes in three steps.</p>

        {message && <p className="mng__msg" role="status" aria-live="polite">{message}</p>}

        <div className="mng__grid">
          <form className="mng__card" onSubmit={createBatch}>
            <div className="mng__card-head">
              <span className="mng__step" aria-hidden="true">1</span>
              <div>
                <h2>Create a batch</h2>
                <p className="mng__hint">Group the students who practise together.</p>
              </div>
            </div>
            <div className="mng__fields">
              <div className="mng__field">
                <label htmlFor="batch-name">Batch name</label>
                <input
                  id="batch-name"
                  placeholder="Morning flow, 6:30 am"
                  value={batchName}
                  onChange={(e) => setBatchName(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="mng__btn">Create batch</button>
            </div>
          </form>

          <form className="mng__card" onSubmit={addStudent}>
            <div className="mng__card-head">
              <span className="mng__step" aria-hidden="true">2</span>
              <div>
                <h2>Add a student</h2>
                <p className="mng__hint">Use the email they registered with.</p>
              </div>
            </div>
            <div className="mng__fields">
              <div className="mng__field">
                <label htmlFor="add-batch">Batch</label>
                <select
                  id="add-batch"
                  value={student.batchId}
                  onChange={(e) => setStudent({ ...student, batchId: e.target.value })}
                  required
                >
                  <option value="">Select a batch</option>
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
              <div className="mng__field">
                <label htmlFor="add-email">Student email</label>
                <input
                  id="add-email"
                  type="email"
                  placeholder="student@example.com"
                  value={student.email}
                  onChange={(e) => setStudent({ ...student, email: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="mng__btn">Add student</button>
            </div>
          </form>

          <form className="mng__card" onSubmit={schedule}>
            <div className="mng__card-head">
              <span className="mng__step" aria-hidden="true">3</span>
              <div>
                <h2>Schedule a class</h2>
                <p className="mng__hint">Pick a batch, a Meet link and a start time.</p>
              </div>
            </div>
            <div className="mng__fields">
              <div className="mng__field">
                <label htmlFor="sched-batch">Batch</label>
                <select
                  id="sched-batch"
                  value={cls.batchId}
                  onChange={(e) => setCls({ ...cls, batchId: e.target.value })}
                  required
                >
                  <option value="">Select a batch</option>
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
              <div className="mng__field">
                <label htmlFor="sched-title">Class title</label>
                <input
                  id="sched-title"
                  placeholder="Sun salutations"
                  value={cls.title}
                  onChange={(e) => setCls({ ...cls, title: e.target.value })}
                  required
                />
              </div>
              <div className="mng__field">
                <label htmlFor="sched-link">Meet link</label>
                <input
                  id="sched-link"
                  placeholder="https://meet.google.com/..."
                  value={cls.meetLink}
                  onChange={(e) => setCls({ ...cls, meetLink: e.target.value })}
                  required
                />
              </div>
              <div className="mng__field">
                <label htmlFor="sched-time">Start time</label>
                <input
                  id="sched-time"
                  type="datetime-local"
                  value={cls.startTime}
                  onChange={(e) => setCls({ ...cls, startTime: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="mng__btn">Schedule class</button>
            </div>
          </form>
        </div>

        <section className="mng__section">
          <h2>Your batches</h2>
          <div className="mng__table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Batch</th>
                  <th>Status</th>
                  <th>Meet link</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {batches.length === 0 && (
                  <tr>
                    <td className="mng__empty" colSpan={4}>
                      No batches yet. Create your first batch above.
                    </td>
                  </tr>
                )}
                {batches.map((b) => (
                  <BatchRow key={b.id} batch={b} headers={headers} setMessage={setMessage} reload={loadBatches} />
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Manage
