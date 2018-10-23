// CSS表单美化
import React from "react";
import style from "./index.scss";
import { Table, Button } from "antd";
import csvExport from "./csvExport";

class ExcelExport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          title: "Name",
          dataIndex: "name"
        },
        {
          title: "Age",
          dataIndex: "age"
        },
        {
          title: "Address",
          dataIndex: "address"
        }
      ],
      data: [
        {
          key: "1",
          name: "John Brown",
          age: 32,
          address: "New York No. 1 Lake Park"
        },
        {
          key: "2",
          name: "Jim Green",
          age: 42,
          address: "London No. 1 Lake Park"
        },
        {
          key: "3",
          name: "Joe Black",
          age: 32,
          address: "Sidney No. 1 Lake Park"
        }
      ]
    };
  }
  export() {
    const thead = this.state.columns.map(item => item.title);
    const tbody = this.state.columns.map(item => item.dataIndex);
    const tableData = this.state.data;
    const fileName = "导出测试";
    csvExport(thead, tbody, tableData, fileName);
  }
  render() {
    return (
      <div className={style.container}>
        <Table
          columns={this.state.columns}
          dataSource={this.state.data}
          size="middle"
          pagination={false}
        />
        <Button
          type="primary"
          className={style.button}
          onClick={this.export.bind(this)}
        >
          导出表格
        </Button>
      </div>
    );
  }
}

export default ExcelExport;
