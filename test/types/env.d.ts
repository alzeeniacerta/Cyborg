export {};

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			BROWSER: "chrome" | "firefox" | "webkit";
			ENV: "SC" | "QA" | "STAGING" | "PROD";
			BASEURL: string;
			ADMIN: string;
			MFA_AUTH_SECRET_KEY: string;
			APP_VERSION: string;
			HEADLESS: boolean;
		}
	}
}
