// CSS表单美化
import React from "react";
import style from "./index.scss";

class BidirectionalBindings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "123"
    };
  }
  componentDidMount() {
    let user = { name: "" };
    function bind(object, key, domElem, attributeName = "value") {
      //相当于原本从state中取值桥接到从dom中取值
      Object.defineProperty(object, key, {
        //取值从dom中取值
        get: function() {
          return attributeName == "value"
            ? domElem.value
            : domElem.getAttribute("value");
        },
        //通过命令设置值时同时设置所有绑定了dom的值
        set: function(value) {
          console.log(value)
          attributeName == "value"
            ? (domElem.value = value)
            : domElem.setAttribute(attributeName, value);
        },
        configurable: true
      });
    }

    let inputElem = document.getElementById("inputBox");
    // let spanElme = document.getElementById("spanBox");

    bind(user, "name", inputElem);
    // model(this.state, "name", spanElme);

    let that = this;
    inputElem.addEventListener("input", () => {
      console.log(that.state.name);
    });    inputElem.addEventListener("input", () => {
      console.log(that.state.name);
    });
  }
  render() {
    return (
      <div className={style.container}>
        <input id="inputBox" placeholder="12345" />
        <span />
      </div>
    );
  }
}

export default BidirectionalBindings;
