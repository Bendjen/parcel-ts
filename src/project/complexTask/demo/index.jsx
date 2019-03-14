import { Button, Modal, Progress, Icon, notification } from "antd"
import React from "react";
import { from, of } from 'rxjs'
import { catchError, filter, map, mergeMap, switchMap, switchMapTo, exhaustMap, tap } from 'rxjs/operators';
import { changePrintStatus, fetchOrderInfo, fetchTemplate, printTicket, uploadLog } from "./service";
import "antd/dist/antd.css";
import style from './index.scss'
import { FindValueSubscriber } from 'rxjs/internal/operators/find';
class ComplexTask extends React.Component {
  constructor(props) {
    super(props);
    this.executeTask = this.executeTask.bind(this)
    this.assembleTask = this.assembleTask.bind(this)
    this.handleConfirm = this.handleConfirm.bind(this)
    this.state = {
      combineOrdernum: 'CMB-0071516106',
      visible: false,
      taskReady: true,
      flow: {
        title: '查询合并订单号下的订单信息',
        tasks: [
          { text: '查询合并订单号：CMB-0071516106', status: 'waitting' },
          { text: '过滤无需打印的任务', status: 'waitting' },
          { text: '查询每个子单对应的各自打印模板', status: 'waitting' },
          { text: '请求变更每个子单的打印状态', status: 'waitting' },
          { text: '根据子单票数拆分出打印任务的数量', status: 'waitting' },
          { text: '请求硬件设备进行单票打印', status: 'waitting' },
          { text: '上报本次任务日志', status: 'waitting' },
        ]
      }
    };
  }
  render() {
    const successNum = this.state.flow.tasks.filter(item => item.status === 'success').length
    return (
      <div>
        <Button type="primary" icon="caret-right" onClick={this.executeTask} disabled={!this.state.taskReady}>执行任务</Button>
        <Modal visible={this.state.visible} maskClosable={false} footer={null} width={800} closable={false}>
          <div className={style.modalContainer} data-flex='dir:top main:center cross:center'>
            {/* 标题 */}
            {successNum === 7 ?
              <p className={`${style.modalTitle}  ${style.green}`} data-flex='cross:center'>  <Icon type="check-circle" /> 任务已完成 </p>
              : <p className={`${style.modalTitle} && ${style.blue}`} data-flex='cross:center'>  <Icon type="loading" /> 任务进行中 </p>
            }
            {/* 说明 */}
            <p data-flex='main:start cross:center' style={{ width: '100%' }} className={style.explain}>
              当前任务共 <span className={style.blue}>7</span>项流程，当前正在进行第 <span className={style.green}>{successNum}</span>项
            </p>
            {/* 进度条 */}
            <Progress percent={Math.ceil((successNum / 7) * 100)} strokeWidth={20} status={successNum === 7 ? "success" : "active"} strokeColor={successNum === 7 ? '#67C23A' : '#1890ff'} />
            {/* 任务详情盒子 */}
            <div className={style.detailBox}>
              {this.state.flow.tasks.map(item => {
                return (<div key={item.text}>
                  {item.status === 'waitting' ? <p className={style.gray} data-flex='main:justify cross:center'>
                    <span>{item.text}</span>
                    <span>等待中</span>
                  </p> : null}
                  {item.status === 'doing' ? <p className={style.blue} data-flex='main:justify cross:center'>
                    <span>{item.text}</span>
                    <span><Icon type="loading" />进行中</span>
                  </p> : null}
                  {item.status === 'success' ? <p className={style.green} data-flex='main:justify cross:center'>
                    <span>{item.text}</span>
                    <span><Icon type="check" />已完成</span>
                  </p> : null}
                </div>)
              })}
            </div>
            {/* 按钮 */}
            <div className={style.btnConatiner} data-flex='dir:left main:right cross:center'>
              <Button type="primary" onClick={this.handleConfirm} disabled={successNum !== 7}>确认</Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
  executeTask() {
    this.setState({ taskReady: false })
    this.assembleTask().then(data => {
      this.setState({ taskReady: true })
      // tslint:disable-next-line:no-console
      console.log(data)
    }).catch(err => {
      this.setState({ taskReady: false })
      // tslint:disable-next-line:no-console
      console.log(err)
    })
  }
  handleConfirm() {
    this.setState({
      flow: {
        title: '查询合并订单号下的订单信息',
        tasks: [
          { text: '1.查询合并订单号：CMB-0071516106', status: 'waitting' },
          { text: '2.过滤无需打印的任务', status: 'waitting' },
          { text: '3.查询每个子单对应的各自打印模板', status: 'waitting' },
          { text: '4.请求变更每个子单的打印状态', status: 'waitting' },
          { text: '5.根据子单票数拆分出打印任务的数量', status: 'waitting' },
          { text: '6.请求硬件设备进行单票打印', status: 'waitting' },
          { text: '7.上报本次任务日志', status: 'waitting' },
        ]
      },
      visible: false,
    })
    // notification.success({
    //   message: '提示',
    //   description: '您可以通过F12，在console中看到数据流变化',
    // });
  }
  assembleTask() {
    let successTaskList = [];
    let failTaskList = [];
    this.setState({ visible: true })
    return new Promise((resolve, reject) => {
      of(this.state.combineOrdernum)
        .pipe(

          // 1. 请求接口，通过合并订单号查询出合并订单下的所有子单数据

          tap(() => {
            let tasks = this.state.flow.tasks;
            tasks[0].status = 'doing'
            this.setState({ flow: { ...this.state.flow, tasks } })
          }),

          switchMapTo(fetchOrderInfo({ ordernum: this.state.combineOrdernum })),

          switchMap(res => {

            if (res.code === 200) {
              const tickets = res.data
              if (res.data.length === 0) {
                throw new Error('服务器没有返回门票打印信息')
              } else {
                return from(tickets)
              }
            } else {
              throw new Error(res.msg || '查询门票打印信息失败')
            }
          }),

          tap(() => {
            let tasks = this.state.flow.tasks;
            tasks[0].status = 'success'
            this.setState({ flow: { ...this.state.flow, tasks } })
          }),

          // 2.过滤掉下不需要打印的子单(mode === 0)

          tap(() => {
            let tasks = this.state.flow.tasks;
            tasks[1].status = 'doing'
            this.setState({ flow: { ...this.state.flow, tasks } })
          }),

          filter(ticket => {
            if (ticket.mode === 0) {
              failTaskList.push({ ticket: ticket, failText: "无需打印" })
              return false
            } else {
              return true
            }
          }),

          tap(() => {
            let tasks = this.state.flow.tasks;
            tasks[1].status = 'success'
            this.setState({ flow: { ...this.state.flow, tasks } })
          }),

          // 3.请求接口，查询每个子单对应的各自打印模板

          tap(() => {
            let tasks = this.state.flow.tasks;
            tasks[2].status = 'doing'
            this.setState({ flow: { ...this.state.flow, tasks } })
          }),

          mergeMap(ticket =>
            of(ticket).pipe(
              switchMapTo(fetchTemplate({ ordernum: ticket.ordernum })),
              filter(res => {
                if (!res.code || res.code !== 200) {
                  failTaskList.push({ ticket: ticket, failText: `查询打印模板失败：${res.msg || res}` })
                  return false
                } else {
                  return true
                }
              }),
              map(res => {
                return { ticket: ticket, template: res.data.template }
              })
            )
          ),

          tap(() => {
            let tasks = this.state.flow.tasks;
            tasks[2].status = 'success'
            this.setState({ flow: { ...this.state.flow, tasks } })
          }),

          // 4.请求接口，请求接口变更每个子单的打印状态

          tap(() => {
            let tasks = this.state.flow.tasks;
            tasks[3].status = 'doing'
            this.setState({ flow: { ...this.state.flow, tasks } })
          }),

          mergeMap(({ ticket, template }) => {
            return of({ ticket, template })
              .pipe(
                switchMapTo(changePrintStatus({ ordernum: ticket.ordernum })),
                filter(res => {
                  if (!res.code || res.code !== 200) {
                    failTaskList.push({ ticket: ticket, failText: `修改门票打印状态失败：${res.msg || res}` })
                    return false
                  } else {
                    return true
                  }
                }),
                map(res => { return { ticket, template } })
              )
          }),

          tap(() => {
            let tasks = this.state.flow.tasks;
            tasks[3].status = 'success'
            this.setState({ flow: { ...this.state.flow, tasks } })
          }),

          // 5.根据子单票数拆分出打印任务的数量

          tap(() => {
            let tasks = this.state.flow.tasks;
            tasks[4].status = 'doing'
            this.setState({ flow: { ...this.state.flow, tasks } })
          }),

          exhaustMap(({ ticket, template }) => {
            if (ticket.mode === 2) {
              let patchTickets = new Array(ticket.num).fill(null).map(() => {
                return { ticket: Object(ticket, { num: 1 }), template: template }
              })
              return from(patchTickets)
            } else if (ticket.mode === 1) {
              return of({ ticket, template })
            }
          }),

          tap(() => {
            let tasks = this.state.flow.tasks;
            tasks[4].status = 'success'
            this.setState({ flow: { ...this.state.flow, tasks } })
          }),

          // 6.请求硬件设备进行单票打印

          tap(() => {
            let tasks = this.state.flow.tasks;
            tasks[5].status = 'doing'
            this.setState({ flow: { ...this.state.flow, tasks } })
          }),

          mergeMap(({ ticket, template }) => {
            return of({ ticket, template })
              .pipe(
                switchMapTo(printTicket({ ordernum: ticket.ordernum, template })),
                filter(res => {
                  if (!res.code || res.code !== 200) {
                    failTaskList.push({ ticket: ticket, failText: `打印机打印失败：${res.msg || res}` })
                    return false
                  } else {
                    return true
                  }
                }),
                map(res => { return { ticket, template } })
              )
          }),

          tap(() => {
            let tasks = this.state.flow.tasks;
            tasks[5].status = 'success'
            this.setState({ flow: { ...this.state.flow, tasks } })
          }),

          // 7.上报日志

          tap(() => {
            let tasks = this.state.flow.tasks;
            tasks[6].status = 'doing'
            this.setState({ flow: { ...this.state.flow, tasks } })
          }),

          mergeMap(({ ticket, template }) => {
            return of({ ticket, template })
              .pipe(
                switchMapTo(uploadLog({ ordernum: ticket.ordernum, status: '任务完成' })),
                filter(res => {
                  if (!res.code || res.code !== 200) {
                    failTaskList.push({ ticket: ticket, failText: `上报失败：${res.msg || res}` })
                    return false
                  } else {
                    return true
                  }
                }),
                map(res => { return { ticket, template } })
              )
          }),

          tap(() => {
            let tasks = this.state.flow.tasks;
            tasks[6].status = 'success'
            this.setState({ flow: { ...this.state.flow, tasks } })
          }),

          catchError(err => reject(err))
        )
        .subscribe({
          next(successTask) {
            successTaskList.push(successTask)
          },
          complete() {
            resolve({ successTaskList, failTaskList })
          }
        })
    })
  }
}

export default ComplexTask;
