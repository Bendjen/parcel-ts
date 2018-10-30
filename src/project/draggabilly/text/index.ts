const javaScriptText =`
import React from "react";
import style from "./index.scss";
import { Popover, Form, Button, Input, Slider, InputNumber, Radio } from 'antd';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Draggabilly = require('draggabilly');

class DraggabillyComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			toolList: [
				{ title: '自定义文本', type: 'text', name: 'text', content: '' },
				{ title: '表格区域', type: 'table', name: 'table' },
				{ title: '二维码区域', type: 'qrcode', name: 'qrcode' },
			],
			activeList: [],
			toolDraggies: [],
			activeDraggies: [],
		};
	}

	componentDidMount () {
		let that = this;
		let contentDom = document.getElementById('contentContainer');
		document.querySelectorAll("#toolContainer [role = 'toolItem']").forEach((item, index) => {
			let toolItem = this.state.toolList[index];
			let type = toolItem.type;
			let toolDraggie = new Draggabilly(item, {})
			this.setState({ toolDraggies: [...this.state.toolDraggies, toolDraggie] })
			let originDelta = { y: item.offsetTop - contentDom.offsetTop, x: item.offsetLeft - contentDom.offsetLeft }

			toolDraggie.on('dragStart', function (event, pointer) {
				//样式处理
				item.style.opacity = 0.65;
				item.style.zIndex = 10;
				//计算初始偏移

			})

			toolDraggie.on('dragEnd', function (event, pointer) {
				//样式处理
				item.style.opacity = 1;
				item.style.zIndex = '';

				if (that.isOverlap(item, document.getElementById('contentContainer'))) {
					// 计算最终偏移的相对坐标 【最终偏移的坐标（以容器的左上角为起点），等于工具组件静止时相对原点的坐标与工具被拖动方向的矢量合】
					let finalDelta = { x: toolDraggie.position.x, y: toolDraggie.position.y }
					let relativePosition = {
						x: (finalDelta.x + originDelta.x > 0 && type != 'table') ? finalDelta.x + originDelta.x : 0,
						y: finalDelta.y + originDelta.y > 0 ? finalDelta.y + originDelta.y : 0,
					}
					// 生成初始数据
					let timestamp = new Date().getTime();
					let newActiveList = [...that.state.activeList, {
						id: timestamp,
						font_size: 12,
						size: 5,
						lockDirection: type == 'table' ? 'y' : 'free',
						x: relativePosition.x,
						y: relativePosition.y,
						...toolItem,
					}]

					//激活组件
					that.setState({ activeList: newActiveList })
					let activeDom = document.getElementById(timestamp);
					let activeDraggie = new Draggabilly(activeDom, { containment: '#contentContainer' })
					that.setState({ activeDraggies: [...that.state.activeDraggies, activeDraggie] })
					activeDraggie.setPosition(relativePosition.x, relativePosition.y)
					let _index = that.state.activeList.length - 1

					// 同步修改state中的位置值
					activeDraggie.on('dragEnd', function (event, pointer) {
						that.state.activeList[_index].x = activeDraggie.position.x;
						that.state.activeList[_index].y = activeDraggie.position.y;
					})
				}

				// 恢复工具控件的位置
				toolDraggie.setPosition(0, 0)

			})
		})
	}

	// 卸载时取消监听
	componentWillUnmount () {
		this.clear(this.state.activeDraggies)
		this.clear(this.state.toolDraggies)
	}

	// 销毁监听
	clear (draggieList) {
		draggieList.forEach(item => {
			item.destroy()
		})
	}

	//判断组件是否被拖入有效工作区域
	isOverlap (objOne, objTwo) {
		let x1 = objOne.offsetLeft;
		let y1 = objOne.offsetTop;
		let x2 = x1 + objOne.offsetWidth;
		let y2 = y1 + objOne.offsetHeight;

		let x3 = objTwo.offsetLeft;
		let y3 = objTwo.offsetTop;
		let x4 = x3 + objTwo.offsetWidth;
		let y4 = y3 + objTwo.offsetHeight;

		let zx = Math.abs(x1 + x2 - x3 - x4);
		let x = Math.abs(x1 - x2) + Math.abs(x3 - x4);
		let zy = Math.abs(y1 + y2 - y3 - y4);
		let y = Math.abs(y1 - y2) + Math.abs(y3 - y4);
		return (zx <= x && zy <= y);
	}


	// 对组件元素进行操作的部分
	onItemValueChange (value, index, key) {
		//修改值
		this.state.activeList[index][key] = value
		//触发dom更新
		this.setState({
			activeList: this.state.activeList
		})
		//需要手动变更的选项
		let dom = document.getElementById(this.state.activeList[index].id);
		if (key == 'font_size') {
			dom.style.fontSize = value + 'px'
		} else if (key == 'lockDirection') {
			this.state.activeDraggies[index].options.axis = this.state.activeList[index].lockDirection == 'free' ? '' : this.state.activeList[index].lockDirection
		} else if (key == 'size') {
			dom.style.width = value * 10 + 'px'
			dom.style.height = value * 10 + 'px'
		}
	}

	//删除组件
	deleteItem (index) {
		console.log(index)
		this.state.activeList.splice(index, 1);
		this.state.activeDraggies[index].destroy();
		this.state.activeDraggies.splice(index, 1);
		this.setState({
			activeList: this.state.activeList
		})
	}


	// 渲染编辑面板
	editToolRender (item, index) {
		const formItemLayout = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 6 },
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 16 },
			},
		};
		return (
			<Form style={{ overflow: "hidden" }}>
				<FormItem label="类型" {...formItemLayout} style={{ marginBottom: 5 }}> <Input value={item.title} placeholder='文本标题' disabled={item.type != 'text'} onChange={(e) => this.onItemValueChange.bind(this)(e.target.value, index, 'title')} /></FormItem>
				<FormItem label="内容" {...formItemLayout} style={{ marginBottom: 5 }}> <Input value={item.content} placeholder='文本内容' disabled={item.type != 'text'} onChange={(e) => this.onItemValueChange.bind(this)(e.target.value, index, 'content')} /></FormItem>
				<FormItem label="字体大小" {...formItemLayout} style={{ marginBottom: 5 }}> <Slider min={8} max={24} value={item.font_size} disabled={item.type != 'text'} onChange={(value) => this.onItemValueChange.bind(this)(value, index, 'font_size')}></Slider></FormItem>
				<FormItem label="尺寸" {...formItemLayout} style={{ marginBottom: 5 }}> <Slider min={4} max={10} value={item.size} disabled={item.type != 'qrcode'} onChange={(value) => this.onItemValueChange.bind(this)(value, index, 'size')}></Slider></FormItem>
				<FormItem label="移动方向" {...formItemLayout} style={{ marginBottom: 5 }}>
					<RadioGroup onChange={(e) => this.onItemValueChange.bind(this)(e.target.value, index, 'lockDirection')} value={item.lockDirection}>
						<Radio value='free' disabled={item.type == 'table'}>自由</Radio>
						<Radio value='x' disabled={item.type == 'table'}>水平</Radio>
						<Radio value='y' >垂直</Radio>
					</RadioGroup>
				</FormItem>
				<Button style={{ float: 'right' }} type="danger" onClick={(e) => this.deleteItem.bind(this)(index)}>删除</Button>
			</Form >)
	}


	render () {

		return (<div className={style.container}>
			<div data-flex='main:start cross:center'>
				{/* 选项列表 */}
				<ul className={style.toolContainer} flex='dir:top main:center cross:center' id='toolContainer'>
					{this.state.toolList.map(item => {
						return (<li className={style.toolItem} role='toolItem' key={item.name}>{item.title || '标题'}</li>)
					})}
				</ul>
				{/* 画布 */}
				<div className={style.contentContainer} id='contentContainer'>
					<ul className={style.activeList}>
						{this.state.activeList.map((item, index) => {
							// 这里是把手区域的渲染
							return (
								<Popover
									content={this.editToolRender(item, index)}
									trigger="click"
									key={item.id}
								>
									<li className={style[\`\${item.type}Item\`]} id={item.id}>
										{
											item.type == 'text' ?
												<div>
													<span>{item.title}：</span>
													<content>{item.content || '<-- 文本内容 -->'}</content>
												</div>
												: null
										}
										{item.type == 'table' ? <p>{'<-- 表格区域 -->'}</p> : null}
										{item.type == 'qrcode' ? <content></content> : null}
									</li>
								</Popover>
							)
						})}
					</ul>
				</div>
			</div>
		</div>)
	}
}


export default DraggabillyComponent;

  `

