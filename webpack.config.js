/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable jsdoc/valid-types */
/* eslint-disable spaced-comment */
/* eslint-disable jsdoc/check-tag-names */

const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

/** @typedef {import('webpack').Configuration} WebpackConfig */

/** @type WebpackConfig */
const extensionConfig = {
  target: "node",
  mode: "none",

  entry: "./src/extension.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "extension.js",
    libraryTarget: "commonjs2",
  },
  externals: {
    vscode: "commonjs vscode",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /(node_modules|*\.spec\.ts)/,
        use: [
          {
            loader: "ts-loader",
          },
        ],
      },
      {
        test: /resources\/*/,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
    ],
  },
  devtool: "nosources-source-map",
  infrastructureLogging: {
    level: "log",
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: ".",
          to: "resources",
          context: "resources",
        },
      ],
    }),
  ],
};
module.exports = [extensionConfig];
