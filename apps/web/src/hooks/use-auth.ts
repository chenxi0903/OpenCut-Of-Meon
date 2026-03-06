/**
 * 认证 Hook
 * 提供用户认证状态和操作
 */

import { useEffect, useState } from "react";
import { getSession, initializeAuth, signOut, type User } from "@/lib/auth/client";

export function useAuth() {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// 初始化认证
		const init = async () => {
			try {
				const session = await getSession();
				if (session) {
					setUser(session.user);
				} else {
					// 自动登录
					const newUser = await initializeAuth();
					setUser(newUser);
				}
			} catch (error) {
				console.error("Failed to initialize auth:", error);
			} finally {
				setIsLoading(false);
			}
		};

		init();
	}, []);

	const handleSignOut = async () => {
		await signOut();
		setUser(null);
		// 重新初始化（创建新的匿名用户）
		const newUser = await initializeAuth();
		setUser(newUser);
	};

	return {
		user,
		isLoading,
		isAuthenticated: !!user,
		signOut: handleSignOut,
	};
}
