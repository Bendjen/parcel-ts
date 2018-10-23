import * as React from "react";
import style from "./index.scss";

class Body extends React.Component<{}, {}> {
  public render() {
    return <div className={style.body}>{this.props.children}</div>;
  }
}

export default Body;
