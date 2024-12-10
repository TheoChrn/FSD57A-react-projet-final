import { fetchData } from "@/lib/get-functions";
import { getIdFromUrl } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";

export type TCharacter = {
  name: string;
  birth_year: string;
  eye_color: string;
  gender: "Male" | "Female" | "unknown" | "n/a";
  hair_color: string;
  height: string;
  mass: string;
  skin_color: string;
  homeworld: string;
  films: string[];
  species: string[];
  starships: string[];
  vehicles: string[];
  url: string;
  created: string;
  edited: string;
};

export function Characters() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["characters"],
    queryFn: () => fetchData<TCharacter>("people"),
  });

  if (isLoading) return "Chargement...";

  if (error) return error.message;

  if (!data || !data.results) {
    return <div>Aucune donnée disponible</div>;
  }

  return (
    <>
      {!!data.results.length ? (
        <ul>
          {data.results.map((character) => (
            <li key={character.url}>
              <Link to={`${getIdFromUrl({ url: character.url })}`}>
                {character.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <span>Aucun personnage trouvé</span>
      )}
    </>
  );
}
