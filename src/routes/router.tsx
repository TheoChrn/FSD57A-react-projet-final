import { store } from "@/app/store";
import { SubPageLoader } from "@/components/sub-page-loader";
import ErrorPage from "@/routes/error-page";
import Home from "@/routes/home/home";
import {
  Character,
  characterLoader,
} from "@/routes/pages/characters/character-id/character";
import {
  Characters,
  charactersLoader,
} from "@/routes/pages/characters/characters";
import { Film, filmLoader } from "@/routes/pages/films/film-id/film";
import { Films, filmsLoader } from "@/routes/pages/films/films";
import { PagesLayout } from "@/routes/pages/pages-layout";
import { RootLayout } from "@/routes/root-layout";
import { QueryClient } from "@tanstack/react-query";
import { Suspense } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router"; // Utilisation de BrowserRouter ici
import NotFound from "./not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 10,
    },
  },
});

export function Router() {
  return (
    <Provider store={store}>
      <BrowserRouter basename="/FSD57A-react-projet-final">
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<Home />} />
            <Route element={<PagesLayout />} errorElement={<ErrorPage />}>
              <Route path="*" element={<NotFound />} />
              <Route
                path="characters"
                loader={charactersLoader(queryClient)}
                element={
                  <Suspense
                    fallback={<SubPageLoader>Loading characters</SubPageLoader>}
                  >
                    <Characters />
                  </Suspense>
                }
                errorElement={<ErrorPage />}
              />
              <Route
                path="characters/:characterId"
                loader={characterLoader(queryClient)}
                element={
                  <Suspense
                    fallback={<SubPageLoader>Loading character</SubPageLoader>}
                  >
                    <Character />
                  </Suspense>
                }
                errorElement={<ErrorPage />}
              />
              <Route
                path="films"
                loader={filmsLoader(queryClient)}
                element={
                  <Suspense
                    fallback={<SubPageLoader>Loading movies</SubPageLoader>}
                  >
                    <Films />
                  </Suspense>
                }
                errorElement={<ErrorPage />}
              />
              <Route
                path="films/:filmId"
                loader={filmLoader(queryClient)}
                element={
                  <Suspense
                    fallback={<SubPageLoader>Loading movie</SubPageLoader>}
                  >
                    <Film />
                  </Suspense>
                }
                errorElement={<ErrorPage />}
              />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
