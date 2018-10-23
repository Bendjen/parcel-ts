// CSS表单美化
import React from "react";
import style from "./index.scss";

class WebVedioOfHtml5 extends React.Component {
  constructor(props) {
    super(props);
  }
  play() {
    const video = document.querySelector("#video");
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        video.pause();
        console.log("paly操作似乎出了一些问题");
      });
    }
  }

  pause() {
    document.querySelector("#video").pause();
  }
  render() {
    return (
      <div className={style.container}>
        <video className={style.video} id="video" src="./dist/video/test.mp4" controls="controls"/>
        <div className={style.controls}>
          <button className="play" onClick={this.play.bind(this)}>
            Play
          </button>
          <button className="pause" onClick={this.pause.bind(this)}>
            Pause
          </button>
          <div className={style.progress}>
            <input type="range" />
          </div>
          {/* <div className='time'></div>
        <div className='volume'></div>
        <div className='resolution'></div>
        <div className='fullScreen'></div>
        <div className='fullScreen-cancel'></div> */}
        </div>
      </div>
    );
  }
}

export default WebVedioOfHtml5;
