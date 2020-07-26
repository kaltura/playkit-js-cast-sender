'use strict';

const webpack = require('webpack');
const path = require('path');
const packageData = require('./package.json');

const plugins = [
  new webpack.DefinePlugin({
    __VERSION__: JSON.stringify(packageData.version),
    __NAME__: JSON.stringify(packageData.name)
  })
];

module.exports = {
  context: __dirname + '/src',
  entry: {
    'playkit-cast-sender': 'index.js'
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].js',
    library: ['KalturaPlayer', 'cast', 'sender'],
    libraryTarget: 'umd',
    umdNamedDefine: true,
    devtoolModuleFilenameTemplate: './cast/sender/[resource-path]'
  },
  devtool: 'source-map',
  plugins: plugins,
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader'
          }
        ],
        exclude: [/node_modules/]
      },
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        enforce: 'pre',
        use: [
          {
            loader: 'eslint-loader',
            options: {
              rules: {
                semi: 0
              }
            }
          }
        ]
      }
    ]
  },
  devServer: {
    contentBase: __dirname + '/src'
  },
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  },
  externals: {
    'kaltura-player-js': {
      commonjs: 'kaltura-player-js',
      commonjs2: 'kaltura-player-js',
      amd: 'kaltura-player-js',
      root: ['KalturaPlayer']
    }
  }
};
