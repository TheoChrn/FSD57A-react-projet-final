import Home from "@/routes/home/home";
import {
  Characters,
  charactersLoader,
} from "@/routes/pages/characters/characters";
import { RootLayout } from "@/routes/root-layout";
import { createBrowserRouter, RouterProvider } from "react-router";
import NotFound from "./not-found";
import { PagesLayout } from "@/routes/pages/pages-layout";
import {
  Character,
  characterLoader,
} from "@/routes/pages/characters/character-id/character";
import { Suspense } from "react";
import { QueryClient } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "@/app/store";
import { Films, filmsLoader } from "@/routes/pages/films/films";
import { Film, filmLoader } from "@/routes/pages/films/film-id/film";
import { Spinner } from "@/components/spinner";
import { SubPageLoader } from "@/components/sub-page-loader";
import ErrorPage from "@/routes/error-page";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 10,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,

    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        element: <PagesLayout />,
        errorElement: <ErrorPage />,
        children: [
          {
            path: "*",
            element: <NotFound />,
          },
          {
            path: "characters",
            loader: charactersLoader(queryClient),
            element: (
              <Suspense
                fallback={<SubPageLoader>Loading characters</SubPageLoader>}
              >
                <Characters />
              </Suspense>
            ),
            errorElement: <ErrorPage />,
          },
          {
            path: "characters/:characterId",
            element: (
              <Suspense
                fallback={<SubPageLoader>Loading character</SubPageLoader>}
              >
                <Character />
              </Suspense>
            ),
            loader: characterLoader(queryClient),
            errorElement: <ErrorPage />,
          },
          {
            path: "films",
            loader: filmsLoader(queryClient),
            element: (
              <Suspense
                fallback={<SubPageLoader>Loading movies</SubPageLoader>}
              >
                <Films />
              </Suspense>
            ),
            errorElement: <ErrorPage />,
          },
          {
            path: "films/:filmId",
            element: (
              <Suspense fallback={<SubPageLoader>Loading movie</SubPageLoader>}>
                <Film />
              </Suspense>
            ),
            loader: filmLoader(queryClient),
            errorElement: <ErrorPage />,
          },
        ],
      },
    ],
  },
]);

export function Router() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}
