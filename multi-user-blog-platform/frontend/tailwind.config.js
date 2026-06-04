/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: '#165DFF',
				secondary: '#FF7D00',
				dark: '#1F2937',
				light: '#F9FAFB'
			},
			fontFamily: {
				display: ['Playfair Display', 'serif'],
				body: ['Source Sans Pro', 'sans-serif']
			}
		}
	},
	plugins: []
};
