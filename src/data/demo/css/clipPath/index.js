import React from "react";
import style from "./index.scss";
import { Link } from "react-router-dom";

class clipPath extends React.Component {
  componentDidMount() {
    const bg = document.querySelector("#bg");
    const cut = document.querySelector("#cut");
    cut.addEventListener("mouseenter", event => {
      bg.classList.add("dimmed");
    });
    cut.addEventListener("mouseleave", event => {
      bg.classList.remove("dimmed");
    });
  }
  componentWillUnmount() {
    cut.removeEventListener("mouseenter", event => {
      bg.classList.remo("dimmed");
    });
    cut.removeEventListener("mouseleave", event => {
      bg.classList.remove("dimmed");
    });
  }
  render() {
    return (
      <div data-flex="dir:top main:center">
        <p>请将鼠标移至花上</p>
        <div className="container">
          <div className="flower" id="bg" />
          <div className="cut flower" id="cut" />
        </div>
      </div>
    );
  }
}

export default clipPath;
