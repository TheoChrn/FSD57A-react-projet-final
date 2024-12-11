import clsx from "clsx";
import { NavLinkProps, NavLinkRenderProps } from "react-router";
import { NavLink } from "react-router";

export function SubPageNavigation() {
  return (
    <nav>
      <menu className="flex flex-wrap gap-3 justify-center">
        <CustomNavLink to={"/characters"}>Characters</CustomNavLink>
        <CustomNavLink to={"/films"}>Movies</CustomNavLink>
        <CustomNavLink to={"/vehicles"}>Vehicles</CustomNavLink>
        <CustomNavLink to={"/starships"}>Starships</CustomNavLink>
        <CustomNavLink to={"/planets"}>Planets</CustomNavLink>
        <CustomNavLink to={"/species"}>Species</CustomNavLink>
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
