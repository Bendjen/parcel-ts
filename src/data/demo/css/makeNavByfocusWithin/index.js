import React from "react";
import style from './index.scss'
import { Link } from "react-router-dom";
const MakeNavByfocusWithin = () => (
    <div className='nav_container'>

        <a className='nav_baseIcon'>
            <i className='iconfont icon-xiangzi icon_common nav_icon_xiangzi'></i>
        </a>

        <ul className='nav_iconList'>
            <Link to="#"><i className='iconfont icon-JavaScript icon_common nav_icon_JavaScript'></i></Link>
            <Link to="#"><i className='iconfont icon-css icon_common nav_icon_css'></i></Link>
            <Link to="#"><i className='iconfont icon-dengpao icon_common nav_icon_dengpao'></i></Link>
        </ul>

    </div>
);

export default MakeNavByfocusWithin