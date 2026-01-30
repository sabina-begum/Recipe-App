
import FeatureNavbar from "./navbar/FeatureNavbar";
import { useDarkMode } from "../contexts/DarkModeContext";

interface PageHeaderProps {
  isAuthPage: boolean;
}

export default function PageHeader({ isAuthPage }: PageHeaderProps) {
  const darkModeContext = useDarkMode();
  const darkMode = darkModeContext?.darkMode || false;
  if (isAuthPage) return null;
  return (
    <>
      <div className="text-left pt-0 pb-2 md:pb-3 lg:pb-4 px-4">
        <h1
          className={`text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black leading-tight mb-2 tracking-tight ${
            darkMode ? "text-green-300" : "text-green-900"
          }`}
        >
          Discover New Halal Recipes
        </h1>
        <p
          className={`text-sm md:text-base lg:text-lg max-w-lg leading-relaxed ${
            darkMode ? "text-stone-300" : "text-stone-600"
          }`}
        >
          Find your next favorite dish with our recipe collection
        </p>
      </div>
      <FeatureNavbar darkMode={darkMode} />
    </>
  );
}

