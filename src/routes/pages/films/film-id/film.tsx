import { RootState } from "@/app/store";
import {
  Section,
  SectionItems,
  SectionLinkItem,
  SectionTitle,
} from "@/components/sections-components";
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
            fetchDataById<TCharacter>(`characters/${getIdFromUrl({ url })}`),
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
  const favorites = useSelector(
    (state: RootState) => state.favorites.favorites
  );

  const { data: film, error } = useSuspenseQuery(
    queryOptions({
      queryKey: ["film", filmId],
      queryFn: () => fetchDataById<TFilm>(`films/${filmId}`),
    })
  );

  const relatedQueries = useSuspenseQueries({
    queries: [
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

  const populatedFilm = {
    ...film,
    planets: relatedQueries
      .slice(0, film.planets.length)
      .map((query) => query.data as TPlanet),
    characters: relatedQueries
      .slice(film.planets.length, film.planets.length + film.characters.length)
      .map((query) => query.data as TCharacter),
    species: relatedQueries
      .slice(
        film.planets.length + film.characters.length,
        film.planets.length + film.characters.length + film.species.length
      )
      .map((query) => query.data as TSpecies),
    starships: relatedQueries
      .slice(
        film.planets.length + film.characters.length + film.species.length,
        film.planets.length +
          film.characters.length +
          film.species.length +
          film.starships.length
      )
      .map((query) => query.data as TStarship),
    vehicles: relatedQueries
      .slice(
        film.planets.length +
          film.characters.length +
          film.species.length +
          film.starships.length,
        film.planets.length +
          film.characters.length +
          film.species.length +
          film.starships.length +
          film.vehicles.length
      )
      .map((query) => query.data as TVehicle),
  };

  if (error) return error.message;

  return (
    <section className="space-y-8 text-center">
      <h1
        data-favorite={favorites.includes(film.url) ? "" : undefined}
        className="group text-3xl"
      >
        {populatedFilm.title}{" "}
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
            size={24}
          />
          <span className="sr-only">Add to favorites</span>
        </button>
      </h1>
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
              <SectionLinkItem
                key={v.url}
                to={`/vehicles/${getIdFromUrl({ url: v.url })}`}
              >
                {v.name}
              </SectionLinkItem>
            ))}
          </SectionItems>
          <SectionItems>
            {populatedFilm.starships.map((s) => (
              <SectionLinkItem
                key={s.url}
                to={`/starships/${getIdFromUrl({ url: s.url })}`}
              >
                {s.name}
              </SectionLinkItem>
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
              <SectionLinkItem
                key={p.url}
                to={`/planets/${getIdFromUrl({ url: p.url })}`}
              >
                {p.name}
              </SectionLinkItem>
            ))}
          </SectionItems>
        </Section>
      )}

      {!!populatedFilm.species.length && (
        <Section>
          <SectionTitle>Related Species</SectionTitle>
          <SectionItems>
            {populatedFilm.species.map((s) => (
              <SectionLinkItem
                key={s.url}
                to={`/species/${getIdFromUrl({ url: s.url })}`}
              >
                {s.name}
              </SectionLinkItem>
            ))}
          </SectionItems>
        </Section>
      )}
    </section>
  );
}
