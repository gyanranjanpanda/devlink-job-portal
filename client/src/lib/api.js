import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem('devlink-auth')
  if (raw) {
    const { accessToken } = JSON.parse(raw)?.state || {}
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const raw = localStorage.getItem('devlink-auth')
        const { refreshToken } = JSON.parse(raw)?.state || {}
        const { data } = await axios.post('/api/auth/refresh', { refreshToken })
        // update store
        const stored = JSON.parse(localStorage.getItem('devlink-auth'))
        stored.state.accessToken = data.accessToken
        localStorage.setItem('devlink-auth', JSON.stringify(stored))
        original.headers.Authorization = `Bearer ${data.accessToken}`
        return api(original)
      } catch {
        localStorage.removeItem('devlink-auth')
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

export default api
