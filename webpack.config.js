const path = require('path');
const webpack = require('webpack');
const rtlcss = require('rtlcss');

module.exports = {
  entry: './src/main.js',
  mode: 'development',
  module: {
    rules: [
      /* {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: { presets:['env'] }
        }]
      }, */
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          { loader: 'postcss-loader', options: {plugins: [rtlcss]} },
          'sass-loader',
        ],
      },
      {
        test: /\.htm$/,
        loader: 'html-loader',
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: { name: '[name].[ext]', outputPath: 'fonts/' }
        }]
      }
    ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './public')
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery'
    })
  ]
};