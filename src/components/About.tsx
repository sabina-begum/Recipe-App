/**
 * Copyright (c) 2024 Sabina Begum. All rights reserved.
 *
 * PROPRIETARY SOFTWARE - CONFIDENTIAL
 *
 * This file contains proprietary and confidential information.
 * Unauthorized copying, distribution, or use is strictly prohibited.
 *
 * For licensing inquiries: begumsabina81193@gmail.com
 *
 * Educational use only - Commercial use prohibited.
 */

import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import AboutFeatures from "./AboutFeatures";
import AboutTeam from "./AboutTeam";
import AboutTech from "./AboutTech";
import AboutContact from "./AboutContact";

const About = ({ darkMode }: { darkMode: boolean }) => {
  return (
    <div className="min-h-screen pt-20 pb-8 bg-main text-main">
      <Helmet>
        <title>About Culinaria - Professional Cooking Platform</title>
        <meta
          name="description"
          content="Learn about Culinaria, the comprehensive professional cooking platform. Discover our mission to make healthy cooking accessible to everyone."
        />
        <meta
          name="keywords"
          content="about culinaria, professional cooking platform, nutrition tracking, meal planning, culinary skills"
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Culinaria",
            description:
              "Professional cooking platform with comprehensive recipe discovery and nutrition tracking",
            url: "https://culinaria.com/",
            founder: {
              "@type": "Person",
              name: "Sabina Begum",
              email: "begumsabina81193@gmail.com",
            },
          })}
        </script>
      </Helmet>

      <div className="py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1
            className={`text-4xl md:text-5xl font-bold mb-6 ${
              darkMode ? "text-green-300" : "text-gray-900"
            }`}
          >
            Welcome to{" "}
            <span
              className={`bg-gradient-to-r bg-clip-text text-transparent ${
                darkMode
                  ? "from-green-400 to-emerald-500"
                  : "from-green-600 to-emerald-700"
              }`}
            >
              CULINARIA
            </span>
          </h1>
          <p
            className={`text-xl max-w-3xl mx-auto ${
              darkMode ? "text-stone-300" : "text-gray-600"
            }`}
          >
            Your comprehensive cooking platform for discovering delicious
            recipes, planning meals, tracking nutrition, and mastering culinary
            skills. We&apos;re passionate about empowering home cooks with
            professional-grade tools and guidance.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <h2
            className={`text-3xl font-bold mb-8 text-center bg-clip-text text-transparent ${
              darkMode
                ? "bg-gradient-to-r from-green-300 to-emerald-400"
                : "bg-gradient-to-r from-gray-900 to-gray-700"
            }`}
          >
            Our Mission
          </h2>
          <div
            className={`rounded-2xl p-8 ${
              darkMode
                ? "bg-neutral-900 border border-neutral-700"
                : "bg-gradient-to-r from-green-50 to-emerald-50"
            }`}
          >
            <p
              className={`text-lg leading-relaxed ${
                darkMode ? "text-stone-300" : "text-gray-700"
              }`}
            >
              At CULINARIA, we believe that culinary excellence should be
              accessible to everyone. Our mission is to provide a comprehensive
              platform that combines cutting-edge technology with culinary
              expertise to inspire and empower home cooks of all skill levels.
              We&apos;re committed to making professional-grade cooking tools,
              nutrition tracking, and meal planning accessible to everyone,
              everywhere.
            </p>
          </div>
        </div>

        {/* Features Section */}
        <AboutFeatures darkMode={darkMode} />

        {/* Team Section */}
        <AboutTeam darkMode={darkMode} />

        {/* Technology Section */}
        <AboutTech darkMode={darkMode} />

        {/* CTA Section */}
        <div className="text-center">
          <h2
            className={`text-3xl font-bold mb-4 bg-clip-text text-transparent ${
              darkMode
                ? "bg-gradient-to-r from-green-300 to-emerald-400"
                : "bg-gradient-to-r from-gray-900 to-gray-700"
            }`}
          >
            Ready to Master Your Culinary Skills?
          </h2>
          <p
            className={`text-lg mb-8 ${
              darkMode ? "text-stone-300" : "text-gray-600"
            }`}
          >
            Join thousands of home cooks who are already discovering, planning,
            and creating amazing meals with{" "}
            <span className="bg-gradient-to-r from-green-600 to-emerald-700 dark:from-green-400 dark:to-emerald-500 bg-clip-text text-transparent font-semibold">
              CULINARIA
            </span>
            .
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            <span
              className={
                darkMode
                  ? "text-white"
                  : "bg-gradient-to-r from-white to-gray-100 bg-clip-text text-transparent"
              }
            >
              Start Your Culinary Journey
            </span>
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>

        {/* Contact Section */}
        <AboutContact darkMode={darkMode} />
      </div>
    </div>
  );
};

export default About;
