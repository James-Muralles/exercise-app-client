import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  GetExercisesResponse,
} from "./types";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL }),
  reducerPath: "main",
  tagTypes: ["Exercises"],
  endpoints: (build) => ({
    getExercises: build.query<Array<GetExercisesResponse>, void>({
      query: () => "exercise/exercises/",
      providesTags: ["Exercises"],
    }),
  }),
});

export const {useGetExercisesQuery} =
  api;