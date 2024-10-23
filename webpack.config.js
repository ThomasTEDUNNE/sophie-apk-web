const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync({
    ...env,
    babel: {
      dangerouslyAddModulePathsToTranspile: ['@ui-kitten/components']
    }
  }, argv);

  // Fallbacks pour les polyfills manquants
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "crypto": false,
    "vm": false,
    "stream": require.resolve("stream-browserify"),
    "buffer": require.resolve("buffer/")
  };

  // Optimisation de la taille du bundle
  config.optimization = {
    ...config.optimization,
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
          },
          mangle: true,
        },
      }),
    ],
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
      maxSize: 244000,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      automaticNameDelimiter: '~',
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  };

  return config;
};