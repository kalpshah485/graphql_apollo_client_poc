import { gql, useApolloClient, useMutation, useQuery } from "@apollo/client";
import { GET_LAUNCHES } from "../../utils/queries";
import { DELETE_LAUNCH } from "../../utils/mutation";
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

  const minusCount = (id: string, count = 0) => {
    client.writeFragment({
      id: client.cache.identify({ __typename: "Launch", id: id }),
      fragment: gql`
        fragment UpdateLaunch on Launch {
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
      id: client.cache.identify({ __typename: "Launch", id: id }),
      fragment: gql`
        fragment UpdateLaunch on Launch {
          count
        }
      `,
      data: {
        count: count + 1,
      },
    });
  };

  return (
    <div>
      <AddLaunchModal />
      {data?.launches?.map((launch: { id: string; name: string; count: number }) => {
        return (
          <div key={launch?.id}>
            <Button variant="outline" onClick={() => minusCount(launch?.id, launch?.count)}>
              -
            </Button>{" "}
            {launch?.name}
            {` (${launch?.count || 0})`}{" "}
            <Button variant="outline" onClick={() => deleteLaunch(launch?.id)}>
              delete
            </Button>{" "}
            <Button variant="outline" onClick={() => plusCount(launch?.id, launch?.count)}>
              +
            </Button>
          </div>
        );
      })}
    </div>
  );
};

export default ApolloWithMutation;
