import { Header } from "@/components/header";
import { Outlet } from "react-router";

export function RootLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
