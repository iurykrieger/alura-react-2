import React from 'react';
import ReactDOM from 'react-dom';
import './css/reset.css';
import './css/timeline.css';
import './css/login.css';
import App from './App';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { timeline, notify } from './reducers/timeline';
import thunkMiddleware from 'redux-thunk';

const reducers = combineReducers({ timeline, notify });
const store = createStore(reducers, applyMiddleware(thunkMiddleware));

ReactDOM.render(
	<Provider store={store} key="store">
		<App />
	</Provider>,
	document.getElementById('root')
);
