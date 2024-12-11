import { RootState } from "@/app/store";
import {
  addToFavorites,
  removeFromFavorites,
} from "@/features/favorites/favoritesSlice";
import { fetchDataById } from "@/lib/get-functions";
import {
  TCharacter,
  TFilm,
  TPlanet,
  TSpecies,
  TStarship,
  TVehicle,
} from "@/lib/types";
import { getIdFromUrl } from "@/lib/utils";

import {
  QueryClient,
  queryOptions,
  useSuspenseQueries,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, LoaderFunctionArgs, useLoaderData } from "react-router";

export const characterLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const { characterId } = params;
    if (!characterId) {
      throw new Error("No character ID provided");
    }

    const characterData = await queryClient.ensureQueryData(
      queryOptions({
        queryKey: ["character", characterId],
        queryFn: () => fetchDataById<TCharacter>(`people/${characterId}`),
      })
    );

    if (!characterData) {
      throw new Error("Character not found");
    }

    queryClient.ensureQueryData(
      queryOptions({
        queryKey: ["homeworld", getIdFromUrl({ url: characterData.homeworld })],
        queryFn: () =>
          fetchDataById<TPlanet>(
            `planets/${getIdFromUrl({ url: characterData.homeworld })}`
          ),
      })
    );
    characterData.films.forEach((url) => {
      queryClient.ensureQueryData(
        queryOptions({
          queryKey: ["film", getIdFromUrl({ url })],
          queryFn: () => fetchDataById<TFilm>(`films/${getIdFromUrl({ url })}`),
        })
      );
    });
    characterData.species.forEach((url) => {
      queryClient.ensureQueryData(
        queryOptions({
          queryKey: ["species", getIdFromUrl({ url })],
          queryFn: () =>
            fetchDataById<TSpecies>(`species/${getIdFromUrl({ url })}`),
        })
      );
    });
    characterData.starships.forEach((url) => {
      queryClient.ensureQueryData(
        queryOptions({
          queryKey: ["starship", getIdFromUrl({ url })],
          queryFn: () =>
            fetchDataById<TStarship>(`starships/${getIdFromUrl({ url })}`),
        })
      );
    });

    characterData.vehicles.forEach((url) => {
      queryClient.ensureQueryData(
        queryOptions({
          queryKey: ["vehicle", getIdFromUrl({ url })],
          queryFn: () =>
            fetchDataById<TVehicle>(`vehicles/${getIdFromUrl({ url })}`),
        })
      );
    });

    return { characterId };
  };

export function Character() {
  const { characterId } = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof characterLoader>>
  >;
  const dispatch = useDispatch();
  const favorites = useSelector(
    (state: RootState) => state.favorites.favorites
  );

  const { data: character, error } = useSuspenseQuery(
    queryOptions({
      queryKey: ["character", characterId],
      queryFn: () => fetchDataById<TCharacter>(`people/${characterId}`),
    })
  );

  const planetQuery = useSuspenseQuery({
    queryKey: ["planet", getIdFromUrl({ url: character.homeworld })],
    queryFn: (): Promise<TPlanet> =>
      fetchDataById<TPlanet>(
        `planets/${getIdFromUrl({ url: character.homeworld })}`
      ),
  });

  const relatedQueries = useSuspenseQueries({
    queries: [
      ...character.films.map((url) => ({
        queryKey: ["film", getIdFromUrl({ url })],
        queryFn: () => fetchDataById<TFilm>(`films/${getIdFromUrl({ url })}`),
      })),
      ...character.species.map((url) => ({
        queryKey: ["species", getIdFromUrl({ url })],
        queryFn: () =>
          fetchDataById<TSpecies>(`species/${getIdFromUrl({ url })}`),
      })),
      ...character.starships.map((url) => ({
        queryKey: ["starship", getIdFromUrl({ url })],
        queryFn: () =>
          fetchDataById<TStarship>(`starships/${getIdFromUrl({ url })}`),
      })),
      ...character.vehicles.map((url) => ({
        queryKey: ["vehicle", getIdFromUrl({ url })],
        queryFn: () =>
          fetchDataById<TVehicle>(`vehicles/${getIdFromUrl({ url })}`),
      })),
    ],
  });

  const populatedCharacter = {
    ...character,
    homeworld: planetQuery.data,
    films: relatedQueries
      .slice(0, character.films.length)
      .map((query) => query.data as TFilm),
    species: relatedQueries
      .slice(
        character.films.length,
        character.films.length + character.species.length
      )
      .map((query) => query.data as TSpecies),
    starships: relatedQueries
      .slice(
        character.films.length + character.species.length,
        character.films.length +
          character.species.length +
          character.starships.length
      )
      .map((query) => query.data as TStarship),
    vehicles: relatedQueries
      .slice(
        character.films.length +
          character.species.length +
          character.starships.length
      )
      .map((query) => query.data as TVehicle),
  };

  if (error) return error.message;

  return (
    <section className="space-y-8 text-center">
      <h1
        data-favorite={favorites.includes(character.url) ? "" : undefined}
        className="group text-3xl"
      >
        {populatedCharacter.name}{" "}
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
            size={24}
          />
          <span className="sr-only">Add to favrites</span>
        </button>
      </h1>
      <section className="space-y-2">
        <h2 className="text-xl">Character Details</h2>
        <ul>
          <li className="capitalize">
            Birth Year: {populatedCharacter.birth_year}
          </li>
          <li className="capitalize">
            Eye Color: {populatedCharacter.eye_color}
          </li>
          <li className="capitalize">Gender: {populatedCharacter.gender}</li>
          <li className="capitalize">
            Hair Color: {populatedCharacter.hair_color}
          </li>
          <li className="capitalize">Height: {populatedCharacter.height}</li>
          <li className="capitalize">Mass: {populatedCharacter.mass}kg</li>
          <li className="capitalize">
            Skin Color: {populatedCharacter.skin_color}
          </li>
          <li className="capitalize">
            Homeworld:{" "}
            <Link
              to={`/plantets/${getIdFromUrl({
                url: character.homeworld,
              })}`}
              className="text-accent underline"
            >
              {populatedCharacter.homeworld.name}
            </Link>
          </li>
          <li className="">
            Species:{" "}
            {!!populatedCharacter.species.length ? (
              <ul className="inline-block">
                {populatedCharacter.species.map((spece) => (
                  <li>
                    <Link
                      to={`/species/${getIdFromUrl({
                        url: spece.url,
                      })}`}
                      className="text-accent underline"
                    >
                      {spece.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              "-"
            )}
          </li>
        </ul>
      </section>

      {(!!populatedCharacter.starships.length ||
        !!populatedCharacter.vehicles.length) && (
        <section className="space-y-2">
          <h2 className="text-xl">Vehicles and Starships</h2>
          <ul>
            {populatedCharacter.vehicles.map((v) => (
              <li>
                <Link
                  className="text-accent underline"
                  to={`/vehicles/${getIdFromUrl({ url: v.url })}`}
                >
                  {v.name}
                </Link>
              </li>
            ))}
            {populatedCharacter.starships.map((s) => (
              <li>
                <Link
                  className="text-accent underline"
                  to={`/starships/${getIdFromUrl({ url: s.url })}`}
                >
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {!!populatedCharacter.films.length && (
        <section className="space-y-2">
          <h2 className="text-xl">Related Films</h2>
          <ul>
            {populatedCharacter.films.map((f) => (
              <li key={f.title}>
                <Link
                  className="text-accent underline"
                  to={`/films/${f.episode_id}`}
                >
                  {f.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </section>
  );
}
