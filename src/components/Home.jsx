import React from 'react'
import { NavLink } from 'react-router'

function Home() {
  return (
    <div className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(180,83,9,0.12),transparent)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex rounded-full border border-amber-200/80 bg-amber-50 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-amber-900">
            Editorial platform
          </p>
          <h1 className="font-display mt-8 text-4xl font-semibold leading-[1.1] tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
            Stories worth
            <span className="block text-amber-800">sitting with.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-stone-600">
            Read thoughtful articles from authors you follow, or open a blank document and let the page breathe. No clutter—just words and white space.
          </p>
          <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <NavLink
              to="/register"
              className="inline-flex items-center justify-center rounded-xl bg-stone-900 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-stone-900/20 transition hover:bg-stone-800"
            >
              Start writing
            </NavLink>
            <NavLink
              to="/login"
              className="inline-flex items-center justify-center rounded-xl border border-stone-300 bg-white px-8 py-3.5 text-sm font-semibold text-stone-800 transition hover:border-stone-400 hover:bg-stone-50"
            >
              Browse as reader
            </NavLink>
          </div>
        </div>

        <div className="mx-auto mt-20 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { t: 'Calm reading', d: 'Generous line height and serif headlines for long sessions.' },
            { t: 'Author studio', d: 'Draft, publish, and see your work in a clean article layout.' },
            { t: 'Threaded voices', d: 'Readers can comment and join the conversation respectfully.' },
          ].map((item) => (
            <div
              key={item.t}
              className="rounded-2xl border border-stone-200/90 bg-white/80 p-6 text-left shadow-sm backdrop-blur-sm"
            >
              <h2 className="font-display text-lg font-semibold text-stone-900">{item.t}</h2>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">{item.d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
