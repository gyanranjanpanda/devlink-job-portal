import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'
import useAuthStore from '../store/authStore'

const STATUS_COLOR = {
  pending: 'bg-yellow-50 text-yellow-700',
  reviewed: 'bg-blue-50 text-blue-700',
  shortlisted: 'bg-purple-50 text-purple-700',
  hired: 'bg-green-50 text-green-700',
  rejected: 'bg-red-50 text-red-700',
}

function SeekerDashboard() {
  const [apps, setApps] = useState([])
  useEffect(() => {
    api.get('/applications/mine').then(r => setApps(r.data.applications))
  }, [])

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">My Applications</h2>
        <Link to="/jobs" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">Browse Jobs</Link>
      </div>
      {apps.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border text-gray-400">
          You haven't applied to any jobs yet.
          <br /><Link to="/jobs" className="text-blue-600 mt-2 block font-medium">Browse open roles →</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {apps.map(a => (
            <div key={a._id} className="bg-white border rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold">{a.job?.title}</p>
                <p className="text-sm text-gray-500">{a.job?.company} · {a.job?.location}</p>
                <p className="text-xs text-gray-400 mt-1">{new Date(a.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${STATUS_COLOR[a.status]}`}>
                {a.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function EmployerDashboard() {
  const [jobs, setJobs] = useState([])
  const [selectedJob, setSelectedJob] = useState(null)
  const [applicants, setApplicants] = useState([])

  useEffect(() => {
    api.get('/jobs/employer/mine').then(r => setJobs(r.data.jobs))
  }, [])

  const loadApplicants = async (jobId) => {
    setSelectedJob(jobId)
    const { data } = await api.get(`/applications/job/${jobId}`)
    setApplicants(data.applications)
  }

  const updateStatus = async (appId, status) => {
    await api.put(`/applications/${appId}/status`, { status })
    setApplicants(prev => prev.map(a => a._id === appId ? { ...a, status } : a))
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-1">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold">My Job Postings</h2>
          <Link to="/post-job" className="text-blue-600 text-sm font-medium">+ New</Link>
        </div>
        <div className="space-y-2">
          {jobs.map(j => (
            <button key={j._id} onClick={() => loadApplicants(j._id)}
              className={`w-full text-left border rounded-xl p-3 transition ${selectedJob === j._id ? 'border-blue-500 bg-blue-50' : 'bg-white hover:border-blue-300'}`}>
              <p className="font-medium text-sm">{j.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{j.applicants?.length || 0} applicants</p>
            </button>
          ))}
        </div>
      </div>
      <div className="col-span-2">
        <h2 className="font-semibold mb-3">Applicants</h2>
        {!selectedJob ? (
          <div className="text-center py-16 bg-white rounded-xl border text-gray-400">Select a job to see applicants</div>
        ) : applicants.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border text-gray-400">No applicants yet</div>
        ) : (
          <div className="space-y-3">
            {applicants.map(a => (
              <div key={a._id} className="bg-white border rounded-xl p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{a.applicant?.name}</p>
                    <p className="text-sm text-gray-500">{a.applicant?.email}</p>
                    <div className="flex gap-1 flex-wrap mt-1.5">
                      {a.applicant?.skills?.slice(0, 5).map(s => (
                        <span key={s} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{s}</span>
                      ))}
                    </div>
                  </div>
                  <select value={a.status} onChange={e => updateStatus(a._id, e.target.value)}
                    className={`text-xs border rounded-lg px-2 py-1 font-medium ${STATUS_COLOR[a.status]}`}>
                    {['pending','reviewed','shortlisted','hired','rejected'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                {a.coverLetter && <p className="text-sm text-gray-600 mt-2 border-t pt-2 italic">"{a.coverLetter}"</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuthStore()
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        Welcome, {user?.name} 👋
      </h1>
      {user?.role === 'employer' ? <EmployerDashboard /> : <SeekerDashboard />}
    </div>
  )
}
