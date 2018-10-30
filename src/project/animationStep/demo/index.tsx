import * as React from "react";
import style from "./index.scss";

class AnimationStep extends React.Component {
  constructor(props: {}) {
    super(props);
    this.state = {};
  }
  public render() {
    return (
      <div className={style.container}>
        <p className={style.title}>素材图片：</p>
        <div className={style.imgScroll}>
          <img src="img/assets/zan.png" />
        </div>
        <p className={style.title}>动画效果：</p>
        <div className="zanAnimation" />
      </div>
    );
  }
}

export default AnimationStep;
