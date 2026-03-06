import { z } from "zod";

const webEnvSchema = z.object({
	// Node
	NODE_ENV: z.enum(["development", "production", "test"]),
	ANALYZE: z.string().optional(),
	NEXT_RUNTIME: z.enum(["nodejs", "edge"]).optional(),

	// Public
	NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
	NEXT_PUBLIC_MARBLE_API_URL: z.url(),

	// Server - 本地模式，移除数据库和Redis依赖
	// DATABASE_URL, BETTER_AUTH_SECRET, REDIS 配置已移除
	// 所有数据存储在浏览器 IndexedDB 中
	
	MARBLE_WORKSPACE_KEY: z.string().optional(),
	FREESOUND_CLIENT_ID: z.string().optional(),
	FREESOUND_API_KEY: z.string().optional(),
	CLOUDFLARE_ACCOUNT_ID: z.string().optional(),
	R2_ACCESS_KEY_ID: z.string().optional(),
	R2_SECRET_ACCESS_KEY: z.string().optional(),
	R2_BUCKET_NAME: z.string().optional(),
	MODAL_TRANSCRIPTION_URL: z.url().optional(),
});

export type WebEnv = z.infer<typeof webEnvSchema>;

export const webEnv = webEnvSchema.parse(process.env);
