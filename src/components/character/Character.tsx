import { useApolloClient, useQuery } from "@apollo/client";
import { GET_CHARACTERS } from "../../utils/queries";
import { Button } from "../ui/button";

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
            <Button variant="outline" onClick={() => minusCount(character?.id)}>-</Button> {character?.name}
            {` (${character?.count || 0})`} <Button variant="outline" onClick={() => plusCount(character?.id)}>+</Button>
          </div>
        );
      })}
    </div>
  );
};

export default Characters;
