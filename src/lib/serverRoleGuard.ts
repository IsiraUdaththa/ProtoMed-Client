"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

const JWT_SECRET: string = process.env["JWT_SECRET"] || "dev_secret_key";

interface DecodedToken {
	userId: string;
	roles: string[];
	iat: number;
	exp: number;
}

export async function requireRole(allowedRoles: string[], redirectTo: string = "/login") {
	const cookieStore = await cookies();
	const token = cookieStore.get("ssr_token")?.value;

	if (!token) {
		redirect(redirectTo);
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

		const hasRole = decoded.roles.some((role) => allowedRoles.includes(role));
		if (!hasRole) {
			redirect("/unauthorized"); // You can create a 403 page
		}

		return decoded; // useful if you want user info in the page
	} catch (err) {
		console.error("Token verification failed:", err);
		redirect(redirectTo);
	}
}
