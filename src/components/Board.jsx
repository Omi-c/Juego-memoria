//Tablero del juego
import React, { useEffect, useState } from 'react';
import { imgs } from '../data';
import { Card } from './Card';
import { Modal } from './Modal';

const shuffleArray = array => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]]; //intercambia los valores
	}
	return array;
};

export const Board = () => {
	const [cards, setCards] = useState([]);
	const [flippedCards, setFlippedCards] = useState([]); //Cartas volteadas. Se va a voltear hasta dos cartas
	const [moves, setMoves] = useState(0); //movimientos
	const [gameOver, setGameOver] = useState(false); //Juego acabado
	const [isDisabled, setIsDisabled] = useState(false); //estado para saber cuando esta activado

	const createBoard = () => {
		const duplicatecards = imgs.flatMap((img, i) => {  //duplico las cartas para tener dos cartas de la misma imagen
			const duplicate = {    //hay que modificar el id de los duplicados para que no sea el mismo
				...img,
				id: img.id + imgs.length,
			};
			return [img, duplicate];
		});

		const newCards = shuffleArray(duplicatecards);  //para barajear las cartas del arreglo que acabamos de combinar
		const cards = newCards.map(card => {
			return {
				...card,
				flipped: false,
				matched: false,
			};
		});
		setCards(cards);
	};

	useEffect(() => {    //para poder llamar la funcion, solo se ejecutara una vez de inicialice la pagina
		createBoard();
	}, []);

	const handleCardClick = id => {
		if (isDisabled) return;

		const [currentCard] = cards.filter(card => card.id === id);

		if (!currentCard.flipped && !currentCard.matched) {
			currentCard.flipped = true;

			const newFlippedCards = [...flippedCards, currentCard];
			setFlippedCards(newFlippedCards);

			if (newFlippedCards.length === 2) {
				setIsDisabled(true);
				const [firstCard, secondCard] = newFlippedCards;

				if (firstCard.img === secondCard.img) {
					firstCard.matched = true;
					secondCard.matched = true;
					setIsDisabled(false);
				} else {
					setTimeout(() => {
						firstCard.flipped = false;
						secondCard.flipped = false;
						setCards(cards);
						setIsDisabled(false);
					}, 1000);
				}

				setFlippedCards([]);
				setMoves(moves + 1);
			}

			setCards(cards);
		}

		if (cards.every(card => card.matched)) {
			setGameOver(true);
			setIsDisabled(true);
		}
	};

	const handleNewGame = () => {
		setCards([]);
		createBoard();
		setMoves(0);
		setGameOver(false);
		setIsDisabled(false);
	};

	return (
		<>
			{gameOver && (
				<div className='fixed inset-0 bg-black opacity-50 z-10'></div>
			)}

			<div className='relative h-screen flex items-center bg-gradient-to-r from-pink-100 via-purple-300 to-pink-100'>
				<div className='mx-auto flex flex-col justify-center items-center'>
					<h1 className='font-bold text-4xl my-6 text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 md:text-[40px]'>
						Juego de Memoria
					</h1>
					<div className='grid grid-cols-4 gap-4 justify-center items-center px-3 py-5 my-3'>
						{cards.map(card => (
							<Card
								card={card}
								key={card.id}
								handleCardClick={handleCardClick}
							/>
						))}
					</div>
					<button
						className='h-12 w-36 bg-red-500 font-semibold text-white rounded-md px-5 py-1 hover:bg-yellow-500 hover:text-black transition-all mb-3'
						onClick={handleNewGame}
					>
						Nuevo Juego
					</button>
				</div>

				<Modal
					gameOver={gameOver}
					setGameOver={setGameOver}
					moves={moves}
					handleNewGame={handleNewGame}
				/>
			</div>
		</>
	);
};
