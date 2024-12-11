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
} from "@/routes/pages/characters/characterId/character";
import { Suspense } from "react";
import { QueryClient } from "@tanstack/react-query";

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
        path: "*",
        element: <NotFound />,
      },
      {
        index: true,
        element: <Home />,
      },
      {
        element: <PagesLayout />,
        errorElement: <NotFound />,
        children: [
          {
            path: "characters",
            loader: charactersLoader(queryClient),
            element: (
              <Suspense fallback="Chargement...">
                <Characters />
              </Suspense>
            ),
            errorElement: <NotFound />,
          },
          {
            path: "characters/:characterId",
            element: (
              <Suspense fallback="Chargement du personnage...">
                <Character />
              </Suspense>
            ),
            loader: characterLoader(queryClient),
            errorElement: <NotFound />,
          },
        ],
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
