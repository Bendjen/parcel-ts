// CSS表单美化
import React from "react";
import style from "./index.scss";
import data from "./data";
// 引入 ECharts 主模块
const echarts = require("echarts/lib/echarts");
require("echarts/lib/component/tooltip");
require("echarts/lib/component/legend");
require("echarts/lib/component/title");
require("echarts/lib/chart/line");

const moment = require("moment");

class House extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    moment()
      .subtract(2, "years")
      .calendar();

    this.state.option = {
      title: {
        text: "新盘供需关系"
      },
      xAxis: {
        type: "category",
        data: data.map(item => item.time)
      },
      legend: {
        data: ["预售面积", "预售套数", "签约面积", "签约套数"]
      },
      yAxis: {
        type: "value"
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#6a7985"
          }
        }
      },
      series: [
        {
          name: "预售面积",
          data: data.map(item => item.saleArea),
          type: "line"
        },
        {
          name: "预售套数",
          data: data.map(item => item.saleNum),
          type: "line"
        },
        {
          name: "签约面积",
          data: data.map(item => item.dealArea),
          type: "line"
        },
        {
          name: "签约套数",
          data: data.map(item => item.dealNum),
          type: "line"
        }
      ]
    };
  }
  componentDidMount() {
    let myChart = echarts.init(document.getElementById("main"));
    myChart.setOption(this.state.option);
  }
  render() {
    return (
      <div id="main" style={{ width: "100%", height: 600 }}></div>
    );
  }
}

export default House;
