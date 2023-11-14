import { generateToken } from "authenticator";

export async function getMFAOtp() {
	const secretKey = process.env.MFA_AUTH_SECRET_KEY; // Access the environment variable
	if (secretKey !== undefined) {
		// Generate the OTP using the username and secretKey
		const otp = await generateToken(secretKey);
		return otp;
	} else {
		throw "Environment variable for MFA_AUTH_SECRET_KEY not found.";
	}
}
