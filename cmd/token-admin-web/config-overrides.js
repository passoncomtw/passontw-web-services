const webpack = require('webpack');

module.exports = function override(config, env) {
  const plugins = [
    {
      test: /\.worker\.js$/,
      use: { loader: 'worker-loader' },
    },
    {
      test: /\.m?js$/,
      exclude: /(node_modules|bower_components)/,
      use: { loader: 'babel-loader' },
    },
  ];

  config.module.rules = [...config.module.rules, ...plugins];

  config.output.globalObject = 'this';

  // 修復 "process is not defined" 錯誤
  // 使用 DefinePlugin 將 process.env 替換為實際值
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env),
      'process.env.PUBLIC_URL': JSON.stringify(process.env.PUBLIC_URL || ''),
      'process.env.REACT_APP_BASE_PATH': JSON.stringify(
        process.env.REACT_APP_BASE_PATH || 'https://token-admin-api.passon.tw/'
      ),
    })
  );

  return config;
};
