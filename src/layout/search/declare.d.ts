export interface IOptionItem {
  id: string;
  img: string;
  route: string;
  title: string;
  type?: string;
  dependencies?:[string];
  reference?:string;
  catelog?:string
}