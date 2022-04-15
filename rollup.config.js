import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import typescript2 from 'rollup-plugin-typescript2';

/**
 * @type { import('rollup').RollupOptions }
 */
const RollUpConfig = {
  input: 'src/index.ts',
  output: [
    {
      file: './dist/index.es.js',
      format: 'esm',
    },
    {
      name: 'v3-mhooks',
      file: './dist/index.cjs.js',
      format: 'commonjs',
      exports: 'named',
    },
    {
      name: 'v3-mhooks',
      file: './dist/mhooks.min.js',
      format: 'umd',
      exports: 'named',
      extend: true,
      plugins: [terser()],
      globals: {
        vue: 'Vue',
      },
    },
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript2({
      tsconfigOverride: {
        exclude: ['node_modules', '**/__tests__/**/*', 'example', 'script'],
      },
      useTsconfigDeclarationDir: true,
    }),
    babel({
      extensions: ['js', 'ts', 'tsx'],
      babelHelpers: 'runtime',
      configFile: './babel.config.js',
      exclude: [/core-js/],
    }),
  ],
  external: ['vue'],
};
export default RollUpConfig;
