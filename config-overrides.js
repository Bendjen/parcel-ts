const tsImportPluginFactory = require('ts-import-plugin')
const { getLoader } = require("react-app-rewired");
const path = require('path');

module.exports = function override(config, env) {

  // ts-import-plugin  按需载入antd
  const tsLoader = getLoader(
    config.module.rules,
    rule =>
      rule.loader &&
      typeof rule.loader === 'string' &&
      rule.loader.includes('ts-loader')
  );

  tsLoader.options = {
    getCustomTransformers: () => ({
      before: [tsImportPluginFactory({
        libraryDirectory: 'es',
        libraryName: 'antd',
        style: 'css',
      })]
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
  resolve.extensions = [...resolve.extensions, '.tsx']

  // 增加别名
  resolve.alias['@'] = path.resolve(__dirname, 'src')

  console.log(config.resolve)
  return config;
}