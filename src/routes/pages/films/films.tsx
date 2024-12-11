import { RootState } from "@/app/store";
import {
  addToFavorites,
  removeFromFavorites,
} from "@/features/favorites/favoritesSlice";
import { fetchData } from "@/lib/get-functions";
import { TFilm } from "@/lib/types";
import { getIdFromUrl } from "@/lib/utils";
import {
  QueryClient,
  queryOptions,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";

export const filmsLoader = (queryClient: QueryClient) => async () =>
  await queryClient.ensureQueryData(
    queryOptions({
      queryKey: ["films"],
      queryFn: () => fetchData<TFilm>("films"),
    })
  );

export function Films() {
  const favorites = useSelector(
    (state: RootState) => state.favorites.favorites
  );

  const dispatch = useDispatch();

  const {
    data: { results: films },
    error,
  } = useSuspenseQuery(
    queryOptions({
      queryKey: ["films"],
      queryFn: () => fetchData<TFilm>("films"),
    })
  );

  if (error) return error.message;

  return (
    <>
      {!!films.length ? (
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(max(200px,(100%-((3*1rem)))_/_3),1fr))] gap-4">
          {films.map((film) => (
            <li
              data-favorite={favorites.includes(film.url) ? "" : undefined}
              className="group flex justify-center items-center gap-2"
              key={film.url}
            >
              <Link to={`${getIdFromUrl({ url: film.url })}`}>
                {film.title}
              </Link>
              <button
                onClick={() =>
                  dispatch(
                    favorites.includes(film.url)
                      ? removeFromFavorites(film.url)
                      : addToFavorites(film.url)
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
    </>
  );
}
