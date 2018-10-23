// CSS表单美化
import React from "react";
import style from "./index.scss";

class MicroFront extends React.Component {
  open(){
    var script = document.createElement("script");
  
    script.src = './666.js'
    document.querySelector('#reactComponent').append(
      script
    )
  }
  render() {
    return (
      <div className={style.container}>
        <nav className={style.nav} data-flex="main start">
          <div onClick={this.open}>react</div>
          <div>vue</div>
          <div>other</div>
        </nav>
        <div id="reactComponent" />
      </div>
    );
  }
}

export default MicroFront;
