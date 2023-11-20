/* eslint-disable no-unused-vars */
import './App.css';
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
	BrowserRouter as Router,
	Route,
	Link,
	Routes,
	useParams
} from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import useFetch from 'react-fetch-hook';
// import { useRouter } from 'router'

const url = 'https://vef1-2023-h2-api-791d754dda5b.herokuapp.com/products';
function formatPrice(price) {
	const formatter = new Intl.NumberFormat('is-IS', {
		style: 'currency',
		currency: 'ISK',
	});
	return formatter.format(price);
}
export default function App() {
	return (
		<div className='site-container'>
			<Router>
				<header>
					<div className='rows'>
						<nav className='grid-container'>
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
									<Link to="/vara">Nýjar vörur</Link>
								</li>
								<li>
									<Link to="/flokkur">Flokkar</Link>
								</li>
							</menu>
						</nav>
					</div>
				</header>
				<main>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/flokkur" element={<Flokk teksti={'/categories'} />} />
						{/* <Route path="/innskra" element={<FlokkaSida />} /> */}
						<Route path="/flokkur/:id" element={<FlokkaSida />} />
						<Route path="/vara" element={<Vorulisti />} />
						<Route path="/vara/:id" element={<Vorusida />} />
					</Routes>
				</main>
			</Router>
		</div>
	);
}

// Virkni til að fara á milli síða

function OpenPL() {
	window.history.pushState({}, '', '/vara')
	window.history.go()
}
function OpenProduct(inntak) {
	const a = inntak.target.closest('li');
	const stadur = `/vara/${a.id}`
	window.history.pushState({}, '', stadur)
	window.history.go()
}

function OpenFlokk(inntak) {
	const a = inntak.target.closest('li');
	const stadur = `/flokkur/${a.id}`
	window.history.pushState({}, '', stadur)
	window.history.go()
}

// Hlutar af síðum

function ProdList(props) {
	const sott = `${url}${props.teksti}`;
	const { isLoading, error, data } = useFetch(sott);
	if (isLoading) return 'Loading...';
	if (error) return 'Error!';
	const v = 'vantar';
	const arrayOfLists = Array.from(data.items).map(
		vara => (<li key={vara.id} id={vara.id}
			onClick={OpenProduct} className='voruspjald'>
			<figure>
				<img src={vara.image ? vara.image : ''}
					className='vorumynd'
					alt={'mynd af vöru'}></img>
				<figcaption className='voru-data'>
					<h4 className='heiti'>{vara.title ? vara.title : `titill ${v}`}</h4>
					<p className='flokk'>{vara.category_title ? vara.category_title : `flokk ${v}`}</p>
					<p className='verd'>{vara.price ? formatPrice(vara.price) : `verð ${v}`}</p>
				</figcaption>
			</figure>

		</li >)
	)
	return (<ul className='grid-container'>{arrayOfLists}</ul>);
}

function Product(props) {
	const sott = `${url}${props.teksti}`;
	const { isLoading, error, data } = useFetch(sott);
	if (isLoading) return 'Loading...';
	if (error) return 'Error!';
	const v = 'vantar';
	return <figure className='grid-container'>
		<img src={data.image ? data.image : ''}
			className='adal-mynd'
			alt={'mynd af vöru'}></img>
		<div className='adal-mynd'>
			<h2 className='heiti'>{data.title ? data.title : `titill ${v}`}</h2>
			<p className='flokk'>{data.category_title ? `Flokkur:${data.category_title}` : `flokk ${v}`}</p>
			<p className='verd'>{data.price ? `Verð:${formatPrice(data.price)}` : `verð ${v}`}</p>
			<p className='voru-lysing '>{data.description ? data.description : `vöru lýsinug ${v}`}</p>
		</div>
	</figure>
}

// Síður

function Flokk(props) {
	const ne = 'https://vef1-2023-h2-api-791d754dda5b.herokuapp.com'
	const sott = `${ne}${props.teksti}`;
	const { isLoading, error, data } = useFetch(sott);
	if (isLoading) return 'Loading...';
	if (error) return 'Error!';
	const v = 'vantar';
	const arrayOfLists = Array.from(data.items).map(
		vara => (<li key={vara.id ? vara.id : ''} id={vara.id} title={vara.title}
			className='Flokkur'
			onClick={OpenFlokk}>
			<h4 className='flokk'>{vara.title ? vara.title : `flokk ${v}`}</h4>
		</li >)
	)
	return (<div>
		<h3>Skoðaðu vöruflokkana okkar</h3>
		<ul className='grid-container'>{arrayOfLists}</ul>
	</div>);
}



function Vorusida() {
	const { id } = useParams()
	const sott = `${url}/${id}`;
	const { isLoading, error, data } = useFetch(sott);
	if (isLoading) return 'Loading...';
	if (error) return 'Error!';
	return <div className='rows'>
		<Product teksti={`/${id}`} />
		<h3>Fleiri vörur úr flokki: {data.category_title ? data.category_title : 'sama flokki'}</h3>
		<ProdList teksti={`?limit=3&category=${data.category_id}`} />
		<h3>Aðrar vörur frá okkur</h3>
		<ProdList teksti={'?limit=3'} />
		<p>{id}</p></div>
}

function Home() {
	return (
		<div className='rows'>
			<h2>Nýjar vörur</h2>
			<ProdList teksti={'?limit=6'} />
			<button onClick={OpenPL}>Skoða alla flokka</button>
			<Flokk teksti={'/categories'} />
		</div>);
}

function FlokkaSida() {
	const { id } = useParams()
	const sott = `${url}/${id}`;
	const { isLoading, error, data } = useFetch(sott);
	if (isLoading) return 'Loading...';
	if (error) return 'Error!';
	return <div>
		<h3>Flokkur: {data.category_title}</h3>
		<ProdList teksti={`?limit=3&category=${id}`} />
	</div>;
}

function Vorulisti() {
	return (
		<div>
			<h2>Nýjar vörur</h2>
			<ProdList teksti={'?limit=20'} />
			<button onClick={(() => {
				window.history.pushState({}, '', '/');
				window.history.go();
			})}>Til baka á forsíðu</button>
		</div>
	)
}
