import { Button, Form, Input,  Popover, Radio, Slider } from 'antd';
import React from "react";
import style from "./index.scss";

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
// tslint:disable-next-line:no-var-requires
const Draggabilly = require('draggabilly');

class DraggabillyComponent extends React.Component<{}, any> {
	constructor(props: {}) {
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

	public componentDidMount() {
		const that = this;
		const contentDom: any = document.getElementById('contentContainer');
		document.querySelectorAll("#toolContainer [role = 'toolItem']").forEach((item: any, index) => {
			const toolItem = this.state.toolList[index];
			const type = toolItem.type;
			const toolDraggie = new Draggabilly(item, {})
			this.setState({ toolDraggies: [...this.state.toolDraggies, toolDraggie] })
			const originDelta = { y: item.offsetTop - contentDom.offsetTop, x: item.offsetLeft - contentDom.offsetLeft }

			toolDraggie.on('dragStart', () => {
				// 样式处理
				item.style.opacity = 0.65;
				item.style.zIndex = 10;
				// 计算初始偏移

			})

			toolDraggie.on('dragEnd', () => {
				// 样式处理
				item.style.opacity = 1;
				item.style.zIndex = '';

				if (that.isOverlap(item, document.getElementById('contentContainer'))) {
					// 计算最终偏移的相对坐标 【最终偏移的坐标（以容器的左上角为起点），等于工具组件静止时相对原点的坐标与工具被拖动方向的矢量合】
					const finalDelta = { x: toolDraggie.position.x, y: toolDraggie.position.y }
					const relativePosition = {
						x: (finalDelta.x + originDelta.x > 0 && type !== 'table') ? finalDelta.x + originDelta.x : 0,
						y: finalDelta.y + originDelta.y > 0 ? finalDelta.y + originDelta.y : 0,
					}
					// 生成初始数据
					const timestamp: any = new Date().getTime();
					const newActiveList = [...that.state.activeList, {
						id: timestamp,
						font_size: 12,
						size: 5,
						lockDirection: type === 'table' ? 'y' : 'free',
						x: relativePosition.x,
						y: relativePosition.y,
						...toolItem,
					}]

					// 激活组件
					that.setState({ activeList: newActiveList })
					const activeDom = document.getElementById(timestamp);
					const activeDraggie = new Draggabilly(activeDom, { containment: '#contentContainer' })
					that.setState({ activeDraggies: [...that.state.activeDraggies, activeDraggie] })
					activeDraggie.setPosition(relativePosition.x, relativePosition.y)
					const positionIndex = that.state.activeList.length - 1

					// 同步修改state中的位置值
					activeDraggie.on('dragEnd', () => {
						that.state.activeList[positionIndex].x = activeDraggie.position.x;
						that.state.activeList[positionIndex].y = activeDraggie.position.y;
					})
				}

				// 恢复工具控件的位置
				toolDraggie.setPosition(0, 0)

			})
		})
	}

	// 卸载时取消监听
	public componentWillUnmount() {
		this.clear(this.state.activeDraggies)
		this.clear(this.state.toolDraggies)
	}


	public render() {

		return (<div className={style.container}>
			<div data-flex='main:start cross:center'>
				{/* 选项列表 */}
				<ul className={style.toolContainer} data-flex='dir:top main:center cross:center' id='toolContainer'>
					{this.state.toolList.map((item: any) => {
						return (<li className={style.toolItem} role='toolItem' key={item.name}>{item.title || '标题'}</li>)
					})}
				</ul>
				{/* 画布 */}
				<div className={style.contentContainer} id='contentContainer'>
					<ul className={style.activeList}>
						{this.state.activeList.map((item: any, index: number) => {
							// 这里是把手区域的渲染
							return (
								<Popover
									content={this.editToolRender(item, index)}
									trigger="click"
									key={item.id}
								>
									<li className={style[`${item.type}Item`]} id={item.id}>
										{
											item.type === 'text' ?
												<div>
													<span>{item.title}：</span>
													<p>{item.content || '<-- 文本内容 -->'}</p>
												</div>
												: null
										}
										{item.type === 'table' ? <p>{'<-- 表格区域 -->'}</p> : null}
										{item.type === 'qrcode' ? <p>{''}</p> : null}
									</li>
								</Popover>
							)
						})}
					</ul>
				</div>
			</div>
		</div>)
	}

	// 销毁监听
	private clear(draggieList: any) {
		draggieList.forEach((item: any) => {
			item.destroy()
		})
	}

	// 判断组件是否被拖入有效工作区域
	private isOverlap(objOne: any, objTwo: any) {
		const x1 = objOne.offsetLeft;
		const y1 = objOne.offsetTop;
		const x2 = x1 + objOne.offsetWidth;
		const y2 = y1 + objOne.offsetHeight;

		const x3 = objTwo.offsetLeft;
		const y3 = objTwo.offsetTop;
		const x4 = x3 + objTwo.offsetWidth;
		const y4 = y3 + objTwo.offsetHeight;

		const zx = Math.abs(x1 + x2 - x3 - x4);
		const x = Math.abs(x1 - x2) + Math.abs(x3 - x4);
		const zy = Math.abs(y1 + y2 - y3 - y4);
		const y = Math.abs(y1 - y2) + Math.abs(y3 - y4);
		return (zx <= x && zy <= y);
	}


	// 对组件元素进行操作的部分
	private onItemValueChange(value: any, index: any, key: any) {
		// 修改值
		this.state.activeList[index][key] = value
		// 触发dom更新
		this.setState({
			activeList: this.state.activeList
		})
		// 需要手动变更的选项
		const dom :any = document.getElementById(this.state.activeList[index].id);
		if (key === 'font_size') {
			dom.style.fontSize = value + 'px'
		} else if (key === 'lockDirection') {
			this.state.activeDraggies[index].options.axis = this.state.activeList[index].lockDirection === 'free' ? '' : this.state.activeList[index].lockDirection
		} else if (key === 'size') {
			dom.style.width = value * 10 + 'px'
			dom.style.height = value * 10 + 'px'
		}
	}

	// 删除组件
	private deleteItem(index:any) {
		// console.log(index)
		this.state.activeList.splice(index, 1);
		this.state.activeDraggies[index].destroy();
		this.state.activeDraggies.splice(index, 1);
		this.setState({
			activeList: this.state.activeList
		})
	}


	// 渲染编辑面板
	private editToolRender(item:any, index:any) {
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
				{/* tslint:disable-next-line:jsx-no-lambda */}
				<FormItem label="标题" {...formItemLayout} style={{ marginBottom: 5 }}> <Input value={item.title} placeholder='文本标题' disabled={item.type !== 'text'} onChange={(e) => this.onItemValueChange.bind(this)(e.target.value, index, 'title')} /></FormItem>
				{/* tslint:disable-next-line:jsx-no-lambda */}
				<FormItem label="内容" {...formItemLayout} style={{ marginBottom: 5 }}> <Input value={item.content} placeholder='文本内容' disabled={item.type !== 'text'} onChange={(e) => this.onItemValueChange.bind(this)(e.target.value, index, 'content')} /></FormItem>
				{/* tslint:disable-next-line:jsx-no-lambda */}
				<FormItem label="字体大小" {...formItemLayout} style={{ marginBottom: 5 }}> <Slider min={8} max={24} value={item.font_size} disabled={item.type !== 'text'} onChange={(value) => this.onItemValueChange.bind(this)(value, index, 'font_size')}/></FormItem>
				{/* tslint:disable-next-line:jsx-no-lambda */}
				<FormItem label="尺寸" {...formItemLayout} style={{ marginBottom: 5 }}> <Slider min={4} max={10} value={item.size} disabled={item.type !== 'qrcode'} onChange={(value) => this.onItemValueChange.bind(this)(value, index, 'size')} /></FormItem>
				<FormItem label="移动方向" {...formItemLayout} style={{ marginBottom: 5 }}>
				{/* tslint:disable-next-line:jsx-no-lambda */}
					<RadioGroup onChange={(e) => this.onItemValueChange.bind(this)(e.target.value, index, 'lockDirection')} value={item.lockDirection}>
						<Radio value='free' disabled={item.type === 'table'}>自由</Radio>
						<Radio value='x' disabled={item.type === 'table'}>水平</Radio>
						<Radio value='y' >垂直</Radio>
					</RadioGroup>
				</FormItem>
				{/* tslint:disable-next-line:jsx-no-lambda */}
				<Button style={{ float: 'right' }} type="danger" onClick={() => this.deleteItem.bind(this)(index)}>删除</Button>
			</Form >)
	}
}


export default DraggabillyComponent;
