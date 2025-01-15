import { FormEvent, useRef } from "react";
import { useApolloClient, useMutation, useQuery, useSubscription } from "@apollo/client";
import { GET_BLOGS } from "../../utils/queries";
import { ADD_BLOG } from "../../utils/mutation";
import { SUBSCRIBE_BLOGS } from "../../utils/subscriptions";
import { Button } from "../ui/button";

const ApolloWithSubscription = () => {
  const client = useApolloClient();
  const inputRef1 = useRef<HTMLInputElement | null>(null);
  const inputRef2 = useRef<HTMLInputElement | null>(null);
  const { loading, error, data } = useQuery(GET_BLOGS, {
    variables: {
      first: 5000,
      orderBy: "createdAt_DESC",
    },
  });
  const [addBlogMutation] = useMutation(ADD_BLOG);
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

  const addBlog = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!inputRef1.current?.value || !inputRef2.current?.value) return;
    const authorName = inputRef1.current?.value;
    const content = inputRef2.current?.value;
    await addBlogMutation({
      variables: {
        author: authorName,
        content,
      },
    });
    inputRef1.current.value = "";
    inputRef2.current.value = "";
  };

  return (
    <div>
      <form onSubmit={addBlog}>
        <input type="text" ref={inputRef1} placeholder="author name" />
        <input type="text" ref={inputRef2} placeholder="content" />
        <Button type="submit">Add Blog</Button>
      </form>
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
