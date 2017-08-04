const path = require('path')

module.exports = {
  entry: './src/server',
  output: {
    path: path.resolve(__dirname, 'build/server'), // string
    filename: 'bundle.js', // string
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
    ],
  },

  target: 'node',
}
