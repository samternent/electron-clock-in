var webpack = require('webpack');
var path = require('path');

module.exports = {
  devtool: 'source-map',
  context: __dirname + '/src',
  entry: {
    javascript: "./app.js"
  },
  output: {
    filename: "src/bundle.js",
    path: path.resolve(__dirname, "/app/"),
    publicPath: "/",
  },
  resolve: {
      extensions: ['', '.js', '.scss'],
  },
  node: {
    fs: "empty"
  },
  module: {
      loaders: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loaders: ["react-hot", "babel-loader"]
          },
          {
            test: /\.scss$/,
            loader: 'style!css!sass'
          }
        ]
  },
  plugins: [
    new webpack.NoErrorsPlugin()
  ]
};
