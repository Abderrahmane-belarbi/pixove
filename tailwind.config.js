/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // ============================================
        // PIXOVE BRAND COLORS
        // ============================================
        // Primary Background - Deep Dark
        "dark-primary": "#0F0F11",
        // Card/Container Background - Dark Gray
        "card-primary": "#18181B",
        // Border/Divider - Medium Gray
        "border-primary": "#27272A",
        // Text/Label - Light Gray
        "gray-primary": "#A1A1AA",
        // Gradient Start - Purple
        "purple-primary": "#7C3AED",
        // Gradient Start - Orange
        "orange-primary": "#F97316",
        // Gradient End - Pink
        "pink-primary": "#EC4899",

        // ============================================
        // USAGE EXAMPLES
        // ============================================

        /**
         * Backgrounds:
         * - Main app background: bg-[#0F0F11]
         * - Cards/containers: bg-[#18181B]
         * - Glassmorphism: bg-[#0F0F11]/80 with backdrop-blur-xl
         *
         * Borders:
         * - Default borders: border-[#27272A]
         * - Focus/hover borders: border-[#7C3AED]
         *
         * Text:
         * - Primary text: text-white
         * - Secondary text: text-[#A1A1AA]
         *
         * Gradients:
         * - Primary gradient: bg-gradient-to-r from-[#7C3AED] to-[#F97316]
         * - Text gradient: bg-gradient-to-r from-[#7C3AED] to-[#F97316] bg-clip-text text-transparent
         *
         * Interactive States:
         * - Hover: hover:text-[#F97316] or hover:text-[#7C3AED]
         * - Active: active:scale-95
         *
         * Shadows:
         * - Card shadows: shadow-xl shadow-black/20
         * - Gradient shadows: shadow-lg shadow-purple-500/30
         * - Hover shadows: hover:shadow-xl hover:shadow-purple-500/40
         */
      },

      // ============================================
      // ADDITIONAL DESIGN TOKENS
      // ============================================

      borderRadius: {
        "pixove-sm": "1rem", // 16px - small elements
        "pixove-md": "1.5rem", // 24px - medium elements
        "pixove-lg": "2rem", // 32px - large cards
        "pixove-xl": "3rem", // 48px - hero elements
      },

      boxShadow: {
        "pixove-card": "0 10px 40px rgba(0, 0, 0, 0.2)",
        "pixove-float": "0 20px 60px rgba(0, 0, 0, 0.3)",
        "pixove-purple": "0 10px 40px rgba(124, 58, 237, 0.3)",
        "pixove-orange": "0 10px 40px rgba(249, 115, 22, 0.3)",
      },

      backdropBlur: {
        pixove: "24px",
      },

      fontFamily: {
        "sora-bold": ["Sora-Bold", "sans-serif"],
        "sora-semibold": ["Sora-SemiBold", "sans-serif"],
        inter: ["Inter-Regular", "sans-serif"],
        "inter-medium": ["Inter-Medium", "sans-serif"],
      },

      /**
       *  FONTS
       *  --------------------
       *  1) Sora — Bold (700)
       *  --------------------
       *  -Logo Font
       *  -App logo “Pixove”
       *  -Large hero titles (Onboarding headline)
       *  -Big promotional text
       *  ------------------------
       *  2) Sora — SemiBold (600)
       *  ------------------------
       *  -Headings / Screen Titles
       *  -Screen titles (Home, Search, Profile)
       *  -Section headers
       *  -Card titles if you want stronger hierarchy
       *  ------------------------
       *  3) Inter — Regular (400)
       *  ------------------------
       *  -Video descriptions
       *  -Usernames
       *  -Bio text
       *  -Input fields
       *  -Feed content
       *  -General UI copy
       *  ------------------------
       *  4) Inter — Medium (500)
       *  ------------------------
       *  -Button text
       *  -Stats (Followers, Likes, etc.)
       *  -Navigation labels
       */
    },
  },
  plugins: [],
};

/**
 * Complete color system:
 *
 * PRIMARY PALETTE:
 * ---------------
 * #0F0F11 - Main background (darkest)
 * #18181B - Card/container background
 * #27272A - Borders and dividers
 * #A1A1AA - Secondary text and icons
 * #FFFFFF - Primary text
 *
 * ACCENT PALETTE:
 * --------------
 * #7C3AED - Purple (gradient start, focus states)
 * #F97316 - Orange (gradient end, highlights)
 *
 * TAILWIND COLOR REFERENCES:
 * -------------------------
 * Purple variations: purple-500/30, purple-500/40 (for shadows)
 * Black variations: black/20 (for card shadows)
 *
 * GRADIENT COMBINATIONS:
 * ---------------------
 * - from-[#7C3AED] to-[#F97316] - Primary gradient
 * - from-transparent via-[#0F0F11]/50 to-[#0F0F11] - Image overlays
 *
 * OPACITY VARIATIONS:
 * ------------------
 * - /80 - Glassmorphism backgrounds
 * - /50 - Medium overlays
 * - /30 - Light shadows
 * - /20 - Subtle shadows
 * - /10 - Very subtle hover effects
 */
