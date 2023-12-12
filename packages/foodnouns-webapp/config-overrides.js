const { override, babelInclude } = require('customize-cra');
const path = require('path');
const { ProvidePlugin } = require('webpack');

module.exports = override(
  babelInclude([
    path.resolve('src'),
    path.resolve('node_modules/@svgr/webpack'),
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
      fs: false, // ignore 'fs' module from sdk
      zlib: require.resolve('browserify-zlib'),
      tls: false,
      net: false,
      path: false,
      http: false,
      https: false,
      // stream: false,
      crypto: false,
      "crypto-browserify": false,
      // crypto: require.resolve('crypto-browserify'),
      // http: require.resolve('stream-http'),
      // https: require.resolve('https-browserify'),
      // fs: require.resolve('browserify-fs'),
      os: false, //require.resolve('os-browserify'),
      // path: require.resolve('path-browserify'),
      stream: require.resolve('stream-browserify'),
      url: false //webpack < 5 used to include polyfills for node.js core modules by default,
      // resolve.fallback: { "url": require.resolve("url/") }' is another option if we need it
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
