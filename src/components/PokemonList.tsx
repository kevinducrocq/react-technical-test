import type { Pokemon, PokemonSpecies } from "pokenode-ts";
import { useState } from "react";
import { Link } from "react-router-dom";
import usePokeApi, { getLocalizedName, resolveResources } from "src/hooks/usePokeApi";
import { PokeTeam } from "./PokeTeam";
import { Spinner } from "./Spinner";

interface PokemonProps {
  pokemon: Pokemon;
  onAddToTeam: (pokemon: Pokemon) => void;
  isPokemonInTeam: (pokemon: Pokemon) => boolean;
}

// Component for displaying individual Pokemon
function Pokemon({ pokemon, onAddToTeam, isPokemonInTeam }: PokemonProps) {
  // Fetch the species data for the Pokemon
  const { data: species } = usePokeApi((api) => api.utility.getResourceByUrl<PokemonSpecies>(pokemon.species.url));

  return species ? (
    <tr>
      <td width="1">
        <img
          src={pokemon.sprites.other?.["official-artwork"].front_default ?? "src/assets/pokeball.png"}
          style={{
            height: "3em",
          }}
        />
      </td>
      <td>
        <div
          style={{
            display: "inline-flex",
            gap: "1em",
            alignItems: "center",
          }}
        >
          {/* Link to the Pokemon details page */}
          <Link
            to={`/pokemon/${pokemon.name}`}
            style={{
              textDecoration: "none",
              color: "blue",
            }}
          >
            {/* Display the localized name of the Pokemon */}
            {getLocalizedName(species)}
          </Link>
          {/* Button to add the Pokemon to the team */}
          <button disabled={isPokemonInTeam(pokemon)} onClick={() => onAddToTeam(pokemon)}>
            Ajouter à l'équipe
          </button>
        </div>
      </td>
    </tr>
  ) : (
    <tr>
      <td width="1">
        <img
          src={"src/assets/pokeball.png"}
          style={{
            height: "3em",
          }}
        />
      </td>
      <td></td>
    </tr>
  );
}

// Component for displaying the list of Pokemon
function PokemonList() {
  // Fetch the list of Pokemon
  const { data: pokemon } = usePokeApi((api) => api.pokemon.listPokemons(0, 10).then(resolveResources<Pokemon>));
  const [team, setTeam] = useState<Pokemon[]>([]);

  // Function to add a Pokemon to the team
  const addToTeam = (pokemon: Pokemon) => {
    if (team.length < 6) {
      if (team.some((p) => p.id === pokemon.id)) {
        alert("Ce Pokémon est déjà dans votre équipe !");
      } else {
        setTeam([...team, pokemon]);
      }
    } else {
      alert("Votre équipe est complète !");
    }
  };

  // Function to remove a Pokemon from the team
  const removeFromTeam = (pokemon: Pokemon) => {
    setTeam(team.filter((p) => p.id !== pokemon.id));
  };

  // Function to check if a Pokemon is already in the team
  const isPokemonInTeam = (pokemon: Pokemon) => {
    return team.some((p) => p.id === pokemon.id);
  };

  if (!pokemon) return <Spinner />;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1em",
        margin: "5em",
        borderRadius: "3em",
      }}
    >
      <table border={1} style={{ background: "white", color: "blue", width: 800 }}>
        <tbody>
          {/* Render each Pokemon in the list */}
          {pokemon.results.map((p) => (
            <Pokemon key={p.id} pokemon={p} onAddToTeam={addToTeam} isPokemonInTeam={isPokemonInTeam} />
          ))}
        </tbody>
      </table>
      {/* Display the Pokemon team */}
      <PokeTeam team={team} onRemove={removeFromTeam} />
    </div>
  );
}

export default PokemonList;
