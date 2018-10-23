import React from "react";
import { Link } from "react-router-dom";
// import QueueAnim from "rc-queue-anim";
import style from "./index.scss";
import QueueAnim from "rc-queue-anim";

class About extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			renderList: [
				{
					type: 'WxMicro',
					title: '微信小程序',
					articles: [
						{ title: '从微信页面到小程序（一）', url: 'https://mp.weixin.qq.com/s?__biz=MzAwODcwODYwMw==&mid=2247484292&idx=1&sn=437ef07bfc4fdedaeefe90a5bf3b644a&chksm=9b6b8b10ac1c020665d95893a1294f98c19a7ced18a44b8001044205e6693f8cf25d65923961&scene=21#wechat_redirect' },
						{ title: '从微信页面到小程序（二）', url: 'https://mp.weixin.qq.com/s/X2okd-75jbEs6JyHADOJ7A' },
						{ title: '登录鉴权', url: 'https://segmentfault.com/a/1190000014234141' },
						{ title: '更多开发指南', url: 'https://mp.weixin.qq.com/s/X75Go2dwevHEuQXSl0pArw' },
					]
				},
				{
					type: 'PWA',
					title: 'PWA',
					articles: [
						{ title: 'PWA概述', url: 'https://mp.weixin.qq.com/s/e9I2G2JD-SXfJLLLThyaIg' },
					]
				},
				{
					type: 'Vue',
					title: 'Vue.js',
					articles: [
						{ title: '逐行解读Vue', url: 'http://hcysun.me/vue-design/art/6vue-init-start.html' },
					]
				},
				{
					type: 'React',
					title: 'React',
					articles: [
						{ title: 'React Router 4.x 雷区', url: 'https://jdc.jd.com/archives/212552' },
					]
				},
				{
					type: 'TypeScript',
					title: 'TypeScript',
					articles: [
						{ title: 'vue + typescript 新项目起手式', url: 'https://segmentfault.com/a/1190000011744210#articleHeader12' },
						{ title: 'vue + typescript 进阶篇', url: 'https://segmentfault.com/a/1190000011878086' },
					]
				},
				{
					type: 'Rxjs',
					title: 'Rxjs',
					articles: [
						{ title: '利用Rxjs处理复杂异步请求数据流', url: 'https://zhuanlan.zhihu.com/p/28958042' },
					]
				},
				{
					type:'AR/VR',
					title:'AR/VR',
					articles:[
						{ title: '现阶段（2017-2018）AR/VR开发技术概述', url: 'https://segmentfault.com/a/1190000014891945' },
						{ title: 'Three.js中的自定义几何体', url: 'https://mp.weixin.qq.com/s/7wOHircEX3qUMWtukjRvnw' }
					]
				},
				{
					type:'WebAssembly',
					title:'WebAssembly',
					articles:[
						{ title: 'WebAssembly 现状与实战', url: 'https://www.ibm.com/developerworks/cn/web/wa-lo-webassembly-status-and-reality/index.html' }
					]
				},
				{
					type:'Nodejs',
					title:'Node.js',
					articles:[
						{ title: 'GMTC大会专访：Node.js 2018年大前端潮流解析', url: 'https://mp.weixin.qq.com/s/J79c-gPD_7e3MZuRYCp2bA' },
						{ title: '结合源码分析 Node.js 模块加载与运行原理', url: 'http://efe.baidu.com/blog/nodejs-module-analyze/' }
					]
				},
				{
					type: 'developer',
					title: '作为开发者',
					articles: [
						{ title: '超大型 JavaScript 应用的设计哲学', url: 'https://zhuanlan.zhihu.com/p/35929167' },
						{ title: 'W3C in 2018', url: 'https://mp.weixin.qq.com/s/o0EnLmcCX1FvjIe3NbutJA' },
						{ title: '从张云龙职业生涯启发程序员如何度过中年危机', url: 'https://mp.weixin.qq.com/s/zWPjfHiYxx0HH9lE99Yijw' },
					]
				},
		
			]
		}
	}
	render () {
		return (
			<div className={style.container}>
				{this.state.renderList.map(item => {
					return (<section key={item.type}>
						<h1>{item.title}</h1>
						<ul>
							{item.articles.map(_item => {
								return (<li key={_item.title}>
									<a target='_blank' href={_item.url}>{_item.title}</a>
								</li>)
							})}
						</ul>
					</section>)
				})}

			</div>
		);
	}
}

export default About;
