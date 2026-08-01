import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { Toast } from '@/components/ui/Toast'
import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function AdminLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      navigate('/login')
    }
  }, [navigate])

  return (
    <div className="flex min-h-screen bg-surface-bg">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-5" id="main-content">{children}</main>
      </div>
      <Toast />
    </div>
  )
}
