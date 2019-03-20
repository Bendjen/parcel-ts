import React from "react";
import { Link } from "react-router-dom";
import Nav from "../nav";
import style from "./index.scss";

const Header = () => (
  <header className={style.header} data-flex="cross:center">
    <div className={style.container} data-flex="main:justify cross:center">
      <div data-flex="cross:center">
        <Link
          data-flex="cross:center"
          className={style.icon}
          to="/about"
        >
          <i className="iconfont icon-kafeidou" />
          <span>Bendjen</span>
        </Link>
      </div>
      <Nav />
    </div>
  </header>
);

export default Header;
