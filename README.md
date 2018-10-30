#  本项目用于ts重写parcel项目
   https://bendjen.github.io/parcel-ts/
##  npm install  用cnpm可能会有ts重复声明的问题
#  以下为构建中遇到的问题记录

### 1.create-react-app脚手架自定义配置webpack的方法

  "react-app-rewired"将config-overrides.js中的配置插入默认的配置
  参考链接：https://ant.design/docs/react/use-in-typescript-cn

### 2.typeScript中使用cssModule时引入声明

  定义style.d.ts文件作声明

### 3.将页面布到gitPage时，引用的静态资源为域名下的根目录开始

  将正式环境webpack的output.publicPath 配置为 '' （默认为 '/'）
