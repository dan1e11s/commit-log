import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        lib: {
            entry: 'src/index.ts',
            name: 'CommitLogWidget',
            fileName: 'widget',
            formats: ['iife']
        },
        outDir: '../public',
        emptyOutDir: false,
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
            },
        },
        rollupOptions: {
            output: {
                entryFileNames: 'widget.js',
            },
        },
    },
    css: {},
})
