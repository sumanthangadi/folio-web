import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, CheckCircle2, TrendingUp, Search, ShieldAlert, 
  Crown, LogOut, ArrowLeft, RefreshCw, BarChart2, Mail
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { databases, APPWRITE_DATABASE_ID, APPWRITE_USERS_COLLECTION_ID, Query } from '../lib/appwrite';
import { AuthService } from '../services/auth';

const ADMIN_EMAILS = ['sumanthangadi7@gmail.com'];

const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

export default function Admin() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Data states
  const [users, setUsers] = useState([]);
  const [dashboards, setDashboards] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingUserId, setUpdatingUserId] = useState(null);

  // Check Authentication on Mount
  useEffect(() => {
    async function checkAuth() {
      setAuthLoading(true);
      try {
        const user = await AuthService.getCurrentUser();
        setCurrentUser(user);
      } catch (err) {
        console.error('Auth check failed:', err);
      } finally {
        setAuthLoading(false);
      }
    }
    checkAuth();
  }, []);

  // Fetch admin stats and users
  const fetchData = async () => {
    setLoadingData(true);
    setErrorMsg('');
    try {
      // 1. Fetch Users
      const usersRes = await databases.listDocuments(
        APPWRITE_DATABASE_ID,
        APPWRITE_USERS_COLLECTION_ID,
        [Query.limit(1000)]
      );

      // 2. Fetch Dashboards
      let dashboardsList = [];
      try {
        const dashRes = await databases.listDocuments(
          APPWRITE_DATABASE_ID,
          'dashboards',
          [Query.limit(1000)]
        );
        dashboardsList = dashRes.documents;
      } catch (e) {
        console.warn('Could not fetch dashboards:', e);
      }

      // 3. Fetch Sessions
      let sessionsList = [];
      try {
        const sessRes = await databases.listDocuments(
          APPWRITE_DATABASE_ID,
          'sessions',
          [Query.limit(1000)]
        );
        sessionsList = sessRes.documents;
      } catch (e) {
        console.warn('Could not fetch sessions:', e);
      }

      setUsers(usersRes.documents);
      setDashboards(dashboardsList);
      setSessions(sessionsList);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
      setErrorMsg('Failed to load database records. Ensure your collection permissions allow read access.');
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (currentUser && ADMIN_EMAILS.includes(currentUser.email)) {
      fetchData();
    }
  }, [currentUser]);

  // Google Login initiation
  const handleAdminLogin = async () => {
    try {
      await AuthService.loginWithGoogleWeb('admin-x3010');
    } catch (e) {
      console.error(e);
      setErrorMsg('Failed to initiate login flow.');
    }
  };

  // Sign out
  const handleSignOut = async () => {
    await AuthService.logout();
    setCurrentUser(null);
  };

  // Toggle paid/subscription status
  const handleToggleSubscription = async (user) => {
    setUpdatingUserId(user.$id);
    const newPaidStatus = !user.paid;
    try {
      await databases.updateDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_USERS_COLLECTION_ID,
        user.$id,
        {
          userId: user.userId || user.$id,
          name: user.name || '',
          email: user.email || '',
          loginDate: user.loginDate || new Date().toISOString(),
          paid: newPaidStatus,
          paidAt: newPaidStatus ? new Date().toISOString() : null
        }
      );
      // Update locally
      setUsers(prev => prev.map(u => u.$id === user.$id ? { ...u, paid: newPaidStatus } : u));
    } catch (err) {
      console.error('Failed to update subscription:', err);
      alert('Failed to update subscription status. Please check your document permissions.');
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Statistics Computations
  const getStats = () => {
    const total = users.length;
    const premium = users.filter(u => u.paid).length;
    const free = total - premium;

    const now = new Date();
    let dau = 0;
    let wau = 0;
    let mau = 0;

    users.forEach(u => {
      // Use $updatedAt or u.loginDate or $createdAt as active timestamp
      const activeTimestamp = u.$updatedAt || u.loginDate || u.$createdAt;
      if (!activeTimestamp) return;

      const diffMs = now - new Date(activeTimestamp);
      const diffDays = diffMs / (1000 * 60 * 60 * 24);

      if (diffDays <= 1) dau++;
      if (diffDays <= 7) wau++;
      if (diffDays <= 30) mau++;
    });

    return { total, premium, free, dau, wau, mau };
  };

  const stats = getStats();

  // Filter users by search term
  const filteredUsers = users.filter(u => {
    const search = searchTerm.toLowerCase();
    return (
      (u.email && u.email.toLowerCase().includes(search)) ||
      (u.$id && u.$id.toLowerCase().includes(search))
    );
  });

  // Render auth loading state
  if (authLoading) {
    return (
      <div className="admin-loading-container">
        <div className="spinner" />
        <p>Verifying admin session...</p>
      </div>
    );
  }

  // Render login request screen
  if (!currentUser) {
    return (
      <motion.div className="admin-page" {...pageTransition}>
        <div className="admin-card-container">
          <div className="admin-auth-card glass">
            <div className="admin-icon-wrapper">
              <ShieldAlert size={36} className="text-red-500" />
            </div>
            <h2>Admin Portal</h2>
            <p>Access is restricted to whitelisted accounts. Please sign in with your admin credentials.</p>
            <button className="btn-primary" onClick={handleAdminLogin}>
              Sign in with Google
            </button>
            <Link to="/" className="back-link-admin">
              <ArrowLeft size={14} /> Back to Home
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  // Render Access Denied screen
  if (!ADMIN_EMAILS.includes(currentUser.email)) {
    return (
      <motion.div className="admin-page" {...pageTransition}>
        <div className="admin-card-container">
          <div className="admin-auth-card glass">
            <div className="admin-icon-wrapper error">
              <ShieldAlert size={36} />
            </div>
            <h2>Access Denied</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Logged in as <strong style={{ color: 'var(--text-primary)' }}>{currentUser.email}</strong>, which is not whitelisted.
            </p>
            <div className="flex-row gap-3">
              <button className="btn-ghost" onClick={handleSignOut}>
                <LogOut size={14} /> Log Out
              </button>
            </div>
            <Link to="/" className="back-link-admin" style={{ marginTop: '20px' }}>
              <ArrowLeft size={14} /> Back to Home
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  // Render Admin Dashboard
  return (
    <motion.div className="admin-dashboard-page" {...pageTransition}>
      {/* Styles Injection */}
      <style>{`
        .admin-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #050505;
          padding: 24px;
        }
        .admin-card-container {
          width: 100%;
          max-width: 480px;
        }
        .admin-auth-card {
          text-align: center;
          padding: 48px 40px;
          border-radius: 32px;
          border: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }
        .admin-auth-card h2 {
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .admin-auth-card p {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }
        .admin-icon-wrapper {
          width: 72px;
          height: 72px;
          border-radius: 20px;
          background: rgba(220, 38, 38, 0.1);
          border: 1px solid rgba(220, 38, 38, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent);
        }
        .admin-icon-wrapper.error {
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }
        .back-link-admin {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          color: var(--text-muted);
          transition: color 0.2s ease;
        }
        .back-link-admin:hover {
          color: var(--text-primary);
        }
        .admin-loading-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          background: #050505;
          color: var(--text-secondary);
        }
        .spinner {
          width: 32px;
          height: 32px;
          border: 3px border-t-transparent rounded-full animate-spin;
          border-color: var(--accent);
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        /* Dashboard styles */
        .admin-dashboard-page {
          min-height: 100vh;
          background: #050505;
          padding: 40px 24px;
        }
        .admin-dashboard-container {
          max-width: var(--container-width);
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        .admin-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border);
          padding-bottom: 24px;
        }
        .admin-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .admin-badge {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 4px 10px;
          border-radius: 8px;
          font-weight: 700;
          background: var(--accent-soft);
          border: 1px solid rgba(220, 38, 38, 0.25);
          color: var(--accent-hover);
        }
        .admin-user-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .admin-user-email {
          font-size: 0.85rem;
          color: var(--text-secondary);
          background: rgba(255,255,255,0.03);
          padding: 6px 14px;
          border-radius: 12px;
          border: 1px solid var(--border);
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        /* Stats Grid */
        .admin-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }
        .stat-card {
          padding: 24px;
          border-radius: 24px;
          border: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: transform 0.2s;
        }
        .stat-card:hover {
          transform: translateY(-2px);
          border-color: var(--border-light);
        }
        .stat-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: var(--text-muted);
        }
        .stat-card-title {
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .stat-card-value {
          font-size: 2.2rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1;
        }
        .stat-icon-box {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border);
          color: var(--text-secondary);
        }
        .stat-card:nth-child(2) .stat-icon-box {
          background: rgba(220, 38, 38, 0.1);
          border-color: rgba(220, 38, 38, 0.2);
          color: var(--accent-hover);
        }
        .stat-card:nth-child(3) .stat-icon-box {
          background: rgba(34, 197, 94, 0.1);
          border-color: rgba(34, 197, 94, 0.2);
          color: #22c55e;
        }

        /* Controls / Search */
        .admin-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .search-wrapper {
          position: relative;
          flex: 1;
          max-width: 400px;
        }
        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }
        .search-input-admin {
          width: 100%;
          padding: 12px 16px 12px 42px;
          font-size: 0.9rem;
          border-radius: 16px;
          border: 1px solid var(--border);
          background: rgba(20, 20, 20, 0.6);
          color: var(--text-primary);
          transition: all 0.2s;
        }
        .search-input-admin:focus {
          outline: none;
          border-color: var(--border-light);
          background: rgba(20, 20, 20, 0.8);
        }

        /* Table Design */
        .table-wrapper {
          overflow-x: auto;
          border-radius: 24px;
          border: 1px solid var(--border);
          background: rgba(15, 15, 15, 0.4);
          backdrop-filter: blur(12px);
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.9rem;
        }
        .admin-table th {
          padding: 16px 24px;
          font-weight: 600;
          color: var(--text-secondary);
          border-bottom: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.02);
        }
        .admin-table td {
          padding: 18px 24px;
          border-bottom: 1px solid var(--border);
          color: var(--text-primary);
        }
        .admin-table tr:last-child td {
          border-bottom: none;
        }
        .admin-table tr:hover td {
          background: rgba(255,255,255,0.01);
        }
        .user-id-badge {
          font-family: monospace;
          font-size: 0.78rem;
          color: var(--text-muted);
          background: rgba(255,255,255,0.02);
          padding: 2px 6px;
          border-radius: 4px;
        }
        .plan-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          padding: 4px 12px;
          border-radius: 100px;
        }
        .plan-badge.premium {
          background: rgba(220, 38, 38, 0.1);
          color: var(--accent-hover);
          border: 1px solid rgba(220, 38, 38, 0.2);
          box-shadow: 0 0 12px rgba(220, 38, 38, 0.15);
        }
        .plan-badge.free {
          background: rgba(255, 255, 255, 0.04);
          color: var(--text-secondary);
          border: 1px solid var(--border);
        }
        .btn-action-premium {
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 0.78rem;
          font-weight: 600;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .btn-action-premium.grant {
          border: 1px solid rgba(220, 38, 38, 0.3);
          color: var(--accent-hover);
          background: transparent;
        }
        .btn-action-premium.grant:hover {
          background: var(--accent);
          color: white;
          border-color: var(--accent);
          box-shadow: 0 4px 12px var(--accent-glow);
        }
        .btn-action-premium.revoke {
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--text-secondary);
          background: transparent;
        }
        .btn-action-premium.revoke:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-primary);
        }
        
        .flex-row {
          display: flex;
          align-items: center;
        }
        .gap-3 {
          gap: 12px;
        }
        .text-center-empty {
          text-align: center;
          padding: 48px;
          color: var(--text-muted);
        }
      `}</style>

      <div className="admin-dashboard-container">
        {/* Header */}
        <div className="admin-header">
          <div className="admin-brand">
            <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.6rem' }}>Dashboard</h1>
            <span className="admin-badge">Admin</span>
          </div>
          <div className="admin-user-info">
            <div className="admin-user-email">
              <Mail size={13} />
              <span>{currentUser.email}</span>
            </div>
            <button className="btn-ghost" onClick={handleSignOut} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              <LogOut size={14} /> Log Out
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="admin-stats-grid">
          <div className="stat-card glass">
            <div className="stat-card-header">
              <span className="stat-card-title">Total Users</span>
              <div className="stat-icon-box"><Users size={16} /></div>
            </div>
            <span className="stat-card-value">{loadingData ? '...' : stats.total}</span>
          </div>

          <div className="stat-card glass">
            <div className="stat-card-header">
              <span className="stat-card-title">Premium Users</span>
              <div className="stat-icon-box"><Crown size={16} /></div>
            </div>
            <span className="stat-card-value">{loadingData ? '...' : stats.premium}</span>
          </div>

          <div className="stat-card glass">
            <div className="stat-card-header">
              <span className="stat-card-title">DAU / WAU / MAU</span>
              <div className="stat-icon-box"><TrendingUp size={16} /></div>
            </div>
            <span className="stat-card-value" style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'baseline', gap: '4px', paddingTop: '4px' }}>
              {loadingData ? '...' : `${stats.dau} / ${stats.wau} / ${stats.mau}`}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="admin-controls">
          <div className="search-wrapper">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search users by email or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input-admin"
            />
          </div>
          <button 
            className="btn-ghost" 
            onClick={fetchData} 
            disabled={loadingData}
            style={{ padding: '10px 18px', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <RefreshCw size={14} className={loadingData ? 'animate-spin' : ''} /> Refresh Data
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', padding: '16px 20px', borderRadius: '16px', color: '#ef4444', fontSize: '0.9rem' }}>
            {errorMsg}
          </div>
        )}

        {/* User Management Table */}
        <div className="table-wrapper">
          {loadingData && users.length === 0 ? (
            <div className="text-center-empty">
              <div className="spinner" style={{ margin: '0 auto 12px' }} />
              <p>Fetching records from Appwrite...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center-empty">
              <BarChart2 size={36} style={{ margin: '0 auto 12px', color: 'var(--text-muted)' }} />
              <p>No user records matching search criteria.</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User Details</th>
                  <th>Joined</th>
                  <th>Last Active</th>
                  <th>Saved Data</th>
                  <th>Plan Tier</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => {
                  // Count user dashboards
                  const userDashboardsCount = dashboards.filter(d => d.userId === user.$id).length;
                  // Count user sessions
                  const userSessionsCount = sessions.filter(s => s.userId === user.$id).length;

                  return (
                    <tr key={user.$id}>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{user.email}</span>
                          <span className="user-id-badge">{user.$id}</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>
                        {user.loginDate ? new Date(user.loginDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>
                        {user.$updatedAt ? new Date(user.$updatedAt).toLocaleString() : 'N/A'}
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          <span>Bookmarks Layout: <strong>{userDashboardsCount}</strong></span>
                          <span>Sessions: <strong>{userSessionsCount}</strong></span>
                        </div>
                      </td>
                      <td>
                        {user.paid ? (
                          <span className="plan-badge premium">
                            <Crown size={12} /> Premium
                          </span>
                        ) : (
                          <span className="plan-badge free">
                            Free
                          </span>
                        )}
                      </td>
                      <td>
                        <button
                          className={`btn-action-premium ${user.paid ? 'revoke' : 'grant'}`}
                          onClick={() => handleToggleSubscription(user)}
                          disabled={updatingUserId === user.$id}
                          style={{ minWidth: '130px', justifyContent: 'center' }}
                        >
                          {updatingUserId === user.$id ? (
                            <div className="spinner" style={{ width: '12px', height: '12px' }} />
                          ) : user.paid ? (
                            'Demote to Free'
                          ) : (
                            <>
                              <Crown size={12} /> Make Premium
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </motion.div>
  );
}
