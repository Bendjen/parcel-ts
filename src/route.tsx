import * as React from 'react';
import Loadable from 'react-loadable';
import { HashRouter, Route, Switch } from "react-router-dom";
import { Body, Header } from "./layout/index";

const Loading = () => <div>Loading...</div>;

const About = Loadable({
	loader: () => import('./page/about'),
	loading: Loading,
})
const Detail = Loadable({
	loader: () => import('./page/detail'),
	loading: Loading,
})
const Home = Loadable({
	loader: () => import('./page/home'),
	loading: Loading,
})
const Mark = Loadable({
	loader: () => import('./page/mark'),
	loading: Loading,
})


const Main = () => (
	<Body>
		<Switch>
			<Route exact={true} path="/" component={Mark} />
			<Route exact={true} path="/home/:type" component={Home} />
			<Route exact={true} path="/detail/:type/:id" component={Detail} />
			<Route exact={true} path="/mark" component={Mark} />
			<Route exact={true} path="/about" component={About} />
		</Switch>
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
