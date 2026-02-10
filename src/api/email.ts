import apiClient from "./client"
import { cacheGet, cacheSet, cacheInvalidate } from "./cache";
import type { Email, EmailCreate } from "../types";

const EMAILS_TTL = 1 * 60 * 1000; // 1 minute

export const getEmails = async (submissionId: number): Promise<Email[]> => {
    const cacheKey = `emails:${submissionId}`;
    const cached = cacheGet<Email[]>(cacheKey);
    if (cached) return cached;

    const response = await apiClient.get<Email[]>("/emails/", {
        params: { submission_id: submissionId }
    });
    cacheSet(cacheKey, response.data, EMAILS_TTL);
    return response.data;
}

export const sendEmail = async (data: EmailCreate): Promise<Email> => {
    const response = await apiClient.post<Email>("/emails/", data);
    cacheInvalidate(`emails:${data.submission_id}`);
    return response.data;
}
