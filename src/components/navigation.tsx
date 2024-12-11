import { Link, LinkProps } from "react-router";

export function Navigation() {
  return (
    <nav>
      <menu className="flex flex-wrap gap-4">
        <CustomLink src="/assets/character.png" to="/characters">
          Characters
        </CustomLink>
        <CustomLink
          position="left-[55%]"
          src="/assets/cinema-camera.png"
          to="/films"
        >
          Movies
        </CustomLink>
        <CustomLink src="/assets/vehicle.png" to="/vehicles">
          Vehicles
        </CustomLink>
        <CustomLink src="/assets/starship.png" to="/starships">
          Starships
        </CustomLink>
        <CustomLink src="/assets/planet.png" to="/planets">
          Planets
        </CustomLink>
        <CustomLink src="/assets/species.png" to="/species">
          Species
        </CustomLink>
      </menu>
    </nav>
  );
}

interface CustomLink extends LinkProps {
  src: string;
  position?: string;
}
const CustomLink = ({ children, position, ...props }: CustomLink) => {
  return (
    <li className="group relative text-center uppercase hologram flex-[1_0_calc(33.333333%_-_1rem)] min-w-[250px]">
      <Link {...props}>
        <figure className="group-hover:animate-pulse relative">
          <img
            src="/assets/hologram.png"
            height={150}
            width={150}
            className="w-full"
            alt={"Image preview de la page"}
          />
          <img
            className={`group-hover:animate-float absolute w-32 top-[40%] opacity-50 -translate-x-1/2  -translate-y-1/2 ${
              position ? position : "left-1/2"
            }`}
            src={props.src}
          />
        </figure>
        <span className="text-2xl"> {children}</span>
      </Link>
    </li>
  );
};
