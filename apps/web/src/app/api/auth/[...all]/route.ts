/**
 * 本地模式 - 不需要认证 API 路由
 * 所有认证在客户端通过 IndexedDB 完成
 */

import { NextResponse } from "next/server";

export const GET = async () => {
	return NextResponse.json({ message: "Local auth mode - no server auth needed" });
};

export const POST = async () => {
	return NextResponse.json({ message: "Local auth mode - no server auth needed" });
};
