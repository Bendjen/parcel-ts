const tsImportPluginFactory = require("ts-import-plugin");
const { getLoader } = require("react-app-rewired");
const path = require("path");
const webpack = require("webpack");

module.exports = function override(config, env) {
  // ts-import-plugin  按需载入antd
  const tsLoader = getLoader(
    config.module.rules,
    rule =>
      rule.loader &&
      typeof rule.loader === "string" &&
      rule.loader.includes("ts-loader")
  );

  tsLoader.options = {
    getCustomTransformers: () => ({
      before: [
        tsImportPluginFactory({
          libraryDirectory: "es",
          libraryName: "antd",
          style: "css"
        })
      ]
    })
  };

  // sass-loader
  const loaderList = config.module.rules[1].oneOf;
  loaderList.splice(loaderList.length - 1, 0, {
    test: /\.scss$/,
    use: ["style-loader", "css-loader", "sass-loader"]
  });

  // 增加tsx作为默认值
  const resolve = config.resolve;
  resolve.extensions = [...resolve.extensions, ".tsx", ".ts"];

  // 增加别名
  resolve.alias["@"] = path.resolve(__dirname, "src");

  // 抽取公共chunk
  const plugins = config.plugins;
  plugins.push(
    new webpack.optimize.CommonsChunkPlugin({
      name: "commons", // 这公共代码的chunk名为'commons'
      filename: "[name].bundle.js", // 生成后的文件名，虽说用了[name]，但实际上就是'commons.bundle.js'了
      minChunks: 3 // 设定要有4个chunk（即4个页面）加载的js模块才会被纳入公共代码。这数目自己考虑吧，我认为3-5比较合适。
    })
  );

  // 公用通过externals从外链引入
  config.externals = {
    'react': 'React',
    'react-dom': 'ReactDOM',
  }

  // 打包后的默认publicPath为'/',这就导致了在gitPage部署时，引入的静态资源都是从域名根目录去引用，而不是当前html的相对位置
  if (env == 'production') {
    config.output.publicPath = '';
  }



  return config;
};
