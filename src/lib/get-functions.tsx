import { API_URL } from "@/lib/utils";
import axios from "axios";

type PaginatedResponse<T> = {
  next: string | undefined;
  prev: string | undefined;
  count: number;
  results: T[];
};

export const fetchData = async <T,>(
  endpoint: string
): Promise<PaginatedResponse<T>> => {
  try {
    const { data } = await axios.get<PaginatedResponse<T>>(
      `${API_URL}${endpoint}`
    );
    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "Erreur lors de la récupération des données"
    );
  }
};

export const fetchDataById = async <T,>(endpoint: string): Promise<T> => {
  try {
    const { data } = await axios.get<T>(`${API_URL}${endpoint}`);
    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "Erreur lors de la récupération des données"
    );
  }
};
