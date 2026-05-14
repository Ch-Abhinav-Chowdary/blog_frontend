import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { pageWrapper, secondaryBtn } from "../styles/common";

const Unauthorized = ({ delay = 5000 }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.redirectTo || "/login";

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(redirectTo, { replace: true });
    }, delay);

    return () => clearTimeout(timer);
  }, [navigate, redirectTo, delay]);

  return (
    <div className={`${pageWrapper} flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-20 text-center`}>
      <div className="max-w-md rounded-3xl border border-stone-200 bg-white px-8 py-12 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-red-700">403</p>
        <h1 className="font-display mt-2 text-2xl font-semibold text-stone-900">Access denied</h1>
        <p className="mt-3 text-sm leading-relaxed text-stone-600">
          You do not have permission to view this page. You will be redirected shortly.
        </p>
        <button
          type="button"
          className={`${secondaryBtn} mt-8`}
          onClick={() => navigate(redirectTo, { replace: true })}
        >
          Go now
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
