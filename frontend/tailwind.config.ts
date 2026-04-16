import type { Config } from "tailwindcss";

const config: Config = {
  // ... other config
  theme: {
    extend: {
      // ... other extensions
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(-5%)', animationTimingFunction: 'cubic-bezier(0.8,0,1,1)' },
          '50%': { transform: 'none', animationTimingFunction: 'cubic-bezier(0,0,0.2,1)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        'fade-in-delay': 'fade-in 0.8s ease-out 0.4s both',
        'slide-in-right': 'slide-in-right 0.5s ease-out 1s both',
        'slide-in-left': 'slide-in-left 0.5s ease-out 1.2s both',
        'bounce-slow': 'bounce-slow 3s infinite',
      },
    },
  },
  plugins: [],
};
export default config;