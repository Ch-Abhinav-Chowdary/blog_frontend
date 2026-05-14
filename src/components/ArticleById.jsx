import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../stores/authStore";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { pageWrapper, tagClass, primaryBtn, secondaryBtn } from "../styles/common";
import { API_BASE } from "../config/api.js";

function ArticleById() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = useAuth((state) => state.currentUser);

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentLoading, setCommentLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    async function fetchArticle() {
      try {
        const res = await axios.get(
          `${API_BASE}/common-api/articles/${id}`,
          { withCredentials: true }
        );
        setArticle(res.data.payload);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load article");
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [id]);

  const onAddComment = async (data) => {
    setCommentLoading(true);
    try {
      const res = await axios.put(
        `${API_BASE}/user-api/articles`,
        {
          articleId: id,
          user: currentUser?._id || currentUser?.userId,
          comment: data.comment,
        },
        { withCredentials: true }
      );
      setArticle(res.data.payload);
      reset();
      toast.success("Comment added!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add comment");
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`${pageWrapper} flex min-h-[50vh] items-center justify-center`}>
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-stone-200 border-t-amber-700" aria-hidden />
          <p className="text-sm font-medium text-stone-500">Opening article…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${pageWrapper} flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center`}>
        <p className="text-lg font-medium text-red-700">{error}</p>
        <button type="button" onClick={() => navigate(-1)} className={secondaryBtn}>
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className={`${pageWrapper} pb-16`}>
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-amber-800 hover:text-amber-950"
      >
        <span aria-hidden>←</span> Back
      </button>

      <article className="mx-auto max-w-3xl rounded-3xl border border-stone-200/90 bg-white p-8 shadow-sm sm:p-10 lg:p-12">
        <span className={tagClass}>{article.category}</span>
        <h1 className="font-display mt-6 text-3xl font-semibold leading-tight tracking-tight text-stone-900 sm:text-4xl">
          {article.title}
        </h1>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-stone-600">
          {article.author?.profileImageUrl && (
            <img
              src={article.author.profileImageUrl}
              alt=""
              className="h-10 w-10 rounded-full border border-stone-200 object-cover"
            />
          )}
          <span className="font-medium text-stone-800">
            {article.author?.firstName} {article.author?.lastName || ""}
          </span>
          <span className="text-stone-300">·</span>
          <time dateTime={article.createdAt}>
            {new Date(article.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>

        <hr className="my-10 border-stone-200" />

        <div className="whitespace-pre-wrap text-base leading-[1.85] text-stone-700">
          {article.content}
        </div>
      </article>

      <section className="mx-auto mt-10 max-w-3xl rounded-3xl border border-stone-200/90 bg-white p-8 shadow-sm sm:p-10">
        <h2 className="font-display text-xl font-semibold text-stone-900">
          Comments <span className="text-stone-400">({article.comments?.length || 0})</span>
        </h2>

        {article.comments && article.comments.length > 0 ? (
          <ul className="mt-6 space-y-4">
            {article.comments.map((c, index) => (
              <li
                key={index}
                className="flex gap-4 rounded-2xl border border-stone-100 bg-stone-50/80 p-4"
              >
                {c.user?.profileImageUrl ? (
                  <img src={c.user.profileImageUrl} alt="" className="h-10 w-10 shrink-0 rounded-full border border-stone-200 object-cover" />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-sm font-bold text-amber-900">
                    {(c.user?.firstName || "U").charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-stone-900">
                    {c.user?.firstName} {c.user?.lastName || ""}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-stone-600">{c.comment}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm italic text-stone-500">
            No comments yet. Be the first to join the conversation.
          </p>
        )}

        {currentUser?.role === "USER" && (
          <form onSubmit={handleSubmit(onAddComment)} className="mt-8 border-t border-stone-200 pt-8">
            <label htmlFor="comment" className="sr-only">Your comment</label>
            <textarea
              id="comment"
              rows={3}
              placeholder="Share your thoughts…"
              className="w-full resize-none rounded-xl border border-stone-200 bg-stone-50/50 p-4 text-sm text-stone-900 placeholder:text-stone-400 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              {...register("comment", {
                required: "Comment cannot be empty",
                minLength: {
                  value: 2,
                  message: "At least 2 characters",
                },
              })}
            />
            {errors.comment && (
              <p className="mt-2 text-sm text-red-600">{errors.comment.message}</p>
            )}
            <button
              type="submit"
              disabled={commentLoading}
              className={`${primaryBtn} mt-4 disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {commentLoading ? "Posting…" : "Post comment"}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}

export default ArticleById;
