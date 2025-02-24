
import { defineConfig } from 'vite'
import path, { resolve } from 'path'
import fs from 'fs'

export default defineConfig({

	//base: "./"
	build: {

		rollupOptions: {

			input: {
				page_1: resolve(__dirname, "index.html"),
				page_2: resolve(__dirname, "page_2.html")
			}

		}
	}

})
