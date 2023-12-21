const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      const fallback = webpackConfig.resolve.fallback || {};
      Object.assign(fallback, {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        assert: require.resolve('assert'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: require.resolve('os-browserify'),
        url: require.resolve('url'),
        fs: require.resolve('browserify-fs'),
        path: require.resolve('path-browserify'),
        zlib: require.resolve('browserify-zlib'),
      });
      webpackConfig.resolve.fallback = fallback;
      webpackConfig.plugins = (webpackConfig.plugins || []).concat([
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer'],
        }),
      ]);
    }
  },
  eslint: {
    enable: true,  /* TODO: change?  */
  },
    configure: {
      parser: '@babel/eslint-parser'
  },
  typescript: {
    enableTypeChecking: false /* TODO: change?  */
  },
  babel: {
    plugins: [
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      ['@babel/plugin-proposal-optional-chaining'],
      ['@babel/plugin-proposal-nullish-coalescing-operator'],
    ],
  },

};
