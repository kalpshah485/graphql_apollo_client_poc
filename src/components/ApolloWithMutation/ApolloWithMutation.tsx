import { gql, useMutation, useQuery } from "@apollo/client";
import { GET_LAUNCHES } from "../../utils/queries";
import { ADD_LAUNCH } from "../../utils/mutation";

const ApolloWithMutation = () => {
  const { loading, error, data } = useQuery(GET_LAUNCHES, {
    variables: {
      first: 5000,
      orderBy: "createdAt_DESC",
    },
  });
  const [addLaunchMutation] = useMutation(ADD_LAUNCH);
  if (loading) return <div>Loading....</div>;
  if (error) return <div>error occurred</div>;

  const addLaunch = async () => {
    await addLaunchMutation({
      variables: {
        name: "kalp launch from website",
        date: "TODAY",
      },
      update: (cache, result, options) => {
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
  };

  return (
    <div>
      <button onClick={addLaunch}>Add Launch</button>
      {data?.launches?.map((launch: { id: string; name: string; count: number }) => {
        return (
          <div key={launch?.id}>
            {launch?.name}
            {` (${launch?.count || 0})`}
          </div>
        );
      })}
    </div>
  );
};

export default ApolloWithMutation;
