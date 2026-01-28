import { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Logo from "./Logo";
import LoadingScreen from "./LoadingScreen";

// Modern 2025-style Navbar with dropdowns and mobile slide panel
export default function Header({ onDonateClick }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // UI state
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  // refs for outside click handling
  const notifRef = useRef(null);
  const userDropdownRef = useRef(null);

  // Mock reminders (would normally come from backend)
  const [reminders, setReminders] = useState([
    { id: 1, shelter: 'Mumbai Animal Welfare', date: 'Dec 12, 2025', slot: '9:00 AM - 12:00 PM', read: false },
    { id: 2, shelter: 'Delhi Animal Care', date: 'Dec 14, 2025', slot: '10:00 AM - 1:00 PM', read: false },
    { id: 3, shelter: 'Bengaluru Pet Rescue', date: 'Dec 20, 2025', slot: '11:00 AM - 3:00 PM', read: true },
  ]);

  const mockUnreadCount = reminders.filter(r => !r.read).length;

  const markAllRead = () => setReminders(prev => prev.map(r => ({ ...r, read: true })));
  const markRead = (id) => setReminders(prev => prev.map(r => r.id === id ? { ...r, read: true } : r));

  // Handle logo click with loading animation
  const handleLogoClick = (e) => {
    e.preventDefault();
    setShowLoading(true);
  };

  const handleLoadingComplete = () => {
    setShowLoading(false);
    // Force page refresh to home
    window.location.href = '/';
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate("/");
  };

  // Get first name from user
  const getFirstName = () => {
    if (user?.name) {
      return user.name.split(' ')[0];
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  useEffect(() => {
    function onDocClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) setUserDropdownOpen(false);
    }
    function onEsc(e) {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setNotifOpen(false);
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => { document.removeEventListener("click", onDocClick); document.removeEventListener("keydown", onEsc); };
  }, []);

  // navigation items
  const allNavItems = [
    { label: "Home", to: "/" },
    { label: "Adopt", to: "/pets" },
    { label: "Donate", to: "/donate" },
    { label: "Volunteer", to: "/volunteer" },
    { label: "Shelters", to: "/shelters" },
    { label: "Medical Records", to: "/medical-records" },
    { label: "About", to: "/about" },
    ...(user && user.role === "admin" ? [
      { label: "Admin Panel", to: "/admin" },
      { label: "Requests", to: "/admin/adoption-requests" },
      { label: "Adopted History", to: "/admin/adopted-pets" }
    ] : []),
    ...(user && user.role === "user" ? [
      { label: "Request Status", to: "/adoption-status" }
    ] : []),
  ];

  // Primary items for Header (Desktop)
  const primaryNavItems = allNavItems.filter(item => ["Home", "Adopt", "About", "Admin Panel", "Requests", "Request Status"].includes(item.label));
  // Secondary items for Sidebar (Desktop)
  const secondaryNavItems = allNavItems.filter(item => !["Home", "Adopt", "About", "Admin Panel", "Requests", "Request Status"].includes(item.label));

  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full">
      {/* Glass background bar */}
      <div className="glass border-b border-white/20 backdrop-blur-md w-full">
        <nav className="w-full h-16 px-6 flex items-center justify-between gap-4" aria-label="Primary Navigation">

          {/* Left: Logo */}
          <div className="flex items-center flex-shrink-0">
            <button
              onClick={handleLogoClick}
              className="flex items-center gap-3 hover:scale-105 transition-transform duration-300 group"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-lg overflow-hidden group-hover:rotate-12 transition-transform duration-300">
                <Logo width={40} height={40} />
              </div>
              <span className="hidden sm:inline-block text-gray-900 font-semibold text-lg group-hover:text-pink-600 transition-colors duration-300">
                Pet Haven
              </span>
            </button>
          </div>

          {/* Center nav links (Primary - Desktop only) */}
          <div className="hidden lg:flex lg:items-center lg:justify-center gap-6">
            {primaryNavItems.map((item) => (
              <Link key={item.label} to={item.to} className="px-4 py-2 text-gray-700 hover:text-gray-900 border-b-2 border-transparent hover:border-pink-400 transition font-medium">
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-3">

            {/* Desktop Sidebar Toggle (Hamburger for remaining options) */}
            <div className="hidden lg:block">
              <button onClick={() => setMobileOpen(true)} className="p-2 rounded-md hover:bg-white/50 transition-colors flex items-center gap-2 text-gray-700 font-medium">
                <span className="text-sm">More</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
              </button>
            </div>

            {/* Favorites Link */}
            {user && (
              <Link to="/favorites" className="p-2 rounded-md bg-white/60 hover:text-pink-600 transition-colors relative group">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Favorites</span>
              </Link>
            )}

            {/* Notifications bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => {
                  setNotifOpen((s) => !s);
                }}
                aria-label="Notifications"
                className={`p-2 rounded-md bg-white/60 relative transition-transform ${notifOpen ? 'animate-bounce' : ''}`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-700"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h11z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                {mockUnreadCount > 0 ? (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-semibold leading-none text-white bg-red-500 rounded-full">{mockUnreadCount}</span>
                ) : null}
              </button>

              {/* Notifications dropdown */}
              {notifOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl ring-1 ring-black ring-opacity-5 z-50 overflow-hidden">
                  <div className="px-4 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Reminders</h4>
                      <button onClick={() => setNotifOpen(false)} className="text-white/90 text-sm">Close</button>
                    </div>
                    <p className="text-xs text-pink-100 mt-1">Upcoming volunteer sessions</p>
                  </div>
                  <div className="p-3 max-h-72 overflow-y-auto">
                    {reminders.length === 0 ? (
                      <div className="text-center text-sm text-gray-500 py-6">No reminders</div>
                    ) : (
                      reminders.map((r) => (
                        <div key={r.id} className={`flex items-start gap-3 p-3 mb-2 rounded-lg ${r.read ? 'bg-white' : 'bg-pink-50'}`}>
                          <div className="flex-shrink-0 mt-1">
                            <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3" /></svg>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="text-sm font-semibold text-gray-900 truncate">{r.shelter}</div>
                              <div className="text-xs text-gray-500">{r.date}</div>
                            </div>
                            <div className="text-xs text-gray-600 mt-1">{r.slot}</div>
                            <div className="mt-2 flex items-center gap-3">
                              <Link to={`/volunteer?shelter=${encodeURIComponent(r.shelter)}`} onClick={() => markRead(r.id)} className="text-sm text-pink-600 font-medium hover:underline">View Details</Link>
                              {!r.read && <span className="text-xs text-red-500">● Unread</span>}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="px-3 py-2 border-t border-gray-100 text-center">
                    <button onClick={() => markAllRead()} className="text-sm text-gray-700 hover:text-gray-900">Mark all as read</button>
                  </div>
                </div>
              )}
            </div>

            {/* Auth actions - right aligned */}
            <div className="hidden md:flex items-center gap-4 flex-shrink-0">
              {user ? (
                <div className="relative" ref={userDropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-100 to-rose-100 hover:from-pink-200 hover:to-rose-200 transition-all duration-300 group"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {getFirstName().charAt(0).toUpperCase()}
                    </div>
                    <span className="text-gray-700 font-medium">{getFirstName()}</span>
                    <svg
                      className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* User Dropdown */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 py-2 z-40 animate-fade-in-up">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          to="/welcome"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Profile
                        </Link>
                        <Link
                          to="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          Dashboard
                        </Link>
                        <Link
                          to="/adoption-status"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          My Adoptions
                        </Link>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login" className="group relative px-4 py-2 text-gray-600 hover:text-pink-600 font-semibold transition-all duration-300 hover:scale-105">
                    <span className="relative z-10">Sign In</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-100 to-rose-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-rose-500 group-hover:w-full transition-all duration-300"></div>
                  </Link>
                  <Link to="/register" className="px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">Create account</Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile hamburger (when desktop 'More' is hidden) */}
          <div className="lg:hidden flex-shrink-0">
            <button onClick={() => setMobileOpen(true)} aria-label="Open menu" className="p-2 rounded-md bg-white/60">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h16" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </nav>
      </div>

      {/* Sidebar Dropdown (Desktop & Mobile) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop with blur */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={() => setMobileOpen(false)} />

          <aside className="absolute right-0 top-0 h-full w-full max-w-xs bg-white/95 backdrop-blur-md shadow-2xl p-6 transform transition-transform duration-300 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg overflow-hidden">
                  <Logo width={32} height={32} />
                </div>
                <span className="font-semibold text-gray-800">Menu</span>
              </div>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="p-2 rounded-full hover:bg-gray-100 transition-colors">✕</button>
            </div>

            <nav className="space-y-1">
              {/* Show Primary Items in Sidebar only on Mobile (on desktop they are already in header) */}
              <div className="lg:hidden space-y-1 mb-4">
                {primaryNavItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 rounded-xl text-gray-800 hover:bg-pink-50 hover:text-pink-600 font-medium transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="border-t border-gray-100 my-2"></div>
              </div>

              {/* Show Secondary Items (Always in sidebar) */}
              {secondaryNavItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-gray-800 hover:bg-pink-50 hover:text-pink-600 font-medium transition-colors ${item.label === 'Admin Panel' ? 'text-pink-600' : ''}`}
                >
                  {item.label}
                </Link>
              ))}

              <div className="border-t border-gray-200 mt-6 pt-6">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 mb-4 px-2">
                      <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                        {getFirstName().charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>

                    <Link to="/welcome" onClick={() => setMobileOpen(false)} className="flex items-center px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50">
                      <span className="mr-3">👤</span> Profile
                    </Link>
                    <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50">
                      <span className="mr-3">📊</span> Dashboard
                    </Link>
                    <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="w-full text-left flex items-center px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 mt-2">
                      <span className="mr-3">🚪</span> Logout
                    </button>
                  </>
                ) : (
                  <div className="space-y-3 px-2">
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="block w-full text-center px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50">Sign In</Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)} className="block w-full text-center px-4 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium shadow-lg hover:shadow-pink-500/30">Create Account</Link>
                  </div>
                )}
              </div>
            </nav>
          </aside>
        </div>
      )}

      {/* Loading Screen */}
      <LoadingScreen
        isVisible={showLoading}
        onComplete={handleLoadingComplete}
      />
    </header>
  );
}
