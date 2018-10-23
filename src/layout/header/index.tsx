import React from "react";
import Nav from "../nav";
import style from "./index.scss";

const Header = () => (
  <header className={style.header} data-flex="cross:center">
    <div className={style.container} data-flex="main:justify cross:center">
      <div data-flex="cross:center">
        <i className="iconfont icon-kafeidou" />
        <span>Bendjen</span>
      </div>
      <Nav />
    </div>
  </header>
);

export default Header;
