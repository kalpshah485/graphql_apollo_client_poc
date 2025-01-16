import { lazy } from "react";
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import { SuspenseErrorBoundary } from "./SuspenseErrorBoundary";
import SingleCharacter from "@/components/character/SingleCharacter";
import Characters from "@/components/character/Character";
import ApolloWithMutation from "@/components/ApolloWithMutation/ApolloWithMutation";
import ApolloWithSubscription from "@/components/ApolloWithSubscription/ApolloWithSubscription";

//lazy imports
const Home = lazy(() => import("../components/home/Home"));
const LayoutAuth = lazy(() => import("../components/layoutAuth/LayoutAuth"));
const Login = lazy(() => import("../components/login/Login"));
const PrivateRoutes = lazy(() => import("./PrivateRouter"));

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        path="/"
        element={
          <SuspenseErrorBoundary>
            <PrivateRoutes />
          </SuspenseErrorBoundary>
        }
      >
        <Route
          path="/characters"
          element={
            <SuspenseErrorBoundary>
              <Characters />
            </SuspenseErrorBoundary>
          }
        />
        <Route
          path="/characters-with-mutation"
          element={
            <SuspenseErrorBoundary>
              <ApolloWithMutation />
            </SuspenseErrorBoundary>
          }
        />
        <Route
          path="/blog-subscription"
          element={
            <SuspenseErrorBoundary>
              <ApolloWithSubscription />
            </SuspenseErrorBoundary>
          }
        />
        <Route
          path="/character/:id"
          element={
            <SuspenseErrorBoundary>
              <SingleCharacter />
            </SuspenseErrorBoundary>
          }
        />
        <Route
          index
          element={
            <SuspenseErrorBoundary>
              <Home />
            </SuspenseErrorBoundary>
          }
        />
      </Route>
      <Route
        path="auth/*"
        element={
          <SuspenseErrorBoundary>
            <LayoutAuth />
          </SuspenseErrorBoundary>
        }
      >
        <Route
          path="signin"
          element={
            <SuspenseErrorBoundary>
              <Login />
            </SuspenseErrorBoundary>
          }
        />
        <Route />
      </Route>
    </>,
  ),
);

export default router;
