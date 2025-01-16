import { gql, useApolloClient, useMutation, useQuery } from "@apollo/client";
import { GET_LAUNCHES } from "../../utils/queries";
import { DELETE_LAUNCH } from "../../utils/mutation";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import AddLaunchModal from "../AddLaunchModal/AddLaunchModal";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";

const ApolloWithMutation = () => {
  const client = useApolloClient();
  const { loading, error, data } = useQuery(GET_LAUNCHES, {
    variables: {
      first: 5000,
      orderBy: "createdAt_DESC",
    },
  });
  const [deleteLaunchMutation] = useMutation(DELETE_LAUNCH);
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
    <div className="w-full mt-[72px]">
      <div>
        <h1 className="m-20 text-center">Welcome to GraphQL POC</h1>
      </div>
      <AddLaunchModal />
      <div className="flex justify-center align-middle">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 mb-8">
          {loading ? (
            <>
              {Array.from({ length: 12 }).map(() => {
                return <Skeleton className="h-44 w-80" />;
              })}
            </>
          ) : (
            <>
              {data?.launches?.map((launch: { id: string; name: string; count: number }) => {
                return (
                  <Card key={launch.id} className="h-44 w-80 shadow-md">
                    <CardContent className="pb-0 pt-6 h-14 overflow-hidden">
                      <h3 className="text-lg font-bold">{launch.name}</h3>
                    </CardContent>
                    <CardFooter className="block">
                      <div className="flex justify-start items-center gap-2">
                        <Button variant="outline" onClick={() => deleteLaunch(launch?.id)}>
                          Delete
                        </Button>
                        <Button variant="outline" onClick={() => minusCount(launch?.id, launch?.count)}>
                          -
                        </Button>
                        <Button variant="outline" onClick={() => plusCount(launch?.id, launch?.count)}>
                          +
                        </Button>
                      </div>
                      <div className="flex justify-start items-center gap-2">
                        <Badge>{launch.count ?? 0}</Badge>
                        <span className="text-sm text-gray-500">ID: {launch.id}</span>
                      </div>
                    </CardFooter>
                  </Card>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApolloWithMutation;
