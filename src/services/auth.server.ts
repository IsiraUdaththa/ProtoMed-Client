'use server';

import { cookies } from 'next/headers';
import jwt, { SignOptions } from 'jsonwebtoken';

import api from '@/lib/axiosInstance';

const JWT_SECRET: string = process.env['JWT_SECRET'] || 'dev_secret_key';

const createSSRToken = (payload: object, expiresIn: number = 600): string => {
	const options: SignOptions = { expiresIn };
	return jwt.sign(payload, JWT_SECRET, options);
};

export const verifySSRToken = async (token: string): Promise<unknown> => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, JWT_SECRET, (err, decoded) => {
			if (err) {
				reject(err);
			} else {
				resolve(decoded);
			}
		});
	});
};

export async function getSSRToken(accessToken: string) {
	const response = await api.get('/auth/me', {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});
	console.log(response.data)
	const userId = response.data._id;
	const roles = response.data.roles;

	const sessionToken = createSSRToken({ userId, roles });

	(await cookies()).set('ssr_token', sessionToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		maxAge: 600,
		path: '/',
		sameSite: 'lax',
	});

	return { status: 'ok' };
}

