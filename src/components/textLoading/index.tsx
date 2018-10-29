import { Icon, Spin } from 'antd';
import * as React from 'react';
import style from './index.scss'

const loadingIcon = <Icon type="loading" className={style.loadingIcon} spin={true} />;

const TextLoading = () => (
  <section key="demo" >
    <h2 className={style.title}>Code:</h2>
    <div className={style.content} data-flex="dir:top main:center cross:center">
      <Spin indicator={loadingIcon} />
      <p className={style.loadingText}>Loading...</p>
    </div>
  </section>
);

export default TextLoading