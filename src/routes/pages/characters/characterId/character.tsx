import { fetchDataById } from "@/lib/get-functions";
import { TCharacter } from "@/routes/pages/characters/characters";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";

export function Character() {
  const { characterId } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["character", `${characterId}`],
    queryFn: () => fetchDataById<TCharacter>(`people/${characterId}`),
  });

  if (isLoading) return "Chargement...";

  if (error) return error.message;

  if (!data) {
    return <div>Aucune donnée disponible</div>;
  }

  return <div>character</div>;
}
