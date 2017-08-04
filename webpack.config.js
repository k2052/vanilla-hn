const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const Visualizer = require('webpack-visualizer-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: './src/client',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'assets/bundle.js',
    publicPath: '',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader', options: { importLoaders: 1 } },
            'postcss-loader',
          ],
        }),
      },
    ],
  },
  devServer: {
    contentBase: [path.join(__dirname, 'public'), path.join(__dirname, 'dist')],
    compress: true,
    port: 9000,
  },
  plugins: [
    new Visualizer(),
    new HtmlWebpackPlugin({
      title: 'Vanilla HN',
      filename: 'index.html',
      template: 'src/templates/dist.ejs',
    }),
    new ExtractTextPlugin('assets/[name].css'),
  ],
}
