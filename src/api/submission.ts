import apiClient from "./client"
import { cacheGet, cacheSet, cacheInvalidate, cacheInvalidatePattern } from "./cache";
import type { Submission, SubmissionUpdate } from "../types";

const SUBMISSIONS_TTL = 2 * 60 * 1000; // 2 minutes

export const getSubmissions = async (siteId?: number, filters?: { is_active?: boolean }): Promise<Submission[]> => {
    const cacheKey = `submissions:${siteId ?? 'all'}:${filters?.is_active ?? 'default'}`;
    const cached = cacheGet<Submission[]>(cacheKey);
    if (cached) return cached;

    const params: any = {};
    if (siteId) params.site_id = siteId;
    if (filters?.is_active !== undefined) params.is_active = filters.is_active;

    const response = await apiClient.get<Submission[]>("/submissions/", { params });
    cacheSet(cacheKey, response.data, SUBMISSIONS_TTL);
    return response.data;
}

export const getSubmission = async (id: number): Promise<Submission> => {
    const cacheKey = `submission:${id}`;
    const cached = cacheGet<Submission>(cacheKey);
    if (cached) return cached;

    const response = await apiClient.get<Submission>(`/submissions/${id}`);
    cacheSet(cacheKey, response.data, SUBMISSIONS_TTL);
    return response.data;
}

export const updateSubmission = async (id: number, data: SubmissionUpdate): Promise<Submission> => {
    const response = await apiClient.put<Submission>(`/submissions/${id}`, data);
    cacheInvalidate(`submission:${id}`);
    cacheInvalidatePattern('submissions:');
    return response.data;
}
