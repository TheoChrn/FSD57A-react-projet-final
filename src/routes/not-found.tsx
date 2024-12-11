import { Outlet } from "react-router";

export default function NotFound() {
  return (
    <>
      <div>Error 404 not found</div>
      <Outlet />
    </>
  );
}
