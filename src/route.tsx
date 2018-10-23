import * as React from 'react';
import { HashRouter } from "react-router-dom";
// import { HashRouter, Route, Switch } from "react-router-dom";
import { Body, Header } from "./layout";

// import About from "./page/about";
// import Detail from "./page/detail";
// import Home from "./page/home";
// import Mark from "./page/mark";

const Main = () => (
	<Body>
		{/* <Switch>
			<Route exact={true} path="/" component={Mark} />
			<Route exact={true} path="/home/:type" component={Home} />
			<Route exact={true} path="/detail/:type/:id" component={Detail} />
			<Route exact={true} path="/mark" component={Mark} />
			<Route exact={true} path="/about" component={About} />
		</Switch> */}
	</Body>
);

const App = () => (
	<HashRouter>
		<div>
			<Header />
			<Main />
		</div>
	</HashRouter>
);

export default App;
