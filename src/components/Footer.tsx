import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import favicon from "../assets/favicon.svg";

const NEWSLETTER_STORAGE_KEY = "culinaria_newsletter_subscribed";
const NEWSLETTER_EMAIL_KEY = "culinaria_newsletter_email";

function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Load persisted newsletter state from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(NEWSLETTER_STORAGE_KEY);
      const storedEmail = localStorage.getItem(NEWSLETTER_EMAIL_KEY);
      if (stored === "true") {
        setSubmitted(true);
        if (storedEmail) setEmail(storedEmail);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = email.trim();
    if (!value) return;
    setSubmitted(true);
    try {
      localStorage.setItem(NEWSLETTER_STORAGE_KEY, "true");
      localStorage.setItem(NEWSLETTER_EMAIL_KEY, value);
    } catch {
      // ignore quota
    }
  };

  return (
    <footer
      className="w-full bg-gradient-to-br from-stone-100 via-orange-50 to-yellow-50 dark:from-black dark:via-stone-900 dark:to-stone-900 border-t border-stone-200 dark:border-stone-800 pt-12 pb-8 px-4 sm:px-8 lg:px-16 mt-16 shadow-xl"
      aria-label="Site Footer"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10">
        {/* Branding & Logo */}
        <div className="flex flex-col items-start gap-2">
          <div className="flex items-center gap-3 mb-2">
            <img
              src={favicon}
              alt="Culinaria Logo"
              className="w-10 h-10 rounded-lg shadow"
            />
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-green-600 to-emerald-700 dark:from-green-400 dark:to-emerald-500 bg-clip-text text-transparent select-none">
              CULINARIA
            </span>
          </div>
          <span className="text-stone-500 dark:text-stone-400 text-sm">
            &copy; {new Date().getFullYear()} All rights reserved.
          </span>
          <span className="text-xs text-stone-400 dark:text-stone-500">
            Crafted for culinary inspiration.
          </span>
        </div>

        {/* Navigation */}
        <nav aria-label="Footer navigation" className="col-span-1">
          <h3 className="text-base font-semibold text-stone-700 dark:text-stone-200 mb-3">
            Explore
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to="/about"
                className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors text-stone-600 dark:text-stone-300"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/recipes"
                className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors text-stone-600 dark:text-stone-300"
              >
                Recipes
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors text-stone-600 dark:text-stone-300"
              >
                Profile
              </Link>
            </li>
            <li>
              <Link
                to="/privacy"
                className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors text-stone-600 dark:text-stone-300"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                to="/terms"
                className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors text-stone-600 dark:text-stone-300"
              >
                Terms
              </Link>
            </li>
          </ul>
        </nav>

        {/* Newsletter Signup */}
        <div className="col-span-1">
          <h3 className="text-base font-semibold text-stone-700 dark:text-stone-200 mb-3">
            Newsletter
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">
            Get the latest recipes, tips, and culinary news. No spam, ever.
          </p>
          <form
            onSubmit={handleNewsletterSubmit}
            className="flex flex-col gap-2"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="Your email address"
              className="rounded-md border border-stone-300 dark:border-stone-700 px-3 py-2 text-sm bg-white dark:bg-black focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitted}
            />
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md px-4 py-2 text-sm transition disabled:opacity-60"
              disabled={submitted}
            >
              {submitted ? "Subscribed!" : "Subscribe"}
            </button>
          </form>
        </div>

        {/* Contact & Socials */}
        <div className="col-span-1 flex flex-col gap-3">
          <h3 className="text-base font-semibold text-stone-700 dark:text-stone-200 mb-3">
            Connect
          </h3>
          <a
            href="mailto:begumsabina81193@gmail.com"
            className="text-stone-600 dark:text-stone-300 hover:text-green-700 dark:hover:text-green-300 text-sm transition-colors"
          >
            Contact Us
          </a>
          <div className="flex gap-4 mt-2">
            {/* GitHub - use real URL from env when set */}
            <a
              href={
                (import.meta.env.VITE_GITHUB_URL as string | undefined) ||
                "https://github.com"
              }
              aria-label="GitHub"
              className="hover:text-stone-800 dark:hover:text-stone-100 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                width="22"
                height="22"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.686-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.699 1.028 1.593 1.028 2.686 0 3.847-2.337 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.417-.012 2.747 0 .267.18.579.688.481C19.138 20.203 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" />
              </svg>
            </a>
            {/* Twitter/X - use real URL from env when set */}
            <a
              href={
                (import.meta.env.VITE_TWITTER_URL as string | undefined) ||
                "https://x.com"
              }
              aria-label="Twitter"
              className="hover:text-blue-500 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                width="22"
                height="22"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M22.46 5.924c-.793.352-1.645.59-2.54.697a4.48 4.48 0 0 0 1.963-2.475 8.94 8.94 0 0 1-2.828 1.082A4.48 4.48 0 0 0 16.11 4c-2.482 0-4.495 2.013-4.495 4.495 0 .352.04.695.116 1.022C7.728 9.37 4.1 7.555 1.67 4.905c-.386.663-.607 1.434-.607 2.26 0 1.56.795 2.936 2.006 3.744-.738-.023-1.432-.226-2.04-.565v.057c0 2.18 1.55 4.002 3.604 4.418-.377.103-.775.158-1.185.158-.29 0-.57-.028-.844-.08.57 1.78 2.223 3.078 4.183 3.113A8.98 8.98 0 0 1 2 19.54a12.68 12.68 0 0 0 6.88 2.017c8.26 0 12.785-6.84 12.785-12.785 0-.195-.004-.39-.013-.583A9.14 9.14 0 0 0 24 4.59a8.98 8.98 0 0 1-2.54.697z" />
              </svg>
            </a>
            {/* LinkedIn - use real URL from env when set */}
            <a
              href={
                (import.meta.env.VITE_LINKEDIN_URL as string | undefined) ||
                "https://linkedin.com"
              }
              aria-label="LinkedIn"
              className="hover:text-blue-700 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                width="22"
                height="22"
                fill="currentColor"
                aria-hidden="true"
                viewBox="0 0 24 24"
              >
                <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 7h4V20h-4V7zm7.5 0h3.6v1.8h.05c.5-.95 1.7-1.95 3.5-1.95 3.75 0 4.45 2.45 4.45 5.65V20h-4v-6.2c0-1.48-.03-3.38-2.06-3.38-2.06 0-2.38 1.6-2.38 3.27V20h-4V7z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
