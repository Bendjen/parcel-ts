import React from "react";
import { Icon, message, Modal } from 'antd';
import "antd/dist/antd.css";
import style from "./index.scss";
class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pictureLoading: false,
      cameraLoading: false,
      pictureBase64: '',
      faceRect: [],
      cropFace: [],
      visible: false
    };
    this.handlePictureClick = this.handlePictureClick.bind(this);
    this.handleCameraClick = this.handleCameraClick.bind(this);
    this.fileChange = this.fileChange.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.pictureInput = React.createRef();
    this.addScript();
  }

  addScript() {
    const scriptTracking = document.createElement("script");
    scriptTracking.setAttribute("type", "text/javascript");
    scriptTracking.setAttribute("src", "lib/tracking-min.js");
    const scriptFace = document.createElement("script");
    scriptFace.setAttribute("type", "text/javascript");
    scriptFace.setAttribute("src", "lib/face-min.js");
    const scriptHtml2canvas = document.createElement("script");
    document.documentElement.appendChild(scriptFace);
    document.documentElement.appendChild(scriptTracking);
  }

  handlePictureClick() {
    if (!tracking && !this.pictureLoading) {
      this.setState({ pictureLoading: true })
      setTimeout(() => {
        this.setState({ pictureLoading: false })
      }, 5000)
    } else {
      this.pictureInput.current.click()
    }
  }
  handleCameraClick() {
    if (!tracking && !this.cameraLoading) {
      this.setState({ cameraLoading: true })
      setTimeout(() => {
        this.setState({ cameraLoading: false })
      }, 5000)
    }
  }

  fileChange() {
    const that = this;
    const reader = new FileReader();
    const file = this.pictureInput.current.files[0];
    if (file) {
      const hideReadLoading = message.loading('读取图片..', 0);
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        hideReadLoading()
        const hideDetectLoading = message.loading('正在识别人像..', 0);
        this.setState({ pictureBase64: e.target.result, visible: true })
        setTimeout(() => {
          const faces = new tracking.ObjectTracker(['face'])
          // faces.setScaleFactor(2)   // 1.1 ~ 2
          // faces.setStepSize(2)      // 1.1 ~ 2  越大，能识别的人脸特写越大
          faces.on('track', (event) => {
            hideDetectLoading()
            if (event.data.length === 0) {
              message.warning('未能在该图片中识别到人脸，请避免阴影与逆光，且确保图片质量清晰。', 3);
            } else {
              that.setState({ faceRect: event.data })
            }
          })
          tracking.track('#pictureBase64', faces);
        }, 1000)
      };
      reader.onerror = () => {
        hideLoading()
        this.setState({ pictureBase64: '' })
      }
    }
  }

  async handleOk() {
    if (this.state.faceRect.length === 0) {
      this.setState({ visible: false, faceRect: [] })
    } else {
      const img = document.getElementById("pictureBase64");
      const canvas = document.getElementById("mycanvas")
      const faceCtx = canvas.getContext('2d');
      const imgList = [];
      this.state.faceRect.forEach(rect => {
        canvas.width = rect.width;
        canvas.height = rect.height;
        faceCtx.drawImage(img, rect.x, rect.y, rect.width, rect.height, 0, 0, rect.width, rect.height)
        const faceBase64 = canvas.toDataURL("image/png");
        imgList.push(faceBase64)
      })
      this.setState({ cropFace: imgList })
    }
    this.pictureInput.current.value = ''
  }

  handleCancel() {
    this.pictureInput.current.value = ''
    this.setState({ visible: false, faceRect: [] })
  }

  renderPreviewModal() {
    return (
      <Modal
        title="人脸采集"
        width={800}
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <div data-flex='main:center corss:center' id='pictureContainer'>
          <img id='pictureBase64' className={style.pictureBase64} src={this.state.pictureBase64} />
          {this.state.faceRect.map((rect, index) => {
            const img = document.getElementById('pictureBase64')
            return (<div className={style.rect} id={`rect${index}`} key={index} style={{ width: rect.width, height: rect.height, left: img.offsetLeft + rect.x, top: img.offsetTop + rect.y }}></div>)
          })}
        </div>
      </Modal>
    )
  }

  render() {
    return (
      <div className={style.container}>
        {/* 人像来源 */}
        <h2>选择人像来源：</h2>
        <div data-flex='main:center cross:center'>
          <div className={style.button} onClick={this.handlePictureClick}>
            {this.state.pictureLoading ?
              <div data-flex='dir:top main:center cross:center' >
                <Icon type="loading" style={{ fontSize: 120, color: "#1890FF" }} />
                <span className={style.label}>资源加载中...</span>
              </div>
              :
              <div data-flex='dir:top main:center cross:center'>
                <Icon type="picture" style={{ fontSize: 120 }} theme="twoTone" />
                <span className={style.label}>选择图片</span>
              </div>
            }
          </div>
          <div className={style.button} onClick={this.handleCameraClick}>
            {this.state.cameraLoading ?
              <div data-flex='dir:top main:center cross:center' >
                <Icon type="loading" style={{ fontSize: 120, color: "#1890FF" }} />
                <span className={style.label}>资源加载中...</span>
              </div>
              :
              <div data-flex='dir:top main:center cross:center'>
                <Icon type="camera" style={{ fontSize: 120 }} theme="twoTone" />
                <span className={style.label}>现场拍摄</span>
              </div>
            }
          </div>
          <input type="file" hidden accept="image/*" ref={this.pictureInput} onChange={this.fileChange}></input>
        </div>

        {/* 所捕获人像 */}
        <h2>捕获人像：</h2>
        <div data-flex='main:center cross:center' style={{ flexWrap: 'wrap' }}>
          {this.state.cropFace.map((base64, index) => {
            return <img key={index} src={base64}></img>
          })}
        </div>

        <canvas id="mycanvas" hidden></canvas>
        {this.renderPreviewModal()}
      </div>
    );
  }
}

export default Demo;
