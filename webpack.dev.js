const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.common");

const devConfig = {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    host: "0.0.0.0",
    open: true,
    port: 8080,
    allowedHosts: ["all"],
    hot: true,
    useLocalIp: true,
    watchContentBase: true,
  },
};

module.exports = merge(commonConfig, devConfig);
