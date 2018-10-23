import xs from "xstream";
// import Rx from "rxjs";
// import { run } from "@cycle/run";
import { div, input, h2, makeDOMDriver } from "@cycle/dom";
import isolate from "@cycle/isolate";

import LabeledSlider from "./LabeledSlider";

function main(sources) {
  //实例化组件
  const weightSlider = isolate(LabeledSlider)({
    DOM: sources.DOM,
    props: xs.of({
      label: "Weight",
      unit: "kg",
      min: 40,
      value: 70,
      max: 150
    })
  });
  const heightSlider = isolate(LabeledSlider)({
    DOM: sources.DOM,
    props: xs.of({
      label: "Height",
      unit: "cm",
      min: 140,
      value: 170,
      max: 210
    })
  });

  //获取组件的流与dom
  const { value: weightValue$, DOM: weightVDom$ } = weightSlider;
  const { value: heightValue$, DOM: heightVDom$ } = heightSlider;

  const bmi$ = xs
    .combine(weightValue$, heightValue$)
    .map(([weight, height]) => {
      const heightMeters = height * 0.01;
      const bmi = Math.round(weight / (heightMeters * heightMeters));
      return bmi;
    })
    .remember();

  //组合进父组件vdom
  const vdom$ = xs
    .combine(bmi$, weightVDom$, heightVDom$)
    .map(([bmi, weightVDom, heightVDom]) =>
      div([
        weightVDom,
        heightVDom,
        h2({ style: { marginTop: "20px" } }, `BMI is   ${bmi}`)
      ])
    );

  return {
    DOM: vdom$
  };
}

export default main;

// run(main, {
//   DOM: makeDOMDriver("#app")
// });
