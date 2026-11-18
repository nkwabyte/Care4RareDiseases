import 'server-only';

/**
 * In-memory login throttling. Suitable for the single-process SQLite deployment this app targets;
 * move to a shared store (e.g. Redis or a DB table) if the app is ever scaled horizontally.
 *
 *  - Per account: 5 failed attempts within 15 min → locked for 15 min.
 *  - Per IP: 30 attempts within 15 min → blocked for 15 min (limits password spraying).
 *
 * Failures are tracked for unknown emails too, so lockout behaviour does not reveal which accounts exist.
 */
const WINDOW_MS = 15 * 60 * 1000;
const LOCK_MS = 15 * 60 * 1000;
const MAX_ACCOUNT_FAILURES = 5;
const MAX_IP_ATTEMPTS = 30;
const MAX_TRACKED_KEYS = 10_000;

type Bucket = { hits: number[]; lockedUntil: number };
const buckets = new Map<string, Bucket>();

function bucket(key: string): Bucket {
    let b = buckets.get(key);
    if (!b) {
        if (buckets.size >= MAX_TRACKED_KEYS) sweep();
        b = { hits: [], lockedUntil: 0 };
        buckets.set(key, b);
    }
    return b;
}

function sweep() {
    const now = Date.now();
    for (const [key, b] of buckets) {
        if (b.lockedUntil < now && b.hits.every((t) => t < now - WINDOW_MS)) buckets.delete(key);
    }
}

function lockedFor(key: string): number {
    const b = buckets.get(key);
    return b && b.lockedUntil > Date.now() ? b.lockedUntil - Date.now() : 0;
}

function hit(key: string, max: number): boolean {
    const now = Date.now();
    const b = bucket(key);
    b.hits = b.hits.filter((t) => t > now - WINDOW_MS);
    b.hits.push(now);
    if (b.hits.length >= max) {
        b.lockedUntil = now + LOCK_MS;
        b.hits = [];
        return true;
    }
    return false;
}

/** Milliseconds until the caller may try again, or 0 if allowed. Counts the attempt against the IP. */
export function checkLoginAllowed(email: string, ip: string | null): number {
    const wait = Math.max(lockedFor(`acct:${email}`), ip ? lockedFor(`ip:${ip}`) : 0);
    if (wait) return wait;
    if (ip && hit(`ip:${ip}`, MAX_IP_ATTEMPTS)) return LOCK_MS;
    return 0;
}

/** Records a failed attempt. Returns true if this failure locked the account. */
export function recordLoginFailure(email: string): boolean {
    return hit(`acct:${email}`, MAX_ACCOUNT_FAILURES);
}

export function recordLoginSuccess(email: string): void {
    buckets.delete(`acct:${email}`);
}
