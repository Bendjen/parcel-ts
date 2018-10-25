export interface IColumnsItem {
  title: string,
  dataIndex: string
}

export interface IDataItem {
  key: string,
  name: string,
  age: number,
  address: string
}

export interface IState {
  columns: IColumnsItem[],
  data: IDataItem[]
}