import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
        plugins: [sveltekit()],

        server: {
                    fs: {
                        allow: ['data_jsons']
                    }
                }
};



export default config;