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
    return (
      <div
        style={{
          border: "1px solid black",
          background: "white",
          color: "blue",
          width: 400,
          padding: "1em",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2>Mon équipe</h2>
        <span>Vous n'avez pas encore de pokémon dans votre équipe</span>
      </div>
    );
  }

  if (error) {
    return <div>Erreur lors du chargement des types de Pokémon</div>;
  }

  return (
    <div
      style={{
        border: "1px solid black",
        background: "white",
        color: "blue",
        width: 400,
        padding: "1em",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h2>Mon équipe</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "1em" }}>
        {team.map((pokemon) => (
          <div
            key={pokemon.id}
            style={{
              border: "1px solid black",
              borderRadius: "15px",
              padding: "1em",
              color: "blue",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1em",
              }}
            >
              <h2>{pokemon.name}</h2>
              <button
                onClick={() => onRemove(pokemon)}
                style={{
                  border: "1px solid black",
                  padding: "0.5em",
                  background: "white",
                  color: "blue",
                  cursor: "pointer",
                  fontSize: "10px",
                }}
              >
                - Retirer de l'équipe
              </button>
            </div>
            <div>
              {typesLoading ? (
                <div>Loading...</div>
              ) : (
                types?.map((type, index) => (
                  <div
                    key={index}
                    style={{
                      border: "1px solid gray",
                      padding: "1em",
                      margin: "1em",
                      background: "white",
                      color: "blue",
                    }}
                  >
                    <h4>Type : {type.name}</h4>
                    <h4>Double dommages infligés à :</h4>
                    <div
                      style={{
                        display: "flex",
                      }}
                    >
                      {type.damage_relations.double_damage_to.map((type, index) => (
                        <span key={index}>{type.name}, </span>
                      ))}
                    </div>
                    <hr />
                    <h4>Double dommages reçus de :</h4>
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
