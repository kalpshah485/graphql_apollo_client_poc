import { useApolloClient, useQuery } from "@apollo/client";
import { GET_CHARACTERS } from "../../utils/queries";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "../ui/badge";
import { Link } from "react-router-dom";
import { Skeleton } from "../ui/skeleton";
import styles from "../home/Home.module.css";

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
  if (error) return <div>error occurred</div>;

  return (
    <div className="w-full">
      <div className={`${styles.container} mt-[72px]`}>
        <h1 className={styles["container__heading--size"]}>Welcome to GraphQL POC</h1>
      </div>
      <div className="flex justify-center align-middle">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 mb-8">
          {loading ? (
            <>
              {Array.from({ length: 6 }).map(() => {
                return <Skeleton className="h-96 w-72" />;
              })}
            </>
          ) : (
            <>
              {data?.characters?.results?.map(
                (character: { id: string; image: string; name: string; count: number }) => {
                  return (
                    <Card key={character.id} className="h-96 w-72 shadow-md">
                      <Link to={`/character/${character.id}`}>
                        <CardHeader>
                          <img
                            src={character.image}
                            alt={character.name}
                            className="w-full h-48 object-cover rounded-t-md"
                          />
                        </CardHeader>
                        <CardContent>
                          <h3 className="text-lg font-bold">{character.name}</h3>
                        </CardContent>
                      </Link>
                      <CardFooter className="flex justify-between items-center">
                        <Badge>{character.count ?? "No count available"}</Badge>
                        <span className="text-sm text-gray-500">ID: {character.id}</span>
                        <Button variant="outline" onClick={() => minusCount(character?.id)}>
                          -
                        </Button>
                        <Button variant="outline" onClick={() => plusCount(character?.id)}>
                          +
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                },
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Characters;
