import React, { Component } from 'react';
import Card from './Card';
import axios from 'axios';
import './Deck.css';

const API_BASE_URL = 'https://deckofcardsapi.com/api/deck';

class Deck extends Component {
	constructor(props) {
		super(props);
		this.state = {
			deck: 'null',
			drawnCards: []
		};
		this.getCard = this.getCard.bind(this);
	}

	async componentDidMount() {
		//suffle deck
		let deck = await axios.get(`${API_BASE_URL}/new/shuffle/`);
		//set deck info in state
		this.setState({
			deck: deck.data
		});
	}

	async getCard() {
		//get deck id from api
		let deck_id = this.state.deck.deck_id;

		try {
			//create url using base url to draw a card
			let cardURL = `${API_BASE_URL}/${deck_id}/draw/`;
			//wait to draw card from api
			let cardRes = await axios.get(cardURL);
			//throw error if deck is empty
			if (!cardRes.data.success) {
				throw new Error('Deck is empty');
			}
			//save card drawn to its own variable
			let card = cardRes.data.cards[0];
			//add card drawn to state with card info
			this.setState((st) => ({
				drawnCards: [
					...st.drawnCards,
					{
						id: card.code,
						image: card.image,
						name: `${card.value} of ${card.suit}`
					}
				]
			}));
		} catch (err) {
			console.log(err);
		}
	}

	render() {
		const cards = this.state.drawnCards.map((c) => <Card name={c.name} image={c.image} key={c.id} />);

		return (
			<div>
				<h1 className="Deck-title">Dealer</h1>
				<button className="Deck-btn" onClick={this.getCard}>
					Deal Card
				</button>
				<div className="Deck-card-area">{cards}</div>
			</div>
		);
	}
}

export default Deck;
