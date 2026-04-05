import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const USERS_KEY = 'finance_dashboard_users';
const SESSION_KEY = 'finance_dashboard_session';

// Seed a default admin user on first run
function loadUsers() {
  try {
    const saved = localStorage.getItem(USERS_KEY);
    if (saved) return JSON.parse(saved);
  } catch (_) {}
  return [
    { id: '1', name: 'Admin User', email: 'admin@finance.io', password: 'admin123', role: 'admin' },
  ];
}

function saveUsers(users) {
  try { localStorage.setItem(USERS_KEY, JSON.stringify(users)); } catch (_) {}
}

function loadSession() {
  try {
    const saved = localStorage.getItem(SESSION_KEY);
    if (saved) return JSON.parse(saved);
  } catch (_) {}
  return null;
}

function saveSession(user) {
  try { localStorage.setItem(SESSION_KEY, JSON.stringify(user)); } catch (_) {}
}

function clearSession() {
  try { localStorage.removeItem(SESSION_KEY); } catch (_) {}
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => loadUsers());
  const [currentUser, setCurrentUser] = useState(() => loadSession());

  // Persist users whenever they change
  useEffect(() => { saveUsers(users); }, [users]);

  /** Returns null on success, or an error string */
  function login(email, password) {
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!user) return 'Invalid email or password.';
    const session = { id: user.id, name: user.name, email: user.email, role: user.role };
    setCurrentUser(session);
    saveSession(session);
    return null;
  }

  /** Returns null on success, or an error string */
  function register(name, email, password) {
    if (!name.trim()) return 'Full name is required.';
    if (!email.includes('@')) return 'Enter a valid email address.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) return 'An account with this email already exists.';

    const newUser = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.toLowerCase(),
      password,
      role: 'viewer',
    };
    const updated = [...users, newUser];
    setUsers(updated);
    const session = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role };
    setCurrentUser(session);
    saveSession(session);
    return null;
  }

  function logout() {
    setCurrentUser(null);
    clearSession();
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
