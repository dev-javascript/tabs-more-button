const webpack = require('webpack');
const path = require('path');
const pkg = require('./package.json');
module.exports = (env) => {
  const isProduction = env === 'production';
  const watch = process.env.WATCH === 'true';
  return {
    entry: {
      'tabs-more-button': watch ? './src/api.js' : './lib/esm/api.js',
    },
    optimization: {
      removeAvailableModules: true,
      removeEmptyChunks: true,
      flagIncludedChunks: true,
    },
    plugins: [
      new webpack.optimize.ModuleConcatenationPlugin(),
      new webpack.BannerPlugin({
        raw: true,
        banner: `/**
 * ${pkg.name} - ${pkg.description}
 *
 * @version v${pkg.version}
 * @homepage ${pkg.homepage}
 * @author ${pkg.author.name} ${pkg.author.email}
 * @license ${pkg.license}
 */`,
        entryOnly: true,
      }),
    ],
    watch,
    output: {
      filename: `[name]${isProduction ? '.min' : ''}.js`,
      path: path.resolve(__dirname, 'dist'),
      library: 'tabsMoreButton',
      libraryTarget: 'umd',
      publicPath: '/dist/',
      umdNamedDefine: true,
    },
    devtool: 'source-map',
    mode: env,
    module: {
      rules: [
        watch
          ? {
              test: /\.m?js$/,
              exclude: /(node_modules)/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: [['@babel/preset-env', {loose: true, modules: false}]],
                },
              },
            }
          : {},
      ],
    },
  };
};
