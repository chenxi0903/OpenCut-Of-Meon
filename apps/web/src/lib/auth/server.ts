/**
 * 本地认证服务器端 API
 * 兼容原 better-auth 的接口
 */

// 本地模式不需要服务器端认证
// 所有认证逻辑在客户端通过 IndexedDB 完成

export const auth = {
	api: {
		getSession: async () => {
			// 服务器端不处理会话，返回 null
			return { data: null };
		},
	},
};

export type Auth = typeof auth;
