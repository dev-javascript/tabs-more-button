import {terser} from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
const pkg = require('./package.json');
const Config = ({en, inputPath = '', outputFile = 'more-tabs', outputName = 'moreTabs', pf = false}) => {
    var pfName = pf ? '.including-polyfills' : '';
    return {
      input: `lib/${pf ? 'esm-including-polyfills' : 'esm'}/${inputPath}api.js`,
      output: {
        file: `dist/${outputFile}${en === 'dev' ? '' : '.min'}.js`,
        format: 'umd',
        name: outputName,
        sourcemap: true,
        banner:
          '' +
          `/**
 * ${pkg.name} - ${pkg.description}
 *
 * @version v${pkg.version}
 * @homepage ${pkg.homepage}
 * @author ${pkg.author.name} ${pkg.author.email}
 * @license ${pkg.license}
 */`,
      },
      plugins: (function () {
        const _plugins = [
          nodeResolve({
            //  preferBuiltins: false
          }),
          commonjs(),
        ];
        if (en === 'prod') {
          _plugins.push(terser());
        }
        return _plugins;
      })(),
      external: function (id) {
        return /.test.js$/g.test(id);
      },
    };
  },
  ConfigFactory = (op) => [Config({en: 'dev', ...op}), Config({en: 'prod', ...op})];
export default ConfigFactory();