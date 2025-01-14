import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       '/user': {
//         target: 'http://localhost:3007',
//         changeOrigin: true,
//         secure: false,
//         ws: true,
//         rewrite: (path) => path
//       },
//       '/uploads': {
//         target: 'http://localhost:3007',
//         changeOrigin: true,
//         secure: false,
//         ws: true
//       }
//     }
//   }
// })

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/user': {
        target: 'http://localhost:3000',  // Change this to 3000
        changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: (path) => path
      },
      '/uploads': {
        target: 'http://localhost:3000',  // Change this to 3000
        changeOrigin: true,
        secure: false,
        ws: true
      }
    }
  }
})