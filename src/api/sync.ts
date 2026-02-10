import apiClient from "./client";
import { cacheInvalidatePattern } from "./cache";
import type { SyncResult } from "../types";

export const syncSite = async (site_id: number): Promise<SyncResult> => {
    const response = await apiClient.post<SyncResult>(`/sync/${site_id}`);
    cacheInvalidatePattern('submissions:');
    return response.data;
}

export const syncAllSites = async (): Promise<SyncResult[]> => {
    // Backend endpoint is POST /sync/ for all sites
    const response = await apiClient.post<SyncResult[]>("/sync/");
    cacheInvalidatePattern('submissions:');
    return response.data;
}

export const syncGmailInbox = async (): Promise<{ new_emails: number }> => {
    const response = await apiClient.post<{ new_emails: number }>("/emails/sync-gmail");
    cacheInvalidatePattern('emails:');
    cacheInvalidatePattern('submissions:');
    cacheInvalidatePattern('submission:');
    return response.data;
}
