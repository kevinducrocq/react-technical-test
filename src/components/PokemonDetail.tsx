import { Link, useParams } from "react-router-dom";
import usePokeApi from "src/hooks/usePokeApi";
import { Spinner } from "./Spinner";

function PokemonDetail() {
  // Extract the 'id' parameter from the URL
  const { name } = useParams<{ name: string }>();

  // Fetch the Pokemon data using the usePokeApi custom hook
  const { data: pokemon, isLoading } = usePokeApi((api) => api.pokemon.getPokemonByName(name || ""));

  // If the data is still loading, display a spinner
  if (isLoading) {
    return <Spinner />;
  }

  // If the Pokemon data is not found, display a message
  if (!pokemon) {
    return <div>Pokémon non trouvé</div>;
  }

  // Render the Pokemon details
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1em",
        backgroundColor: "white",
        padding: "0 1em 1em 1em",
        margin: "5em",
        borderRadius: "3em",
        color: "blue",
      }}
    >
      <h1>{pokemon.name}</h1>
      <img src={pokemon.sprites.front_default ?? ""} alt={pokemon.name} />
      <p>Taille: {pokemon.height} </p>
      <p>Poids: {pokemon.weight}</p>
      <p>
        Type:
        {pokemon.types.map((type) => (
          <span key={type.slot}>{type.type.name} </span>
        ))}
      </p>
      <p>
        Capacités:
        {pokemon.abilities.map((ability) => (
          <span key={ability.slot}>{ability.ability.name} </span>
        ))}
      </p>
      <p>
        Stats:
        {pokemon.stats.map((stat) => (
          <span key={stat.stat.name}>
            {stat.stat.name}: {stat.base_stat}{" "}
          </span>
        ))}
      </p>

      <p>
        Attaques:
        {pokemon.moves.map((move) => (
          <span key={move.move.name}>{move.move.name} </span>
        ))}
      </p>

      <p>
        Formes:
        {pokemon.forms.map((form) => (
          <span key={form.name}>{form.name.substring(0, 50)} </span>
        ))}
      </p>

      <Link to="/">Revenir à la liste</Link>
    </div>
  );
}

export default PokemonDetail;
