interface RateLimitEntry {
	count: number;
	resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

interface RateLimitOptions {
	windowMs: number;
	maxRequests: number;
}

function getClientIp(request: Request): string {
	const forwarded = request.headers.get("x-forwarded-for");
	if (forwarded) {
		return forwarded.split(",")[0].trim();
	}
	return "unknown";
}

export function checkRateLimit(
	request: Request,
	options: RateLimitOptions,
): { allowed: boolean; retryAfter?: number } {
	const ip = getClientIp(request);
	const key = `${request.url}:${ip}`;
	const now = Date.now();

	const entry = store.get(key);
	if (!entry || now > entry.resetAt) {
		store.set(key, {
			count: 1,
			resetAt: now + options.windowMs,
		});
		return { allowed: true };
	}

	if (entry.count >= options.maxRequests) {
		return {
			allowed: false,
			retryAfter: Math.ceil((entry.resetAt - now) / 1000),
		};
	}

	entry.count += 1;
	return { allowed: true };
}

export function rateLimitResponse(retryAfter?: number): Response {
	return new Response(
		JSON.stringify({
			error: "Too many requests. Please slow down.",
			retryAfter,
		}),
		{
			status: 429,
			headers: {
				"Content-Type": "application/json",
				"Retry-After": String(retryAfter || 60),
			},
		},
	);
}
