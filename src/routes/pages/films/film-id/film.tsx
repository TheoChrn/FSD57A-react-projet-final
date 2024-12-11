import { RootState } from "@/app/store";
import {
  Section,
  SectionItems,
  SectionLinkItem,
  SectionTitle,
} from "@/components/sections-components";
import {
  addToWatchList,
  removeFromWatchList,
} from "@/features/watchList/watchListSlice";
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
import { MinusCircle, PlusCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { LoaderFunctionArgs, useLoaderData } from "react-router";

export const filmLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const { filmId } = params;
    if (!filmId) {
      throw new Error("No film ID provided");
    }

    const filmData = await queryClient.ensureQueryData(
      queryOptions({
        queryKey: ["film", filmId],
        queryFn: () => fetchDataById<TFilm>(`films/${filmId}`),
      })
    );

    if (!filmData) {
      throw new Error("Character not found");
    }

    filmData.planets.forEach((url) => {
      queryClient.ensureQueryData(
        queryOptions({
          queryKey: ["planet", getIdFromUrl({ url })],
          queryFn: () =>
            fetchDataById<TPlanet>(`planets/${getIdFromUrl({ url })}`),
        })
      );
    });
    filmData.characters.forEach((url) => {
      queryClient.ensureQueryData(
        queryOptions({
          queryKey: ["character", getIdFromUrl({ url })],
          queryFn: () =>
            fetchDataById<TCharacter>(`people/${getIdFromUrl({ url })}`),
        })
      );
    });
    filmData.species.forEach((url) => {
      queryClient.ensureQueryData(
        queryOptions({
          queryKey: ["species", getIdFromUrl({ url })],
          queryFn: () =>
            fetchDataById<TSpecies>(`species/${getIdFromUrl({ url })}`),
        })
      );
    });
    filmData.starships.forEach((url) => {
      queryClient.ensureQueryData(
        queryOptions({
          queryKey: ["starship", getIdFromUrl({ url })],
          queryFn: () =>
            fetchDataById<TStarship>(`starships/${getIdFromUrl({ url })}`),
        })
      );
    });

    filmData.vehicles.forEach((url) => {
      queryClient.ensureQueryData(
        queryOptions({
          queryKey: ["vehicle", getIdFromUrl({ url })],
          queryFn: () =>
            fetchDataById<TVehicle>(`vehicles/${getIdFromUrl({ url })}`),
        })
      );
    });

    return { filmId };
  };

