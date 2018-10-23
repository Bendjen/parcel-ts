// CSS表单美化
import React from "react";
import style from "./index.scss";
import { Row, Col } from "antd";

const AdvancedFormStyling = () => (
  <div className={style.container}>
    {/* 输入提示 */}
    <Row className={style.line}>
      <Col span={8} className={style.title}>
        Help Input
      </Col>
      <Col span={12} className={style.placeholderInput}>
        <input placeholder="Placeholder Text" type="text" required />
        <span>Help Text</span>
      </Col>
    </Row>
    {/* 必填提示 */}
    <Row className={style.line}>
      <Col span={8} className={style.title}>
        Required Input
      </Col>
      <Col span={12} className={style.requiredInput}>
        <input type="text" required />
        <span />
      </Col>
    </Row>
    {/* 可选提示 */}
    <Row className={style.line}>
      <Col span={8} className={style.title}>
        Optional Input
      </Col>
      <Col span={12} className={style.optionalInput}>
        <input type="text" />
        <span />
      </Col>
    </Row>
    {/* 禁用 */}
    <Row className={style.line}>
      <Col span={8} className={style.title}>
        Disabled Input
      </Col>
      <Col span={12} className={style.disabledInput}>
        <input type="text" disabled />
        <span />
      </Col>
    </Row>
    {/* 只读 */}
    <Row className={style.line}>
      <Col span={8} className={style.title}>
        Read-only Input
      </Col>
      <Col span={12} className={style.readyonlyInput}>
        <input type="text" value="read-only value" readOnly />
        <span />
      </Col>
    </Row>
    {/* 类型 */}
    <Row className={style.line}>
      <Col span={8} className={style.title}>
        Valid Input
      </Col>
      <Col span={12} className={style.validInput}>
        <input type="email" required />
        <span />
      </Col>
    </Row>
    {/* 范围 */}
    <Row className={style.line}>
      <Col span={8} className={style.title}>
        Range input
      </Col>
      <Col span={12} className={style.rangeInput}>
        <input type="number" min="1" max="10" />
        <span />
      </Col>
    </Row>
    {/* checkInput */}
    <Row className={style.line}>
      <Col span={8} className={style.title}>
        Checked Input
      </Col>
      <Col span={12} className={style.checkInput}>
        <input type="checkbox" name="checkbox" id="check-option-1" value="1" hidden />
        <label htmlFor="check-option-1">Option 1</label>
      </Col>
    </Row>
  </div>
);

export default AdvancedFormStyling;
