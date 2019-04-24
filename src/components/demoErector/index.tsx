import * as React from "react";
import style from './index.scss'


function demoErector(Demo: any): any {
  return class DemoErector extends React.Component {
    public render() {
      if (Demo) {
        return (
          <section key="demo">
            <h2 className={style.title}>Demo</h2>
            <div className={style.content} data-flex="main:center">
              <Demo />
            </div>
          </section>
        );
      } else {
        return ''
      }
    }
  }
}

export default demoErector