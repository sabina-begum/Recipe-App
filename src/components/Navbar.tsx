import { useState, useContext, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sun,
  Moon,
  Menu,
  X,
  Bell,
  User,
  Plus,
  ChevronDown,
  Globe,
} from "lucide-react";
import { useDarkMode } from "../contexts/DarkModeContext";
import { AuthContext } from "../contexts/AuthContextDef";
import { useModal } from "../contexts/ModalContext";
import foodieLogo from "../assets/foodie-logo-simple.svg";

interface NavbarProps {
  handleSearch: (query: string) => void;
}

interface NavItem {
  path: string;
  label: string;
  always?: boolean;
  loggedIn?: boolean;
  admin?: boolean;
  premium?: boolean;
}

const getNavItems = (): NavItem[] => [
  { path: "/", label: "Home", always: true },
  { path: "/recipes", label: "Recipes", always: true },
  { path: "/about", label: "About", always: true },
  { path: "/profile", label: "Profile", loggedIn: true },
  { path: "/admin", label: "Admin", admin: true },
];

function Navbar({ handleSearch }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [search, setSearch] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const darkModeContext = useDarkMode();
  const darkMode = darkModeContext?.darkMode || false;
  const toggleDarkMode = darkModeContext?.toggleDarkMode || (() => {});
  const modalContext = useModal();
  const openModal = modalContext?.openModal || (() => {});
  const notificationsCount = modalContext?.notificationsCount || 0;
  const location = useLocation();
  const auth = useContext(AuthContext);
  const { logout, isDemoUser } = auth || {};
  const navbarRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          setShowNavbar(currentY < 80 || currentY < lastScrollY);
          setLastScrollY(currentY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        langMenuRef.current &&
        !(langMenuRef.current as HTMLDivElement).contains(event.target as Node)
      ) {
        setShowLangMenu(false);
      }
      if (
        profileMenuRef.current &&
        !(profileMenuRef.current as HTMLDivElement).contains(
          event.target as Node,
        )
      ) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        document.activeElement &&
        (document.activeElement as HTMLElement).tagName !== "INPUT"
      ) {
        e.preventDefault();
        (document.getElementById("navbar-search") as HTMLInputElement)?.focus();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (!showProfileMenu) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowProfileMenu(false);
      if (e.key === "Tab") setShowProfileMenu(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showProfileMenu]);

  useEffect(() => {
    if (!showLangMenu) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowLangMenu(false);
      if (e.key === "Tab") setShowLangMenu(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showLangMenu]);

  const isActive = (path: string) => location.pathname === path;

  const getAvatar = () => {
    if (auth?.currentUser?.photoURL)
      return (
        <img
          src={auth.currentUser.photoURL}
          alt="avatar"
          className="w-8 h-8 rounded-full object-cover"
        />
      );
    if (auth?.currentUser?.displayName)
      return (
        <span className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
          {auth.currentUser.displayName[0].toUpperCase()}
        </span>
      );
    return <User className="w-8 h-8 text-gray-400" />;
  };

  const handleProfileMenu = () => setShowProfileMenu((v) => !v);
  const handleLangMenu = () => setShowLangMenu((v) => !v);

  const handleLogout = async () => {
    if (logout) await logout();
    setShowProfileMenu(false);
    setIsMenuOpen(false);
  };

  const [logoHover, setLogoHover] = useState(false);

  const navItemsToShow = getNavItems().filter(
    (item) =>
      item.always ||
      (item.loggedIn && auth && auth.currentUser) ||
      (item.admin && false),
  );

  return (
    <nav
      ref={navbarRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 bg-white/95 dark:bg-black/95 border-b border-gray-200 dark:border-stone-700 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80 supports-[backdrop-filter]:dark:bg-black/80 px-4 sm:px-8 lg:px-16 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}
      aria-label="Main navigation"
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only absolute left-2 top-2 z-50 bg-primary-600 text-white px-3 py-1 rounded"
      >
        Skip to content
      </a>
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
        {/* Left: Logo */}
        <div className="flex items-center flex-shrink-0">
          <Link
            to="/"
            className="flex items-center space-x-3 focus:outline-none focus:ring-1 focus:ring-primary-500 rounded-lg group"
            onMouseEnter={() => setLogoHover(true)}
            onMouseLeave={() => setLogoHover(false)}
            onClick={() => {
              // Clear any selected recipe and return to landing page
              window.location.href = "/";
            }}
          >
            <img
              src={foodieLogo}
              alt="CULINARIA Logo"
              className={`h-9 w-9 sm:h-10 sm:w-10 lg:h-12 lg:w-12 object-contain transition-transform duration-300 rounded-lg shadow ${
                logoHover ? "scale-110 rotate-6" : "scale-100"
              }`}
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 dark:from-green-400 dark:to-emerald-500 bg-clip-text text-transparent tracking-tight select-none transition-all duration-300 group-hover:scale-105">
              CULINARIA
            </span>
          </Link>
        </div>
        {/* Center: Nav links (md and up) */}
        <div className="hidden md:flex flex-1 justify-center items-center space-x-2 md:space-x-2 lg:space-x-4">
          {navItemsToShow
            .filter((item) => item.label !== "Recipes")
            .map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  text-xs md:text-xs lg:text-base
                  px-0.5 md:px-0.5 lg:px-2
                  py-1
                  font-medium
                  transition-colors duration-200
                  rounded
                  focus:outline-none focus:ring-1 focus:ring-primary-500
                  ${
                    isActive(item.path)
                      ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30"
                      : "text-gray-700 hover:text-primary-600 dark:text-stone-300 dark:hover:text-primary-400 hover:bg-stone-100 dark:hover:bg-stone-900"
                  }
                `}
                tabIndex={0}
                onMouseEnter={() => {
                  if (window.__vite_plugin_react_router_prefetch) {
                    window.__vite_plugin_react_router_prefetch(item.path);
                  }
                }}
              >
                {item.label}
              </Link>
            ))}
        </div>
        {/* Right: Actions (md and up) */}
        <div className="hidden md:flex items-center space-x-2 md:space-x-2 lg:space-x-4">
          {/* Search Bar */}
          <form
            className="hidden lg:flex items-center max-w-md"
            role="search"
            onSubmit={async (e) => {
              e.preventDefault();
              if (search.trim() && handleSearch) {
                setSearchLoading(true);
                await handleSearch(search);
                setSearchLoading(false);
                setSearch(""); // Clear the search input after submission
              }
            }}
          >
            <div className="relative w-full">
              <input
                id="navbar-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search recipes... ( / )"
                className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-stone-400 focus:ring-1 focus:ring-primary-200 focus:border-transparent shadow-sm transition-shadow disabled:opacity-50"
                aria-label="Search recipes"
                disabled={searchLoading}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
                aria-label="Search"
                disabled={searchLoading}
              >
                {searchLoading ? (
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </form>
          {/* Quick Add Button */}
          <button
            className="ml-2 p-2 rounded-full bg-green-600 hover:bg-green-700 text-white transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-green-400"
            aria-label="Quick add"
            title="Quick add (new recipe, meal, etc.)"
            type="button"
            onClick={() => openModal("quick-add")}
          >
            <Plus className="w-5 h-5" />
          </button>
          {/* Notifications */}
          <button
            className={`relative p-2 rounded-full text-gray-600 hover:text-primary-600 dark:text-stone-300 dark:hover:text-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-transform duration-200 ${
              showNavbar ? "scale-100" : "scale-90"
            }`}
            aria-label="Notifications"
            title="Notifications"
            type="button"
            onClick={() => openModal("notifications")}
          >
            <Bell className="w-5 h-5 animate-pulse" />
            {notificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                {notificationsCount}
              </span>
            )}
          </button>
          {/* Language Switcher */}
          <div className="relative" role="menu" aria-label="Language menu">
            <button
              className="flex items-center p-2 rounded-lg text-gray-600 hover:text-primary-600 dark:text-stone-300 dark:hover:text-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-500"
              aria-label="Change language"
              aria-haspopup="true"
              aria-expanded={showLangMenu}
              onClick={handleLangMenu}
              type="button"
              tabIndex={0}
            >
              <Globe className="w-5 h-5" />
              <ChevronDown className="w-4 h-4 ml-1" />
            </button>
            {showLangMenu && (
              <div
                ref={langMenuRef}
                className="absolute right-0 mt-2 w-32 bg-white dark:bg-black rounded-lg shadow-lg border border-gray-100 dark:border-stone-800 z-50 animate-fade-in-down"
                role="menu"
                tabIndex={-1}
              >
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-stone-100 dark:hover:bg-stone-800"
                  role="menuitem"
                  tabIndex={0}
                >
                  English
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-stone-100 dark:hover:bg-stone-800"
                  disabled
                  role="menuitem"
                  tabIndex={0}
                >
                  More soon…
                </button>
              </div>
            )}
          </div>
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-gray-600 hover:text-primary-600 dark:text-stone-300 dark:hover:text-primary-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Toggle dark mode"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            type="button"
          >
            {darkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
          {/* User Avatar/Profile Dropdown */}
          {auth?.currentUser ? (
            <div className="relative" role="menu" aria-label="User menu">
              <button
                className="flex items-center space-x-2 p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                onClick={handleProfileMenu}
                aria-label="User menu"
                aria-haspopup="true"
                aria-expanded={showProfileMenu}
                type="button"
                tabIndex={0}
              >
                {getAvatar()}
                <ChevronDown className="w-4 h-4" />
              </button>
              {showProfileMenu && (
                <div
                  ref={profileMenuRef}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-black rounded-lg shadow-lg border border-gray-100 dark:border-stone-800 z-50 animate-fade-in-down"
                  role="menu"
                  tabIndex={-1}
                >
                  <div className="px-4 py-2 text-sm text-gray-700 dark:text-stone-300">
                    {auth.currentUser.displayName || auth.currentUser.email}
                    {isDemoUser && (
                      <span className="ml-1 text-xs text-orange-500">
                        (Demo)
                      </span>
                    )}
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-stone-100 dark:hover:bg-stone-800"
                    role="menuitem"
                    tabIndex={0}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 hover:bg-stone-100 dark:hover:bg-stone-800"
                    role="menuitem"
                    tabIndex={0}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400"
                    role="menuitem"
                    tabIndex={0}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-stone-800 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-green-600 hover:bg-green-700 text-white focus:outline-none focus:ring-1 focus:ring-green-400"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
        {/* Mobile Menu Button (below md) */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-lg text-gray-600 hover:text-primary-600 dark:text-stone-300 dark:hover:text-primary-400 transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-primary-500"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          type="button"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>
      {/* Mobile Menu (below md) */}
      {isMenuOpen && (
        <div className="md:hidden mt-2 pb-4 animate-fade-in-down">
          <form
            className="flex items-center mb-2"
            role="search"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              id="navbar-search-mobile"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search recipes..."
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-stone-400 focus:ring-1 focus:ring-primary-200 focus:border-transparent shadow-sm transition-shadow"
              aria-label="Search recipes"
            />
          </form>
          <div className="flex flex-col space-y-1">
            {navItemsToShow
              .filter((item) => item.label !== "Recipes")
              .map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-base font-medium transition-colors duration-200 px-2 py-2 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 ${
                    isActive(item.path)
                      ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30"
                      : "text-gray-700 hover:text-primary-600 dark:text-stone-300 dark:hover:text-primary-400 hover:bg-stone-100 dark:hover:bg-stone-800"
                  }`}
                  tabIndex={0}
                  onMouseEnter={() => {
                    if (window.__vite_plugin_react_router_prefetch) {
                      window.__vite_plugin_react_router_prefetch(item.path);
                    }
                  }}
                >
                  {item.label}
                </Link>
              ))}
            {/* Actions in mobile menu (optional) */}
            <button
              className="mt-2 p-2 rounded-full bg-green-600 hover:bg-green-700 text-white transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-green-400"
              aria-label="Quick add"
              type="button"
              onClick={() => {
                openModal("quick-add");
                setIsMenuOpen(false);
              }}
            >
              <Plus className="w-5 h-5" /> Quick Add
            </button>
            <button
              className="relative p-2 rounded-full text-gray-600 hover:text-primary-600 dark:text-stone-300 dark:hover:text-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-500"
              aria-label="Notifications"
              type="button"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                3
              </span>
            </button>
            <button
              className="flex items-center p-2 rounded-lg text-gray-600 hover:text-primary-600 dark:text-stone-300 dark:hover:text-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-500"
              aria-label="Change language"
              type="button"
              onClick={handleLangMenu}
            >
              <Globe className="w-5 h-5" />
              <ChevronDown className="w-4 h-4" />
            </button>
            {showLangMenu && (
              <div
                ref={langMenuRef}
                className="mt-2 w-32 bg-white dark:bg-black rounded-lg shadow-lg border border-gray-100 dark:border-stone-800 z-50 animate-fade-in-down"
                role="menu"
                tabIndex={-1}
              >
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-stone-100 dark:hover:bg-stone-800"
                  role="menuitem"
                  tabIndex={0}
                >
                  English
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-stone-100 dark:hover:bg-stone-800"
                  disabled
                  role="menuitem"
                  tabIndex={0}
                >
                  More soon…
                </button>
              </div>
            )}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-gray-600 hover:text-primary-600 dark:text-stone-300 dark:hover:text-primary-400 transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-primary-500"
              aria-label="Toggle dark mode"
              type="button"
            >
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            {auth?.currentUser ? (
              <>
                <button
                  className="flex items-center space-x-2 p-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
                  onClick={handleProfileMenu}
                  aria-label="User menu"
                  type="button"
                >
                  {getAvatar()}
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showProfileMenu && (
                  <div
                    ref={profileMenuRef}
                    className="mt-2 w-48 bg-white dark:bg-black rounded-lg shadow-lg border border-gray-100 dark:border-stone-800 z-50 animate-fade-in-down"
                    role="menu"
                    tabIndex={-1}
                  >
                    <div className="px-4 py-2 text-sm text-gray-700 dark:text-stone-300">
                      {auth.currentUser.displayName || auth.currentUser.email}
                      {isDemoUser && (
                        <span className="ml-1 text-xs text-orange-500">
                          (Demo)
                        </span>
                      )}
                    </div>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-stone-100 dark:hover:bg-stone-800"
                      role="menuitem"
                      tabIndex={0}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 hover:bg-stone-100 dark:hover:bg-stone-800"
                      role="menuitem"
                      tabIndex={0}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400"
                      role="menuitem"
                      tabIndex={0}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-green-600 hover:bg-green-700 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

declare global {
  interface Window {
    __vite_plugin_react_router_prefetch?: (path: string) => void;
  }
}
