// PostJob.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../lib/api'

export function PostJob() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '', location: '', type: 'full-time', description: '',
    requirements: '', skills: '', salaryMin: '', salaryMax: ''
  })
  const [loading, setLoading] = useState(false)

  const handle = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/jobs', {
        title: form.title, location: form.location, type: form.type,
        description: form.description,
        requirements: form.requirements.split('\n').filter(Boolean),
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
        salary: { min: +form.salaryMin, max: +form.salaryMax }
      })
      toast.success('Job posted!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error posting job')
    } finally { setLoading(false) }
  }

  const f = (field) => (e) => setForm({ ...form, [field]: e.target.value })
  const input = 'w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
  const label = 'block text-sm font-medium text-gray-700 mb-1'

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Post a Job</h1>
      <div className="bg-white border rounded-2xl p-6">
        <form onSubmit={handle} className="space-y-4">
          <div><label className={label}>Job Title</label>
            <input required value={form.title} onChange={f('title')} className={input} placeholder="e.g. Full Stack Developer" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={label}>Location</label>
              <input required value={form.location} onChange={f('location')} className={input} placeholder="Bengaluru / Remote" /></div>
            <div><label className={label}>Type</label>
              <select value={form.type} onChange={f('type')} className={input}>
                {['full-time','part-time','contract','internship','remote'].map(t => <option key={t}>{t}</option>)}
              </select></div>
          </div>
          <div><label className={label}>Description</label>
            <textarea required rows={5} value={form.description} onChange={f('description')} className={input} placeholder="Describe the role, responsibilities, team…" /></div>
          <div><label className={label}>Requirements (one per line)</label>
            <textarea rows={3} value={form.requirements} onChange={f('requirements')} className={input} placeholder="3+ years React experience&#10;Strong TypeScript skills" /></div>
          <div><label className={label}>Skills (comma separated)</label>
            <input value={form.skills} onChange={f('skills')} className={input} placeholder="React, Node.js, MongoDB, Docker" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={label}>Min Salary (₹k/mo)</label>
              <input type="number" value={form.salaryMin} onChange={f('salaryMin')} className={input} placeholder="15" /></div>
            <div><label className={label}>Max Salary (₹k/mo)</label>
              <input type="number" value={form.salaryMax} onChange={f('salaryMax')} className={input} placeholder="30" /></div>
          </div>
          <button disabled={loading} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Posting…' : 'Post Job'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default PostJob
