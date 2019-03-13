import { Button, Modal, Progress, Icon } from "antd"
import React from "react";
import { from, of } from 'rxjs'
import { catchError, filter, map, mergeMap, switchMap, switchMapTo, exhaustMap } from 'rxjs/operators';
import { changePrintStatus, fetchOrderInfo, fetchTemplate, printTicket, uploadLog } from "./service";
import "antd/dist/antd.css";
import style from './index.scss'
class ComplexTask extends React.Component {
  constructor(props) {
    super(props);
    this.executeTask = this.executeTask.bind(this)
    this.assembleTask = this.assembleTask.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.state = {
      combineOrdernum: 'CMB-0071516106',
      visible: true
    };
  }
  render() {
    return (
      <div>
        <Button type="primary" icon="caret-right" onClick={this.executeTask}>执行任务</Button>
        <Modal visible={this.state.visible} onCancel={this.handleCancel} maskClosable={false}>
          <div className={style.modalContainer}>
            <p className={style.modalTitle}>任务进行中 <Icon type="loading" /> </p>
            <Progress percent={50} strokeWidth={30} status="active" />
          </div>
        </Modal>
      </div>
    );
  }
  executeTask() {
    this.assembleTask().then(data => {
      this.setState({ visible: true })
      // tslint:disable-next-line:no-console
      console.log(data)
    }).catch(err => {
      // tslint:disable-next-line:no-console
      console.log(err)
    })
  }
  handleCancel() {
    this.setState({ visible: false })
  }
  assembleTask() {
    let successTaskList = [];
    let failTaskList = [];
    return new Promise((resolve, reject) => {
      of(this.state.combineOrdernum)
        .pipe(

          // 1. 请求接口，通过合并订单号查询出合并订单下的所有子单数据

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

          // 2.过滤掉下不需要打印的子单(mode === 0)

          filter(ticket => {
            if (ticket.mode === 0) {
              failTaskList.push({ ticket: ticket, failText: "无需打印" })
              return false
            } else {
              return true
            }
          }),

          // 3.请求接口，查询每个子单对应的各自打印模板

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

          // 4.请求接口，请求接口变更每个子单的打印状态

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
