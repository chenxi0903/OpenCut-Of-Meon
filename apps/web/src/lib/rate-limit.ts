/**
 * 本地限流实现 - 基于内存的简单限流
 * 用于替代 Upstash Redis 限流
 */

interface RateLimitEntry {
	count: number;
	resetTime: number;
}

class LocalRateLimiter {
	private limits: Map<string, RateLimitEntry> = new Map();
	private readonly maxRequests: number;
	private readonly windowMs: number;

	constructor(maxRequests = 100, windowMs = 60000) {
		this.maxRequests = maxRequests;
		this.windowMs = windowMs;

		// 定期清理过期的限流记录
		if (typeof setInterval !== "undefined") {
			setInterval(() => this.cleanup(), 60000);
		}
	}

	private cleanup() {
		const now = Date.now();
		for (const [key, entry] of this.limits.entries()) {
			if (entry.resetTime < now) {
				this.limits.delete(key);
			}
		}
	}

	async limit(identifier: string): Promise<{ success: boolean }> {
		const now = Date.now();
		const entry = this.limits.get(identifier);

		if (!entry || entry.resetTime < now) {
			// 创建新的限流记录
			this.limits.set(identifier, {
				count: 1,
				resetTime: now + this.windowMs,
			});
			return { success: true };
		}

		if (entry.count >= this.maxRequests) {
			return { success: false };
		}

		entry.count++;
		return { success: true };
	}
}

// 创建全局限流器实例
const rateLimiter = new LocalRateLimiter(100, 60000); // 100 requests per minute

export async function checkRateLimit({ request }: { request: Request }) {
	const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
	const { success } = await rateLimiter.limit(ip);
	return { success, limited: !success };
}
