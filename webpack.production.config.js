var webpack = require('webpack');
var path = require('path');

module.exports = {
  context: __dirname + '/src',
  entry: {
    javascript: "./app.js"
  },
  output: {
    filename: "app.js",
    path: __dirname + "/public/assets/",
  },
  resolve: {
      extensions: ['', '.js', '.scss'],
  },
  module: {
      loaders: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loaders: ["react-hot", "babel-loader"]
          },
          { test: /\.jsx?$/, exclude: /node_modules/, loaders: ['babel-loader'] },
          {
            test: /\.scss$/,
            loader: 'style!css!sass'
          }
        ]
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ]
};
