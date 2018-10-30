import * as React from "react";
import style from "./index.scss";

import { makeDOMDriver } from "@cycle/dom";
import { run } from "@cycle/run";
import main from "./cycleApp/index";

class ReactiveProgramming extends React.Component {
  public componentDidMount() {
    run(main, {
      DOM: makeDOMDriver("#app")
    });
  }
  public render() {
    return (
      <div className={style.container}>
        <div id="app" />
      </div>
    );
  }
}

export default ReactiveProgramming;
