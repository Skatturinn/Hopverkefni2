/* eslint-disable no-unused-vars */
import './App.css';
// eslint-disable-next-line no-unused-vars
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
	BrowserRouter as Router,
	Route,
	Link,
	Routes,
	useParams
} from 'react-router-dom';

async function gogn(texti) {
	let hlekkur = texti;
	if (!texti) {
		hlekkur = '';
	}
	const url = `https://vef1-2023-h2-api-791d754dda5b.herokuapp.com/products${String(hlekkur)}`
	let response;
	try {
		response = await fetch(url);
	} catch (e) {
		console.error('Villa kom upp við að sækja gögn');
		return null;
	}
	if (!response.ok) {
		console.error(
			'Villa við að sækja gögn, ekki 200 staða',
			response.status,
			response.statusText
		);
		return null;
	}
	let json;
	try {
		json = await response.json();
	} catch (e) {
		console.error('Villa við að vinna úr JSON');
		return null;
	}
	if (hlekkur[1] === '?') {
		return json.items;
	}
	return json;
}
console.log(gogn())

// function App() {
// 	gogn('?search=handmade')
// 	return (
// 		<Router>
// 			<Sidebar />
// 			<Routes>
// 				<Route exact path='/data' />
// 				<Route path='/data/subdata' />
// 				<Route path='/data/subdata2' />
// 			</Routes>
// 		</Router>
// 	);
// }
// import React from "react";

export default function App() {
	return (
		<Router>
			<div>
				<nav>
					<ul>
						<li>
							<Link to="/">Home</Link>
						</li>
						<li>
							<Link to="/about">About</Link>
						</li>
						<li>
							<Link to="/users">Users</Link>
						</li>
					</ul>
				</nav>

				{/* A <Routes> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
				<Routes>
					<Route path="/about" element={<About />}>
					</Route>
					<Route path="/users" element={<Users />}>
						{/* <Users /> */}
					</Route>
					<Route path="/" element={<Home />}>
						{/* <Home /> */}
					</Route>
				</Routes>
			</div>
		</Router>
	);
}

function Home() {
	return <h2>Home</h2>;
}

function About() {
	return <h2>About</h2>;
}

function Users() {
	return <h2>Users</h2>;
}
// export default App;
