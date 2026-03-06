/**
 * 本地认证系统 - 使用 IndexedDB 存储用户数据
 * 完全本地化，无需服务器
 */

import { IndexedDBAdapter } from "@/services/storage/indexeddb-adapter";
import { nanoid } from "nanoid";

export interface LocalUser {
	id: string;
	name: string;
	email: string;
	createdAt: string;
	updatedAt: string;
}

export interface LocalSession {
	id: string;
	userId: string;
	createdAt: string;
	expiresAt: string;
}

class LocalAuthService {
	private usersAdapter: IndexedDBAdapter<LocalUser>;
	private sessionsAdapter: IndexedDBAdapter<LocalSession>;
	private currentSessionKey = "opencut-current-session";

	constructor() {
		this.usersAdapter = new IndexedDBAdapter<LocalUser>(
			"opencut-auth",
			"users",
			1,
		);
		this.sessionsAdapter = new IndexedDBAdapter<LocalSession>(
			"opencut-auth",
			"sessions",
			1,
		);
	}

	/**
	 * 创建或获取默认用户（匿名用户）
	 */
	async getOrCreateDefaultUser(): Promise<LocalUser> {
		const users = await this.usersAdapter.getAll();
		
		if (users.length > 0) {
			return users[0];
		}

		// 创建默认匿名用户
		const defaultUser: LocalUser = {
			id: nanoid(),
			name: "Local User",
			email: "local@opencut.app",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		await this.usersAdapter.set(defaultUser.id, defaultUser);
		return defaultUser;
	}

	/**
	 * 创建会话
	 */
	async createSession(userId: string): Promise<LocalSession> {
		const session: LocalSession = {
			id: nanoid(),
			userId,
			createdAt: new Date().toISOString(),
			expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30天
		};

		await this.sessionsAdapter.set(session.id, session);
		
		// 保存当前会话ID到localStorage
		if (typeof window !== "undefined") {
			localStorage.setItem(this.currentSessionKey, session.id);
		}

		return session;
	}

	/**
	 * 获取当前会话
	 */
	async getCurrentSession(): Promise<LocalSession | null> {
		if (typeof window === "undefined") {
			return null;
		}

		const sessionId = localStorage.getItem(this.currentSessionKey);
		if (!sessionId) {
			return null;
		}

		const session = await this.sessionsAdapter.get(sessionId);
		if (!session) {
			return null;
		}

		// 检查会话是否过期
		if (new Date(session.expiresAt) < new Date()) {
			await this.deleteSession(sessionId);
			return null;
		}

		return session;
	}

	/**
	 * 获取当前用户
	 */
	async getCurrentUser(): Promise<LocalUser | null> {
		const session = await this.getCurrentSession();
		if (!session) {
			return null;
		}

		return await this.usersAdapter.get(session.userId);
	}

	/**
	 * 初始化认证（自动登录）
	 */
	async initialize(): Promise<LocalUser> {
		let session = await this.getCurrentSession();
		
		if (!session) {
			// 创建或获取默认用户
			const user = await this.getOrCreateDefaultUser();
			session = await this.createSession(user.id);
			return user;
		}

		const user = await this.usersAdapter.get(session.userId);
		if (!user) {
			// 用户不存在，重新创建
			const newUser = await this.getOrCreateDefaultUser();
			await this.createSession(newUser.id);
			return newUser;
		}

		return user;
	}

	/**
	 * 删除会话
	 */
	async deleteSession(sessionId: string): Promise<void> {
		await this.sessionsAdapter.remove(sessionId);
		
		if (typeof window !== "undefined") {
			const currentSessionId = localStorage.getItem(this.currentSessionKey);
			if (currentSessionId === sessionId) {
				localStorage.removeItem(this.currentSessionKey);
			}
		}
	}

	/**
	 * 登出
	 */
	async signOut(): Promise<void> {
		const session = await this.getCurrentSession();
		if (session) {
			await this.deleteSession(session.id);
		}
	}

	/**
	 * 更新用户信息
	 */
	async updateUser(userId: string, updates: Partial<Omit<LocalUser, "id" | "createdAt">>): Promise<LocalUser | null> {
		const user = await this.usersAdapter.get(userId);
		if (!user) {
			return null;
		}

		const updatedUser: LocalUser = {
			...user,
			...updates,
			updatedAt: new Date().toISOString(),
		};

		await this.usersAdapter.set(userId, updatedUser);
		return updatedUser;
	}

	/**
	 * 清除所有认证数据
	 */
	async clearAll(): Promise<void> {
		await this.usersAdapter.clear();
		await this.sessionsAdapter.clear();
		
		if (typeof window !== "undefined") {
			localStorage.removeItem(this.currentSessionKey);
		}
	}
}

export const localAuth = new LocalAuthService();
