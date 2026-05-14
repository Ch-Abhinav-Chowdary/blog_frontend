import { NavLink } from "react-router"
import { useAuth } from "../stores/authStore"
import { navContainerClass, navLinksClass } from "../styles/common"

function Header() {

  const isAuthenticated = useAuth((state) => state.isAuthenticated)
  const logout = useAuth((state) => state.logout)
  const currentUser = useAuth((state)=>state.currentUser)

  const linkBase = "rounded-lg px-3 py-2 text-sm font-medium transition"
  const linkIdle = `${linkBase} text-stone-600 hover:bg-stone-100 hover:text-stone-900`
  const linkActiveDark = `${linkBase} bg-stone-900 text-white`
  const linkAccent = `${linkBase} bg-amber-700 text-white hover:bg-amber-800`

  return (
    <header className="fixed top-0 z-50 w-full border-b border-stone-200/90 bg-white/90 shadow-sm shadow-stone-900/5 backdrop-blur-md">
      <div className={navContainerClass}>
          <div className="flex shrink-0 items-center">
            <NavLink to="/" className="font-display text-xl font-semibold tracking-tight text-stone-900">
              BlogApp<span className="text-amber-700">.</span>
            </NavLink>
          </div>

          <div className={navLinksClass}>
            {isAuthenticated ? (
              <>
                <span className="hidden max-w-[10rem] truncate rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-medium text-stone-700 sm:inline sm:max-w-xs">
                  {currentUser.firstName || currentUser.name || "User"}
                </span>

                {currentUser.role === "USER" && (
                  <NavLink
                    to="/user-dashboard"
                    className={({ isActive }) => (isActive ? linkActiveDark : linkIdle)}
                  >
                    Reading list
                  </NavLink>
                )}

                {currentUser.role === "AUTHOR" && (
                  <>
                    <NavLink
                      to="/author-dashboard"
                      className={({ isActive }) => (isActive ? linkActiveDark : linkIdle)}
                    >
                      Studio
                    </NavLink>
                    <NavLink
                      to="/add-article"
                      className={({ isActive }) => (isActive ? linkAccent : `${linkIdle} text-amber-900`)}
                    >
                      New post
                    </NavLink>
                  </>
                )}

                {currentUser.role === "ADMIN" && (
                  <NavLink
                    to="/admin-dashboard"
                    className={({ isActive }) => (isActive ? linkActiveDark : linkIdle)}
                  >
                    Admin
                  </NavLink>
                )}

                <button
                  type="button"
                  onClick={logout}
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-800 transition hover:bg-red-100"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) => (isActive ? linkActiveDark : linkIdle)}
                >
                  Sign in
                </NavLink>

                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    isActive ? linkAccent : `${linkBase} bg-amber-700 text-white hover:bg-amber-800`
                  }
                >
                  Join
                </NavLink>
              </>
            )}
          </div>
      </div>
    </header>
  )
}

export default Header