export function Film() {
  const { filmId } = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof filmLoader>>
  >;
  const dispatch = useDispatch();
  const watchList = useSelector((state: RootState) => state.watchList);

  const { data: film, error } = useSuspenseQuery(
    queryOptions({
      queryKey: ["film", filmId],
      queryFn: () => fetchDataById<TFilm>(`films/${filmId}`),
    })
  );

  const relatedQueries = useSuspenseQueries({
    queries: [
      ...film.characters.map((url) => ({
        queryKey: ["planet", getIdFromUrl({ url })],
        queryFn: () =>
          fetchDataById<TPlanet>(`planets/${getIdFromUrl({ url })}`),
      })),
      ...film.characters.map((url) => ({
        queryKey: ["character", getIdFromUrl({ url })],
        queryFn: () =>
          fetchDataById<TCharacter>(`people/${getIdFromUrl({ url })}`),
      })),
      ...film.planets.map((url) => ({
        queryKey: ["planet", getIdFromUrl({ url })],
        queryFn: () =>
          fetchDataById<TPlanet>(`planets/${getIdFromUrl({ url })}`),
      })),
      ...film.species.map((url) => ({
        queryKey: ["species", getIdFromUrl({ url })],
        queryFn: () =>
          fetchDataById<TSpecies>(`species/${getIdFromUrl({ url })}`),
      })),
      ...film.starships.map((url) => ({
        queryKey: ["starship", getIdFromUrl({ url })],
        queryFn: () =>
          fetchDataById<TStarship>(`starships/${getIdFromUrl({ url })}`),
      })),
      ...film.vehicles.map((url) => ({
        queryKey: ["vehicle", getIdFromUrl({ url })],
        queryFn: () =>
          fetchDataById<TVehicle>(`vehicles/${getIdFromUrl({ url })}`),
      })),
    ],
  });

  let startIndex = 0;

  const populatedFilm = {
    ...film,
    planets: relatedQueries
      .slice(startIndex, startIndex + film.planets.length)
      .map((query) => {
        startIndex += film.planets.length;
        return query.data as TPlanet;
      }),
    characters: relatedQueries
      .slice(startIndex, startIndex + film.characters.length)
      .map((query) => {
        startIndex += film.characters.length;
        return query.data as TCharacter;
      }),
    species: relatedQueries
      .slice(startIndex, startIndex + film.species.length)
      .map((query) => {
        startIndex += film.species.length;
        return query.data as TSpecies;
      }),
    starships: relatedQueries
      .slice(startIndex, startIndex + film.starships.length)
      .map((query) => {
        startIndex += film.starships.length;
        return query.data as TStarship;
      }),
    vehicles: relatedQueries
      .slice(startIndex, startIndex + film.vehicles.length)
      .map((query) => {
        startIndex += film.vehicles.length;
        return query.data as TVehicle;
      }),
  };

  if (error) return error.message;

  const isInWatchList = watchList.includes(populatedFilm.url);

  return (
    <section className="space-y-8 text-center">
      <div className="space-y-2">
        <h1
          data-favorite={isInWatchList ? "" : undefined}
          className="group text-3xl "
        >
          {populatedFilm.title}{" "}
        </h1>
        <button
          className="hover:scale-105 duration-200 active:scale-100 mx-auto flex items-center gap-2 px-3 py-2 border-2 rounded bg-accent text-accent-foreground"
          onClick={() =>
            dispatch(
              isInWatchList
                ? removeFromWatchList(populatedFilm.url)
                : addToWatchList(populatedFilm.url)
            )
          }
        >
          {isInWatchList ? <MinusCircle size={24} /> : <PlusCircle size={24} />}
          <span className="text-sm">
            {isInWatchList ? "Remove from watch list" : "Add to watch list"}
          </span>
        </button>
      </div>
      <Section>
        <SectionTitle>Film Details</SectionTitle>
        <ul>
          <li className="capitalize">Director: {populatedFilm.director}</li>
          <li className="capitalize">Producer: {populatedFilm.producer}</li>
          <li className="capitalize">
            Opening Crawl: {populatedFilm.opening_crawl}
          </li>
        </ul>
      </Section>

      {(!!populatedFilm.starships.length ||
        !!populatedFilm.vehicles.length) && (
        <Section>
          <SectionTitle>Related Vehicles and Starships</SectionTitle>
          <SectionItems>
            {populatedFilm.vehicles.map((v) => (
              <li key={v.url}>{v.name}</li>
            ))}
          </SectionItems>
          <SectionItems>
            {populatedFilm.starships.map((s) => (
              <li key={s.url}>{s.name}</li>
            ))}
          </SectionItems>
        </Section>
      )}

      {!!populatedFilm.characters.length && (
        <Section>
          <SectionTitle>Related Characters</SectionTitle>
          <SectionItems>
            {populatedFilm.characters.map((c) => (
              <SectionLinkItem
                key={c.url}
                to={`/characters/${getIdFromUrl({ url: c.url })}`}
              >
                {c.name}
              </SectionLinkItem>
            ))}
          </SectionItems>
        </Section>
      )}

      {!!populatedFilm.planets.length && (
        <Section>
          <SectionTitle>Related Planets</SectionTitle>
          <SectionItems>
            {populatedFilm.planets.map((p) => (
              <li key={p.url}>{p.name}</li>
            ))}
          </SectionItems>
        </Section>
      )}

      {!!populatedFilm.species.length && (
        <Section>
          <SectionTitle>Related Species</SectionTitle>
          <SectionItems>
            {populatedFilm.species.map((s) => (
              <li key={s.url}>{s.name}</li>
            ))}
          </SectionItems>
        </Section>
      )}
    </section>
  );
}
