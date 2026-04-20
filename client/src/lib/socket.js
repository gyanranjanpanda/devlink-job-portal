import { io } from 'socket.io-client'

let socket = null

export const getSocket = () => {
  if (!socket) {
    const raw = localStorage.getItem('devlink-auth')
    const token = JSON.parse(raw)?.state?.accessToken
    socket = io('/', { auth: { token }, autoConnect: false })
  }
  return socket
}

export const connectSocket = () => { getSocket().connect() }
export const disconnectSocket = () => { socket?.disconnect(); socket = null }
