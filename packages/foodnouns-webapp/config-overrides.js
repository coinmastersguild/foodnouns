const { override, babelInclude } = require('customize-cra');
const path = require('path');
const { ProvidePlugin } = require('webpack');

module.exports = override(
  babelInclude([
    path.resolve('src'),
    // path.resolve('node_modules/@svgr/webpack'),
  ]),
  (config) => {
    // const svgRule = config.module.rules.find((rule) =>
    //   rule.test && rule.test.toString().includes('svg')
    // );
    // if (svgRule) {
    //   svgRule.test = /\.(png|jpe?g|gif|webp)$/;
    //
    //   config.module.rules.unshift({
    //     test: /\.svg$/,
    //     use: [
    //       {
    //         loader: require.resolve('@svgr/webpack'),
    //         options: {
    //           throwIfNamespace: false,
    //         },
    //       },
    //     ],
    //   });
    // }

    config.module.rules[1].oneOf.splice(0, 0, {
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    })

    config.resolve = {
      ...config.resolve,
      alias: { ...config.resolve.alias, stream: 'stream-browserify' },
    };


    // Webpack 5 no longer bundles polyfills for default Node modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      assert: false,
      tls: false,
      net: false,
      os: require.resolve('os-browserify'),
      stream: require.resolve('stream-browserify'),
      url: require.resolve("url"),
      crypto: require.resolve('crypto-browserify'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      fs: require.resolve('browserify-fs'),
      path: require.resolve('path-browserify'),
      zlib: require.resolve('browserify-zlib'),
    };

    // Also provide polyfills for some Node globals.
    config.plugins = [
      ...(config.plugins ?? []),
      new ProvidePlugin({
        Buffer: ['buffer/', 'Buffer'],
        process: ['process/browser.js'],
      }),
    ];

    return config;
  }
);
