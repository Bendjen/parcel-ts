const javaScriptText = [
  {
    title: "LabeledSlider(子组件)",
    text: `import xs from "xstream";
import { run } from "@cycle/run";
import { div, input, h2, makeDOMDriver } from "@cycle/dom";

//intent (events => actions)
function intent(domSource) {
  return {
    changeValue$: domSource
      .select(".slider")
      .events("input")
      .map(ev => ev.target.value)
  };
}

//model (actions => state)
function model(actions, props$) {
  const state$ = props$
    .map(
      props =>
        //这部分才是真正含有变动数据的流
        actions.changeValue$
          .map(value => ({
            label: props.label,
            unit: props.unit,
            min: props.min,
            value: value,
            max: props.max
          }))
          .startWith(props) //发出流
    )
    .flatten() //源流(props$)并非要输出的流(含changeValue$的一个完整的state$)，要输出的流是由源流内部以另一个流发出的(changeValue$),由flatten()整合
    .remember(); //重新将流作为一个输出流进行输出，相当于触发了.startWith()。本身的流并非一个输出流（不含有of\creat\combine之类的创建）

  return state$;
}

//view (state => dom)
function view(state$) {
  return state$.map(state =>
    div([
      \`\${state.label}: \${state.value} \${state.unit}\`,
      input(".slider", {
        attrs: {
          type: "range",
          min: state.min,
          max: state.max,
          value: state.value
        }
      })
    ])
  );
}

//组装
function LabeledSlider(sources) {
  //闭环
  const actions = intent(sources.DOM);
  const state$ = model(actions, sources.props);
  const vdom$ = view(state$);

  //输出副作用
  const sinks = {
    DOM: vdom$,
    value: state$.map(state => state.value)
  };

  return sinks;
}

export default LabeledSlider;
  `
  },
  {
    title: "index.js(父组件)",
    text: `import xs from "xstream";
// import Rx from "rxjs";
import { run } from "@cycle/run";
import { div, h2, makeDOMDriver } from "@cycle/dom";
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

  //计算bmi
  const bmi$ = xs
    .combine(weightValue$, heightValue$)
    .map(([weight, height]) => {
      const heightMeters = height * 0.01;
      const bmi = Math.round(weight / (heightMeters * heightMeters));
      return bmi;
    })
    .remember();

  //计算父组件vdom
  const vdom$ = xs
    .combine(bmi$, weightVDom$, heightVDom$)
    .map(([bmi, weightVDom, heightVDom]) =>
      div([
        weightVDom,
        heightVDom,
        h2({ style: { marginTop: "20px" } }, \`BMI is   \${bmi}\`)
      ])
    );

  return {
    DOM: vdom$
  };
}

run(main, {
  DOM: makeDOMDriver("#app")
});
    `
  }
];

export default { javaScriptText };
