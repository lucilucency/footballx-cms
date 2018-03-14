/**
 * Webpack configuration file
 * */
/* eslint-disable no-nested-ternary */
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const postcssImport = require('postcss-import');
const postcssCssNext = require('postcss-cssnext');
// eslint-disable-next-line import/no-extraneous-dependencies
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';

function HashBundlePlugin() {
}

HashBundlePlugin.prototype.apply = (compiler) => {
  compiler.plugin('done', (statsData) => {
    const stats = statsData.toJson();
    const htmlFileName = 'index.html';
    const html = fs.readFileSync(path.join(__dirname, htmlFileName), 'utf8');
    const htmlOutput = html.replace(/\/build\/.?bundle\.js/, `/build/bundle.js?h=${stats.hash}`);
    fs.writeFileSync(path.join(__dirname, htmlFileName), htmlOutput);
  });
};

const config = {
  node: {
    fs: 'empty',
  },
  entry: ['babel-polyfill', path.resolve(__dirname, 'src')],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
    publicPath: 'build/',
  },
  resolve: {
    extensions: ['.jsx', '.js', '.css', '.json'],
    modules: [
      path.resolve(__dirname, 'src'),
      path.resolve(__dirname, 'assets'),
      path.resolve(__dirname, 'node_modules'),
    ],
  },
  context: __dirname,
  module: {
    rules: [{
      test: /\.css$/,
      loader: 'style-loader!css-loader?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]!postcss-loader',
      exclude: /node_modules\/c3/,
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader',
      include: /node_modules\/c3/,
    }, {
      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'url-loader?limit=10000&minetype=application/font-woff&name=[hash].[ext]',
    }, {
      test: /\.(ttf|eot|svg|jpg|gif|png)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'file-loader?name=[hash].[ext]',
    }, {
      test: /\.(js|jsx)$/,
      exclude: /(node_modules)/,
      loader: 'babel-loader',
    }],
    loaders: [{
      test: /\.es6$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015', 'react'],
      },
    }],
  },
  plugins: [
    isTest && new BundleAnalyzerPlugin(),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [
          postcssImport({
            addDependencyTo: webpack,
          }),
          postcssCssNext(),
        ],
      },
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      FX_API: JSON.stringify(isProd ? 'http://web-api.ttab.me' : isDev ? 'http://dev.ttab.me:51168' : isTest ? 'http://web-api.ttab.me' : 'http://localhost:51168'),
      FX_VERSION: JSON.stringify(process.env.FX_VERSION || 'v1'),
      FX_SOCKET: JSON.stringify(isProd || isTest ? 'http://prod.ttab.me:51170/' : 'http://dev.ttab.me:51170/'),
    }),
  ].filter(o => o),
  devServer: {
    contentBase: __dirname,
    host: '0.0.0.0',
    disableHostCheck: true,
    port: Number(process.env.PORT) || 1210,
    historyApiFallback: true,
    compress: true,
  },
};

if (!isProd) {
  config.devtool = 'eval-source-map';
  config.entry = [
    'react-hot-loader/patch',
    `webpack-dev-server/client?http://${config.devServer.host}:${config.devServer.port}`,
    'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
    'babel-polyfill',
    path.resolve(__dirname, 'src'),
  ];

  config.plugins.push(new webpack.NamedModulesPlugin());
} else {
  // config.plugins.push(new webpack.optimize.DedupePlugin());
  config.plugins.concat([
    new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      compress: {
        warnings: false, // Suppress uglification warnings
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        screw_ie8: true,
      },
      output: {
        comments: false,
      },
      exclude: [/\.min\.js$/gi], // skip pre-minified libs
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0,
    }),
  ]);
}

module.exports = config;
