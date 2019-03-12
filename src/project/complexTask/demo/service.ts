// 通过合并订单号（如：CMB-0015151616）查询子单

export function fetchOrderInfo(params: { ordernum: string }) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: [
          { ordernum: '350001', title: '示例任务A', num: 5, mode: 0 },
          { ordernum: '350002', title: '示例任务B', num: 3, mode: 1 },
          { ordernum: '350003', title: '示例任务C', num: 4, mode: 2 },
        ]
      })
    }, 1000)
  })
}

// 通过子订单号查询其他配套数据

export function fetchTemplate(params: { ordernum: string }) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          ordernum: params.ordernum,
          template: '\br <示例模板/>'
        }
      })
    }, 1000)
  })
}

// 请求接口变更子单的打印状态

export function changePrintStatus(params: { ordernum: string }) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code: 200,
        msg: 'success'
      })
    }, 1000)
  })
}

// 请求接口上报操作日志

export function uploadLog(params: { ordernum: string, status: string }) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code: 200,
        msg: 'success'
      })
    }, 1000)
  })
}

// 模拟请求打印机发起打印

export function printTicket(params: { ordernum: string, status: string }) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code: 200,
        msg: 'success'
      })
    }, 1000)
  })
}