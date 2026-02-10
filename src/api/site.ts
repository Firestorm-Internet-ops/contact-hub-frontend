import apiClient from "./client";
import { cacheGet, cacheSet, cacheInvalidate } from "./cache";
import type { Site, SiteAdmin, SiteCreate, SiteUpdate, SyncResult } from "../types";

const SITES_CACHE_KEY = 'sites';
const SITES_TTL = 5 * 60 * 1000; // 5 minutes

export const getSites = async (): Promise<Site[]> => {
    const cached = cacheGet<Site[]>(SITES_CACHE_KEY);
    if (cached) return cached;

    const response = await apiClient.get<Site[]>("/sites/");
    cacheSet(SITES_CACHE_KEY, response.data, SITES_TTL);
    return response.data;
};

export const getAllSites = async (): Promise<SiteAdmin[]> => {
    const response = await apiClient.get<SiteAdmin[]>("/sites/all");
    return response.data;
};

export const getSite = async (id: number): Promise<Site> => {
    const response = await apiClient.get<Site>(`/sites/${id}`);
    return response.data;
};

export const createSite = async (data: SiteCreate): Promise<Site> => {
    const response = await apiClient.post<Site>("/sites/", data);
    cacheInvalidate(SITES_CACHE_KEY);
    return response.data;
};

export const updateSite = async (id: number, data: SiteUpdate): Promise<Site> => {
    const response = await apiClient.put<Site>(`/sites/${id}`, data);
    cacheInvalidate(SITES_CACHE_KEY);
    return response.data;
};

export const deleteSite = async (id: number): Promise<Site> => {
    const response = await apiClient.delete<Site>(`/sites/${id}`);
    cacheInvalidate(SITES_CACHE_KEY);
    return response.data;
};

export const restoreSite = async (id: number): Promise<Site> => {
    const response = await apiClient.post<Site>(`/sites/${id}/restore`);
    cacheInvalidate(SITES_CACHE_KEY);
    return response.data;
};

export const testSiteConnection = async (id: number): Promise<SyncResult> => {
    const response = await apiClient.post<SyncResult>(`/sites/${id}/test-connection`);
    return response.data;
};
