import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../stores/authStore";
import axios from "axios";
import { API_BASE } from "../config/api.js";
import { toast } from "react-hot-toast";
import {
  pageWrapper,
  pageTitleClass,
  articleGrid,
  articleCardClass,
  articleTitle,
  articleExcerpt,
  articleMeta,
  primaryBtn,
  secondaryBtn,
  emptyStateClass,
} from "../styles/common";

function UserDashboard() {

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const logout = useAuth((state) => state.logout);
  const navigate = useNavigate();

  useEffect(() => {

    async function getData() {

      setLoading(true);

      try {

        const res = await axios.get(
          `${API_BASE}/user-api/articles`,
          { withCredentials: true }
        );

        setArticles(res.data.payload);

      } catch (err) {

        setError(err);

      } finally {

        setLoading(false);

      }
    }

    getData();

  }, []);

  const onLogout = async () => {
    await logout();
    toast.success("Logged out");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className={`${pageWrapper} flex min-h-[50vh] items-center justify-center`}>
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-stone-200 border-t-amber-700" aria-hidden />
          <p className="text-sm font-medium text-stone-500">Loading articles…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${pageWrapper} flex min-h-[50vh] items-center justify-center`}>
        <p className="text-lg font-medium text-red-700">Could not load articles.</p>
      </div>
    );
  }

  return (
    <div className={`${pageWrapper} pb-16`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-800">Reader</p>
          <h1 className={`${pageTitleClass} mt-1`}>Articles for you</h1>
          <p className="mt-2 max-w-xl text-sm text-stone-600">Pick a story and settle in. Comments are open on each piece.</p>
        </div>
        <button type="button" className={secondaryBtn} onClick={onLogout}>
          Log out
        </button>
      </div>

      {articles.length === 0 ? (
        <p className={`${emptyStateClass} mt-10`}>No articles yet. Check back soon.</p>
      ) : (
        <div className={`${articleGrid} mt-10`}>
          {articles.map((obj) => (
            <article key={obj._id} className={articleCardClass}>
              <h2 className={articleTitle}>{obj.title}</h2>
              <p className={`${articleExcerpt} mt-2 flex-1`}>
                {obj.content.slice(0, 120)}…
              </p>
              <div className="mt-6 flex items-center justify-between gap-3 border-t border-stone-100 pt-4">
                <p className={articleMeta}>
                  {new Date(obj.updatedAt).toLocaleString()}
                </p>
                <NavLink to={`/article/${obj._id}`} className={primaryBtn}>
                  Read
                </NavLink>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
