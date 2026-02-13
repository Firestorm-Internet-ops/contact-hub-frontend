import apiClient from "./client";

interface GmailStatus {
    configured: boolean;
    email?: string;
    expiry?: string;
    updated_at?: string;
}

interface GmailAuthUrl {
    authorization_url: string;
}

export async function getGmailStatus(): Promise<GmailStatus> {
    const response = await apiClient.get<GmailStatus>("/gmail/status");
    return response.data;
}

export async function getGmailAuthUrl(): Promise<GmailAuthUrl> {
    const response = await apiClient.get<GmailAuthUrl>("/gmail/oauth/authorize");
    return response.data;
}
