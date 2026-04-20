import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'

const TYPES = ['', 'full-time', 'part-time', 'contract', 'internship', 'remote']

function JobCard({ job }) {
  return (
    <Link to={`/jobs/${job._id}`}
      className="bg-white border rounded-xl p-5 hover:shadow-md hover:border-blue-300 transition block">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{job.title}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{job.company} · {job.location}</p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">{job.type}</span>
            {job.skills?.slice(0, 4).map(s => (
              <span key={s} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{s}</span>
            ))}
          </div>
        </div>
        {job.salary?.min && (
          <div className="text-right text-sm">
            <p className="font-semibold text-gray-800">₹{job.salary.min}–{job.salary.max}k</p>
            <p className="text-gray-400 text-xs">per month</p>
          </div>
        )}
      </div>
      <p className="text-xs text-gray-400 mt-3">{new Date(job.createdAt).toLocaleDateString()}</p>
    </Link>
  )
}

export default function Jobs() {
  const [jobs, setJobs] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [q, setQ] = useState('')
  const [type, setType] = useState('')
  const [location, setLocation] = useState('')

  const fetchJobs = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, limit: 10 })
      if (q) params.set('q', q)
      if (type) params.set('type', type)
      if (location) params.set('location', location)
      const { data } = await api.get(`/jobs?${params}`)
      setJobs(data.jobs)
      setTotal(data.total)
      setPages(data.pages)
    } catch {}
    setLoading(false)
  }, [q, type, location, page])

  useEffect(() => { fetchJobs() }, [fetchJobs])

  const search = (e) => { e.preventDefault(); setPage(1); fetchJobs() }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Browse Jobs</h1>
      {/* Search bar */}
      <form onSubmit={search} className="bg-white border rounded-xl p-4 mb-6 flex flex-wrap gap-3">
        <input value={q} onChange={e => setQ(e.target.value)}
          placeholder="Search title, skill, keyword…"
          className="flex-1 min-w-[180px] border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <select value={type} onChange={e => setType(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          {TYPES.map(t => <option key={t} value={t}>{t || 'All types'}</option>)}
        </select>
        <input value={location} onChange={e => setLocation(e.target.value)}
          placeholder="Location"
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-36" />
        <button className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">Search</button>
      </form>

      <p className="text-sm text-gray-500 mb-4">{total} jobs found</p>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading…</div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No jobs found. Try adjusting filters.</div>
      ) : (
        <div className="space-y-3">
          {jobs.map(j => <JobCard key={j._id} job={j} />)}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-lg text-sm font-medium ${p === page ? 'bg-blue-600 text-white' : 'border hover:bg-gray-50'}`}>
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
