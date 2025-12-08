import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    plugins: [react(), tailwindcss()],
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    // Vendor chunks - separate large libraries
                    'vendor-react': ['react', 'react-dom', 'react-router-dom'],
                    'vendor-charts': ['recharts'],
                    'vendor-forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
                    'vendor-ui': [
                        '@radix-ui/react-dialog',
                        '@radix-ui/react-select',
                        '@radix-ui/react-tabs',
                        '@radix-ui/react-checkbox',
                        '@radix-ui/react-slider',
                        '@radix-ui/react-popover',
                        '@radix-ui/react-label',
                        '@radix-ui/react-radio-group',
                        '@radix-ui/react-separator',
                        '@radix-ui/react-toggle',
                        '@radix-ui/react-slot',
                        'react-day-picker',
                    ],
                    'vendor-i18n': ['i18next', 'react-i18next'],
                    'vendor-utils': ['date-fns', 'clsx', 'tailwind-merge', 'class-variance-authority'],
                },
            },
        },
        // Increase chunk size warning limit to 1000kb (was causing warning at 500kb)
        chunkSizeWarningLimit: 1000,
    },
})
