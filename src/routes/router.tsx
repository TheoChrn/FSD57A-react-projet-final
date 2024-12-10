import Home from "@/routes/home/home";
import { Characters } from "@/routes/pages/characters/characters";
import { RootLayout } from "@/routes/root-layout";
import { createBrowserRouter, RouterProvider } from "react-router";
import NotFound from "./not-found";
import { PagesLayout } from "@/routes/pages/pages-layout";
import { Character } from "@/routes/pages/characters/characterId/character";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        element: <PagesLayout />,
        children: [
          {
            path: "characters",
            element: <Characters />,
            // action: newAction(queryClient),
            errorElement: <NotFound />,
          },
          {
            path: "characters/:characterId",
            element: <Character />,
            // loader: contactLoader(queryClient),
            // action: contactAction(queryClient),
            errorElement: <NotFound />,
          },
        ],
      },
    ],
  },
]);

export function Router() {
  return (
    <RouterProvider router={router} />
    // <BrowserRouter>
    //   <RouterRoutes>
    //     <Route element={<RootLayout />}>
    //       <Route index element={<Home />} />
    //       <Route path="*" element={<NotFound />} />
    //       <Route element={<PagesLayout />}>
    //         <Route path="/characters" element={<Characters />} />
    //         <Route path="/movies" element={<Movies />} />
    //         <Route path="/vehicles" element={<Vehicles />} />
    //         <Route path="/starships" element={<Starships />} />
    //         <Route path="/planets" element={<Planets />} />
    //         <Route path="/species" element={<Species />} />
    //       </Route>
    //     </Route>
    //   </RouterRoutes>
    // </BrowserRouter>
  );
}
