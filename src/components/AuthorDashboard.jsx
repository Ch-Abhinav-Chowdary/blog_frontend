import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router'
import { useAuth } from "../stores/authStore";
import { articleGrid, articleCardClass, articleTitle, articleExcerpt, articleMeta, primaryBtn, pageWrapper, pageTitleClass, mutedText } from '../styles/common';
import { toast } from 'react-hot-toast';
import axios from 'axios'
import { API_BASE } from '../config/api.js'


function AuthorDashboard() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const logout = useAuth((state) => state.logout)
  const currentUser = useAuth(state => state.currentUser)
  const navigate = useNavigate()

  useEffect(() => {
    async function getData() {
      setLoading(true)
      try {
        const id = currentUser?._id || currentUser?.userId;
        if (!id) {
          setArticles([])
          return
        }
        const res = await axios.get(`${API_BASE}/author-api/articles/${id}`, { withCredentials: true })
        const articleObj = res.data.payload
        setArticles([...articleObj])
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }
    getData()
  }, [currentUser])

  const onLogout = async () => {
    await logout()
    toast.success("Logged out")
    navigate('/login')
  }

  if (loading) {
    return (
      <div className={`${pageWrapper} flex min-h-[50vh] items-center justify-center`}>
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-stone-200 border-t-amber-700" aria-hidden />
          <p className="text-sm font-medium text-stone-500">Loading your work…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`${pageWrapper} flex min-h-[50vh] items-center justify-center`}>
        <p className="text-lg font-medium text-red-700">Could not load your articles.</p>
      </div>
    )
  }

  return (
    <div className={`${pageWrapper} pb-16`}>
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-1 flex-col gap-6 rounded-3xl border border-stone-200/90 bg-white p-8 shadow-sm sm:flex-row sm:items-center">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-stone-200 bg-stone-100 shadow-inner">
            {currentUser?.profileImageUrl ? (
              <img src={currentUser.profileImageUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center font-display text-2xl font-semibold text-stone-400">
                {(currentUser?.firstName || "?").charAt(0)}
              </span>
            )}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-800">Author studio</p>
            <h1 className={`${pageTitleClass} mt-1`}>Hello, {currentUser?.firstName}</h1>
            <p className={`${mutedText} mt-2 max-w-md`}>Manage drafts and published posts. Open any card to view on the public article page.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <NavLink to="/add-article" className={primaryBtn}>New post</NavLink>
              <button type="button" onClick={onLogout} className="rounded-xl border border-stone-300 bg-white px-5 py-2.5 text-sm font-semibold text-stone-800 transition hover:bg-stone-50">
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>

      <h2 className="font-display mt-14 text-2xl font-semibold text-stone-900">Your articles</h2>
      <div className={`${articleGrid} mt-6`}>
        {articles.length === 0 ? (
          <p className="col-span-full rounded-2xl border border-dashed border-stone-300 bg-stone-50/80 py-14 text-center text-sm text-stone-500">
            No articles yet. Write your first post.
          </p>
        ) : (
          articles.map((obj) => (
            <article key={obj._id} className={articleCardClass}>
              <h2 className={articleTitle}>{obj.title}</h2>
              <p className={`${articleExcerpt} mt-2 flex-1`}>{obj.content.slice(0, 140)}…</p>
              <div className="mt-6 flex items-center justify-between gap-3 border-t border-stone-100 pt-4">
                <p className={articleMeta}>{new Date(obj.updatedAt).toLocaleString()}</p>
                <NavLink to={`/article/${obj._id}`} className={primaryBtn}>View</NavLink>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  )
}

export default AuthorDashboard;
