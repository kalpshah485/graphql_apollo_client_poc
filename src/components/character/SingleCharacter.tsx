import { gql, useApolloClient, useQuery } from "@apollo/client";
import { GET_CHARACTER } from "../../utils/queries";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

import { useParams } from "react-router-dom";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

const SingleCharacter = () => {
  const client = useApolloClient();
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_CHARACTER, {
    variables: {
      id,
    },
  });

  const minusCount = (id: string, count = 0) => {
    client.writeFragment({
      id: client.cache.identify({ __typename: "Character", id: id }),
      fragment: gql`
        fragment UpdateCharacter on Character {
          count
        }
      `,
      data: {
        count: count - 1,
      },
    });
  };

  const plusCount = (id: string, count = 0) => {
    client.writeFragment({
      id: client.cache.identify({ __typename: "Character", id: id }),
      fragment: gql`
        fragment UpdateCharacter on Character {
          count
        }
      `,
      data: {
        count: count + 1,
      },
    });
  };

  if (loading)
    return (
      <div className="flex justify-center mt-10">
        <Skeleton className="h-80 w-60" />
      </div>
    );
  if (error) return <div>error occurred</div>;

  const character: { id: string; name: string; count: number; image: string } = data?.character;

  return (
    <div className="flex justify-center mt-10">
      <Card key={character.id} className="shadow-md">
        <CardHeader>
          <img src={character.image} alt={character.name} className="w-full h-48 object-cover rounded-t-md" />
        </CardHeader>
        <CardContent>
          <h3 className="text-lg font-bold">{character.name}</h3>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Badge>{character.count ?? "No count available"}</Badge>
          <span className="text-sm text-gray-500">ID: {character.id}</span>
          <Button variant="outline" onClick={() => minusCount(character?.id, character?.count)}>
            -
          </Button>
          <Button variant="outline" onClick={() => plusCount(character?.id, character?.count)}>
            +
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SingleCharacter;
