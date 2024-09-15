const { override, addWebpackPlugin, overrideDevServer } = require('customize-cra');
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
    (config) => {
      // Disable deprecation warnings
      config.ignoreWarnings = [/DEP_/];
      return config;
    }
  ),
  devServer: overrideDevServer(devServerConfig())
};
