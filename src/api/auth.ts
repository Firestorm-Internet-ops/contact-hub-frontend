import apiClient from "./client";
import type { TokenResponse, LoginCredentials } from "../types";

export const login = async (credentials: LoginCredentials): Promise<TokenResponse> => {
    // OAuth2 password form in the request BODY (application/x-www-form-urlencoded).
    // Never send credentials as query params: URLs end up in server and proxy access logs.
    const form = new URLSearchParams();
    form.append('username', credentials.username);
    form.append('password', credentials.password);

    const response = await apiClient.post<TokenResponse>("/auth/login/access-token", form, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    return response.data;
};