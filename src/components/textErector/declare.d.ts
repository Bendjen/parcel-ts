export interface ITextList {
  readMeText?: string | IParttextItem[],
  exampleText?: string | IParttextItem[],
  htmlText?: string | IParttextItem[],
  javaScriptText?: string | IParttextItem[],
  cssText?: string | IParttextItem[]
}

export interface IProps {
  title: string,
  language: string,
  text: any
}

export interface IParttextItem {
  title: string,
  text: string
}