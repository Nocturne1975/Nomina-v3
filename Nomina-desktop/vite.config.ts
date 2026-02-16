import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig(({ mode }) => ({
	plugins: [react()],
	// Electron/file:// a besoin de chemins relatifs (./). Le src préfère '/'.
	base: mode === 'src' ? '/' : './',
}));
