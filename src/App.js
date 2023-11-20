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

export default function App() {
	return (
		<header>
			<Router>

				<nav>
					<h1>
						<Link to="/">Vefforitunarbúðin</Link>
					</h1>
					<menu>
						<li>
							<Link to="/nyskra">Nýskrá</Link>
						</li>
						<li>
							<Link to="/innskra">Innskrá</Link>
						</li>
						<li>
							<Link to="/karfa">Karfa</Link>
						</li>
					</menu>
					<menu>
						<li>
							<Link to="/nyjar">Nýjar vörur</Link>
						</li>
						<li>
							<Link to="/flokkar">Flokkar</Link>
						</li>
					</menu>
				</nav>
				{/* A <Routes> looks through its children <Route>s and
						renders the first one that matches the current URL. */}
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/" element={<Home />} />
					<Route path="/" element={<Home />} />
					<Route path="/" element={<Home />} />
					<Route path="/" element={<Home />} />
					<Route path="/" element={<Home />} />
				</Routes>

			</Router>
		</header>
	);
}
function re(turn) {
	return turn
}

function verify(inntak) {
	let uttak;
	if (!inntak) {
		uttak = '';
		console.error(`vantar${String(Object.keys({ inntak })[0])}`)
		return uttak
	}
	return inntak
}


async function Kassi(inntak) {
	const val = await gogn(`/${inntak}`)
	if (!inntak) {
		console.error('tokst ekki að sækja vöru.');
	}
	const mynd = verify(val.image)
	return val
}
const Mm = async () => {
	const a = String(Kassi('99'))
	return (
		<p>{a}</p>

	)
}

function Home() {
	return (
		<div>
			<h2>Home</h2>
			<Mm />
		</div>);
}

function About() {
	return <h2>About</h2>;
}

function Users() {
	return <h2>Users</h2>;
}
// export default App;
