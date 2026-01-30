import React, { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Watermark from "./Watermark";
import PerformanceMonitor from "./PerformanceMonitor";
import PremiumFeatures from "./PremiumFeatures";
import SearchBar from "./SearchBar";
import { useModal } from "../contexts/ModalContext";
import { useDarkMode } from "../contexts/DarkModeContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FeatureNavbar from "./navbar/FeatureNavbar";
import OnboardingModal from "./OnboardingModal";
import QuickAddModal from "./QuickAddModal";
import NotificationsModal from "./NotificationsModal";

interface HeroHeaderProps {
  handleSearch: (query: string) => void | Promise<void>;
}

function HeroHeader({ handleSearch }: HeroHeaderProps) {
  const darkModeContext = useDarkMode();
  const darkMode = darkModeContext?.darkMode || false;
  const [loading, setLoading] = React.useState(false);
  return (
    <div className="w-full bg-gradient-to-b from-orange-50 to-amber-50 dark:from-neutral-900 dark:to-neutral-800 py-8 md:py-12 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="lg:w-80 flex-shrink-0">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-green-900 dark:text-green-300 text-center lg:text-left">
              Discover Halal Recipes
            </h1>
          </div>
          <div className="flex-1 lg:max-w-2xl">
            <SearchBar
              onSearch={async (query) => {
                setLoading(true);
                await handleSearch(query);
                setLoading(false);
              }}
              darkMode={darkMode}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface MainLayoutProps {
  children: ReactNode;
  handleSearch: (query: string) => void | Promise<void>;
}

export default function MainLayout({
  children,
  handleSearch,
}: MainLayoutProps) {
  const modalContext = useModal();
  const modal = modalContext?.modalType || null;
  const closeModal = modalContext?.closeModal || (() => {});
  const darkModeContext = useDarkMode();
  const darkMode = darkModeContext?.darkMode || false;
  const location = useLocation();
  const [showOnboarding, setShowOnboarding] = React.useState(false);
  const [checkedOnboarding, setCheckedOnboarding] = React.useState(false);
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  const isPremium = !!currentUser?.premium;

  const shouldShowHeader = React.useMemo(() => {
    return location.pathname === "/";
  }, [location.pathname]);

  React.useEffect(() => {
    if (!checkedOnboarding) {
      const hasOnboarded = localStorage.getItem("hasOnboarded");
      if (!hasOnboarded) {
        setShowOnboarding(true);
      }
      setCheckedOnboarding(true);
    }
  }, [checkedOnboarding]);

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem("hasOnboarded", "true");
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        shouldShowHeader
          ? darkMode
            ? "pt-16 sm:pt-20 lg:pt-24"
            : "pt-28 sm:pt-32 lg:pt-36"
          : darkMode
          ? "pt-16"
          : "pt-16"
      }`}
    >
      <Navbar handleSearch={handleSearch} />
      {shouldShowHeader && (
        <>
          <HeroHeader handleSearch={handleSearch} />
          <FeatureNavbar darkMode={darkMode} />
        </>
      )}
      <main className="flex-grow flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-8 md:py-12 lg:py-16">
          {children}
        </div>
      </main>
      <Footer />
      <Watermark />
      <PerformanceMonitor darkMode={darkMode} />
      {showOnboarding && (
        <OnboardingModal
          open={showOnboarding}
          onClose={handleCloseOnboarding}
          darkMode={darkMode}
        />
      )}
      {modal === "premium" && !isPremium && (
        <PremiumFeatures darkMode={darkMode} onClose={closeModal} />
      )}
      {modal === "quick-add" && (
        <QuickAddModal open={true} onClose={closeModal} darkMode={darkMode} />
      )}
      {modal === "notifications" && (
        <NotificationsModal
          open={true}
          onClose={closeModal}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}
