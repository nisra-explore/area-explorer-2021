/** @type {import('@sveltejs/kit').Config} */
import adapter from '@sveltejs/adapter-static';

const production = process.env.NODE_ENV === 'production';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const config = {
	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		adapter: adapter({
			// Options below are defaults
			pages: 'build',
			assets: 'build',
			fallback: '404.html'
		}),
		paths: {
				assets: production ? 'https://explore.nisra.gov.uk/area-explorer-2021' : '',
				base: production ? '/area-explorer-2021' : ''
		}
	}
};

export default config;
