const { override, babelInclude } = require('customize-cra');
const path = require('path');

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
      "crypto-browserify": false
    };

    return config;
  }
);
