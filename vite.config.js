// vite.config.js
import vitePluginString from 'vite-plugin-string'

export default {
  plugins: [
    vitePluginString({
        include: [
          '**/*.vs',
          '**/*.fs',
          '**/*.vert',
          '**/*.frag',
          '**/*.glsl',
        ],
        exclude: 'node_modules/**',
      })
  ]
}