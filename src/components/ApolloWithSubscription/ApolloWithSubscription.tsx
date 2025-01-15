import { useApolloClient, useQuery, useSubscription } from "@apollo/client";
import { GET_BLOGS } from "../../utils/queries";
import { SUBSCRIBE_BLOGS } from "../../utils/subscriptions";
import AddBlogModal from "../AddBlogModal/AddBlogModal";

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
  if (loading) return <div>Loading....</div>;
  if (error) return <div>error occurred</div>;

  return (
    <div>
      <AddBlogModal />
      {data?.getBlogs?.map((blog: { id: string; author: string; content: number }) => {
        return (
          <div key={blog?.id}>
            {blog?.author} - {blog?.content}
          </div>
        );
      })}
    </div>
  );
};

export default ApolloWithSubscription;
