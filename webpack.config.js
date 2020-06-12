const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
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
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.scss$/,
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader,
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
        test: /\.(png|svg|jpg|gif)$/,
        use: [{
          loader: 'file-loader',
          options: { outputPath: 'images/', name: '[name].[ext]' }
        }]
      },
      {
        test: /\.(woff|woff2|ttf)$/,
        use: [{
          loader: 'file-loader',
          options: { outputPath: 'fonts/', name: '[name].[ext]' }
        }]
      },
      {
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' }
      }
    ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './public')
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new MiniCssExtractPlugin({ filename: 'style.css' }),
    new webpack.ProvidePlugin({
      $: 'jquery'
    })
  ],
  devtool: 'eval-source-map'
};