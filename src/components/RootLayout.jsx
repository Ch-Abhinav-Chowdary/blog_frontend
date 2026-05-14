import React, { useEffect } from 'react'
import Header from './Header'
import { Outlet } from 'react-router'
import { useAuth } from '../stores/authStore'

function RootLayout() {

  const checkAuth = useAuth((state)=>state.checkAuth)
  const loading = useAuth((state)=>state.loading)
  const connectionError = useAuth((state) => state.connectionError)
  const dismissConnectionError = useAuth((state) => state.dismissConnectionError)

  useEffect(() => {
    checkAuth()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-stone-200 border-t-amber-700" aria-hidden />
          <p className="text-sm font-medium text-stone-500">Loading…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
        <Header />
        {connectionError ? (
          <div
            role="alert"
            className="fixed left-0 right-0 top-16 z-40 border-b border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-950 shadow-sm"
          >
            <span className="inline-block max-w-3xl">{connectionError}</span>
            <button
              type="button"
              onClick={dismissConnectionError}
              className="ml-3 font-semibold text-amber-900 underline underline-offset-2 hover:text-amber-950"
            >
              Dismiss
            </button>
          </div>
        ) : null}
        <main className={connectionError ? "flex-1 pt-32" : "flex-1 pt-16"}>
            <Outlet />
        </main>
    </div>
  )
}

export default RootLayout
