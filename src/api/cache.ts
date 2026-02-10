const CACHE_PREFIX = 'ffm_cache:';

interface CacheEntry<T> {
    data: T;
    expiresAt: number;
}

export function cacheGet<T>(key: string): T | null {
    try {
        const raw = localStorage.getItem(CACHE_PREFIX + key);
        if (!raw) return null;

        const entry: CacheEntry<T> = JSON.parse(raw);
        if (Date.now() > entry.expiresAt) {
            localStorage.removeItem(CACHE_PREFIX + key);
            return null;
        }
        return entry.data;
    } catch {
        return null;
    }
}

export function cacheSet(key: string, data: unknown, ttlMs: number): void {
    try {
        const entry: CacheEntry<unknown> = {
            data,
            expiresAt: Date.now() + ttlMs,
        };
        localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
    } catch {
        // localStorage full or unavailable — silently ignore
    }
}

export function cacheInvalidate(key: string): void {
    localStorage.removeItem(CACHE_PREFIX + key);
}

export function cacheInvalidatePattern(prefix: string): void {
    const fullPrefix = CACHE_PREFIX + prefix;
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(fullPrefix)) {
            keysToRemove.push(key);
        }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
}
