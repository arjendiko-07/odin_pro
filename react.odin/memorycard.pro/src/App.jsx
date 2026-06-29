import { useEffect, useState } from "react";
import CardGrid from "./CardGrid";
import ScoreBoard from "./ScoreBoard";

function App() {
  const [cards, setCards] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [clickedCards, setClickedCards] = useState([]);

  useEffect(() => {
    fetchPokemon();
  }, []);

  // Fisher-Yates shuffle
  function shuffleArray(array) {
    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  }

  async function fetchPokemon() {
    try {
      const promises = [];

      for (let i = 1; i <= 12; i++) {
        promises.push(
          fetch(`https://pokeapi.co/api/v2/pokemon/${i}`).then((res) =>
            res.json()
          )
        );
      }

      const data = await Promise.all(promises);

      const pokemonCards = data.map((pokemon) => ({
        id: pokemon.id,
        name: pokemon.name,
        image: pokemon.sprites.front_default,
      }));

      setCards(shuffleArray(pokemonCards));
    } catch (err) {
      console.error("Failed to fetch Pokémon:", err);
    }
  }

  function handleCardClick(id) {
    setClickedCards((prev) => {
      if (prev.includes(id)) {
        alert("Game Over!");
        setScore(0);
        return [];
      }

      const updatedClicked = [...prev, id];
      const newScore = updatedClicked.length;

      // update score safely
      setScore(newScore);

      // update best score safely
      setBestScore((prevBest) =>
        newScore > prevBest ? newScore : prevBest
      );

      // win condition
      if (newScore === cards.length) {
        alert("You win!");
        setScore(0);
        return [];
      }

      return updatedClicked;
    });

    // shuffle AFTER update
    setCards((prev) => shuffleArray(prev));
  }

  return (
    <>
      <ScoreBoard score={score} bestScore={bestScore} />

      <CardGrid cards={cards} onCardClick={handleCardClick} />
    </>
  );
}

export default App;