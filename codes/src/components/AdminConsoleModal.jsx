import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  Database,
  Download,
  Trash2,
  RotateCcw,
  Eye,
  Activity,
  CheckCircle2,
  AlertTriangle,
  X,
  Search,
  HardDrive,
  Clock,
  Layers,
  Crown
} from 'lucide-react';
import {
  fetchAdminUsers,
  fetchAdminSystemStats,
  inspectUserDossier,
  deleteAdminUser,
  resetAdminUserLogs,
  changeAdminPassword,
  exportAdminSystemBackup
} from '../utils/localAccount.js';

export function AdminConsoleModal({
  isOpen,
  onClose,
  currentAccount
}) {
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'stats' | 'tools'
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedDossier, setSelectedDossier] = useState(null);
  const [inspecting, setInspecting] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordBusy, setPasswordBusy] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setLoading(true);
    setFeedback(null);
    try {
      const [userList, sysStats] = await Promise.all([
        fetchAdminUsers(),
        fetchAdminSystemStats()
      ]);
      setUsers(userList || []);
      setStats(sysStats || null);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to load admin telemetry.' });
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback((prev) => (prev?.message === message ? null : prev));
    }, 4500);
  };

  const handleDeleteUser = async (userId, username) => {
    try {
      await deleteAdminUser(userId);
      showToast(`User account "@${username}" was successfully removed.`);
      loadData();
    } catch (err) {
      showToast(err.message || 'Failed to delete user.', 'error');
    } finally {
      setConfirmAction(null);
    }
  };

  const handleResetLogs = async (userId, username) => {
    try {
      await resetAdminUserLogs(userId);
      showToast(`Logged records for "@${username}" were reset to 0.`);
      loadData();
    } catch (err) {
      showToast(err.message || 'Failed to reset user logs.', 'error');
    } finally {
      setConfirmAction(null);
    }
  };

  const handleExportBackup = async () => {
    try {
      const backupData = await exportAdminSystemBackup();
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `hnazer_browser_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast('Database backup downloaded successfully.');
    } catch (err) {
      showToast(err.message || 'Failed to export backup.', 'error');
    }
  };

  const handleInspectUser = async (userId) => {
    setInspecting(true);
    try {
      setSelectedDossier(await inspectUserDossier(userId));
    } catch (err) {
      showToast(err.message || 'Failed to inspect account.', 'error');
    } finally {
      setInspecting(false);
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('New password and confirmation do not match.', 'error');
      return;
    }
    setPasswordBusy(true);
    try {
      await changeAdminPassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('Administrator password changed successfully.');
    } catch (err) {
      showToast(err.message || 'Failed to change administrator password.', 'error');
    } finally {
      setPasswordBusy(false);
    }
  };

  if (!isOpen) return null;

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return u.username.toLowerCase().includes(q) || (u.name || '').toLowerCase().includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 bg-[#1b1b1e] font-mono">
      <div className="relative flex h-full w-full min-h-0 flex-col overflow-hidden bg-[#1b1b1e] p-4 sm:p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#373f51]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-700/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-glow">
              <ShieldAlert className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1">
                  <Crown className="w-3 h-3 text-amber-400" />
                  ADMIN PRIVILEGES
                </span>
                <span className="text-[11px] text-slate-400 font-sans">
                  Active Admin: <strong className="text-white font-mono">@{currentAccount.username}</strong>
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold font-display text-white mt-1">
                System Administration Console
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#222834] transition-colors"
            title="Close Admin Console"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`mt-4 p-3 rounded-xl border flex items-center gap-2.5 text-xs font-sans ${
              feedback.type === 'error'
                ? 'bg-rose-950/40 border-rose-800 text-rose-200'
                : 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
            }`}
          >
            {feedback.type === 'error' ? (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#373f51] pt-3 pb-2 text-xs">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'users'
                ? 'bg-[#58a4b0] text-[#1b1b1e] shadow-sm'
                : 'bg-[#222834] text-[#a9bcd0] hover:text-white hover:bg-[#2b3342]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>User Accounts ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'stats'
                ? 'bg-[#58a4b0] text-[#1b1b1e] shadow-sm'
                : 'bg-[#222834] text-[#a9bcd0] hover:text-white hover:bg-[#2b3342]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Platform Telemetry</span>
          </button>

          <button
            onClick={() => setActiveTab('tools')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'tools'
                ? 'bg-[#58a4b0] text-[#1b1b1e] shadow-sm'
                : 'bg-[#222834] text-[#a9bcd0] hover:text-white hover:bg-[#2b3342]'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Data Utilities & Backups</span>
          </button>
        </div>

        {/* Tab 1: Users Management */}
        {activeTab === 'users' && (
          <div className="flex-1 overflow-y-auto mt-4 space-y-4 pr-1">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search accounts by username or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#161619] border border-[#373f51] rounded-xl text-xs text-white focus:outline-none focus:border-[#58a4b0]"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={loadData}
                  disabled={loading}
                  className="p-2 bg-[#222834] hover:bg-[#2b3342] border border-[#373f51] text-xs text-slate-300 rounded-xl"
                  title="Refresh Accounts"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {filteredUsers.length === 0 ? (
              <div className="p-8 text-center text-slate-400 bg-[#222834]/50 border border-[#373f51] rounded-2xl">
                No matching accounts found.
              </div>
            ) : (
              <div className="grid gap-3">
                {filteredUsers.map((u) => {
                  const isCurrent = u.id === currentAccount.id;
                  const isAdmin = u.role === 'admin';

                  return (
                    <div
                      key={u.id}
                      className="p-4 bg-[#222834]/80 border border-[#373f51] hover:border-[#4b5873] rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                            isAdmin
                              ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300'
                              : 'bg-[#58a4b0]/15 border border-[#58a4b0]/40 text-[#58a4b0]'
                          }`}
                        >
                          {isAdmin ? <Crown className="w-5 h-5 text-amber-400" /> : (u.name?.[0] || 'U')}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{u.name || u.username}</span>
                            <span className="text-xs text-slate-400">(@{u.username})</span>
                            <span
                              className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-bold border ${
                                isAdmin
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                  : 'bg-slate-800 text-slate-300 border-slate-700'
                              }`}
                            >
                              {u.role}
                            </span>
                            {isCurrent && (
                              <span className="text-[9px] bg-emerald-950/80 text-emerald-300 border border-emerald-800 px-1.5 py-0.2 rounded font-bold">
                                CURRENT USER
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-[11px] text-slate-400 font-sans mt-1">
                            <span>ID #{u.id}</span>
                            <span>•</span>
                            <span>Registered: {u.created_at?.slice(0, 10)}</span>
                            <span>•</span>
                            <span className="text-[#58a4b0] font-semibold">{u.totalLogs} logs</span>
                            <span>•</span>
                            <span>Latest: {u.latestDate}</span>
                          </div>
                        </div>
                      </div>

                      {/* Performance Indicators */}
                      <div className="flex items-center gap-2 flex-wrap text-[11px]">
                        <span className="px-2 py-1 bg-[#161619] border border-[#373f51] rounded-lg text-indigo-300">
                          Sleep: {u.avgSleep}h
                        </span>
                        <span className="px-2 py-1 bg-[#161619] border border-[#373f51] rounded-lg text-cyan-300">
                          Water: {u.avgWater}L
                        </span>
                        <span className="px-2 py-1 bg-[#161619] border border-[#373f51] rounded-lg text-purple-300">
                          Screen: {u.avgScreen}h
                        </span>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1.5 ml-2">
                          <button
                            onClick={() => handleInspectUser(u.id)}
                            disabled={inspecting}
                            className="p-1.5 bg-[#373f51] hover:bg-[#58a4b0] hover:text-[#1b1b1e] text-[#d8dbe2] rounded-lg transition-colors"
                            title="Inspect account dossier"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() =>
                              setConfirmAction({
                                type: 'reset',
                                userId: u.id,
                                username: u.username,
                                label: `Reset all ${u.totalLogs} logged entries for @${u.username}?`
                              })
                            }
                            className="p-1.5 bg-[#373f51] hover:bg-amber-950/80 hover:text-amber-300 text-slate-400 rounded-lg transition-colors"
                            title="Clear this user's logs"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>

                          {!isCurrent && (
                            <button
                              onClick={() =>
                                setConfirmAction({
                                  type: 'delete',
                                  userId: u.id,
                                  username: u.username,
                                  label: `Permanently delete account @${u.username} and all their logs?`
                                })
                              }
                              className="p-1.5 bg-[#373f51] hover:bg-rose-950/80 hover:text-rose-300 text-slate-400 rounded-lg transition-colors"
                              title="Delete user account"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: System Telemetry */}
        {activeTab === 'stats' && stats && (
          <div className="flex-1 overflow-y-auto mt-4 space-y-4 pr-1">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 bg-[#222834]/80 border border-[#373f51] rounded-2xl">
                <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#58a4b0]" /> Registered Accounts
                </span>
                <p className="text-2xl font-bold text-white mt-1">{stats.totalUsers}</p>
                <span className="text-[10px] text-emerald-400 font-sans">In this browser profile</span>
              </div>

              <div className="p-4 bg-[#222834]/80 border border-[#373f51] rounded-2xl">
                <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" /> Total Logs Recorded
                </span>
                <p className="text-2xl font-bold text-white mt-1">{stats.totalLogs}</p>
                <span className="text-[10px] text-cyan-400 font-sans">Across all accounts</span>
              </div>

              <div className="p-4 bg-[#222834]/80 border border-[#373f51] rounded-2xl">
                <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-indigo-400" /> Browser Data Size
                </span>
                <p className="text-2xl font-bold text-white mt-1">
                  {(stats.dbSizeBytes / 1024).toFixed(1)} <span className="text-xs text-slate-400 font-normal">KB</span>
                </p>
                <span className="text-[10px] text-indigo-300 font-sans">Estimated local storage</span>
              </div>

              <div className="p-4 bg-[#222834]/80 border border-[#373f51] rounded-2xl">
                <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" /> Active Sessions
                </span>
                <p className="text-2xl font-bold text-white mt-1">{stats.activeSessions}</p>
                <span className="text-[10px] text-amber-300 font-sans">30-day token lifetime</span>
              </div>
            </div>

            {/* Community Averages Card */}
            <div className="p-5 bg-[#222834]/80 border border-[#373f51] rounded-2xl space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#58a4b0]" />
                Cross-User Population Averages (Community Health Baseline)
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                Calculated from {stats.totalLogs} logs across {stats.totalUsers} accounts in this browser profile.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-[#161619] border border-[#373f51] rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Average Daily Sleep</span>
                  <p className="text-lg font-bold text-indigo-400 mt-0.5">
                    {stats.communityAverages?.avgSleep} <span className="text-xs font-normal">hrs</span>
                  </p>
                  <span className="text-[10px] text-slate-500 font-sans">Target benchmark: 7.0–9.0h</span>
                </div>

                <div className="p-3 bg-[#161619] border border-[#373f51] rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Average Water Intake</span>
                  <p className="text-lg font-bold text-cyan-400 mt-0.5">
                    {stats.communityAverages?.avgWater} <span className="text-xs font-normal">Litres</span>
                  </p>
                  <span className="text-[10px] text-slate-500 font-sans">Target benchmark: 2.5–3.5L</span>
                </div>

                <div className="p-3 bg-[#161619] border border-[#373f51] rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Average Screen Time</span>
                  <p className="text-lg font-bold text-purple-400 mt-0.5">
                    {stats.communityAverages?.avgScreen} <span className="text-xs font-normal">hrs</span>
                  </p>
                  <span className="text-[10px] text-slate-500 font-sans">Target benchmark: &lt; 5.0h</span>
                </div>
              </div>
            </div>

            {/* Browser Storage Environment */}
            <div className="p-4 bg-[#161619] border border-[#373f51] rounded-2xl text-xs space-y-1.5 font-mono">
              <div className="flex items-center justify-between text-slate-400">
                <span>Database Path:</span>
                <span className="text-white text-[11px] truncate max-w-md">{stats.databasePath}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Storage:</span>
                <span className="text-white">{stats.nodeVersion}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Service Uptime:</span>
                <span className="text-emerald-400">{Math.floor(stats.systemUptimeSec / 60)} minutes</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Data Utilities & Tools */}
        {activeTab === 'tools' && (
          <div className="flex-1 overflow-y-auto mt-4 space-y-4 pr-1">
            <div className="p-5 bg-[#222834]/80 border border-[#373f51] rounded-2xl space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Download className="w-4 h-4 text-[#58a4b0]" />
                    Full Database JSON Backup
                  </h3>
                  <p className="text-xs text-slate-400 font-sans mt-1">
                    Export all user accounts, profile settings, and health log records in a portable, human-readable JSON format.
                  </p>
                </div>
                <button
                  onClick={handleExportBackup}
                  className="px-4 py-2 bg-[#58a4b0] hover:bg-[#68b1bc] text-[#1b1b1e] text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md transition-all shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Backup</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="rounded-xl border border-[#373f51] bg-[#222834]/80 p-5 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white">Change administrator password</h3>
                <p className="mt-1 text-xs text-slate-400 font-sans">Enter your current password and choose a new password with 8 to 128 characters.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <label className="text-[11px] text-slate-400">Current password
                  <input required autoComplete="current-password" type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} className="mt-1 w-full rounded-md border border-[#373f51] bg-[#161619] px-3 py-2 text-sm text-white outline-none focus:border-[#58a4b0]" />
                </label>
                <label className="text-[11px] text-slate-400">New password
                  <input required minLength={8} maxLength={128} autoComplete="new-password" type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className="mt-1 w-full rounded-md border border-[#373f51] bg-[#161619] px-3 py-2 text-sm text-white outline-none focus:border-[#58a4b0]" />
                </label>
                <label className="text-[11px] text-slate-400">Confirm new password
                  <input required minLength={8} maxLength={128} autoComplete="new-password" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="mt-1 w-full rounded-md border border-[#373f51] bg-[#161619] px-3 py-2 text-sm text-white outline-none focus:border-[#58a4b0]" />
                </label>
              </div>
              <button disabled={passwordBusy} type="submit" className="rounded-md bg-[#58a4b0] px-4 py-2 text-xs font-bold text-[#1b1b1e] hover:bg-[#68b1bc] disabled:opacity-60">
                {passwordBusy ? 'Updating...' : 'Update password'}
              </button>
            </form>
          </div>
        )}

        {/* Action Confirmation Modal */}
        {confirmAction && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/90 p-6 backdrop-blur-sm">
            <div className="max-w-md w-full bg-[#1b1b1e] border border-rose-800/80 rounded-2xl p-6 text-center space-y-4 shadow-2xl">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 mx-auto flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Confirm Admin Action</h4>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">{confirmAction.label}</p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setConfirmAction(null)}
                  className="px-4 py-2 bg-[#222834] hover:bg-[#373f51] rounded-xl text-xs font-bold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (confirmAction.type === 'delete') {
                      handleDeleteUser(confirmAction.userId, confirmAction.username);
                    } else if (confirmAction.type === 'reset') {
                      handleResetLogs(confirmAction.userId, confirmAction.username);
                    }
                  }}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 rounded-xl text-xs font-bold text-white shadow-md shadow-rose-900/30"
                >
                  Confirm Execute
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedDossier && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/90 p-3 backdrop-blur-sm sm:p-6">
            <section className="flex max-h-full w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-[#4b5873] bg-[#1b1b1e] shadow-2xl" aria-label="Account dossier">
              <header className="flex items-center justify-between gap-3 border-b border-[#373f51] p-4">
                <div>
                  <p className="text-[10px] font-bold uppercase text-[#58a4b0]">Read-only account dossier</p>
                  <h3 className="mt-1 text-sm font-bold text-white">
                    {selectedDossier.account.name} <span className="font-normal text-slate-400">@{selectedDossier.account.username}</span>
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedDossier(null)}
                  className="rounded-md p-2 text-slate-400 hover:bg-[#373f51] hover:text-white"
                  title="Close account dossier"
                  aria-label="Close account dossier"
                >
                  <X className="h-4 w-4" />
                </button>
              </header>
              <div className="grid grid-cols-2 gap-3 border-b border-[#373f51] p-4 text-xs sm:grid-cols-4">
                <div><span className="block text-slate-500">Account ID</span><strong className="text-white">#{selectedDossier.account.id}</strong></div>
                <div><span className="block text-slate-500">Role</span><strong className="text-white">{selectedDossier.account.role}</strong></div>
                <div><span className="block text-slate-500">Daily records</span><strong className="text-white">{selectedDossier.logs.length}</strong></div>
                <div><span className="block text-slate-500">Profile ID</span><strong className="text-white">#{selectedDossier.profile.user_id}</strong></div>
              </div>
              <div className="min-h-0 flex-1 overflow-auto p-4">
                {selectedDossier.logs.length === 0 ? (
                  <p className="py-10 text-center text-xs text-slate-400">This account has no daily records.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px] border-collapse text-left text-xs">
                      <thead className="sticky top-0 bg-[#222834] text-slate-300">
                        <tr>{['Date', 'Sleep', 'Exercise', 'Water', 'Screen', 'Mood', 'Diet'].map((heading) => <th key={heading} className="border-b border-[#373f51] px-3 py-2 font-semibold">{heading}</th>)}</tr>
                      </thead>
                      <tbody>
                        {[...selectedDossier.logs].sort((a, b) => b.date.localeCompare(a.date)).map((log) => (
                          <tr key={log.id || log.date} className="border-b border-[#373f51]/70 text-slate-200">
                            <td className="px-3 py-2 font-mono">{log.date}</td>
                            <td className="px-3 py-2">{log.sleep_hour}h</td>
                            <td className="px-3 py-2">{log.exercise_time}h</td>
                            <td className="px-3 py-2">{log.water_intake}L</td>
                            <td className="px-3 py-2">{log.screen_time}h</td>
                            <td className="px-3 py-2">{log.mood}</td>
                            <td className="px-3 py-2">{log.diet}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-[#373f51] mt-4 flex items-center justify-between text-xs text-slate-400 font-sans">
          <span>Hnazer On-Device Administrator Console v1.0</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#222834] hover:bg-[#2b3342] text-xs font-bold text-white transition-colors"
          >
            Close Console
          </button>
        </div>

      </div>
    </div>
  );
}
