webpackJsonp([8],{280:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.default={javaScriptText:'const FileSaver = require("file-saver");\n\nexport default function(\n\tthead = [],\n\ttbody = [],\n\ttableData = [],\n\tfileName = "\u5bfc\u51fa"\n) {\n\tif (tableData.length == 0 || !tableData) {\n\t\talert("\u6ca1\u6709\u53ef\u4f9b\u5bfc\u51fa\u7684\u6570\u636e\uff01");\n\t\treturn false;\n\t}\n\n    let preContent = "\\uFEFF"; //\u9632\u4e71\u7801\n    \n\tlet theadPart =\n\t\tthead.reduce((pre, cur, index) => {\n\t\t\treturn pre + (index == 0 ? "" : ",") + cur;\n        }, "") + "\\n";\n        \n\tlet tbodyPart = tableData.reduce((pre, cur, index) => {\n\t\tlet lineStr = tbody.reduce((linePre, lineCur, index) => {\n\t\t\treturn (\n\t\t\t\tlinePre +\n\t\t\t\t(index == 0 ? "" : ",") +\n\t\t\t\t(cur[lineCur] ? cur[lineCur] : "")\n\t\t\t);\n\t\t}, "");\n\t\treturn pre + (index == 0 ? "" : "\\n") + lineStr;\n    }, "");\n    \n\tlet blob = new Blob([preContent + theadPart + tbodyPart], {\n\t\ttype: "text/plain;charset=utf-8"\n    });\n    \n\tFileSaver.saveAs(blob, `${fileName}.csv`);\n}\n\n',exampleText:[{title:"\u6570\u636e",text:'this.state = {\n    columns: [\n      {\n        title: "Name",\n        dataIndex: "name"\n      },\n      {\n        title: "Age",\n        dataIndex: "age"\n      },\n      {\n        title: "Address",\n        dataIndex: "address"\n      }\n    ],\n    data: [\n      {\n        key: "1",\n        name: "John Brown",\n        age: 32,\n        address: "New York No. 1 Lake Park"\n      },\n      {\n        key: "2",\n        name: "Jim Green",\n        age: 42,\n        address: "London No. 1 Lake Park"\n      },\n      {\n        key: "3",\n        name: "Joe Black",\n        age: 32,\n        address: "Sidney No. 1 Lake Park"\n      }\n    ]\n  }'},{title:"\u63d0\u53d6",text:'const thead = this.state.columns.map(item => item.title);\nconst tbody = this.state.columns.map(item => item.dataIndex);\nconst tableData = this.state.data;\nconst fileName = "\u5bfc\u51fa\u6d4b\u8bd5";\ncsvExport(thead, tbody, tableData, fileName);'}]}}});
//# sourceMappingURL=8.80f62388.chunk.js.map