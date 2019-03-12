import * as React from "react";
import SyntaxHighlighter from "react-syntax-highlighter/prism";
import { atomDark } from "react-syntax-highlighter/styles/prism";
import { IParttextItem, IProps, ITextList } from "./declare.d"
import style from './index.scss'

class TextRender extends React.Component<IProps>{

  public render() {
    if (!!this.props.text) {
      if (this.props.title === '说明') {
        return this.introduceRender()
      } else {
        return this.codeRender()
      }
    }else{
      return ''
    }
  }

  private introduceRender(): any {
    return (
      <div key={this.props.title}>
        <h2 className={style.title}>{this.props.title}</h2>
        <div
          className={style.text}
          dangerouslySetInnerHTML={{ __html: this.props.text }}
        />
      </div>
    )
  }
  private codeRender(): any {
    return (
      <div key={this.props.title}>
        <h2 className={style.title}>{this.props.title}</h2>

        {typeof this.props.text === "string" ?
          <div className={style.content}>
            <SyntaxHighlighter language={this.props.language} style={atomDark}>{this.props.text}</SyntaxHighlighter>
          </div>
          :
          <div className={style.content}>
            {
              this.props.text.map((item: IParttextItem) => {
                return (
                  <div key={item.title} className={style.part}>
                    <h3>{item.title}：</h3>
                    <SyntaxHighlighter language={this.props.language} style={atomDark}>{item.text}</SyntaxHighlighter>
                  </div>
                );
              })
            }
          </div>
        }
      </div>
    )
  }

}


function textErector(textList: ITextList): any {
  // tslint:disable-next-line:max-classes-per-file
  return class TextErector extends React.Component {
    public render() {
      return (
        <section>
          <TextRender title='说明' language='html' text={textList.readMeText} />
          <TextRender title='使用' language='javascript' text={textList.exampleText} />
          <TextRender title='Html' language='html' text={textList.htmlText} />
          <TextRender title='JavaScript' language='jsx' text={textList.javaScriptText} />
          <TextRender title='CSS' language='scss' text={textList.cssText} />
        </section>
      )
    }
  }
}

export default textErector