import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Colores principales más modernos
        primary: {
          DEFAULT: '#2D3E40', // Verde azulado profundo (más oscuro)
          light: '#4A5F62',
          dark: '#1A2728',
        },
        secondary: {
          DEFAULT: '#FF9B9B', // Coral rosado vibrante (muy K-Beauty)
          light: '#FFB8B8',
          dark: '#E87B7B',
        },
        accent: {
          DEFAULT: '#C8B6A6', // Beige neutro sofisticado
          light: '#E5D9CC',
          dark: '#A89681',
        },
        // Fondos - Menos crema, más blanco
        background: {
          cream: '#FBE0C3', // Solo para acentos
          light: '#FEFDFB', // Casi blanco con tono cálido
          white: '#FFFFFF',
          gray: '#F8F9FA',
        },
        // Superficie y contenedores
        surface: {
          DEFAULT: '#FFFFFF',
          hover: '#FFF9F5',
          dark: '#2D3E40',
        },
        // Colores de estado
        success: '#7BC67E',
        warning: '#FFB74D',
        error: '#F06292',
        info: '#64B5F6',
      },
      fontFamily: {
        display: ['var(--font-space-grotesk)', 'sans-serif'],
        sans: ['var(--font-space-grotesk)', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.6s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
};

export default config;
