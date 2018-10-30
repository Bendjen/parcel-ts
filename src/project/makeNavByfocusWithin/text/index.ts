const htmlText = `<div className='nav_container'>
  <a className='nav_baseIcon'>
      <i className='iconfont icon-xiangzi icon_common nav_icon_xiangzi'></i>
  </a>

  <ul className='nav_iconList'>
      <a href="#"><i className='iconfont icon-JavaScript icon_common nav_icon_JavaScript'></i></a>
      <a href="#"><i className='iconfont icon-css icon_common nav_icon_css'></i></a>
      <a href="#"><i className='iconfont icon-dengpao icon_common nav_icon_dengpao'></i></a>
  </ul>
</div>`;

const cssText = `// 通用部分
.icon_common {
    display: inline-block;
    font-size: 40px;
    transition: all 0.2s ease-in-out;
    &:hover {
        transform: scale(1.2);
    }
} 

// 结构部分
.nav_container {
    cursor: pointer;
    margin-right: 180px;
    z-index:10;
    &:focus .nav_iconList,
    &:focus-within .nav_iconList,
    &:hover .nav_iconList {
        width: 100px;    //控制一行显示多少个图标，默认是图标自身的尺寸，足够大可以并排
        display: inline-block;
        opacity: 1;
        transform: translateY(0px);
        height: auto;
        padding-left:40px;
    }
}
.nav_iconList {
    position: absolute; //脱离文档流，不影响父容器的尺寸
    opacity: 0; //初始动画
    transform: translateY(-20px); //初始动画
    height: 0px; //初始隐藏
    overflow: hidden; //初始隐藏
    transition: transform .2s ease-in-out, opacity .1s ease-out; 
} 

// 特性部分
.nav_icon_xiangzi {
    color: #666666;
    font-size: 50px;
}
.nav_icon_JavaScript {
    color: #EEAF4B;
}
.nav_icon_css {
    color: #209AD7;
}
.nav_icon_dengpao {
    color: #EEE051;
}`;

export default { htmlText, cssText };
