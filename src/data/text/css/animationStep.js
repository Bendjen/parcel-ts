const cssText = `
.animation {
  margin: auto;
  width: 100px;
  height: 100px;
  background: url(img/assets/zan.png)
    left center no-repeat;
  animation: tt 1s steps(20, start) forwards infinite;
}

//  steps(num,position)  num:拆分的步骤数    position:取每个拆分块的开始帧还是结束帧
//  forwards : 全部完成后是否要补上100%时候的结束帧
//  infinite : 开启无限循环

@keyframes tt {
  from {
    background-position: 0;
  }
  to {
    background-position: right;
  }
}

`;

export default { cssText };
