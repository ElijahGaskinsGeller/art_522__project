import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
	base: "./",

	build: {
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'index.html'),
				page_2: resolve(__dirname, 'page_2.html'),
				page_3: resolve(__dirname, 'page_3.html'),
				page_4: resolve(__dirname, 'page_4.html'),
			},
		},
	},
})
