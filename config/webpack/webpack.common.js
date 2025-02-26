const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = (env) => {
  const isProduction = env.production;

  return {
    entry: './src/index.tsx',
    output: {
      path: path.resolve(__dirname, '../../dist'),
      filename: '[name].[contenthash].js',
      publicPath: isProduction ? './' : '/',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      alias: {
        '@': path.resolve(__dirname, '../../src'),
      },
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: 'ts-loader',
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/[name].[hash][ext]',
          },
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [require('tailwindcss'), require('autoprefixer')],
                },
              },
            },
          ],
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
        {
          test: /\.md$/,
          use: 'raw-loader',
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
      }),
      new ESLintPlugin({
        extensions: ['ts', 'tsx', 'js'],
        failOnError: false,
      }),
    ],
  };
};
