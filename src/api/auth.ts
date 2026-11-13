import axios from "axios";
import apiClient from "./client";
import type { TokenResponse, LoginCredentials } from "../types";

export const login = async (credentials: LoginCredentials): Promise<TokenResponse> => {
    // OAuth2 password form in the request BODY (application/x-www-form-urlencoded).
    // Never send credentials as query params: URLs end up in server and proxy access logs.
    const form = new URLSearchParams();
    form.append('username', credentials.username);
    form.append('password', credentials.password);

    try {
        const response = await apiClient.post<TokenResponse>("/auth/login/access-token", form, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        return response.data;
    } catch (err) {
        // TRANSITION ONLY (Nov 2026): a backend that has not been redeployed yet still reads
        // credentials from the query string and answers a body-only request with 422.
        // Fall back once so staff are never locked out while frontend and backend deploy
        // separately. Remove this block once the backend fix is live everywhere.
        if (axios.isAxiosError(err) && err.response?.status === 422) {
            const response = await apiClient.post<TokenResponse>("/auth/login/access-token", null, {
                params: credentials,
            });
            return response.data;
        }
        throw err;
    }
};
