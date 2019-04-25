import React from "react";
import { Button } from 'antd';
import "antd/dist/antd.css";

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
    this.handleClick = this.handleClick.bind(this);
    this.addScript();
  }

  addScript() {
    const scriptTracking = document.createElement("script");
    scriptTracking.setAttribute("type", "text/javascript");
    scriptTracking.setAttribute("src", "lib/tracking-min.js");
    const scriptFace = document.createElement("script");
    scriptFace.setAttribute("type", "text/javascript");
    scriptFace.setAttribute("src", "lib/face-min.js");
    document.documentElement.appendChild(scriptFace);
    document.documentElement.appendChild(scriptTracking);
  }

  handleClick() {
    if (!tracking) {
      this.setState({ loading: true })
      setTimeout(() => {
        this.setState({ loading: false })
      }, 5000)
    }
  }

  render() {
    return (
      <div>
        <Button type="primary" loading={this.state.loading} onClick={this.handleClick}>
          {this.state.loading ? '资源加载中，请稍后' : '拍摄'}
        </Button>
      </div>

    );
  }
}

export default Demo;
