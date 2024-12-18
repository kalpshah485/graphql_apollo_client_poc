import { FormEvent } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION } from "../../utils/mutation";
import { tokenVar } from "../../config/client";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [login] = useMutation(LOGIN_MUTATION);
  const navigate = useNavigate();
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    // const data = await fetch("https://reqres.in/api/login", {
    //   method: "POST",
    //   body: JSON.stringify({
    //     email: "eve.holt@reqres.in",
    //     password: "cityslicka",
    //   }),
    //   headers: {
    //     "Content-Type": "application/json",
    //   }
    // })
    const data = await login({
      variables: {
        input: {
          email: "eve.holt@reqres.in",
          password: "cityslicka",
        },
      },
    });
    localStorage.setItem("token", data?.data?.login?.token);
    tokenVar(data?.data?.login?.token);
    navigate("/");
  };
  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
