import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useAuth } from "../stores/authStore";
import axios from "axios";
import { toast } from "react-hot-toast";
import { errorClass, loadingClass, pageWrapper, formTitle, labelClass, inputClass, submitBtn } from "../styles/common.js";
import { API_BASE } from "../config/api.js";

export default function AddArticle() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const currentUser = useAuth((state) => state.currentUser);

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const id = currentUser?._id || currentUser?.userId;
      const articleObj = { ...data, author: id };
      await axios.post(
        `${API_BASE}/author-api/articles`,
        articleObj,
        { withCredentials: true }
      );
      toast.success("Article published successfully!");
      navigate("/author-dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to publish article");
      toast.error(err.response?.data?.message || "Failed to publish article");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className={loadingClass}>Publishing your article…</p>;
  }

  return (
    <div className={`${pageWrapper} pb-16`}>
      <div className="mx-auto max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-800">Composer</p>
        <h1 className={`${formTitle} mt-2 text-left`}>New article</h1>
        <p className="text-sm text-stone-600">Title, category, and body—keep it clear for readers.</p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-10 space-y-6 rounded-3xl border border-stone-200/90 bg-white p-8 shadow-sm sm:p-10"
        >
          {error && (
            <div className="mb-2">
              <p className={errorClass}>{error}</p>
            </div>
          )}

          <div>
            <label className={labelClass}>Title</label>
            <input
              type="text"
              className={inputClass}
              placeholder="A headline readers will remember"
              {...register("title", {
                required: "Title is required",
                minLength: {
                  value: 5,
                  message: "At least 5 characters",
                },
              })}
            />
            {errors.title && (
              <p className="mt-1.5 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Category</label>
            <select
              className={`${inputClass} cursor-pointer`}
              {...register("category", { required: true })}
            >
              <option value="">Select category</option>
              <option value="Technology">Technology</option>
              <option value="Programming">Programming</option>
              <option value="AI">AI</option>
              <option value="Business">Business</option>
              <option value="Education">Education</option>
            </select>
            {errors?.category?.type == "required" && (
              <p className="mt-1.5 text-sm text-red-600">Category is required</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Content</label>
            <textarea
              rows={12}
              className={`${inputClass} min-h-[200px] resize-y`}
              placeholder="Write your piece here…"
              {...register("content", { required: true, minLength: 20 })}
            />
            {errors?.content?.type == "required" && (
              <p className="mt-1.5 text-sm text-red-600">Content is required</p>
            )}
            {errors?.content?.type == "minLength" && (
              <p className="mt-1.5 text-sm text-red-600">At least 20 characters</p>
            )}
          </div>

          <button type="submit" className={submitBtn}>
            Publish article
          </button>
        </form>
      </div>
    </div>
  );
}
