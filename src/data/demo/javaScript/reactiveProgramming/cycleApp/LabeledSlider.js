import xs from "xstream";
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
    div({ style: { marginBottom: "10px" } }, [
      `${state.label}: ${state.value} ${state.unit}`,
      input(".slider", {
        style: { marginLeft: "10px", display: "inline-block" },
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

function LabeledSlider(sources) {
  const actions = intent(sources.DOM);
  const state$ = model(actions, sources.props);
  const vdom$ = view(state$);

  const sinks = {
    DOM: vdom$,
    value: state$.map(state => state.value)
  };

  return sinks;
}

export default LabeledSlider;
