// Marcelo Andrés Mendoza 2023
import { defineConfig } from 'astro/config';
const devMode = import.meta.env.DEV;
let siteURL = 'https://marceloandresmendoza.github.io';
let siteBase = 'weather-report';
if (devMode) {
    siteURL = 'http://localhost:3000';
    siteBase = '';
}


// https://astro.build/config
export default defineConfig({
    site: siteURL,
    base: siteBase,
    output: 'static',
    outDir: './docs',
    build: {
        assets: 'astro'
    }
});
