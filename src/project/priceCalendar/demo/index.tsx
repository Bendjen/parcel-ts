import { Icon, Input } from 'antd';
import moment from 'moment';
import React from "react";
import style from "./index.scss"

class Demo extends React.Component<{}, any> {
  constructor(props: {}) {
    super(props);
    this.handleFoucs = this.handleFoucs.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.state = {
      showDialog: true,
      calendarArray: []
    };
    this.changeMonth()
  }
  public render() {
    return (
      <div data-flex='dir:top main:center cross:center'>
        <Input placeholder="点击选择日期" style={{ width: 150 }} onFocus={this.handleFoucs} onBlur={this.handleBlur} />
        {!this.state.showDialog2 ?
          this.calendarRender() :
          ''
        }
      </div>
    );
  }
  public changeMonth(date: any = moment()) {
    // const targetMonth = moment(date).month()
    const firstDay = moment(date).startOf('month')
    const lastDay = moment(date).endOf('month')
    const totalvalidNum = moment(lastDay).dayOfYear() - moment(firstDay).dayOfYear() + 1
    const startWeekDay = moment(firstDay).day()
    const endWeekDay = moment(lastDay).day()
    const firstLineExtraNum = startWeekDay === 0 ? 6 : startWeekDay - 1
    const lastLineExtraNum = 7 - endWeekDay
    const totalCellNum = totalvalidNum + firstLineExtraNum + lastLineExtraNum
    const calendarArray = [];
    for (let i = 0; i < totalCellNum; i++) {
      if (i < firstLineExtraNum) {
        calendarArray.push({
          valid: false,
          date: moment(firstDay).subtract(startWeekDay - i, 'days'),
          price: 100
        })
      } else if (i >= totalCellNum - lastLineExtraNum && i < totalCellNum) {
        calendarArray.push({
          valid: false,
          date: moment(lastDay).add(lastLineExtraNum - (totalCellNum - i), 'days'),
          price: 100
        })
      } else {
        calendarArray.push({
          valid: true,
          date: moment(firstDay).add(i - firstLineExtraNum, 'days'),
          price: 100
        })
      }
    }
    this.setState({ calendarArray })

  }
  private calendarRender() {
    return (<div className={style.calendarContainer} >
      <div data-flex='main:justify cross:center'>
        <div className={style.iconLeft} data-flex='cross:center'>
          <Icon type="double-left" />
          <Icon type="left" />
        </div>
        <div className={style.curMonth}>2019年3月</div>
        <div className={style.iconRight} data-flex='cross:center'>
          <Icon type="right" />
          <Icon type="double-right" />
        </div>
      </div>
      <div data-flex='dir:top main:center cross:center'>
        <div className={style.calendarCol} data-flex='main:justify cross:center'>
          <span>一</span>
          <span>二</span>
          <span>三</span>
          <span>四</span>
          <span>五</span>
          <span>六</span>
          <span>日</span>
        </div>
      </div>
    </div>)
  }
  private handleFoucs() {
    this.setState({
      showDialog: true
    })
  }
  private handleBlur() {
    this.setState({
      showDialog: false
    })
  }
}

export default Demo;
