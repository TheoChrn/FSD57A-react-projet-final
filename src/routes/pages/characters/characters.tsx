import { RootState } from "@/app/store";
import { CustomPagination } from "@/components/pagination";
import {
  addToFavorites,
  removeFromFavorites,
} from "@/features/favorites/favoritesSlice";
import { fetchData } from "@/lib/get-functions";
import { TCharacter } from "@/lib/types";
import { getIdFromUrl } from "@/lib/utils";
import {
  QueryClient,
  queryOptions,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  ClientLoaderFunctionArgs,
  Link,
  LoaderFunctionArgs,
  useLoaderData,
} from "react-router";

export const charactersLoader =
  (queryClient: QueryClient) =>
  async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const page = searchParams.get("page") || "1";

    await queryClient.ensureQueryData(
      queryOptions({
        queryKey: ["characters", page],
        queryFn: () => fetchData<TCharacter>(`people?page=${page}`),
      })
    );

    return { page };
  };

export function Characters() {
  const favorites = useSelector(
    (state: RootState) => state.favorites
  );
  const { page = "1" } = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof charactersLoader>>
  >;

  const dispatch = useDispatch();

  const { data, error } = useSuspenseQuery(
    queryOptions({
      queryKey: ["characters", page],
      queryFn: () => fetchData<TCharacter>(`people?page=${page}`),
    })
  );

  if (error) return error.message;
  const { results: characters } = data;

  const maxPages = Math.floor(data.count / 10);

  return (
    <>
      {!!characters.length ? (
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(max(200px,(100%-((3*1rem)))_/_3),1fr))] gap-4">
          {characters.map((character) => (
            <li
              data-favorite={favorites.includes(character.url) ? "" : undefined}
              className="group flex justify-center items-center gap-2"
              key={character.url}
            >
              <Link to={`${getIdFromUrl({ url: character.url })}`}>
                {character.name}
              </Link>
              <button
                onClick={() =>
                  dispatch(
                    favorites.includes(character.url)
                      ? removeFromFavorites(character.url)
                      : addToFavorites(character.url)
                  )
                }
              >
                <Heart
                  className="hover:fill-red-500/40 hover:stroke-red-500/40 hover:scale-110 duration-200 active:scale-100 group-data-[favorite]:fill-red-500 group-data-[favorite]:stroke-red-500"
                  size={20}
                />
                <span className="sr-only">Add to favrites</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <span>Aucun personnage trouvé</span>
      )}

      <CustomPagination currentPage={Number(page)} maxPages={maxPages} />
    </>
  );
}
