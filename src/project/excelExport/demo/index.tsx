import { Button, Table } from "antd";
import React from "react";
import { IColumnsItem, IState } from '../declare'
import csvExport from "./csvExport";
import style from "./index.scss";

class ExcelExport extends React.Component<{}, IState> {
  constructor(props: {}) {
    super(props);
    this.export = this.export.bind(this);
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
  public render() {
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
          onClick={this.export}
        >
          导出表格
        </Button>
      </div>
    );
  }
  private export() {
    const thead = this.state.columns.map((item: IColumnsItem) => item.title);
    const tbody = this.state.columns.map((item: IColumnsItem) => item.dataIndex);
    const tableData = this.state.data;
    const fileName = "导出表格";
    csvExport(thead, tbody, tableData, fileName);
  }
}

export default ExcelExport;