const cssText =
  `:local {
    .container{
        background: #a27373;
		width: 100%;
		padding: 20px;
	}
	.contentContainer{
		margin-left: 20px;
		background: #a78787;
		width: 800px;
		height: 400px;
		position: relative;
		.textItem{
			position: absolute;
			left: 0;
			top: 0;
			display: inline-block;
			background: #fff;
			padding: 5px;
			margin-bottom: 5px;
			margin-right: 5px;
			border: 1px solid #ddd;
			cursor: move;
			user-select:none;
			text-align: center;
			content{
				background: #ddd;
				padding: 5px;
			}
		}
		.tableItem{
			cursor: move;
			width: 100%;
			position: absolute;
			left: 0;
			top: 0;
			display:block;
			padding: 20px;
			background: #ddd;
			text-align: center;	
			p{
				margin-bottom: 0;
			}
		}
		.qrcodeItem{
			cursor: move;
			display: inline-block;
			width: 100%;
			position: absolute;
			left: 0;
			top: 0;
			padding: 5px;
			background: #fff;
			width: 50px;
			height: 50px;
			content{
				display: inline-block;
				background: #ddd;	
				width: 100%;
				height: 100%;	
			}
		}
	}
    .toolContainer{
		padding: 10px;
		float: left;
		user-select:none;
		box-sizing: border-box;
		border:  1px dashed #999 ;
		border-bottom: none;
		width: 150px;
		z-index: 2;
		.toolItem{
			display: inline-block;
			background: #fff;
			padding: 10px;
			margin-bottom: 5px;
			margin-right: 5px;
			border: 1px solid #ddd;
			cursor: move;
			user-select:none;
			text-align: center;
		}
	}
}

:global{
	.ant-popover-inner-content{
		min-width: 400px;
	}
}`



export default { cssText, javaScriptText }