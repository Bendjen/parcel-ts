// CSS表单美化
import React from "react";
import style from "./index.scss";

import main from "./cycleApp";
import { run } from "@cycle/run";
import { makeDOMDriver } from "@cycle/dom";

class ReactiveProgramming extends React.Component {
  componentDidMount() {
    run(main, {
      DOM: makeDOMDriver("#app")
    });
  }
  render() {
    return (
      <div className={style.container}>
        <div id="app" />
      </div>
    );
  }
}

export default ReactiveProgramming;
