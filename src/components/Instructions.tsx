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

import { cleanInstruction, isMeaningfulStep } from "../utils/textFormatters";

interface InstructionsProps {
  instructions: string;
  darkMode: boolean;
}

function Instructions({ instructions, darkMode }: InstructionsProps) {
  if (!instructions) return null;

  const steps = instructions
    .split(/\r?\n/)
    .map((step: string) => cleanInstruction(step))
    .filter(isMeaningfulStep);

  return (
    <div className="instructions-section p-4 sm:p-6 my-4 rounded-lg shadow-lg bg-card border border-border relative">
      {/* Paper texture overlay - removed for true black background */}
      <div className="relative z-10">
        <h3
          className={`text-2xl md:text-3xl lg:text-4xl font-black leading-tight mb-6 tracking-tight ${
            darkMode ? "text-green-300" : "text-green-900"
          }`}
        >
          Method
        </h3>

        <ol className="compact-list-compact">
          {steps.map((step: string, idx: number) => (
            <li key={idx} className="flex items-start min-w-0">
              <span className="bg-amber-600 text-white rounded-full w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 flex items-center justify-center text-xs sm:text-sm lg:text-base font-bold mr-3 mt-0.5 flex-shrink-0 shadow-sm">
                {idx + 1}
              </span>
              <span className="text-sm sm:text-base lg:text-lg break-words leading-relaxed overflow-hidden text-card-foreground">
                {step}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
export default Instructions;

