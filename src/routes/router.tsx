import { BrowserRouter, Route, Routes as RouterRoutes } from "react-router";
import NotFound from "./not-found";
import Home from "@/routes/home/home";
import RootLayout from "@/routes/layout";

export function Router() {
  return (
    <BrowserRouter>
      <RouterRoutes>
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </RouterRoutes>
    </BrowserRouter>
  );
}
