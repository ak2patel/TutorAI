import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { IAssignment, CreateAssignmentRequest, ApiResponse } from '../types';

// ============================================
// RTK Query API Configuration
// Handles all API calls and caching for the frontend
// ============================================

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  }),
  tagTypes: ['Assignment'],
  endpoints: (builder) => ({
    getAssignments: builder.query<IAssignment[], void>({
      query: () => '/assignments',
      transformResponse: (response: ApiResponse<IAssignment[]>) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Assignment' as const, id })),
              { type: 'Assignment', id: 'LIST' },
            ]
          : [{ type: 'Assignment', id: 'LIST' }],
    }),

    getAssignmentById: builder.query<IAssignment, string>({
      query: (id) => `/assignments/${id}`,
      transformResponse: (response: ApiResponse<IAssignment>) => response.data,
      providesTags: (_result, _error, id) => [{ type: 'Assignment', id }],
    }),

    createAssignment: builder.mutation<IAssignment, CreateAssignmentRequest>({
      query: (body) => ({
        url: '/assignments',
        method: 'POST',
        body,
      }),
      transformResponse: (response: ApiResponse<IAssignment>) => response.data,
      invalidatesTags: [{ type: 'Assignment', id: 'LIST' }],
    }),

    regenerateAssignment: builder.mutation<IAssignment, string>({
      query: (id) => ({
        url: `/assignments/${id}/regenerate`,
        method: 'POST',
      }),
      transformResponse: (response: ApiResponse<IAssignment>) => response.data,
      invalidatesTags: (_result, _error, id) => [{ type: 'Assignment', id }],
    }),

    updateAssignment: builder.mutation<IAssignment, { id: string; title: string }>({
      query: ({ id, title }) => ({
        url: `/assignments/${id}`,
        method: 'PATCH',
        body: { title },
      }),
      transformResponse: (response: ApiResponse<IAssignment>) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Assignment', id },
        { type: 'Assignment', id: 'LIST' },
      ],
    }),

    deleteAssignment: builder.mutation<void, string>({
      query: (id) => ({
        url: `/assignments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Assignment', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetAssignmentsQuery,
  useGetAssignmentByIdQuery,
  useCreateAssignmentMutation,
  useRegenerateAssignmentMutation,
  useUpdateAssignmentMutation,
  useDeleteAssignmentMutation,
} = api;
