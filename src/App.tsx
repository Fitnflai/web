import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from '@/routes/router'
import { useAppStore } from '@/store/useAppStore'
import { Toast } from '@/components/ui/Toast'

export default function App() {
  const isDarkMode = useAppStore((state) => state.isDarkMode)

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  return (
    <>
      <RouterProvider router={router} />
      <Toast />
    </>
  )
}
