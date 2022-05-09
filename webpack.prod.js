const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.common");

String.prototype.replaceAllOccurence = function (str1, str2, ignore) {
  return this.replace(
    new RegExp(
      str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"),
      ignore ? "gi" : "g"
    ),
    typeof str2 == "string" ? str2.replace(/\$/g, "$$$$") : str2
  );
};
const prodConfig = {
  mode: "production",
};

module.exports = merge(commonConfig, prodConfig);
