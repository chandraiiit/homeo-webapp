import axios from 'axios';

// ─── Axios Instance ───────────────────────────────────────────────────────────

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
});

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Chapter {
  id: number;
  name: string;
}

export interface Rubric {
  id: number;
  section: string;
  subsection: string | null;
  modality: string | null;
  description: string;
  chapter: Chapter;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface Remedy {
  id: number;
  name: string;
}

export interface RemedyResult {
  remedyId: number;
  name: string;
  abbreviation: string;
  score: number;
  grades: { grade: number; count: number }[];
  matchedRubricCount: number;
}

// ─── API ──────────────────────────────────────────────────────────────────────

export const api = {
  chapters: {
    list: () =>
      http.get<Chapter[]>('/chapters').then((r) => r.data),
  },

  rubrics: {
    search: (params: {
      search?: string;
      chapterId?: number;
      page?: number;
      limit?: number;
    }) =>
      http
        .get<PaginatedResponse<Rubric>>('/rubrics', { params })
        .then((r) => r.data),

    getById: (id: number) =>
      http.get<Rubric>(`/rubrics/${id}`).then((r) => r.data),
  },

  remedies: {
    list: (page = 1, limit = 20) =>
      http
        .get<PaginatedResponse<Remedy>>('/remedies', { params: { page, limit } })
        .then((r) => r.data),

    getById: (id: number) =>
      http.get<Remedy>(`/remedies/${id}`).then((r) => r.data),
  },

  analysis: {
    repertorize: (rubricIds: number[]) =>
      http
        .post<RemedyResult[]>('/analysis', { rubricIds })
        .then((r) => r.data),
  },
};