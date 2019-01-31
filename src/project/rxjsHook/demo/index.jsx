import React from "react";
import "./index.scss";
import { useEventCallback, useObservable } from "rxjs-hooks";
import { fromEvent, timer } from "rxjs";
import {
  map,
  switchMap,
  takeUntil,
  withLatestFrom,
  delay
} from "rxjs/operators";


function useDelayedStyle(x, y, delayTime) {
  const [left, top] = useObservable(
    inputs$ => inputs$.pipe(delay(delayTime)),
    [0, 0],
    [x, y]
  );
  return { left, top };
}

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const [onMouseDown, [x, y]] = useEventCallback(
      (event$, state$) =>
        event$.pipe(
          withLatestFrom(state$),
          map(([e, prevPos]) => [e.clientX, e.clientY, prevPos]),
          switchMap(([startX, startY, prevPos]) => {
            return fromEvent(window, "mousemove").pipe(
              map(moveEvent => {
                return [
                  moveEvent.clientX - startX + prevPos[0],
                  moveEvent.clientY - startY + prevPos[1]
                ];
              }),
              takeUntil(fromEvent(window, "mouseup"))
            );
          })
        ),
      [0, 0]
    );
    const style0 = useDelayedStyle(x, y, 0);
    const style1 = useDelayedStyle(x, y, 100);
    const style2 = useDelayedStyle(x, y, 200);
    const style3 = useDelayedStyle(x, y, 300);
    return (
      <div className="App">
        <div className="box box3" style={style3} />
        <div className="box box2" style={style2} />
        <div className="box box1" style={style1} />
        <div className="box" onMouseDown={onMouseDown} style={style0}>
          drag me
        </div>
      </div>
    );
  }
}

export default Demo;
