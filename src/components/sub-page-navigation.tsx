import { RootState } from "@/app/store";
import clsx from "clsx";
import { useSelector } from "react-redux";
import { NavLinkProps, NavLinkRenderProps } from "react-router";
import { NavLink } from "react-router";

export function SubPageNavigation() {
  const favorites = useSelector((state: RootState) => state.favorites);
  const watchList = useSelector((state: RootState) => state.watchList);

  return (
    <nav>
      <menu className="flex flex-wrap gap-3 justify-center">
        <CustomNavLink to={"/characters"}>Characters</CustomNavLink>
        <CustomNavLink to={"/films"}>Movies</CustomNavLink>
        <CustomNavLink className="relative" to={"/favorites"}>
          Favorites
          {!!favorites.length && (
            <span className="absolute -top-1 -left-1 bg-accent  rounded-full size-4 flex justify-center items-center  text-xs text-accent-foreground">
              {favorites.length}
            </span>
          )}
        </CustomNavLink>
        <CustomNavLink className="relative" to={"/watch list"}>
          Watch list
          {!!watchList.length && (
            <span className="absolute -top-1 -left-1 bg-accent  rounded-full size-4 flex justify-center items-center  text-xs text-accent-foreground">
              {watchList.length}
            </span>
          )}
        </CustomNavLink>
      </menu>
    </nav>
  );
}

interface TCustomNavLink extends NavLinkProps {}

const CustomNavLink = ({ children, ...props }: TCustomNavLink) => {
  return (
    <NavLink
      {...props}
      className={({ isActive }) =>
        clsx(
          "group relative text-center",
          isActive ? "text-accent" : "hover:text-accent"
        )
      }
    >
      {({ isActive, isPending, isTransitioning }: NavLinkRenderProps) => (
        <>
          <div
            className={clsx(
              "absolute bottom-0 left-0 w-full h-0.5 bg-accent transform duration-200",
              isActive ? "scale-100" : "scale-0 group-hover:scale-100"
            )}
          ></div>

          {typeof children === "function"
            ? children({ isActive, isPending, isTransitioning })
            : children}
        </>
      )}
    </NavLink>
  );
};
