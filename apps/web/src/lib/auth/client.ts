/**
 * 客户端认证 API
 * 提供与原 better-auth 兼容的接口
 */

import { localAuth, type LocalUser } from "./local-auth";

export interface User {
	id: string;
	name: string;
	email: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface Session {
	user: User;
}

/**
 * 获取当前会话
 */
export async function getSession(): Promise<Session | null> {
	const user = await localAuth.getCurrentUser();
	
	if (!user) {
		return null;
	}

	return {
		user: {
			id: user.id,
			name: user.name,
			email: user.email,
			createdAt: new Date(user.createdAt),
			updatedAt: new Date(user.updatedAt),
		},
	};
}

/**
 * 初始化认证（自动登录）
 */
export async function initializeAuth(): Promise<User> {
	const user = await localAuth.initialize();
	
	return {
		id: user.id,
		name: user.name,
		email: user.email,
		createdAt: new Date(user.createdAt),
		updatedAt: new Date(user.updatedAt),
	};
}

/**
 * 登出
 */
export async function signOut(): Promise<void> {
	await localAuth.signOut();
}

/**
 * 更新用户信息
 */
export async function updateUser(updates: { name?: string; email?: string }): Promise<User | null> {
	const currentUser = await localAuth.getCurrentUser();
	if (!currentUser) {
		return null;
	}

	const updatedUser = await localAuth.updateUser(currentUser.id, updates);
	if (!updatedUser) {
		return null;
	}

	return {
		id: updatedUser.id,
		name: updatedUser.name,
		email: updatedUser.email,
		createdAt: new Date(updatedUser.createdAt),
		updatedAt: new Date(updatedUser.updatedAt),
	};
}
