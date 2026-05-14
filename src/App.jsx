import React from 'react'
import { createBrowserRouter,NavLink,RouterProvider } from 'react-router'
import { Toaster } from 'react-hot-toast'

import Register from './components/Register'
import Login from './components/Login'
import AddArticle from './components/AddArticle'
import RootLayout from './components/RootLayout'
import Home from './components/Home'
import UserDashboard from './components/UserDashboard'
import AuthorDashboard from './components/AuthorDashboard'
import AdminDashboard from './components/AdminDashboard'
import ArticleById from './components/ArticleById'
import ProtectedRoute from './components/ProtectedRoute'
import Unauthorized from './components/Unauthorised'

function App() {
  
  const routerObj=createBrowserRouter([
    {
      path:"/",
      element:<RootLayout />,
      children:[
        {
          path:"",
          element:<Home />
        },
        {
          path:"/register",
          element:<Register />
        },
        {
          path:"/login",
          element:<Login />
        },
        {
          path:"/add-article",
          element:<AddArticle />
        },
        {
          path: "/user-dashboard",
          element:
            <ProtectedRoute allowedRoles={['USER']}>
              <UserDashboard />
            </ProtectedRoute>
        },
        {
          path: "/admin-dashboard",
          element:
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
        },
        {
          path: "/author-dashboard",
          element:
            <ProtectedRoute allowedRoles={['AUTHOR']}>
              <AuthorDashboard />
            </ProtectedRoute>
        },
        {
          path:`/article/:id`,
          element:<ArticleById  />
        },
        {
          path: '/unauthorized',
          element: <Unauthorized />
        },
      ]
    },
    {
      path: "*",
      element: (
        <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50 px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">404</p>
          <h1 className="font-display mt-3 text-3xl font-semibold text-stone-900">Page not found</h1>
          <p className="mt-2 max-w-sm text-sm text-stone-600">That URL does not exist. Head back to the homepage.</p>
          <NavLink
            to="/"
            className="mt-8 rounded-xl bg-amber-700 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-amber-800"
          >
            Back to home
          </NavLink>
        </div>
      )
    }
  ])

  return (<>
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        className: '!bg-stone-900 !text-stone-50 !text-sm !font-medium !shadow-lg !rounded-xl',
        success: { iconTheme: { primary: '#fef3c7', secondary: '#1c1917' } },
        error: { iconTheme: { primary: '#fecaca', secondary: '#1c1917' } },
      }}
    />
    <RouterProvider router={routerObj} />

  </>)
}

export default App