// tslint:disable-next-line:no-var-requires
const FileSaver = require("file-saver");
import { IDataItem } from '../declare'

export default function (
	thead: string[] = [],
	tbody: string[] = [],
	tableData: IDataItem[] = [],
	fileName: string = "导出"
): any {
	if (tableData.length === 0 || !tableData) {
		alert("没有可供导出的数据！");
		return false;
	}

	const preContent = "\uFEFF"; // 防乱码

	const theadPart =
		thead.reduce((pre, cur, index) => {
			return pre + (index === 0 ? "" : ",") + cur;
		}, "") + "\n";

	const tbodyPart = tableData.reduce((pre, cur, tbodyPartIndex) => {
		const lineStr = tbody.reduce((linePre, lineCur, lineStrIndex) => {
			return (
				linePre +
				(lineStrIndex === 0 ? "" : ",") +
				(cur[lineCur] ? cur[lineCur] : "")
			);
		}, "");
		return pre + (tbodyPartIndex === 0 ? "" : "\n") + lineStr;
	}, "");

	const blob = new Blob([preContent + theadPart + tbodyPart], {
		type: "text/plain;charset=utf-8"
	});

	FileSaver.saveAs(blob, `${fileName}.csv`);
}
