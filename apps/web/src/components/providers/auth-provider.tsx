/**
 * 认证提供者
 * 在应用启动时初始化本地认证
 */

"use client";

import { useEffect, useState } from "react";
import { initializeAuth } from "@/lib/auth/client";

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [isInitialized, setIsInitialized] = useState(false);

	useEffect(() => {
		// 初始化认证系统
		initializeAuth()
			.then(() => {
				setIsInitialized(true);
			})
			.catch((error) => {
				console.error("Failed to initialize auth:", error);
				// 即使失败也继续，应用可以在没有认证的情况下工作
				setIsInitialized(true);
			});
	}, []);

	// 可以在这里显示加载状态
	if (!isInitialized) {
		return (
			<div className="flex h-screen items-center justify-center">
				<div className="text-center">
					<div className="mb-4 text-lg">正在初始化...</div>
					<div className="text-sm text-muted-foreground">
						首次启动可能需要几秒钟
					</div>
				</div>
			</div>
		);
	}

	return <>{children}</>;
}
