const path = require('path');
const { override, babelInclude } = require('customize-cra');
const { ProvidePlugin } = require('webpack');
const fs = require('fs');
const ssri = require('ssri');

const buildPath = path.resolve(__dirname)

// The HTML template can pull in static assets from outside of the Webpack
// pipeline; these need SRI too. This generates SRI attributes for each static
// asset, exporting them as predictably-named REACT_APP_SRI_FILENAME_EXT
// environment variables that can be used in the template.
const publicPath = path.join(buildPath, 'public')
for (const dirent of fs.readdirSync(publicPath, { withFileTypes: true })) {
  if (!dirent.isFile()) continue
  const mungedName = dirent.name
    .toUpperCase()
    .split('')
    .map(x => (/^[0-9A-Z]$/.test(x) ? x : '_'))
    .join('')
  const data = fs.readFileSync(path.join(publicPath, dirent.name))

  const integrity = ssri.fromData(data, {
    strict: true,
    algorithms: ['sha256'],
  })
  process.env[`REACT_APP_SRI_${mungedName}`] = integrity.toString()
}

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
