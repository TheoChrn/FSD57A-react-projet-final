import { fetchData } from "@/lib/get-functions";
import { TCharacter } from "@/lib/types";
import { getIdFromUrl } from "@/lib/utils";
import {
  QueryClient,
  queryOptions,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Link } from "react-router";



export const charactersLoader = (queryClient: QueryClient) => async () =>
  await queryClient.ensureQueryData(
    queryOptions({
      queryKey: ["characters"],
      queryFn: () => fetchData<TCharacter>("people"),
    })
  );

export function Characters() {
  const {
    data: { results: characters },
    error,
  } = useSuspenseQuery(
    queryOptions({
      queryKey: ["characters"],
      queryFn: () => fetchData<TCharacter>("people"),
    })
  );

  if (error) return error.message;

  return (
    <>
      {!!characters.length ? (
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(max(200px,(100%-((3*1rem)))_/_3),1fr))] gap-4">
          {characters.map((character) => (
            <li className="text-center" key={character.url}>
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
