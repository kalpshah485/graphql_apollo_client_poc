import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import { GET_LAUNCHES } from "../../utils/queries";
import {  DELETE_LAUNCH } from "../../utils/mutation";
import { Button } from "../ui/button";
import AddLaunchModal from "../AddLaunchModal/AddLaunchModal";

const ApolloWithMutation = () => {
  const client = useApolloClient();
  const { loading, error, data } = useQuery(GET_LAUNCHES, {
    variables: {
      first: 5000,
      orderBy: "createdAt_DESC",
    },
  });
  const [deleteLaunchMutation] = useMutation(DELETE_LAUNCH);
  if (loading) return <div>Loading....</div>;
  if (error) return <div>error occurred</div>;

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
      <AddLaunchModal />
      {data?.launches?.map((launch: { id: string; name: string; count: number }) => {
        return (
          <div key={launch?.id}>
            <Button variant="outline" onClick={() => minusCount(launch?.id)}>-</Button> {launch?.name}
            {` (${launch?.count || 0})`} <Button variant="outline" onClick={() => deleteLaunch(launch?.id)}>delete</Button>{" "}
            <Button variant="outline" onClick={() => plusCount(launch?.id)}>+</Button>
          </div>
        );
      })}
    </div>
  );
};

export default ApolloWithMutation;
