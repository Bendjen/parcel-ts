const FileSaver = require("file-saver");

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

    let preContent = "\uFEFF"; //防乱码
    
	let theadPart =
		thead.reduce((pre, cur, index) => {
			return pre + (index == 0 ? "" : ",") + cur;
        }, "") + "\n";
        
	let tbodyPart = tableData.reduce((pre, cur, index) => {
		let lineStr = tbody.reduce((linePre, lineCur, index) => {
			return (
				linePre +
				(index == 0 ? "" : ",") +
				(cur[lineCur] ? cur[lineCur] : "")
			);
		}, "");
		return pre + (index == 0 ? "" : "\n") + lineStr;
    }, "");
    
	let blob = new Blob([preContent + theadPart + tbodyPart], {
		type: "text/plain;charset=utf-8"
    });
    
	FileSaver.saveAs(blob, `${fileName}.csv`);
}
