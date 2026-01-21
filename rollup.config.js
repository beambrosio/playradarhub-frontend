import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import esbuild from '@rollup/plugin-esbuild';

export default {
  input: 'src/index.js', // adjust if your entry is different
  output: {
    dir: 'dist',
    format: 'esm',
    sourcemap: true,
  },
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      preventAssignment: true,
    }),
    resolve({
      browser: true,
      extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'],
    }),
    commonjs(),
    esbuild({
      target: 'es2017',
      jsx: 'automatic',
      minify: process.env.NODE_ENV === 'production', // use esbuild minifier instead of terser
      loaders: {
        '.js': 'jsx',
        '.jsx': 'jsx',
        '.ts': 'ts',
        '.tsx': 'tsx',
      },
    }),
  ],
};
