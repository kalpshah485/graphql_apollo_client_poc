import React from "react";

const Login = () => {
  console.log("login");
  return (
    <form>
      <input type="email" placeholder="Email" />
      <br />
      <input type="password" placeholder="Password" />
      <br />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
