const htmlText = `<div className={style.container}>
  <input type="range" />
</div>`;

const cssText = [
  {
    title: "Chorme",
    text: `//chorme
  .container {
    //1.去除默认样式
    input[type="range"] {
      appearance: none;
      width: 300px;
      border-radius: 10px; /*这个属性设置使填充进度条时的图形为圆角*/
      &::-webkit-slider-thumb {
        appearance: none;
      }
      //2.去除空间边框
      &:focus {
        outline: none;
      }
      //3.给滑动轨道(track)添加样式
      &::-webkit-slider-runnable-track {
        height: 15px;
        border-radius: 10px; /*将轨道设为圆角的*/
        box-shadow: 0 1px 1px #def3f8, inset 0 0.125em 0.125em #0d1112; /*轨道内置阴影效果*/
      }
      //4.给滑块(thumb)添加样式
      &::-webkit-slider-thumb {
        -webkit-appearance: none;
        height: 25px;
        width: 25px;
        margin-top: -5px; /*使滑块超出轨道部分的偏移量相等*/
        background: #ffffff;
        border-radius: 50%; /*外观设置为圆形*/
        border: solid 0.125em rgba(205, 224, 230, 0.5); /*设置边框*/
        box-shadow: 0 0.125em 0.125em #3b4547; /*添加底部阴影*/
      }
      //chorme根据滑块所在位置填充进度条需要用JS处理
    }
  }`
  },
  {
    title: "Firefox",
    text: `//fireFox
  .container {
    input[type="range"] {
      -webkit-appearance: none;
      width: 300px;
      border-radius: 10px; /*这个属性设置使填充进度条时的图形为圆角*/
      &::-webkit-slider-thumb {
        -webkit-appearance: none;
      }
      &:focus {
        outline: none;
      }
      //firefox滑道伪类
      &::-moz-range-track {
        height: 15px;
        border-radius: 10px; /*将轨道设为圆角的*/
        box-shadow: 0 1px 1px #def3f8, inset 0 0.125em 0.125em #0d1112; /*轨道内置阴影效果*/
      }
      //firefox滑块伪类
      &::-moz-range-thumb {
        -webkit-appearance: none;
        height: 25px;
        width: 25px;
        margin-top: -5px; /*使滑块超出轨道部分的偏移量相等*/
        background: #ffffff;
        border-radius: 50%; /*外观设置为圆形*/
        border: solid 0.125em rgba(205, 224, 230, 0.5); /*设置边框*/
        box-shadow: 0 0.125em 0.125em #3b4547; /*添加底部阴影*/
      }
      //firefox根据滑块所在位置填充进度条
      &::-moz-range-progress {
        background: linear-gradient(to right, #059cfa, white 100%, white);
        height: 13px;
        border-radius: 10px;
      }
    }
  }`
  },
  {
    title: "IE9+",
    text: `//ie9+
  .container {
    input[type="range"] {
      -webkit-appearance: none;
      width: 300px;
      border-radius: 10px;
    }
    //ie滑道伪类
    input[type="range"]::-ms-track {
      height: 25px;
      border-radius: 10px;
      box-shadow: 0 1px 1px #def3f8, inset 0 0.125em 0.125em #0d1112;
      border-color: transparent; /*去除原有边框*/
      color: transparent; /*去除轨道内的竖线*/
    }
    //ie滑块伪类
    input[type="range"]::-ms-thumb {
      border: solid 0.125em rgba(205, 224, 230, 0.5);
      height: 25px;
      width: 25px;
      border-radius: 50%;
      background: #ffffff;
      margin-top: -5px;
      box-shadow: 0 0.125em 0.125em #3b4547;
    }

    input[type="range"]::-ms-fill-lower {
      //进度条已填充的部分
      height: 22px;
      border-radius: 10px;
      background: linear-gradient(to right, #059cfa, white 100%, white);
    }

    input[type="range"]::-ms-fill-upper {
      //进度条未填充的部分
      height: 22px;
      border-radius: 10px;
      background: #ffffff;
    }

    //根据滑块所在位置填充进度条
    input[type="range"]:focus::-ms-fill-lower {
      background: linear-gradient(to right, #059cfa, white 100%, white);
    }

    input[type="range"]:focus::-ms-fill-upper {
      background: #ffffff;
    }
  }`
  }
];

export default { htmlText, cssText };
