import React from "react";
import { interval } from "rxjs";
import { useObservable } from "rxjs-hooks";
import {
  map
} from "rxjs/operators";
import "./index.scss";

function App() {
  useObservable(() => interval(500).pipe(map((val:any) => val * 3)));

  return (
    <div className="App">
      <h1>Incremental number: {1}</h1>
    </div>
  );
}
export default App;
