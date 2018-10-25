const javaScriptText = `const FileSaver = require("file-saver");

export default function(
	thead = [],
	tbody = [],
	tableData = [],
	fileName = "导出"
) {
	if (tableData.length == 0 || !tableData) {
		alert("没有可供导出的数据！");
		return false;
	}

    let preContent = "\\uFEFF"; //防乱码
    
	let theadPart =
		thead.reduce((pre, cur, index) => {
			return pre + (index == 0 ? "" : ",") + cur;
        }, "") + "\\n";
        
	let tbodyPart = tableData.reduce((pre, cur, index) => {
		let lineStr = tbody.reduce((linePre, lineCur, index) => {
			return (
				linePre +
				(index == 0 ? "" : ",") +
				(cur[lineCur] ? cur[lineCur] : "")
			);
		}, "");
		return pre + (index == 0 ? "" : "\\n") + lineStr;
    }, "");
    
	let blob = new Blob([preContent + theadPart + tbodyPart], {
		type: "text/plain;charset=utf-8"
    });
    
	FileSaver.saveAs(blob, \`\${fileName}.csv\`);
}

`;

const exampleText = [
  {
    title: "数据",
    text: `this.state = {
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
  }`
  },
  {
    title: "提取",
    text: `const thead = this.state.columns.map(item => item.title);
const tbody = this.state.columns.map(item => item.dataIndex);
const tableData = this.state.data;
const fileName = "导出测试";
csvExport(thead, tbody, tableData, fileName);`
  }
];

export default { javaScriptText, exampleText };
