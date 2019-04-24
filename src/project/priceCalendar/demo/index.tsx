import { Icon, Input, Spin } from 'antd';
import moment from 'moment';
import React from "react";
import style from "./index.scss"
import REST from "./rest"
class PriceCalendar extends React.Component<{}, any> {
  constructor(props: {}) {
    super(props);
    this.lastMonth = this.lastMonth.bind(this)
    this.nextMonth = this.nextMonth.bind(this)
    this.lastYear = this.lastYear.bind(this)
    this.nextYear = this.nextYear.bind(this)
    this.setPickDate = this.setPickDate.bind(this)
    this.state = {
      calendarArray: [],      // 日历数组
      pickDate: '',           // 当前选中的日期
      showMonth: '',          // 当前展示的月份
      loading: false          // 是否正在查询价格
    };
  }
  public render() {
    return (
      <div data-flex='dir:top main:center cross:center'>
        <Input placeholder="点击选择日期" style={{ width: 150 }} value={moment(this.state.pickDate).format('YYYY-MM-DD')} readOnly={true} />
        {true ?
          this.calendarRender() :
          ''
        }
      </div>
    );
  }

  // 初始化当前月份日历

  public componentDidMount() {
    this.setState({
      showMonth: moment(),
      pickDate: moment()
    })
    this.changeMonth()
  }

  // 异步查询月份日历价格，本地随机模拟

  private fetchPrice(date: any) {
    const firstDay = moment(date).startOf('month')
    const lastDay = moment(date).endOf('month')
    const totalvalidNum = moment(lastDay).dayOfYear() - moment(firstDay).dayOfYear() + 1
    const res = {}
    this.setState({ loading: true })
    return new Promise((resolve) => {
      setTimeout(() => {
        for (let i = 0; i < totalvalidNum; i++) {
          res[`${moment(firstDay).add(i, 'day').format('YYYY-MM-DD')}`] = Math.floor(Math.random() * 50)
        }
        this.setState({ loading: false })
        resolve(res)
      }, 1000)
    })
  }

  // 变更月份时，重新获取价格与计算日历数组

  private async changeMonth(date: any = moment()) {
    const priceList = await this.fetchPrice(date)
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
        const cellDate: any = moment(firstDay).subtract(startWeekDay === 0 ? (7 - i - 1) : (startWeekDay === 1 ? (7 - i) : (startWeekDay - i - 1)), 'days')
        const cellPrice: number | string = '￥' + priceList[cellDate.format('YYYY-MM-DD')]
        calendarArray.push({
          valid: false,
          date: cellDate,
          price: cellPrice,
          isFestival: REST.includes(moment(cellDate).format('YYYY-MM-DD'))
        })
      } else if (i > totalCellNum - lastLineExtraNum - 1 && i < totalCellNum) {
        const cellDate: any = moment(lastDay).add(lastLineExtraNum - (totalCellNum - i) + 1, 'days')
        const cellPrice: number | string = '￥' + priceList[cellDate.format('YYYY-MM-DD')]
        calendarArray.push({
          valid: false,
          date: cellDate,
          price: cellPrice,
          isFestival: REST.includes(moment(cellDate).format('YYYY-MM-DD'))
        })
      } else {
        const cellDate: any = moment(firstDay).add(i - firstLineExtraNum, 'days')
        const cellPrice: number | string = '￥' + priceList[cellDate.format('YYYY-MM-DD')]
        calendarArray.push({
          valid: true,
          date: moment(firstDay).add(i - firstLineExtraNum, 'days'),
          price: cellPrice,
          isFestival: REST.includes(moment(cellDate).format('YYYY-MM-DD')),
        })
      }
    }
    this.setState({ calendarArray })
    this.calendarRender()
  }

  // 遍历日历数组渲染日历视图

  private calendarRender() {
    const lineNum = Math.ceil(this.state.calendarArray.length / 7)
    const antIcon = <Icon type="loading" style={{ fontSize: 36 }} spin={true} />;
    return (<div className={style.calendarContainer} >
      {
        this.state.loading ?
          <div className={style.loading} data-flex='main:center cross:center'> <Spin indicator={antIcon}/></div> :
          null
      }

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
          new Array(lineNum).fill(null).map((item, index) => {
            return (<div key={index} className={style.calendarLine} data-flex='main:justify cross:center'>
              {new Array(7).fill(null).map((v, i) => {
                const targetDate = this.state.calendarArray[i + index * 7];
                return (<p key={i} className={moment(this.state.pickDate).startOf('day').isSame(moment(targetDate.date).startOf('day')) ? style['pick-date'] : (targetDate.valid ? null : style['disabled-date'])}
                  data-flex='dir:top main:center cross:center' onClick={this.setPickDate.bind(this, i + index * 7)}>
                  <span>{moment(targetDate.date).format("DD")}</span>
                  {targetDate.valid ?
                    <span className={style.price}>{targetDate.price}</span> :
                    ''
                  }
                  {targetDate.isFestival ?
                    <span className={style.rest}>休</span> :
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

  // 选择某个日期，设置当前日期

  private setPickDate(index: number) {
    this.setState({
      pickDate: this.state.calendarArray[index].date
    })
  }

  // 点击上个月

  private lastMonth() {
    const lastMonth = moment(this.state.showMonth).subtract(1, 'month');
    this.setState({ showMonth: lastMonth })
    this.changeMonth(lastMonth)
  }

  // 点击下个月

  private nextMonth() {
    const nextMonth = moment(this.state.showMonth).add(1, 'month');
    this.setState({ showMonth: nextMonth })
    this.changeMonth(nextMonth)
  }

  // 点击上一年

  private lastYear() {
    const lastYear = moment(this.state.showMonth).subtract(1, 'year');
    this.setState({ showMonth: lastYear })
    this.changeMonth(lastYear)
  }

  // 点击下一年

  private nextYear() {
    const nextYear = moment(this.state.showMonth).add(1, 'year');
    this.setState({ showMonth: nextYear })
    this.changeMonth(nextYear)
  }
}

export default PriceCalendar;
