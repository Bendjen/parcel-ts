import { Icon, Input } from 'antd';
import moment from 'moment';
import React from "react";
import style from "./index.scss"

class PriceCalendar extends React.Component<{}, any> {
  constructor(props: {}) {
    super(props);
    this.handleFoucs = this.handleFoucs.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.lastMonth = this.lastMonth.bind(this)
    this.nextMonth = this.nextMonth.bind(this)
    this.lastYear = this.lastYear.bind(this)
    this.nextYear = this.nextYear.bind(this)
    this.setPickDate = this.setPickDate.bind(this)
    this.state = {
      showDialog: true,
      calendarArray: [],
      pickDate: '',
      showMonth: '',
    };
  }
  public changeMonth(date: any = moment()) {
    const firstDay = moment(date).startOf('month')
    const lastDay = moment(date).endOf('month')
    const totalvalidNum = moment(lastDay).dayOfYear() - moment(firstDay).dayOfYear() + 1
    const startWeekDay = moment(firstDay).day()
    const endWeekDay = moment(lastDay).day()
    const firstLineExtraNum = startWeekDay === 0 ? 6 : (startWeekDay === 1 ? 7 : startWeekDay - 1)
    const lastLineExtraNum = 7 - endWeekDay
    const totalCellNum = totalvalidNum + firstLineExtraNum + lastLineExtraNum
    const calendarArray = [];
    for (let i = 0; i < totalCellNum; i++) {
      if (i < firstLineExtraNum) {
        calendarArray.push({
          valid: false,
          date: moment(firstDay).subtract(startWeekDay === 0 ? (7 - i - 1) : (startWeekDay === 1 ? (7 - i) : (startWeekDay - i - 1)), 'days'),
          price: 100
        })
      } else if (i > totalCellNum - lastLineExtraNum - 1 && i < totalCellNum) {
        calendarArray.push({
          valid: false,
          date: moment(lastDay).add(lastLineExtraNum - (totalCellNum - i) + 1, 'days'),
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
    this.calendarRender()
  }
  public render() {
    return (
      <div data-flex='dir:top main:center cross:center'>
        <Input placeholder="点击选择日期" style={{ width: 150 }} value={moment(this.state.pickDate).format('YYYY MM-DD')} onFocus={this.handleFoucs} onBlur={this.handleBlur} />
        {true ?
          this.calendarRender() :
          ''
        }
      </div>
    );
  }
  public componentDidMount() {
    this.setState({
      showMonth: moment(),
      pickDate: moment()
    })
    this.changeMonth()
  }
  private calendarRender() {
    const LineNum = Math.ceil(this.state.calendarArray.length / 7)
    return (<div className={style.calendarContainer} >
      <div data-flex='main:justify cross:center'>
        <div className={style.iconLeft} data-flex='cross:center'>
          <Icon type="double-left" onClick={this.lastYear} />
          <Icon type="left" onClick={this.lastMonth} />
        </div>
        <div className={style.curMonth}>{moment(this.state.showMonth).format('YYYY年MM月')}</div>
        <div className={style.iconRight} data-flex='cross:center'>
          <Icon type="right" onClick={this.nextMonth} />
          <Icon type="double-right" onClick={this.nextYear} />
        </div>
      </div>
      <div data-flex='dir:top main:center cross:center'>
        <div className={style.calendarLine} data-flex='main:justify cross:center'>
          <p>一</p>
          <p>二</p>
          <p>三</p>
          <p>四</p>
          <p>五</p>
          <p>六</p>
          <p>日</p>
        </div>
        {
          new Array(LineNum).fill(null).map((item, index) => {
            return (<div key={index} className={style.calendarLine} data-flex='main:justify cross:center'>
              {new Array(7).fill(null).map((v, i) => {
                const targetDate = this.state.calendarArray[i + index * 7];
                return (<p key={i} className={moment(this.state.pickDate).isSame(targetDate.date) ? style['pick-date'] : null} data-flex='dir:top main:center cross:center' onClick={this.setPickDate.bind(this, i + index * 7)}>
                  <span className={targetDate.valid ? null : style['disabled-date']}>{moment(targetDate.date).format("DD")}</span>
                  {targetDate.valid ?
                    <span className={style.price}>￥{targetDate.price}</span> :
                    ''
                  }
                </p>)
              })}
            </div>)
          })
        }

      </div>
    </div>)
  }
  private setPickDate(index: number) {
    this.setState({
      pickDate: this.state.calendarArray[index].date
    })
  }
  private lastMonth() {
    const lastMonth = moment(this.state.showMonth).subtract(1, 'month');
    this.setState({ showMonth: lastMonth })
    this.changeMonth(lastMonth)
  }
  private nextMonth() {
    const nextMonth = moment(this.state.showMonth).add(1, 'month');
    this.setState({ showMonth: nextMonth })
    this.changeMonth(nextMonth)
  }
  private lastYear() {
    const lastYear = moment(this.state.showMonth).subtract(1, 'year');
    this.setState({ showMonth: lastYear })
    this.changeMonth(lastYear)
  }
  private nextYear() {
    const nextYear = moment(this.state.showMonth).add(1, 'year');
    this.setState({ showMonth: nextYear })
    this.changeMonth(nextYear)
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

export default PriceCalendar;
