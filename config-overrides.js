const { override, addWebpackPlugin, overrideDevServer, addBabelPreset, addBabelPlugin } = require('customize-cra');
const webpack = require('webpack');

const disableEslintPlugin = (config) => {
  config.plugins = config.plugins.filter(
    (plugin) => plugin.constructor.name !== 'ESLintWebpackPlugin'
  );
  return config;
};

const devServerConfig = () => config => {
  return {
    ...config,
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }
      return middlewares;
    },
    // Disable the deprecation warnings
    onBeforeSetupMiddleware: undefined,
    onAfterSetupMiddleware: undefined,
  }
}

module.exports = {
  webpack: override(
    disableEslintPlugin,
    addBabelPreset('@babel/preset-react'),
    addBabelPlugin('@babel/plugin-proposal-class-properties'),
    addBabelPlugin('@babel/plugin-transform-runtime'),
    addBabelPlugin('@babel/plugin-transform-class-static-block'),
    addBabelPlugin('@babel/plugin-transform-private-methods'),
    (config) => {
      // Disable deprecation warnings
      config.ignoreWarnings = [/DEP_/];
      // Ensure that Babel processes JS files
      config.module.rules[1].oneOf.forEach(rule => {
        if (rule.loader && rule.loader.includes('babel-loader')) {
          rule.options.presets = [
            ['@babel/preset-env', { modules: false }],
            '@babel/preset-react'
          ];
          rule.options.plugins = [
            '@babel/plugin-proposal-class-properties',
            '@babel/plugin-transform-runtime',
            '@babel/plugin-transform-class-static-block',
            '@babel/plugin-transform-private-methods'
          ];
        }
      });
      return config;
    }
  ),
  devServer: overrideDevServer(devServerConfig())
};
