import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

export default function AuthPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [regError, setRegError] = useState('');
  const [regLoading, setRegLoading] = useState(false);

  const [showLoginPwd, setShowLoginPwd] = useState(false);
  const [showRegPwd, setShowRegPwd] = useState(false);

  const switchMode = (m) => {
    setMode(m);
    setLoginError('');
    setRegError('');
  };

  async function handleLogin(e) {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    await new Promise((r) => setTimeout(r, 600)); // simulate async
    const err = login(loginEmail, loginPassword);
    if (err) setLoginError(err);
    setLoginLoading(false);
  }

  async function handleRegister(e) {
    e.preventDefault();
    setRegError('');
    if (regPassword !== regConfirm) {
      setRegError('Passwords do not match.');
      return;
    }
    setRegLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const err = register(regName, regEmail, regPassword);
    if (err) setRegError(err);
    setRegLoading(false);
  }

  return (
    <div className="auth-root">
      {/* Animated background orbs */}
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />
      <div className="auth-orb auth-orb-3" />

      <div className="auth-container">
        {/* Left panel – branding */}
        <div className="auth-brand-panel">
          <div className="auth-brand-inner">
            <div className="auth-logo">
              <span className="auth-logo-icon">💹</span>
              <span className="auth-logo-text">FinanceIQ</span>
            </div>
            <h1 className="auth-brand-headline">
              Take Control of<br />
              <span className="auth-brand-accent">Your Finances</span>
            </h1>
            <p className="auth-brand-sub">
              Smart analytics, real-time insights, and powerful tools to help you manage every rupee.
            </p>
            <div className="auth-features">
              {[
                { icon: '📊', label: 'Interactive Charts' },
                { icon: '🔒', label: 'Role-Based Access' },
                { icon: '⚡', label: 'Real-time Insights' },
                { icon: '🌙', label: 'Dark & Light Mode' },
              ].map((f) => (
                <div key={f.label} className="auth-feature-pill">
                  <span>{f.icon}</span>
                  <span>{f.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="auth-brand-stat-grid">
            <div className="auth-stat-card">
              <div className="auth-stat-num">₹2.4M</div>
              <div className="auth-stat-label">Tracked</div>
            </div>
            <div className="auth-stat-card">
              <div className="auth-stat-num">1.2K+</div>
              <div className="auth-stat-label">Transactions</div>
            </div>
            <div className="auth-stat-card">
              <div className="auth-stat-num">98%</div>
              <div className="auth-stat-label">Accuracy</div>
            </div>
          </div>
        </div>

        {/* Right panel – form */}
        <div className="auth-form-panel">
          {/* Tab switcher */}
          <div className="auth-tabs">
            <button
              className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => switchMode('login')}
            >
              Sign In
            </button>
            <button
              className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
              onClick={() => switchMode('register')}
            >
              Register
            </button>
            <div className={`auth-tab-indicator ${mode === 'register' ? 'right' : ''}`} />
          </div>

          {/* ── LOGIN FORM ── */}
          {mode === 'login' && (
            <form className="auth-form animate-fade" onSubmit={handleLogin} key="login">
              <div className="auth-form-header">
                <h2>Welcome back 👋</h2>
                <p>Sign in to your FinanceIQ account</p>
              </div>

              <div className="auth-hint-box">
                <span>🔑</span>
                <div>
                  <strong>Demo credentials</strong><br />
                  <code>admin@finance.io</code> · <code>admin123</code>
                </div>
              </div>

              {loginError && <div className="auth-error">{loginError}</div>}

              <div className="form-group">
                <label className="form-label" htmlFor="login-email">Email Address</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">✉️</span>
                  <input
                    id="login-email"
                    type="email"
                    className="form-input auth-input"
                    placeholder="you@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="login-password">Password</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">🔒</span>
                  <input
                    id="login-password"
                    type={showLoginPwd ? 'text' : 'password'}
                    className="form-input auth-input"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="auth-eye-btn"
                    onClick={() => setShowLoginPwd((p) => !p)}
                    tabIndex={-1}
                  >
                    {showLoginPwd ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary auth-submit-btn"
                disabled={loginLoading}
              >
                {loginLoading ? (
                  <span className="auth-spinner" />
                ) : (
                  <>Sign In <span>→</span></>
                )}
              </button>

              <p className="auth-switch-text">
                Don't have an account?{' '}
                <button type="button" className="auth-link" onClick={() => switchMode('register')}>
                  Create one free
                </button>
              </p>
            </form>
          )}

          {/* ── REGISTER FORM ── */}
          {mode === 'register' && (
            <form className="auth-form animate-fade" onSubmit={handleRegister} key="register">
              <div className="auth-form-header">
                <h2>Create account 🚀</h2>
                <p>Join FinanceIQ and start tracking today</p>
              </div>

              {regError && <div className="auth-error">{regError}</div>}

              <div className="form-group">
                <label className="form-label" htmlFor="reg-name">Full Name</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">👤</span>
                  <input
                    id="reg-name"
                    type="text"
                    className="form-input auth-input"
                    placeholder="John Doe"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                    autoComplete="name"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-email">Email Address</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">✉️</span>
                  <input
                    id="reg-email"
                    type="email"
                    className="form-input auth-input"
                    placeholder="you@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="grid-2" style={{ gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="reg-password">Password</label>
                  <div className="auth-input-wrap">
                    <span className="auth-input-icon">🔒</span>
                    <input
                      id="reg-password"
                      type={showRegPwd ? 'text' : 'password'}
                      className="form-input auth-input"
                      placeholder="Min. 6 chars"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="auth-eye-btn"
                      onClick={() => setShowRegPwd((p) => !p)}
                      tabIndex={-1}
                    >
                      {showRegPwd ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="reg-confirm">Confirm</label>
                  <div className="auth-input-wrap">
                    <span className="auth-input-icon">✅</span>
                    <input
                      id="reg-confirm"
                      type={showRegPwd ? 'text' : 'password'}
                      className="form-input auth-input"
                      placeholder="Repeat password"
                      value={regConfirm}
                      onChange={(e) => setRegConfirm(e.target.value)}
                      required
                      autoComplete="new-password"
                    />
                  </div>
                </div>
              </div>

              {/* Password strength bar */}
              {regPassword && (
                <div className="auth-strength-wrap">
                  <div
                    className={`auth-strength-bar ${
                      regPassword.length < 6
                        ? 'weak'
                        : regPassword.length < 10
                        ? 'medium'
                        : 'strong'
                    }`}
                  />
                  <span className="auth-strength-label">
                    {regPassword.length < 6 ? 'Weak' : regPassword.length < 10 ? 'Fair' : 'Strong'}
                  </span>
                </div>
              )}

              <p className="auth-terms">
                By registering you agree to our{' '}
                <span className="auth-link">Terms of Service</span> and{' '}
                <span className="auth-link">Privacy Policy</span>.
              </p>

              <button
                type="submit"
                className="btn btn-primary auth-submit-btn"
                disabled={regLoading}
              >
                {regLoading ? (
                  <span className="auth-spinner" />
                ) : (
                  <>Create Account <span>→</span></>
                )}
              </button>

              <p className="auth-switch-text">
                Already have an account?{' '}
                <button type="button" className="auth-link" onClick={() => switchMode('login')}>
                  Sign in
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
