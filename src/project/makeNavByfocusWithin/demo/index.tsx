import React from "react";
import { Link } from "react-router-dom";
import './index.scss'
const MakeNavByfocusWithin = () => (
    <div className='nav_container'>

        <a className='nav_baseIcon'>
            <i className='iconfont icon-xiangzi icon_common nav_icon_xiangzi' />
        </a>

        <ul className='nav_iconList'>
            <Link to="#"><i className='iconfont icon-JavaScript icon_common nav_icon_JavaScript' /></Link>
            <Link to="#"><i className='iconfont icon-css icon_common nav_icon_css' /></Link>
            <Link to="#"><i className='iconfont icon-dengpao icon_common nav_icon_dengpao' /></Link>
        </ul>

    </div>
);

export default MakeNavByfocusWithin