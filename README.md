GitPage预览： https://bendjen.github.io/parcel-ts/

###  本项目为个人收录实践小，用于记录学习与实践前端相关知识点

> * 延续初版的视觉设计元素，进行了目录结构上的简化调整
（初版地址：https://github.com/Bendjen/parcel）
> * 基于react-app配合react-app-rewired作为项目脚手架与初始配置 
（相关文档：https://ant.design/docs/react/use-in-typescript-cn）
> * 技术栈采用react/react-router/webpack/typeScript,UI库采用antd，内容板块中各demo载入相关依赖，如cyclejs、rxjs等
> * 该项目采用按需加载，优化了加载过程中的载入动画，页面设计采用插拔思想，将平时关注的内容实践后写成组件注入页面中

###  使用

> * npm install  用cnpm可能会有ts重复声明的问题



###  以下为项目中遇到的问题记录

1.create-react-app脚手架自定义配置webpack的方法

> *"react-app-rewired"将config-overrides.js中的配置插入默认的配置
  参考链接：https://ant.design/docs/react/use-in-typescript-cn

2.typeScript中使用cssModule时引入声明

> *定义style.d.ts文件作声明

3.将页面布到gitPage时，引用的静态资源为域名下的根目录开始

> * 将正式环境webpack的output.publicPath 配置为 '' （默认为 '/'）
