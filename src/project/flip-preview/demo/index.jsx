import React from "react"
import style from './index.scss'

const first = { left: 0, top: 0 };
const last = { left: 0, top: 0 };

class Flip extends React.Component {
  constructor(props) {
    super(props);
    this.previewItem = this.previewItem.bind(this)
    this.hideLayer = this.hideLayer.bind(this)
    this.transEnd = this.transEnd.bind(this)
    this.previewBlock = React.createRef()
    this.state = {
      pickItem: {
        width: 300,
        height: 300,
        color: 'd3d3d3'
      },
      preview: false,
      animation: 0,   // 0 : 关闭  0.5 ：预览开启动画 1 ：开启 -0.5 : 预览关闭动画  
      blockList: new Array(5).fill(null).map(item => {
        return {
          width: this.getWidth(),
          height: this.getHeight(),
          color: this.getColor()
        }
      })
    }
  }
  componentDidUpdate() {
    // 如果preview已经切换到true
    // 获取dom中的last位置
    if (this.state.preview && this.state.animation === 0) {
      const lastRect = this.previewBlock.current.getBoundingClientRect()
      last.left = lastRect.left
      last.top = lastRect.top
      // 下一帧切换到预览开启动画
      setTimeout(() => {
        this.setState({ animation: 0.5 })
      }, 0)
    } else if (!this.state.preview && this.state.animation !== 0) {
      // 如果preview已经切换到false
      // dom已经消失
      // 将动画状态切换回已关闭
      setTimeout(() => {
        this.setState({ animation: 0 })
      }, 0)
    }
  }
  transEnd() {
    if (this.state.animation === 0.5) {
      this.setState({ animation: 1 })
    } else if (this.state.animation === -0.5) {
      this.setState({ animation: 0, preview: false })
    }
  }
  getWidth() {
    return Math.round(Math.random() * 120 + 80)
  }
  getHeight() {
    return Math.round(Math.random() * 240 + 120)
  }
  getColor() {
    return ('00000' + (Math.random() * 0x1000001).toString(16)).substr(-6)
  }
  previewItem(index, e) {
    if (!this.state.preview) {
      const firstRect = e.target.getBoundingClientRect()
      this.setState({
        preview: true,
        pickItem: this.state.blockList[index],
      })
      first.left = firstRect.left
      first.top = firstRect.top
      // console.log('first',first)
    }
  }
  hideLayer() {
    if (this.state.preview) {
      this.setState({ animation: -0.5 });
    }
  }

  render() {
    const { animation, preview, blockList, pickItem } = this.state
    console.log(animation)
    return (
      <div style={{ overflow: 'visible' }}>
        <ul data-flex="main:center cross:bottom">
          {blockList.map((item, index) => {
            return (<li key={index} data-flex='main:center cross:center' className={style.blockItem} onClick={this.previewItem.bind(this, index)}
              style={{ background: `#${item.color}`, width: item.width, height: item.height, }}>{item.width} X {item.height}</li>)
          })}
        </ul>
        {preview ?
          <div className={`${style.layer} ${(animation === 0.5 || animation === -0.5) ? style.transition : null}`} data-flex='main:center cross:center' onClick={this.hideLayer}
          onTransitionEnd={this.transEnd} style={{ opacity: (animation === 0.5 || animation === 1) ? 1 : 0 }}>
              {/* transition 这不能选择0.5，因为0.5是从last(0)变到first(0.5)的过程,而应该选择1(dom已经处于first的位置)开始动画*/}
            <div className={`${style.putPositionItem} ${(animation === 1 || animation === -0.5) ? style.transition : null}`} data-flex='main:center cross:center' ref={this.previewBlock}
              onTransitionEnd={this.transEnd}
                //    难点在这里
                //    animation === 0 的时候要translate3d(0,0,0) scale(1) 来获取last的位置信息
                //    animation === 0.5 的时候这时候flip动画还没有触发，将初始位置移动到firts的位置
                //    animation === 1 的开始flip动画，但是animation == 1 是由layer的animation === 0.5的transEnd触发的，所以要等layer出现后可以
              style={{
                background: `#${pickItem.color}`, width: pickItem.width, height: pickItem.height,
                transform: (animation === 0.5 || animation === -0.5) ? `translate3d(${first.left - last.left}px, ${first.top - last.top}px, 0) scale(1)`
                  : (animation === 0 ? 'translate3d(0,0,0) scale(1)' : 'translate3d(0,0,0) scale(2)')
              }}>
              {pickItem.width} X {pickItem.height}</div>
          </div>
          : null
        }

      </div>
    )
  }
}

export default Flip;
