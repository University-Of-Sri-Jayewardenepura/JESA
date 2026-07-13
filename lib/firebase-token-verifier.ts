import jwt from "jsonwebtoken";

export interface DecodedIdToken {
	uid: string;
	aud: string;
	auth_time?: number;
	email?: string;
	email_verified?: boolean;
	exp: number;
	iat: number;
	iss: string;
	name?: string;
	picture?: string;
	sub: string;
	[key: string]: unknown;
}

interface PublicKeyCache {
	keys: Record<string, string>;
	expiresAt: number;
}

let keyCache: PublicKeyCache | null = null;

function getFirebaseProjectId(): string | undefined {
	if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
		return process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
	}

	const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
	if (serviceAccountJson) {
		try {
			const parsed = JSON.parse(serviceAccountJson) as { project_id?: string };
			return parsed.project_id;
		} catch {
			return undefined;
		}
	}

	return undefined;
}

async function fetchPublicKeys(): Promise<PublicKeyCache> {
	const response = await fetch(
		"https://www.googleapis.com/service_accounts/v1/metadata/x509/securetoken@system.gserviceaccount.com",
		{ next: { revalidate: 0 } },
	);

	if (!response.ok) {
		throw new Error(`Failed to fetch Firebase public keys: ${response.status}`);
	}

	const keys = (await response.json()) as Record<string, string>;
	const cacheControl = response.headers.get("cache-control") || "";
	const maxAgeMatch = cacheControl.match(/max-age=(\d+)/);
	const maxAgeSeconds = maxAgeMatch ? parseInt(maxAgeMatch[1], 10) : 3600;

	return {
		keys,
		expiresAt: Date.now() + maxAgeSeconds * 1000,
	};
}

async function getPublicKey(kid: string): Promise<string> {
	if (!keyCache || keyCache.expiresAt < Date.now()) {
		keyCache = await fetchPublicKeys();
	}

	const key = keyCache.keys[kid];
	if (!key) {
		// Refresh cache once if key not found (key rotation edge case)
		keyCache = await fetchPublicKeys();
		const refreshedKey = keyCache.keys[kid];
		if (!refreshedKey) {
			throw new Error(`Firebase public key not found for kid: ${kid}`);
		}
		return refreshedKey;
	}

	return key;
}

export async function verifyFirebaseIdToken(
	token: string,
): Promise<DecodedIdToken> {
	const projectId = getFirebaseProjectId();
	if (!projectId) {
		throw new Error(
			"Missing Firebase project ID. Set NEXT_PUBLIC_FIREBASE_PROJECT_ID.",
		);
	}

	const decodedHeader = jwt.decode(token, { complete: true });
	if (!decodedHeader?.header?.kid) {
		throw new Error("Invalid Firebase ID token: missing kid header");
	}

	const publicKey = await getPublicKey(decodedHeader.header.kid);

	const decoded = jwt.verify(token, publicKey, {
		algorithms: ["RS256"],
	}) as jwt.JwtPayload;

	if (!decoded.sub) {
		throw new Error("Invalid Firebase ID token: missing sub claim");
	}

	if (decoded.aud !== projectId) {
		throw new Error("Invalid Firebase ID token: audience mismatch");
	}

	const expectedIssuer = `https://securetoken.google.com/${projectId}`;
	if (decoded.iss !== expectedIssuer) {
		throw new Error("Invalid Firebase ID token: issuer mismatch");
	}

	return {
		...decoded,
		uid: decoded.sub,
	} as DecodedIdToken;
}
