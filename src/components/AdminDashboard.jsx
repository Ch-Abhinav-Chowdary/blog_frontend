import React from 'react'
import { pageWrapper, pageTitleClass, cardClass, bodyText } from '../styles/common'

function AdminDashboard() {
  return (
    <div className={`${pageWrapper} pb-16`}>
      <p className="text-xs font-semibold uppercase tracking-wider text-amber-800">Administration</p>
      <h1 className={`${pageTitleClass} mt-1`}>Admin dashboard</h1>
      <p className="mt-2 max-w-xl text-sm text-stone-600">Overview and tools for moderators. Extend this area with lists, metrics, or user management when your API is ready.</p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className={cardClass}>
          <h2 className="font-display text-lg font-semibold text-stone-900">Users</h2>
          <p className={`${bodyText} mt-2 text-sm`}>Review reader and author accounts.</p>
        </div>
        <div className={cardClass}>
          <h2 className="font-display text-lg font-semibold text-stone-900">Content</h2>
          <p className={`${bodyText} mt-2 text-sm`}>Flag or feature articles across the site.</p>
        </div>
        <div className={cardClass}>
          <h2 className="font-display text-lg font-semibold text-stone-900">System</h2>
          <p className={`${bodyText} mt-2 text-sm`}>Health checks and configuration (placeholder).</p>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
