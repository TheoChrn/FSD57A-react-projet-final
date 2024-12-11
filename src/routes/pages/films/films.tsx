import { RootState } from "@/app/store";
import {
  addToWatchList,
  removeFromWatchList,
} from "@/features/watchList/watchListSlice";
import { fetchData } from "@/lib/get-functions";
import { TFilm } from "@/lib/types";
import { getIdFromUrl } from "@/lib/utils";
import {
  QueryClient,
  queryOptions,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { MinusCircle, PlusCircle } from "lucide-react";
import { useState } from "react";
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
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const watchList = useSelector(
    (state: RootState) => state.watchList.watchList
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

  const sortedFilms = [...films].sort((a, b) =>
    sortOrder === "asc"
      ? a.title.localeCompare(b.title)
      : b.title.localeCompare(a.title)
  );

  return (
    <section className="grid gap-8">
      <button
        className="border border-primary px-3 py-2 rounded w-fit mx-auto"
        onClick={() =>
          setSortOrder((prevState) => (prevState === "asc" ? "desc" : "asc"))
        }
      >
        {sortOrder === "asc" ? "Sort Movies Z-A" : "Sort Movies A-Z"}
      </button>
      {!!sortedFilms.length ? (
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(max(200px,(100%-((3*1rem)))_/_3),1fr))] gap-4">
          {sortedFilms.map((film) => {
            const isInWatchList = watchList.includes(film.url);
            return (
              <li
                data-favorite={isInWatchList ? "" : undefined}
                className="group flex flex-col justify-center items-center gap-2"
                key={film.url}
              >
                <Link to={`${getIdFromUrl({ url: film.url })}`}>
                  {film.title}
                </Link>
                <button
                  className="hover:scale-105 duration-200 active:scale-100 mx-auto flex items-center gap-2 px-3 py-2 border-2 rounded bg-accent text-accent-foreground"
                  onClick={() =>
                    dispatch(
                      isInWatchList
                        ? removeFromWatchList(film.url)
                        : addToWatchList(film.url)
                    )
                  }
                >
                  {isInWatchList ? (
                    <MinusCircle size={24} />
                  ) : (
                    <PlusCircle size={24} />
                  )}
                  <span className="text-sm">
                    {isInWatchList
                      ? "Remove from watch list"
                      : "Add to watch list"}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <span>Aucun personnage trouvé</span>
      )}
    </section>
  );
}
