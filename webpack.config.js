const path = require('path');
const pkg = require('./package.json');
module.exports = (env) => {
  const isProduction = env === 'production';
  return {
    entry: {
      'tabs-more-button': './src/api.js',
    },
    output: {
      filename: `[name]${isProduction ? '.min' : ''}.js`,
      path: path.resolve(__dirname, 'build'),
      library: 'tabsMoreButton',
      libraryTarget: 'umd',
      publicPath: '/build/',
      umdNamedDefine: true,
    },
    devtool: isProduction ? 'source-map' : 'inline-source-map',
    mode: env,
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
          },
        },
      ],
    },
    resolve: {
      alias: {
        assets: path.resolve(__dirname, 'assets'),
      },
    },
  };
};
