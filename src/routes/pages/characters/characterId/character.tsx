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
import { LoaderFunctionArgs, useLoaderData } from "react-router";

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
      .map((query) => query.data),
    species: relatedQueries
      .slice(
        character.films.length,
        character.films.length + character.species.length
      )
      .map((query) => query.data),
    starships: relatedQueries
      .slice(
        character.films.length + character.species.length,
        character.films.length +
          character.species.length +
          character.starships.length
      )
      .map((query) => query.data),
    vehicles: relatedQueries
      .slice(
        character.films.length +
          character.species.length +
          character.starships.length
      )
      .map((query) => query.data),
  };

  if (error) return error.message;

  return <div>{populatedCharacter.name}</div>;
}
