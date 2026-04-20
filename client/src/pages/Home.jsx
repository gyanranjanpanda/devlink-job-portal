import { Link } from 'react-router-dom'

const stats = [
  { label: 'Jobs Posted', value: '2,400+' },
  { label: 'Developers Hired', value: '850+' },
  { label: 'Companies', value: '320+' },
]

const features = [
  { icon: '🔍', title: 'Smart Search', desc: 'Filter by skills, type, and location instantly.' },
  { icon: '💬', title: 'Real-time Chat', desc: 'Message employers and candidates directly.' },
  { icon: '📄', title: 'One-click Apply', desc: 'Apply with your saved profile and resume.' },
  { icon: '📊', title: 'Track Status', desc: 'See your application status live.' },
]

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-24 px-4 text-center">
        <h1 className="text-5xl font-bold mb-4">Find Your Next Dev Role</h1>
        <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
          DevLink connects talented developers with companies that value great engineering.
        </p>
        <div className="flex gap-3 justify-center">
          <Link to="/jobs" className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50">
            Browse Jobs
          </Link>
          <Link to="/register" className="border border-white text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10">
            Post a Job
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b py-10">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6 text-center">
          {stats.map(s => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-blue-600">{s.value}</p>
              <p className="text-gray-500 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-10">Everything you need to get hired</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map(f => (
            <div key={f.title} className="bg-white rounded-xl border p-5 text-center hover:shadow-md transition">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold mb-1">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white text-center py-16 px-4">
        <h2 className="text-3xl font-bold mb-4">Ready to build your career?</h2>
        <p className="text-blue-100 mb-6">Join thousands of developers finding their dream jobs on DevLink.</p>
        <Link to="/register" className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-xl hover:bg-blue-50">
          Get Started Free
        </Link>
      </section>
    </div>
  )
}
