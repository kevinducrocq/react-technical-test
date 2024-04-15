import { Pokemon, Type } from "pokenode-ts";
import { useEffect } from "react";
import usePokeApi from "src/hooks/usePokeApi";

interface PokeTeamProps {
  team: Pokemon[];
  onRemove: (pokemon: Pokemon) => void;
}

export const PokeTeam = ({ team, onRemove }: PokeTeamProps) => {
  // Retrieve the types for each Pokemon in the team
  const {
    data: types,
    isLoading: typesLoading,
    error,
    refetch: refetchTypes,
  } = usePokeApi((api) =>
    Promise.all(
      team.flatMap((pokemon) => pokemon.types.map((type) => api.utility.getResourceByUrl<Type>(type.type.url)))
    )
  );

  // Refetch the types when the team changes
  useEffect(() => {
    if (team.length > 0) {
      refetchTypes();
    }
  }, [team, refetchTypes]);

  if (team.length === 0) {
    return <div>Vous n'avez pas de pokémon dans votre équipe</div>;
  }

  if (error) {
    return <div>Erreur lors du chargement des types de Pokémon</div>;
  }

  return (
    <table style={{ border: "1px solid black", background: "white", color: "blue", width: 400, padding: "1em" }}>
      <thead>
        <tr>
          <th colSpan={2}>
            <h2>Mon équipe</h2>
          </th>
        </tr>
      </thead>
      <tbody>
        {team.map((pokemon) => (
          <tr key={pokemon.id}>
            <td>
              {pokemon.name}
              <button onClick={() => onRemove(pokemon)}>Retirer de l'équipe</button>
            </td>
            <td>
              {typesLoading ? (
                <div>Loading...</div>
              ) : (
                types?.map((type, index) => (
                  <div
                    key={index}
                    style={{
                      border: "1px solid black",
                      padding: "1em",
                      margin: "1em",
                      background: "white",
                      color: "blue",
                    }}
                  >
                    <h2>Type : {type.name}</h2>
                    <span>Double dommages infligés à :</span>
                    <div
                      style={{
                        display: "flex",
                      }}
                    >
                      {type.damage_relations.double_damage_to.map((type, index) => (
                        <span key={index}>{type.name}, </span>
                      ))}
                    </div>
                    <span>Double dommages reçus de :</span>
                    <div
                      style={{
                        display: "flex",
                      }}
                    >
                      {type.damage_relations.double_damage_from.map((type, index) => (
                        <span key={index}>{type.name}, </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
