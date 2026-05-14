import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../stores/authStore";
import { formCard, formTitle, formGroup, labelClass, inputClass, submitBtn, pageWrapper } from "../styles/common";
import { toast } from "react-hot-toast";

export default function Login() {

  const { register, handleSubmit, formState: { errors } } = useForm();
  const login = useAuth((state)=>state.login)
  const isAuthenticated = useAuth(state=>state.isAuthenticated)
  const currentUser = useAuth(state=>state.currentUser)
  const error = useAuth(state=>state.error)
  const navigate = useNavigate()


  const onSubmit = async (userCredObj) => {
    await login(userCredObj)
  };

  useEffect (()=>{
    if (isAuthenticated){
      if (currentUser.role === "USER"){
        toast.success("Login successful")
        navigate("/user-dashboard");
      }
      if (currentUser.role === "AUTHOR"){
        toast.success("Login successful")
        navigate("/author-dashboard");
      }
    }
  },[isAuthenticated,currentUser])

  
  return (
    <div className={`${pageWrapper} flex min-h-[calc(100vh-4rem)] items-center justify-center py-12`}>
      <form onSubmit={handleSubmit(onSubmit)} className={formCard}>
        <h2 className={formTitle}>Welcome back</h2>
        <p className="-mt-4 mb-8 text-center text-sm text-stone-500">Sign in to continue reading or writing.</p>
        
        <div className="mb-6 text-center">
          { error ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p> : null }
        </div>

        <div className={formGroup}>
          <label className={labelClass}>Sign in as</label>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-stone-200 bg-stone-50/50 px-3 py-3 transition has-[:checked]:border-amber-500 has-[:checked]:bg-amber-50 has-[:checked]:ring-2 has-[:checked]:ring-amber-500/20">
              <input type="radio" value="USER" className="h-4 w-4 text-amber-700 focus:ring-amber-500" {...register("role", { required:true })} />
              <span className="text-sm font-medium text-stone-800">Reader</span>
            </label>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-stone-200 bg-stone-50/50 px-3 py-3 transition has-[:checked]:border-amber-500 has-[:checked]:bg-amber-50 has-[:checked]:ring-2 has-[:checked]:ring-amber-500/20">
              <input type="radio" value="AUTHOR" className="h-4 w-4 text-amber-700 focus:ring-amber-500" {...register("role",{ required:true })} />
              <span className="text-sm font-medium text-stone-800">Author</span>
            </label>
          </div>
          {errors?.role?.type=="required" && <p className="mt-2 text-center text-xs font-medium text-red-600">Choose a role</p>}
        </div>

        <div className={formGroup}>
          <label className={labelClass}>Email</label>
          <input type="text" className={inputClass} placeholder="you@example.com" {...register("email", { required:true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/})} />
          {errors?.email?.type == "required" && <p className="mt-1.5 text-xs font-medium text-red-600">Email is required</p> }
          {errors?.email?.type == "pattern" && <p className="mt-1.5 text-xs font-medium text-red-600">Invalid email</p> }
        </div>

        <div className="mb-8">
          <label className={labelClass}>Password</label>
          <input type="password" className={inputClass} placeholder="••••••••" {...register("password", { required:true })} />
          {errors?.password?.type == "required" && <p className="mt-1.5 text-xs font-medium text-red-600">Password is required</p> }
        </div>
        
        <button type="submit" className={submitBtn}>Sign in</button>
        <div className="mt-6 text-center text-sm text-stone-600">
          <p>New here? <NavLink to="/register" className="font-semibold text-amber-800 hover:text-amber-950">Create an account</NavLink></p>
        </div>
      </form>
    </div>
  );
}
