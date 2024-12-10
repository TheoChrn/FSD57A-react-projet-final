import { BrowserRouter, Route, Routes as RouterRoutes } from "react-router";
import NotFound from "./not-found";
import Home from "@/routes/home/home";
import { PagesLayout } from "@/routes/pages/pages-layout";
import { Characters } from "@/routes/pages/characters/characters";
import { Movies } from "@/routes/pages/movies/movies";
import { Vehicles } from "@/routes/pages/vehicles/vehicles";
import { Starships } from "@/routes/pages/starships/starships";
import { Planets } from "@/routes/pages/planets/planets";
import { Species } from "@/routes/pages/species/species";
import { RootLayout } from "@/routes/root-layout";

export function Router() {
  return (
    <BrowserRouter>
      <RouterRoutes>
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="*" element={<NotFound />} />
          <Route element={<PagesLayout />}>
            <Route path="/characters" element={<Characters />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/starships" element={<Starships />} />
            <Route path="/planets" element={<Planets />} />
            <Route path="/species" element={<Species />} />
          </Route>
        </Route>
      </RouterRoutes>
    </BrowserRouter>
  );
}
