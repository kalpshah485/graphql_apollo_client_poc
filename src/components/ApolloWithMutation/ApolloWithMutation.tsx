import { FormEvent, useRef } from "react";
import { gql, useApolloClient, useMutation, useQuery } from "@apollo/client";
import { GET_LAUNCHES } from "../../utils/queries";
import { ADD_LAUNCH, DELETE_LAUNCH } from "../../utils/mutation";

const ApolloWithMutation = () => {
  const client = useApolloClient();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { loading, error, data } = useQuery(GET_LAUNCHES, {
    variables: {
      first: 5000,
      orderBy: "createdAt_DESC",
    },
  });
  const [addLaunchMutation] = useMutation(ADD_LAUNCH);
  const [deleteLaunchMutation] = useMutation(DELETE_LAUNCH);
  if (loading) return <div>Loading....</div>;
  if (error) return <div>error occurred</div>;

  const addLaunch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if(!(inputRef.current?.value)) return;
    const value = inputRef.current?.value;
    await addLaunchMutation({
      variables: {
        name: value,
        date: "TODAY",
      },
      update: (cache, result) => {
        cache.modify({
          fields: {
            launches(existingLaunches = []) {
              const newLaunchRef = cache.writeFragment({
                data: result.data.createLaunch,
                fragment: gql`
                  fragment NewLaunch on Launch {
                    id
                    name
                    date
                  }
                `,
              });
              return [newLaunchRef, ...existingLaunches];
            },
          },
        });
      },
    });
    inputRef.current.value = "";
  };

  const deleteLaunch = async (id: string) => {
    await deleteLaunchMutation({
      variables: {
        id: id,
      },
      update: (cache, result) => {
        // Ensure result.data.deleteLaunch exists and contains the deleted id
        const deletedId = result.data?.deleteLaunch?.id;
        if (!deletedId) return;

        cache.modify({
          fields: {
            launches(existingLaunches = [], { readField }) {
              // Filter out the deleted launch by matching its id
              return existingLaunches.filter((launchRef: any) => readField("id", launchRef) !== deletedId);
            },
          },
        });
      },
    });
  };

  const minusCount = (id: string) => {
    const topResult = client.readQuery({
      query: GET_LAUNCHES,
      variables: {
        first: 5000,
        orderBy: "createdAt_DESC",
      },
    });

    const launchResult = topResult.launches.map((character: { id: string; count: number }) => {
      return {
        ...character,
        count: character.id === id ? character.count - 1 : character.count,
      };
    });
    client.writeQuery({
      query: GET_LAUNCHES,
      variables: {
        first: 5000,
        orderBy: "createdAt_DESC",
      },
      data: {
        launches: launchResult,
      },
    });
  };

  const plusCount = (id: string) => {
    const topResult = client.readQuery({
      query: GET_LAUNCHES,
      variables: {
        first: 5000,
        orderBy: "createdAt_DESC",
      },
    });
    const launchResult = topResult.launches.map((character: { id: string; count: number }) => {
      return {
        ...character,
        count: character.id === id ? character.count + 1 : character.count,
      };
    });
    client.writeQuery({
      query: GET_LAUNCHES,
      variables: {
        first: 5000,
        orderBy: "createdAt_DESC",
      },
      data: {
        launches: launchResult,
      },
    });
  };

  return (
    <div>
      <form onSubmit={addLaunch}>
        <input type="text" ref={inputRef} />
        <button type="submit">Add Launch</button>
      </form>
      {data?.launches?.map((launch: { id: string; name: string; count: number }) => {
        return (
          <div key={launch?.id}>
            <button onClick={() => minusCount(launch?.id)}>-</button> {launch?.name}
            {` (${launch?.count || 0})`} <button onClick={() => deleteLaunch(launch?.id)}>delete</button>{" "}
            <button onClick={() => plusCount(launch?.id)}>+</button>
          </div>
        );
      })}
    </div>
  );
};

export default ApolloWithMutation;
