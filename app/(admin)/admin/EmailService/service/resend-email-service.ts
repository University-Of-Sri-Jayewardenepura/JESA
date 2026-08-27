import RegistrationEmail from "../registration-email";
import type { ClaimedRegistrationMessage } from "./types";

type ResendResponse = {
	id?: string;
	message?: string;
	name?: string;
};

/** Sends one claimed registration message to its real recipient through Resend. */
export async function sendClaimedRegistrationEmail(
	message: ClaimedRegistrationMessage,
) {
	const apiKey = process.env.NEXT_RESEND_API_KEY;
	if (!apiKey) throw new Error("RESEND_API_KEY is not configured.");

	const html = RegistrationEmail({
		recipientName: message.recipient.name,
		applicationReferenceNumber: message.applicationReferenceNumber,
		awards: message.awards.map((award) => ({
			label: award.awardLabel,
			registrationNumber: award.registrationNumber,
			whatsappUrl: award.whatsappUrl,
		})),
	});
	const response = await fetch("https://api.resend.com/emails", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json",
			"Idempotency-Key": `registration-${message.applicationId}-${message.attempt}`,
		},
		body: JSON.stringify({
			from:
				process.env.RESEND_FROM_EMAIL ??
				"JESA/BESA 2026 <onboarding@resend.dev>",
			to: message.recipient.email,
			subject: `Registration Confirmation - ${message.applicationReferenceNumber}`,
			html,
		}),
	});
	const responseBody = (await response
		.json()
		.catch(() => null)) as ResendResponse | null;
	if (!response.ok || !responseBody?.id) {
		throw new Error(
			responseBody?.message ||
				responseBody?.name ||
				"Resend rejected the email.",
		);
	}

	return responseBody.id;
}
