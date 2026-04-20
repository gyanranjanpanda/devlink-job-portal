import { useState, useEffect, useRef } from 'react'
import { getSocket, connectSocket } from '../lib/socket'
import api from '../lib/api'
import useAuthStore from '../store/authStore'

export default function Messages() {
  const { user } = useAuthStore()
  const [conversations, setConversations] = useState([])
  const [activeRoom, setActiveRoom] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [activeOther, setActiveOther] = useState(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    connectSocket()
    const socket = getSocket()
    socket.on('newMessage', (msg) => {
      setMessages(prev => [...prev, msg])
    })
    api.get('/messages/conversations/list').then(r => setConversations(r.data.conversations))
    return () => socket.off('newMessage')
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const openRoom = async (roomId, otherId) => {
    setActiveRoom(roomId)
    setActiveOther(otherId)
    const socket = getSocket()
    socket.emit('joinRoom', roomId)
    const { data } = await api.get(`/messages/${roomId}`)
    setMessages(data.messages)
  }

  const send = (e) => {
    e.preventDefault()
    if (!input.trim() || !activeRoom) return
    const socket = getSocket()
    socket.emit('sendMessage', { roomId: activeRoom, content: input.trim(), receiverId: activeOther })
    setInput('')
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 h-[calc(100vh-80px)] flex gap-4">
      {/* Sidebar */}
      <div className="w-64 bg-white border rounded-2xl overflow-hidden flex flex-col">
        <div className="p-4 border-b font-semibold text-sm">Conversations</div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <p className="text-gray-400 text-sm text-center mt-8">No conversations yet</p>
          ) : conversations.map(c => (
            <button key={c.roomId} onClick={() => openRoom(c.roomId, c.otherId)}
              className={`w-full text-left px-4 py-3 border-b hover:bg-gray-50 transition ${activeRoom === c.roomId ? 'bg-blue-50' : ''}`}>
              <p className="text-sm font-medium truncate">{c.otherId}</p>
              <p className="text-xs text-gray-400 truncate">{c.lastMessage}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 bg-white border rounded-2xl flex flex-col overflow-hidden">
        {!activeRoom ? (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a conversation to start messaging
          </div>
        ) : (
          <>
            <div className="p-4 border-b font-semibold text-sm">Chat</div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => {
                const isMine = m.sender?._id === user?._id || m.sender === user?._id
                return (
                  <div key={i} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs rounded-2xl px-4 py-2 text-sm ${isMine ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                      {m.content}
                    </div>
                  </div>
                )
              })}
              <div ref={bottomRef} />
            </div>
            <form onSubmit={send} className="p-3 border-t flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)}
                placeholder="Type a message…"
                className="flex-1 border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700">Send</button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
