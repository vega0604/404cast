import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import jsconfigPaths from "vite-jsconfig-paths"


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), jsconfigPaths()],
})
