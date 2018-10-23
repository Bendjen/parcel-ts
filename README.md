#  本项目用于ts重写parcel项目
#  yarn install  用cnpm可能会有ts重复声明的问题
#  以下为构建中遇到的问题记录

# 1.create-react-app脚手架自定义配置webpack的方法

  用 ./script 下的脚本将 ./config 中的配置动态插入默认的配置
  用到的依赖有 "rewire"  "proxyquire"
  参考链接：https://github.com/dceddia/create-react-app-customized

# 2.typeScript中使用cssModule时引入声明

  定义style.d.ts文件作声明
  d
