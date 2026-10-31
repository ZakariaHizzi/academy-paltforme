import type { Config } from "tailwindcss";

/**
 * Veritas University — "Academic Prestige" design tokens.
 * Mirrors the Stitch design system for project
 * "University Academic Portal System" (projects/17475896972585817199) 1:1.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-fixed-dim": "#aec7f7",
        surface: "#faf8ff",
        "surface-variant": "#dae2fd",
        "on-primary-container": "#87a0cd",
        "primary-container": "#1b365d",
        "on-tertiary-fixed": "#001e2e",
        "on-tertiary": "#ffffff",
        "primary-fixed": "#d6e3ff",
        "surface-tint": "#465f88",
        "tertiary-container": "#15394e",
        "tertiary-fixed-dim": "#a9cbe5",
        "inverse-primary": "#aec7f7",
        outline: "#74777f",
        "surface-bright": "#faf8ff",
        "surface-container-low": "#f2f3ff",
        "on-tertiary-fixed-variant": "#284a60",
        "surface-container-lowest": "#ffffff",
        background: "#faf8ff",
        "secondary-fixed": "#ffdea5",
        "surface-dim": "#d2d9f4",
        "inverse-surface": "#283044",
        "on-background": "#131b2e",
        "on-tertiary-container": "#81a3bc",
        "on-error": "#ffffff",
        "on-primary": "#ffffff",
        "outline-variant": "#c4c6cf",
        tertiary: "#002335",
        error: "#ba1a1a",
        "on-primary-fixed-variant": "#2e476f",
        "on-surface-variant": "#44474e",
        "surface-container": "#eaedff",
        primary: "#002046",
        "on-error-container": "#93000a",
        "tertiary-fixed": "#c8e6ff",
        "error-container": "#ffdad6",
        "on-secondary-fixed": "#261900",
        "surface-container-high": "#e2e7ff",
        "on-primary-fixed": "#001b3d",
        "inverse-on-surface": "#eef0ff",
        "on-surface": "#131b2e",
        secondary: "#775a19",
        "on-secondary-container": "#785a1a",
        "secondary-fixed-dim": "#e9c176",
        "on-secondary": "#ffffff",
        "surface-container-highest": "#dae2fd",
        "on-secondary-fixed-variant": "#5d4201",
        "secondary-container": "#fed488",
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        full: "0.75rem",
      },
      spacing: {
        "margin-sm": "1rem",
        "space-lg": "1.5rem",
        "space-sm": "0.5rem",
        "space-md": "1rem",
        margin: "2rem",
        gutter: "1.5rem",
        "space-xl": "2.5rem",
        "gutter-sm": "1rem",
        "space-xs": "0.25rem",
      },
      fontFamily: {
        "label-md": ["Inter"],
        "body-lg": ["Inter"],
        "body-md": ["Inter"],
        "title-md": ["Inter"],
        "label-mono": ["Inter"],
        "headline-lg-mobile": ["Merriweather"],
        "body-sm": ["Inter"],
        "headline-lg": ["Merriweather"],
        "headline-xl": ["Merriweather"],
        "label-lg": ["Inter"],
        "headline-md": ["Merriweather"],
        "headline-xl-mobile": ["Merriweather"],
        "headline-sm": ["Merriweather"],
      },
      fontSize: {
        "label-md": [
          "0.75rem",
          { lineHeight: "1rem", letterSpacing: "0.05em", fontWeight: "600" },
        ],
        "body-lg": ["1.0625rem", { lineHeight: "1.625rem", fontWeight: "400" }],
        "body-md": ["0.9375rem", { lineHeight: "1.4375rem", fontWeight: "400" }],
        "title-md": [
          "1.125rem",
          {
            lineHeight: "1.5rem",
            letterSpacing: "-0.01em",
            fontWeight: "600",
          },
        ],
        "label-mono": [
          "0.75rem",
          { lineHeight: "1rem", letterSpacing: "0.02em", fontWeight: "500" },
        ],
        "headline-lg-mobile": [
          "1.5rem",
          {
            lineHeight: "2rem",
            letterSpacing: "-0.01em",
            fontWeight: "700",
          },
        ],
        "body-sm": ["0.8125rem", { lineHeight: "1.25rem", fontWeight: "400" }],
        "headline-lg": [
          "2rem",
          {
            lineHeight: "2.625rem",
            letterSpacing: "-0.015em",
            fontWeight: "700",
          },
        ],
        "headline-xl": [
          "2.5rem",
          {
            lineHeight: "3.25rem",
            letterSpacing: "-0.02em",
            fontWeight: "700",
          },
        ],
        "label-lg": [
          "0.875rem",
          {
            lineHeight: "1.25rem",
            letterSpacing: "0.01em",
            fontWeight: "600",
          },
        ],
        "headline-md": ["1.5rem", { lineHeight: "2.125rem", fontWeight: "400" }],
        "headline-xl-mobile": [
          "1.875rem",
          {
            lineHeight: "2.5rem",
            letterSpacing: "-0.01em",
            fontWeight: "700",
          },
        ],
        "headline-sm": ["1.25rem", { lineHeight: "1.75rem", fontWeight: "700" }],
      },
    },
  },
  plugins: [],
};

export default config;
