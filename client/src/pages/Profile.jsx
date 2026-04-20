import { useState } from 'react'
import toast from 'react-hot-toast'
import api from '../lib/api'
import useAuthStore from '../store/authStore'

export default function Profile() {
  const { user, updateUser } = useAuthStore()
  const [form, setForm] = useState({
    name: user?.name || '', bio: user?.bio || '', location: user?.location || '',
    skills: user?.skills?.join(', ') || '', website: user?.website || '', company: user?.company || ''
  })
  const [loading, setLoading] = useState(false)
  const f = (field) => (e) => setForm({ ...form, [field]: e.target.value })
  const input = 'w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
  const label = 'block text-sm font-medium text-gray-700 mb-1'

  const save = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = { ...form, skills: form.skills.split(',').map(s => s.trim()).filter(Boolean) }
      const { data } = await api.put('/auth/profile', payload)
      updateUser(data.user)
      toast.success('Profile updated!')
    } catch { toast.error('Update failed') }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
      <div className="bg-white border rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-2xl">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-lg">{user?.name}</p>
            <p className="text-gray-500 text-sm">{user?.email} · {user?.role}</p>
          </div>
        </div>
        <form onSubmit={save} className="space-y-4">
          <div><label className={label}>Full name</label>
            <input value={form.name} onChange={f('name')} className={input} /></div>
          <div><label className={label}>Bio</label>
            <textarea rows={3} value={form.bio} onChange={f('bio')} className={input} placeholder="A short bio about yourself…" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={label}>Location</label>
              <input value={form.location} onChange={f('location')} className={input} placeholder="Bengaluru, India" /></div>
            <div><label className={label}>Website / GitHub</label>
              <input value={form.website} onChange={f('website')} className={input} placeholder="https://github.com/…" /></div>
          </div>
          {user?.role === 'jobseeker' && (
            <div><label className={label}>Skills (comma separated)</label>
              <input value={form.skills} onChange={f('skills')} className={input} placeholder="React, Node.js, TypeScript" /></div>
          )}
          {user?.role === 'employer' && (
            <div><label className={label}>Company name</label>
              <input value={form.company} onChange={f('company')} className={input} /></div>
          )}
          <button disabled={loading} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Saving…' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  )
}
