import React from "react";
import { useApolloClient, useQuery, gql } from "@apollo/client";

const GET_CHARACTERS = gql(/* GraphQL */ `
  query Get_Characters {
    characters {
      results {
        id
        name
        image
        count @client
      }
    }
  }
`);

const Characters = () => {
  const client = useApolloClient();
  const { loading, error, data } = useQuery(GET_CHARACTERS);

  const minusCount = (id: string) => {
    const topResult = client.readQuery({
      query: GET_CHARACTERS,
    });
    const characterResult = topResult.characters.results.map((character: { id: string; count: number }) => {
      return {
        ...character,
        count: character.id === id ? character.count - 1 : character.count,
      };
    });
    client.writeQuery({
      query: GET_CHARACTERS,
      data: {
        characters: {
          ...topResult.characters,
          results: characterResult,
        },
      },
    });
  };

  const plusCount = (id: string) => {
    const topResult = client.readQuery({
      query: GET_CHARACTERS,
    });
    const characterResult = topResult.characters.results.map((character: { id: string; count: number }) => {
      return {
        ...character,
        count: character.id === id ? character.count + 1 : character.count,
      };
    });
    client.writeQuery({
      query: GET_CHARACTERS,
      data: {
        characters: {
          ...topResult.characters,
          results: characterResult,
        },
      },
    });
  };

  if (loading) return <div>Loading....</div>;
  if (error) return <div>error occurred</div>;

  return (
    <div>
      {data?.characters?.results?.map((character: { id: string; name: string; count: number }) => {
        return (
          <div key={character?.id}>
            <button onClick={() => minusCount(character?.id)}>-</button> {character?.name}
            {` (${character?.count || 0})`} <button onClick={() => plusCount(character?.id)}>+</button>
          </div>
        );
      })}
    </div>
  );
};

export default Characters;
