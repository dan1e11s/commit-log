type RateLimitConfig = {
    limit: number;
    windowMs: number;
};

const trackers = new Map<string, { count: number; expiresAt: number }>();

export function rateLimit(ip: string, config: RateLimitConfig = { limit: 60, windowMs: 60 * 1000 }) {
    const now = Date.now();
    const record = trackers.get(ip);

    if (!record || now > record.expiresAt) {
        trackers.set(ip, {
            count: 1,
            expiresAt: now + config.windowMs,
        });
        return { success: true };
    }

    if (record.count >= config.limit) {
        return { success: false };
    }

    record.count++;
    return { success: true };
}

// Cleanup expired records every minute
setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of trackers.entries()) {
        if (now > record.expiresAt) {
            trackers.delete(ip);
        }
    }
}, 60 * 1000);
