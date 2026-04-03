import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Lock, User, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const MAX_TILT = 9;

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cardEntranceDone, setCardEntranceDone] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCardEntranceDone(true);
    }
  }, []);

  const handleCardPointer = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardEntranceDone || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: py * -MAX_TILT * 2, ry: px * MAX_TILT * 2 });
  }, [cardEntranceDone]);

  useEffect(() => {
    const el = cardRef.current;
    if (!el || !cardEntranceDone) return;
    el.style.setProperty('--tilt-x', `${tilt.rx}deg`);
    el.style.setProperty('--tilt-y', `${tilt.ry}deg`);
    el.style.setProperty('--tilt-z', tilt.rx !== 0 || tilt.ry !== 0 ? '6px' : '0px');
  }, [tilt, cardEntranceDone]);

  const handleCardLeave = useCallback(() => {
    setTilt({ rx: 0, ry: 0 });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex min-h-0 flex-col overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-indigo-50/40 pt-[max(0rem,env(safe-area-inset-top))] pb-[max(0rem,env(safe-area-inset-bottom))] pl-[max(0rem,env(safe-area-inset-left))] pr-[max(0rem,env(safe-area-inset-right))] lg:flex-row">
      {/* Brand panel — desktop */}
      <div className="login-brand-in hidden min-h-0 shrink-0 lg:flex lg:w-[42%] xl:w-[45%] relative flex-col justify-between gap-6 overflow-hidden p-8 xl:p-12 text-white bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.35),transparent)]" />
        <div className="login-aurora pointer-events-none absolute -inset-[20%] bg-[radial-gradient(ellipse_70%_60%_at_30%_20%,rgba(129,140,248,0.45),transparent)] opacity-40" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_100%_100%,rgba(15,23,42,0.9),transparent)]" />
        <div className="relative z-10 shrink-0 self-start">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 shadow-lg shadow-black/20 backdrop-blur-md sm:px-3.5 sm:py-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/25 backdrop-blur sm:h-11 sm:w-11">
              <Building2 className="h-5 w-5 text-indigo-100 sm:h-6 sm:w-6" strokeWidth={1.75} />
            </div>
            <div className="min-w-0 text-left">
              <p className="text-base font-semibold tracking-tight sm:text-lg">HRMS</p>
              <p className="text-[10px] font-medium uppercase tracking-widest text-indigo-200/90 sm:text-xs">
                Workforce Suite
              </p>
            </div>
          </div>
        </div>
        <div className="login-hero-in relative z-10 mx-auto flex min-h-0 w-full max-w-md flex-1 flex-col justify-center space-y-3 overflow-hidden text-center xl:space-y-4">
          <h1 className="text-2xl font-semibold tracking-tight leading-tight drop-shadow-sm xl:text-3xl xl:leading-[1.15]">
            People operations, simplified.
          </h1>
          <p className="text-sm text-slate-300 leading-snug line-clamp-4 xl:text-base xl:leading-relaxed xl:line-clamp-none">
            Secure access to attendance, leave, and employee records in one place—built for teams that need clarity and
            control.
          </p>
        </div>
        <p className="relative z-10 shrink-0 self-start text-left text-[10px] text-slate-500 sm:text-xs">
          Internal use · Authorized personnel only
        </p>
      </div>

      {/* Form panel */}
      <div className="login-form-column-in flex min-h-0 flex-1 flex-col justify-center overflow-hidden px-4 py-3 sm:px-6 sm:py-4 lg:px-12 xl:px-20">
        <div className="mx-auto flex w-full max-w-[400px] min-h-0 flex-col justify-center">
          <div className="login-mobile-brand-in mb-4 flex shrink-0 items-center gap-3 lg:hidden sm:mb-5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/30 sm:h-10 sm:w-10">
              <Building2 className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.75} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 sm:text-base">HRMS</p>
              <p className="text-[11px] text-slate-500 sm:text-xs">Workforce Suite</p>
            </div>
          </div>

          <div className="perspective-[1200px] min-h-0 shrink px-1 py-2">
            <div
              ref={cardRef}
              role="presentation"
              onMouseMove={handleCardPointer}
              onMouseLeave={handleCardLeave}
              onAnimationEnd={(e) => {
                if (e.animationName === 'login-card-3d-in') {
                  setCardEntranceDone(true);
                }
              }}
              className={`rounded-2xl border border-slate-200/90 bg-white/95 p-5 shadow-2xl shadow-slate-900/10 ring-1 ring-white/60 backdrop-blur-sm sm:p-7 lg:p-8 ${
                cardEntranceDone ? 'login-card-interactive' : 'login-card-entrance'
              }`}
            >
              <div className="mb-4 shrink-0 sm:mb-5">
                <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/15 to-indigo-600/5 text-indigo-600 ring-1 ring-indigo-500/20 sm:mb-4 sm:h-10 sm:w-10">
                  <Lock className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.75} />
                </div>
                <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">Welcome back</h2>
                <p className="mt-1 text-xs text-slate-600 sm:mt-2 sm:text-sm">
                  Enter your credentials to continue to the dashboard.
                </p>
              </div>

              <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit} noValidate>
                {error && (
                  <div
                    className="flex gap-2 rounded-lg border border-red-200/90 bg-red-50 px-3 py-2 text-xs text-red-800 shadow-sm sm:gap-3 sm:px-4 sm:py-3 sm:text-sm"
                    role="alert"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-600 sm:h-5 sm:w-5" aria-hidden />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-1.5 sm:space-y-2">
                  <label htmlFor="username" className="block text-xs font-medium text-slate-700 sm:text-sm">
                    Username
                  </label>
                  <div className="relative transition-transform duration-200 focus-within:-translate-y-0.5">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2} aria-hidden />
                    </span>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50/80 py-2 pl-9 pr-3 text-sm text-slate-900 shadow-inner shadow-slate-900/5 placeholder:text-slate-400 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/25 sm:py-2.5 sm:pl-10"
                      placeholder="Enter your username"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <label htmlFor="password" className="block text-xs font-medium text-slate-700 sm:text-sm">
                    Password
                  </label>
                  <div className="relative transition-transform duration-200 focus-within:-translate-y-0.5">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2} aria-hidden />
                    </span>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50/80 py-2 pl-9 pr-3 text-sm text-slate-900 shadow-inner shadow-slate-900/5 placeholder:text-slate-400 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/25 sm:py-2.5 sm:pl-10"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group relative mt-1 flex w-full transform items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-b from-indigo-600 to-indigo-700 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:from-indigo-500 hover:to-indigo-600 hover:shadow-xl hover:shadow-indigo-600/35 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:translate-y-0.5 active:shadow-md disabled:cursor-not-allowed disabled:opacity-60 sm:mt-2"
                >
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/20 opacity-0 transition group-hover:opacity-100" />
                  <span className="relative flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
                        Signing in…
                      </>
                    ) : (
                      'Sign in'
                    )}
                  </span>
                </button>
              </form>

              <div className="mt-4 shrink-0 rounded-xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-slate-100/80 px-3 py-2.5 shadow-inner sm:mt-5 sm:px-4 sm:py-3">
                <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wide text-slate-500 sm:mb-2 sm:text-xs">
                  Demo access
                </p>
                <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-xs sm:gap-x-4 sm:gap-y-1 sm:text-sm">
                  <dt className="text-slate-500">Username</dt>
                  <dd className="font-mono text-slate-800">admin</dd>
                  <dt className="text-slate-500">Password</dt>
                  <dd className="font-mono text-slate-800">admin123</dd>
                </dl>
              </div>
            </div>
          </div>

          <p className="login-footer-in mt-3 shrink-0 text-center text-[10px] text-slate-500 sm:mt-4 sm:text-xs">
            Protected by organization policy. Contact IT if you need access.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
