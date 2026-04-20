import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../lib/api'
import useAuthStore from '../store/authStore'

export default function JobDetail() {
  const { id } = useParams()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    api.get(`/jobs/${id}`).then(r => setJob(r.data.job)).catch(() => navigate('/jobs')).finally(() => setLoading(false))
  }, [id, navigate])

  const apply = async (e) => {
    e.preventDefault()
    if (!user) return navigate('/login')
    setApplying(true)
    try {
      await api.post(`/applications/${id}`, { coverLetter })
      toast.success('Application submitted!')
      setShowForm(false)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error applying')
    } finally { setApplying(false) }
  }

  if (loading) return <div className="text-center py-20 text-gray-400">Loading…</div>
  if (!job) return null

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white border rounded-2xl p-6 mb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            <p className="text-gray-500 mt-1">{job.company} · {job.location}</p>
            <div className="flex gap-2 mt-3">
              <span className="bg-blue-50 text-blue-700 text-sm px-3 py-0.5 rounded-full">{job.type}</span>
              {job.salary?.min && (
                <span className="bg-green-50 text-green-700 text-sm px-3 py-0.5 rounded-full">
                  ₹{job.salary.min}–{job.salary.max}k/mo
                </span>
              )}
            </div>
          </div>
          {user?.role === 'jobseeker' && (
            <button onClick={() => setShowForm(v => !v)}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 whitespace-nowrap">
              Apply Now
            </button>
          )}
        </div>

        {showForm && (
          <form onSubmit={apply} className="mt-5 border-t pt-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">Cover letter (optional)</label>
            <textarea rows={4} value={coverLetter} onChange={e => setCoverLetter(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Why are you a great fit for this role?" />
            <button disabled={applying} className="mt-2 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
              {applying ? 'Submitting…' : 'Submit Application'}
            </button>
          </form>
        )}
      </div>

      <div className="bg-white border rounded-2xl p-6 mb-4">
        <h2 className="font-semibold text-lg mb-3">Job Description</h2>
        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{job.description}</p>
      </div>

      {job.requirements?.length > 0 && (
        <div className="bg-white border rounded-2xl p-6 mb-4">
          <h2 className="font-semibold text-lg mb-3">Requirements</h2>
          <ul className="space-y-1.5">
            {job.requirements.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-blue-500 mt-0.5">✓</span>{r}
              </li>
            ))}
          </ul>
        </div>
      )}

      {job.skills?.length > 0 && (
        <div className="bg-white border rounded-2xl p-6">
          <h2 className="font-semibold text-lg mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {job.skills.map(s => (
              <span key={s} className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">{s}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
