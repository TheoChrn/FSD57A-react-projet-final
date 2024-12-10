import { API_URL } from "@/lib/utils";
import { useEffect, useState } from "react";
import axios from "axios";

export type Character = {
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
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/people`);
        setCharacters(response.data.results);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error ? err.message : "Une errreur est survenue"
        );
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return "Chargement...";

  if (error) return error;

  return (
    <>
      {!!characters.length ? (
        <ul>
          {characters.map((character) => (
            <li>{character.name}</li>
          ))}
        </ul>
      ) : (
        <span>Aucun personnage trouvé</span>
      )}
    </>
  );
}
