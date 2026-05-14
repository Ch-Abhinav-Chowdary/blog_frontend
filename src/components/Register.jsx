import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink,useNavigate } from "react-router";
import axios from 'axios'
import {errorClass, loadingClass, formCard, formTitle, formGroup, labelClass, inputClass, submitBtn, pageWrapper} from '../styles/common.js'
import { API_BASE } from '../config/api.js'


export default function Register() {

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState(null);  
  const navigate = useNavigate()
  const [preview, setPreview] = useState(null)

  const onSubmit = async (newUser) => {
    setLoading(true);
		// Create form data object
    const formData = new FormData();
    //get user object
    let { role, profileImageUrl, ...userObj } = newUser;
		
    //add all fields except profilePic to FormData object
    Object.keys(userObj).forEach((key) => {
    	formData.append(key, userObj[key]);
  	});
    // add profilePic to Formdata object
    formData.append("profileImageUrl", profileImageUrl[0]);
    try {
      if (role === "USER"){
        // make request to user-api
        let resObj = await axios.post(`${API_BASE}/user-api/users`,formData)
        let res = resObj.data;
        navigate('/login')
      }
      if (role === "AUTHOR"){
        // make request to author-api
        let {role,...userObj} = newUser;
        // make request to user-api
        let resObj = await axios.post(`${API_BASE}/author-api/users`,formData)
        let res = resObj.data;
        navigate('/login')
      }
    } catch (err) {
			console.log(err)
      setError(err.response?.data?.error || "Registration failed")
    }
    finally{
      setLoading(false)
    }

  };

  const onSelectImage =(e) => {
    //get image file
    const file = e.target.files[0];
    // validation for image format
    if (file) {
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        setError("Only JPG or PNG allowed");
        return;
      }
      //validation for file size
      if (file.size > 2 * 1024 * 1024) {
        setError("File size must be less than 2MB");
        return;
      }
      //Converts file → temporary browser URL(create preview URL)
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      setError(null);
    }
  }

	useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);
    
  if (loading === true){
    return <p className={loadingClass}></p>
  }

  return (
    <div className={`${pageWrapper} flex min-h-[calc(100vh-4rem)] items-center justify-center py-12`}>
      <form onSubmit={handleSubmit(onSubmit)} className={`${formCard} max-w-lg`}>
        <h2 className={formTitle}>Create your account</h2>
        <p className="-mt-4 mb-8 text-center text-sm text-stone-500">Join as a reader or an author.</p>
        
        <div className="mb-6 text-center">
          { error ? <p className={errorClass}>{error}</p> : null }
        </div>

        <div className={formGroup}>
          <label className={labelClass}>Register as</label>
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
          {errors?.role?.type=="required" && <p className="mt-2 text-center text-xs font-medium text-red-600">Please select a role</p>}
        </div>

        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>First name</label>
            <input type="text" className={inputClass} placeholder="John" {...register("firstName", { required:true, minLength:2})} />
            { errors?.firstName?.type=="required" && <p className="mt-1.5 text-xs font-medium text-red-600">Required</p> }
            {errors?.firstName?.type == "minLength" && <p className="mt-1.5 text-xs font-medium text-red-600">At least 2 characters</p>}
          </div>

          <div>
            <label className={labelClass}>Last name</label>
            <input type="text" className={inputClass} placeholder="Doe" {...register("lastName")}/>
          </div>
        </div>

        <div className={formGroup}>
          <label className={labelClass}>Email</label>
          <input type="text" className={inputClass} placeholder="john@example.com" {...register("email", { required:true, pattern:/^[^\s@]+@[^\s@]+\.[^\s@]+$/})} />
          { errors?.email?.type=="required" && <p className="mt-1.5 text-xs font-medium text-red-600">Email is required</p> }
          { errors?.email?.type=="pattern" && <p className="mt-1.5 text-xs font-medium text-red-600">Invalid email</p> }
        </div>

        <div className={formGroup}>
          <label className={labelClass}>Password</label>
          <input type="password" className={inputClass} placeholder="••••••••" {...register("password", { required:true, minLength:6 })} />
          {errors?.password?.type =="required" && <p className="mt-1.5 text-xs font-medium text-red-600">Password is required</p> }
          {errors?.password?.type =="minLength" && <p className="mt-1.5 text-xs font-medium text-red-600">At least 6 characters</p> }
        </div>

        <div className="mb-8">
          <label className={labelClass}>Profile photo</label>
          <input type="file" accept="image/png, image/jpeg" className={`${inputClass} file:mr-4 file:rounded-lg file:border-0 file:bg-amber-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-amber-900 hover:file:bg-amber-200`} {...register("profileImageUrl")} onChange={onSelectImage}/>
          {preview && (
            <div className="mt-4 flex justify-center">
              <img
                  src={preview}
                  alt="Preview"
                  className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-lg ring-2 ring-stone-200"
              />
            </div>
          )}
        </div>

        <button type="submit" className={submitBtn}>Register</button>
        <div className="mt-6 text-center text-sm text-stone-600">
          <p>Already have an account? <NavLink to="/login" className="font-semibold text-amber-800 hover:text-amber-950">Sign in</NavLink></p>
        </div>
      </form>
    </div>
  );
}
