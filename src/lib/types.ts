export interface TCharacter {
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
}

export interface TPopulatedCharacter
  extends Omit<
    TCharacter,
    "homeworld" | "films" | "species" | "starships" | "vehicles"
  > {
  homeworld: TPlanet;
  films: TFilm[];
  species: TSpecies[];
  starships: TStarship[];
  vehicles: TVehicle[];
}

export interface TFilm {
  title: string;
  episode_id: number;
  opening_crawl: string;
  director: string;
  producer: string;
  release_date: string;
  species: string[];
  starships: string[];
  vehicles: string[];
  characters: string[];
  planets: string[];
  url: string;
  created: string;
  edited: string;
}

export interface TPopulatedFilm
  extends Omit<
    TFilm,
    "species" | "starships" | "vehicles" | "characters" | "planets"
  > {
  species: TSpecies[];
  starships: TStarship[];
  vehicles: TVehicle[];
  characters: TCharacter[];
  planets: TPlanet[];
}

export interface TStarship {
  name: string;
  model: string;
  starship_class: string;
  manufacturer: string;
  cost_in_credits: string;
  length: string;
  crew: string;
  passengers: string;
  max_atmosphering_speed: string;
  hyperdrive_rating: string;
  MGLT: string;
  cargo_capacity: string;
  consumables: string;
  films: string[];
  pilots: string[];
  url: string;
  created: string;
  edited: string;
}

export interface TPopulatedStarship
  extends Omit<TStarship, "films" | "pilots"> {
  films: TFilm[];
  pilots: TCharacter[];
}

export interface TVehicle {
  name: string;
  model: string;
  vehicle_class: string;
  manufacturer: string;
  length: string;
  cost_in_credits: string;
  crew: string;
  passengers: string;
  max_atmosphering_speed: string;
  cargo_capacity: string;
  consumables: string;
  films: string[];
  pilots: string[];
  url: string;
  created: string;
  edited: string;
}

export interface TPopulatedVehicle extends Omit<TVehicle, "films" | "pilots"> {
  films: TFilm[];
  pilots: TCharacter[];
}

export interface TSpecies {
  name: string;
  classification: string;
  designation: string;
  average_height: string;
  average_lifespan: string;
  eye_colors: string;
  hair_colors: string;
  skin_colors: string;
  language: string;
  homeworld: TPlanet; // TPlanet au lieu d'URL
  people: string[];
  films: string[];
  url: string;
  created: string;
  edited: string;
}

export interface TPopulatedSpecies
  extends Omit<TSpecies, "homeworld" | "people" | "films"> {
  homeworld: TPlanet;
  people: TCharacter[];
  films: TFilm[];
}

export interface TPlanet {
  name: string;
  diameter: string;
  rotation_period: string;
  orbital_period: string;
  gravity: string;
  population: string;
  climate: string;
  terrain: string;
  surface_water: string;
  residents: string[];
  films: string[];
  url: string;
  created: string;
  edited: string;
}

export interface TPopulatedPlanet extends Omit<TPlanet, "residents" | "films"> {
  residents: TCharacter[];
  films: TFilm[];
}
