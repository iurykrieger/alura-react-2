import React, { Component } from 'react';
import Header from './componentes/Header';
import Timeline from './componentes/Timeline';
import { Redirect } from 'react-router-dom';

class App extends Component {
	render() {
		if (!localStorage.getItem('x-access-token')) {
			return <Redirect to="/" />;
		} else {
			return (
				<div id="root">
					<div className="main">
						<Header />
						<Timeline />
					</div>
				</div>
			);
		}
	}
}

export default App;
