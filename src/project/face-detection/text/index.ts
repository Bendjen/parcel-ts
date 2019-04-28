const cssText = `
:local{
  .container{
    width: 100%;
    padding: 20px;
    h2{
      font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
      font-size: 16px;
      margin: 20px;
    }
  }
  .button{
    border:2px solid #E6F7FF;
    border-radius: 5px;
    cursor: pointer;
    padding: 20px 60px;
    margin: 0 30px;
  }
  .label{
    padding-top: 20px;
    font-size: 14px;
  }
  .cameraContainer,.pictureBase64{
    max-width: 600px;
    max-height: 600px;
  }
  .rect {
    border-radius: 2px;
    border: 3px solid white;
    // box-shadow: 0 16px 28px 0 rgba(0, 0, 0, 0.3);
    cursor: pointer;
    left: -1000px;
    position: absolute;
    top: -1000px;
  }

  .postScript{
    margin: 40px 0;
    text-align: center;
  }
  
}
`;


const javaScriptText = `
import React from "react";
import { Icon, message, Modal } from 'antd';
import "antd/dist/antd.css";
import style from "./index.scss";
class FaceDetection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pictureLoading: false,
      cameraLoading: false,
      pictureBase64: '',
      pictureFaceRect: [],
      videoFaceRect: [],
      cropFace: [],
      pictureModalVisible: false,
      cameraModalVisible: false
    };
    this.handlePictureClick = this.handlePictureClick.bind(this);
    this.handleCameraClick = this.handleCameraClick.bind(this);
    this.fileChange = this.fileChange.bind(this);
    this.handlePictureCancel = this.handlePictureCancel.bind(this);
    this.handlePictureOk = this.handlePictureOk.bind(this);
    this.handleCameraCancel = this.handleCameraCancel.bind(this);
    this.handleCameraOk = this.handleCameraOk.bind(this);
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
    const scriptWebcam = document.createElement("script");
    scriptWebcam.setAttribute("type", "text/javascript");
    scriptWebcam.setAttribute("src", "lib/webcam.min.js");
    document.documentElement.appendChild(scriptFace);
    document.documentElement.appendChild(scriptTracking);
    document.documentElement.appendChild(scriptWebcam);
  }

  handlePictureClick() {
    if ((!tracking || !Webcam) && !this.pictureLoading) {
      this.setState({ pictureLoading: true })
      setTimeout(() => {
        this.setState({ pictureLoading: false })
      }, 5000)
    } else {
      this.pictureInput.current.click()
    }
  }

  handleCameraClick() {
    let that = this;
    if ((!tracking || !Webcam) && !this.cameraLoading) {
      this.setState({ cameraLoading: true })
      setTimeout(() => {
        this.setState({ cameraLoading: false })
      }, 5000)
    } else {
      this.setState({ cameraModalVisible: true })
      const hideCameraLoading = message.loading('正在连接摄像头..', 0);
      setTimeout(() => {
        Webcam.attach('#camera');
        hideCameraLoading()
        const tracker = new tracking.ObjectTracker(['face'])
        // tracker.setScaleFactor(2)   // 1.1 ~ 2
        // tracker.setStepSize(2)      // 1.1 ~ 2  越大，能识别的人脸特写越大
        tracker.on('track', (event) => {
          that.setState({ videoFaceRect: event.data })
        })

        function addCameraTrack() {
          setTimeout(() => {
            const vedio = document.querySelector('#camera video')
            if (vedio) {
              tracking.track('#camera video', tracker);
            } else {
              addCameraTrack()
            }
          }, 1000)
        }
        addCameraTrack()

      }, 500);
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
        this.setState({ pictureBase64: e.target.result, pictureModalVisible: true })
        setTimeout(() => {
          const tracker = new tracking.ObjectTracker(['face'])
          // faces.setScaleFactor(2)   // 1.1 ~ 2
          // faces.setStepSize(2)      // 1.1 ~ 2  越大，能识别的人脸特写越大
          tracker.on('track', (event) => {
            hideDetectLoading()
            if (event.data.length === 0) {
              message.warning('未能在该图片中识别到人脸，请避免阴影与逆光，且确保图片质量清晰。', 3);
            } else {
              that.setState({ pictureFaceRect: event.data })
            }
          })
          tracking.track('#pictureBase64', tracker, { camera: true });
        }, 1000)
      };
      reader.onerror = () => {
        hideLoading()
        this.setState({ pictureBase64: '' })
      }
    }
  }

  handlePictureOk() {
    if (this.state.pictureFaceRect.length === 0) {
      message.warning('没有可识别的人像供捕获', 3);
      this.setState({ pictureModalVisible: false, pictureFaceRect: [] })
    } else {
      const img = document.getElementById("pictureBase64");
      const canvas = document.getElementById("mycanvas")
      const faceCtx = canvas.getContext('2d');
      const imgList = [];
      this.state.pictureFaceRect.forEach(rect => {
        canvas.width = rect.width;
        canvas.height = rect.height;
        faceCtx.drawImage(img, rect.x, rect.y, rect.width, rect.height, 0, 0, rect.width, rect.height)
        const faceBase64 = canvas.toDataURL("image/png");
        imgList.push(faceBase64)
      })
      this.setState({ cropFace: imgList, pictureModalVisible: false, pictureFaceRect: [] })
    }
    this.pictureInput.current.value = ''
  }

  handlePictureCancel() {
    this.pictureInput.current.value = ''
    this.setState({ pictureModalVisible: false, pictureFaceRect: [] })
  }

  handleCameraOk() {
    if (this.state.videoFaceRect.length === 0) {
      message.warning('没有可识别的人像供捕获', 3);
      this.setState({ cameraModalVisible: false, videoFaceRect: [] })
    } else {
      const vedio = document.querySelector('#camera video');
      const canvas = document.getElementById("mycanvas")
      const faceCtx = canvas.getContext('2d');
      const imgList = [];
      this.state.videoFaceRect.forEach(rect => {
        canvas.width = rect.width;
        canvas.height = rect.height;
        faceCtx.drawImage(vedio, rect.x, rect.y, rect.width, rect.height, 0, 0, rect.width, rect.height)
        const faceBase64 = canvas.toDataURL("image/png");
        imgList.push(faceBase64)
      })
      this.setState({ cropFace: imgList, cameraModalVisible: false, videoFaceRect: [] })
    }
  }

  handleCameraCancel() {
    this.setState({ cameraModalVisible: false, videoFaceRect: [] })
    Webcam.reset()
  }

  renderPictureModal() {
    return (
      <Modal
        title="人脸采集"
        width={800}
        okText='捕获人像'
        cancelText='取消'
        visible={this.state.pictureModalVisible}
        onOk={this.handlePictureOk}
        onCancel={this.handlePictureCancel}
      >
        <div data-flex='main:center corss:center' id='pictureContainer'>
          <img id='pictureBase64' className={style.pictureBase64} src={this.state.pictureBase64} />
          {this.state.pictureFaceRect.map((rect, index) => {
            const img = document.getElementById('pictureBase64')
            if (img) {
              return (<div className={style.rect} id={\`rect\${index}\`} key={index} style={{ width: rect.width, height: rect.height, left: img.offsetLeft + rect.x, top: img.offsetTop + rect.y }}></div>)
            } else {
              return null
            }
          })}
        </div>
      </Modal>
    )
  }

  renderCameraModal() {
    return (
      <Modal
        title="人脸采集"
        width={800}
        okText='捕获人像'
        cancelText='取消'
        visible={this.state.cameraModalVisible}
        onOk={this.handleCameraOk}
        onCancel={this.handleCameraCancel}
      >
        <div data-flex='main:center corss:center'>
          <div id="camera" style={{ width: 600, height: 600 }}></div>
          {this.state.videoFaceRect.map((rect, index) => {
            const video = document.querySelector('#camera video')
            if (video) {
              return (<div className={style.rect} id={\`rect\${index}\`} key={index} style={{ width: rect.width, height: rect.height, left: video.offsetLeft + rect.x, top: video.offsetTop + rect.y }}></div>)
            } else {
              return null
            }
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
        <p className={style.postScript}>说明：过大的人脸特写可能导致无法识别，请选用人脸大小适中的图片。</p>
        {/* 所捕获人像 */}
        <h2>捕获人像：</h2>
        <div data-flex='main:center cross:center' style={{ flexWrap: 'wrap' }}>
          {this.state.cropFace.map((base64, index) => {
            return <img style={{ margin: '0 20px' }} key={index} src={base64}></img>
          })}
        </div>

        <canvas id="mycanvas" hidden></canvas>
        {this.renderPictureModal()}
        {this.renderCameraModal()}
      </div>
    );
  }
}

export default FaceDetection;
`;

export default { cssText, javaScriptText };
