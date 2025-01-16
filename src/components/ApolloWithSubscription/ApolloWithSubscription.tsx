import { useApolloClient, useQuery, useSubscription } from "@apollo/client";
import { GET_BLOGS } from "../../utils/queries";
import { SUBSCRIBE_BLOGS } from "../../utils/subscriptions";
import AddBlogModal from "../AddBlogModal/AddBlogModal";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "../ui/skeleton";

const ApolloWithSubscription = () => {
  const client = useApolloClient();
  const { loading, error, data } = useQuery(GET_BLOGS, {
    variables: {
      first: 5000,
      orderBy: "createdAt_DESC",
    },
  });
  useSubscription(SUBSCRIBE_BLOGS, {
    onData: (data) => {
      const blogs = client.readQuery({
        query: GET_BLOGS,
        variables: {
          first: 5000,
          orderBy: "createdAt_DESC",
        },
      });
      client.writeQuery({
        query: GET_BLOGS,
        data: {
          getBlogs: [...blogs.getBlogs, data.data.data?.newBlog],
        },
      });
    },
  });
  if (error) return <div>error occurred</div>;

  return (
    <div className="w-full mt-[72px]">
      <div>
        <h1 className="m-20 text-center">Welcome to GraphQL POC</h1>
      </div>
      <AddBlogModal />
      <div className="flex justify-center align-middle">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 mb-8">
          {loading ? (
            <>
              {Array.from({ length: 12 }).map(() => {
                return <Skeleton className="h-32 w-80" />;
              })}
            </>
          ) : (
            <>
              {data?.getBlogs?.map((blog: { id: string; author: string; content: number }) => {
                return (
                  <Card key={blog?.id} className="h-32 w-80 shadow-md">
                    <CardContent className="pb-0 pt-6 h-14 overflow-hidden">
                      <h3 className="text-lg font-bold">{blog.content}</h3>
                    </CardContent>
                    <CardFooter className="block">
                      <div className="flex justify-start items-center gap-2">
                        <span className="text-sm text-gray-500">Author: {blog?.author}</span>
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

export default ApolloWithSubscription;
