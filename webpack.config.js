const path = require("path");

module.exports = {
  mode: "production",
  entry: {
    bundle: path.resolve(__dirname, "src/index.js"),
    profile: path.resolve(__dirname, "src/profile.js"),
    dashboard: path.resolve(__dirname, "src/dashboard.js"),
    tasks: path.resolve(__dirname, "src/tasks.js"),
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",

    assetModuleFilename: "[name][ext]",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
};
