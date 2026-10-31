import { useEffect, useState } from 'react'

type Patient = { id: number; name: string; species: string; owner_name: string; notes: string }
const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function App() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [question, setQuestion] = useState('')
  const [reply, setReply] = useState<{ answer: string; notice: string; citations: { source: string; excerpt: string }[] } | null>(null)
  const [error, setError] = useState('')
  const refresh = () => fetch(`${API}/api/patients`).then(r => r.json()).then(setPatients).catch(() => setError('API unavailable. Start the services with Docker Compose.'))
  useEffect(() => { void refresh() }, [])
  async function addPatient(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError('')
    const data = Object.fromEntries(new FormData(event.currentTarget))
    const response = await fetch(`${API}/api/patients`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    if (!response.ok) { setError('Could not save this patient. Check the fields and try again.'); return }
    event.currentTarget.reset(); void refresh()
  }
  async function ask(event: React.FormEvent) {
    event.preventDefault()
    const response = await fetch(`${API}/api/assistant/ask`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question }) })
    setReply(await response.json())
  }
  return <main className="shell">
    <header className="topbar"><a className="brand" href="#">✳ <span>aviary<span className="brand-light">care</span></span></a><div className="top-meta"><span className="status-dot"/> Clinic workspace <span className="avatar">AC</span></div></header>
    <section className="welcome"><div><p className="eyebrow">MONDAY · CLINIC OVERVIEW</p><h1>A calmer day<br/>for every <em>wing.</em></h1><p className="intro">Your patients, appointments, and care resources in one thoughtful space.</p></div><div className="hero-art" aria-hidden="true"><div className="sun"/><div className="bird">✦</div><div className="leaf leaf-a"/><div className="leaf leaf-b"/><div className="orbit"/></div></section>
    <section className="content-grid">
      <div className="panel patients"><div className="section-heading"><div><p className="eyebrow">PATIENT DIRECTORY</p><h2>Feathered friends</h2></div><span className="count">{patients.length} patients</span></div>
        <form onSubmit={addPatient} className="patient-form"><input name="name" placeholder="Patient name" required/><input name="species" placeholder="Species" required/><input name="owner_name" placeholder="Owner name" required/><button type="submit">Add patient <span>＋</span></button></form>
        {error && <p className="error">{error}</p>}
        <div className="patient-list">{patients.length === 0 ? <div className="empty"><span>♧</span><p>Your patient list is ready to take flight.</p><small>Add your first patient above.</small></div> : patients.map((p, i) => <article className="patient-row" key={p.id}><span className={`bird-icon bird-${i % 3}`}>{['♧','✿','◉'][i % 3]}</span><div><strong>{p.name}</strong><small>{p.species} · {p.owner_name}</small></div><span className="row-arrow">↗</span></article>)}</div>
      </div>
      <aside className="side-column"><div className="assistant-card"><div className="assistant-top"><span className="spark">✳</span><span className="pill">CARE LIBRARY</span></div><h2>A little help<br/>for the <em>curious.</em></h2><p>Find answers in clinic-reviewed care references, with sources attached.</p><form onSubmit={ask} className="ask-form"><input value={question} onChange={e => setQuestion(e.target.value)} placeholder="Ask a care question…" required/><button aria-label="Ask assistant">↗</button></form>{reply && <div className="reply"><p>{reply.answer}</p>{reply.citations.map(c => <small key={c.source}>Source: {c.source} — {c.excerpt}</small>)}<small className="notice">{reply.notice}</small></div>}<small className="disclaimer">General information only · Always consult your avian veterinarian</small></div>
        <div className="tip-card"><span className="tip-icon">✧</span><div><p className="eyebrow">A GENTLE REMINDER</p><p>Small changes can make a big difference. Keep routine wellness visits on the calendar.</p></div></div></aside>
    </section><footer>Made with care for the birds in our lives <span>✳</span></footer>
  </main>
}
