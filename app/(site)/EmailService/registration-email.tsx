type RegistrationAward = {
	label: string;
	whatsappUrl: string;
};

type RegistrationEmailProps = {
	recipientName: string;
	registrationNumber: string;
	awards: RegistrationAward[];
};

function escapeHtml(value: string) {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#039;");
}

export default function RegistrationEmail({
	recipientName,
	registrationNumber,
	awards,
}: RegistrationEmailProps) {
	const awardRows = awards
		.map(
			(award) => `
				<tr>
					<td style="border-top:1px solid #e3dbe2;padding:20px 0;">
						<p style="color:#170c1e;font-size:15px;margin:0 0 12px;"><strong>${escapeHtml(award.label)}</strong></p>
						<a href="${escapeHtml(award.whatsappUrl)}" style="background-color:#dbbe45;border-radius:8px;color:#170c1e;display:inline-block;font-size:14px;font-weight:700;padding:11px 18px;text-decoration:none;">Join WhatsApp Group</a>
					</td>
				</tr>`,
		)
		.join("");

	return `<!doctype html>
	<html lang="en">
		<head>
			<meta charset="utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<title>Registration Confirmation</title>
		</head>
		<body style="background-color:#f0ebf0;color:#170c1e;font-family:Arial,Helvetica,sans-serif;margin:0;padding:36px 16px;">
			<table role="presentation" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border:1px solid #d4c8d4;border-radius:16px;margin:0 auto;max-width:600px;overflow:hidden;width:100%;">
				<tr>
					<td style="background-color:#170c1e;border-bottom:4px solid #dbbe45;padding:28px 32px;">
						<p style="color:#dbbe45;font-size:12px;font-weight:700;letter-spacing:2px;margin:0 0 8px;text-transform:uppercase;">JESA / BESA 2026</p>
						<h1 style="color:#ffffff;font-size:26px;line-height:1.25;margin:0;">Registration Confirmed</h1>
					</td>
				</tr>
				<tr>
					<td style="padding:32px;">
						<p style="font-size:16px;line-height:1.7;margin:0 0 16px;">Dear ${escapeHtml(recipientName)},</p>
						<p style="color:#592c55;font-size:15px;line-height:1.7;">Your JESA/BESA 2026 application has been successfully registered. Keep the registration number below for future communication.</p>
						<div style="background-color:#f0ebf0;border:1px solid #d4c8d4;border-radius:12px;margin:28px 0;padding:22px;text-align:center;">
							<p style="color:#7a5676;font-size:12px;font-weight:700;letter-spacing:1.4px;margin:0 0 10px;text-transform:uppercase;">Registration Number</p>
							<strong style="color:#592c55;font-size:24px;letter-spacing:1px;">${escapeHtml(registrationNumber)}</strong>
						</div>
						<h2 style="color:#170c1e;font-size:18px;margin:0 0 8px;">Your Registered Award Categories</h2>
						<p style="color:#7a5676;font-size:14px;line-height:1.6;">Join the relevant WhatsApp group for each award to receive important updates.</p>
						<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">${awardRows}</table>
						<div style="background-color:#f0ebf0;border-radius:10px;color:#592c55;font-size:13px;line-height:1.6;margin-top:8px;padding:16px;">Do not share these WhatsApp group links publicly. They are intended only for registered applicants.</div>
						<p style="font-size:15px;line-height:1.7;margin:28px 0 0;">Regards,<br /><strong>JESA/BESA 2026 Organizing Committee</strong></p>
					</td>
				</tr>
			</table>
			<p style="color:#7a5676;font-size:12px;margin:18px auto 0;max-width:600px;text-align:center;">This is an automated registration message.</p>
		</body>
	</html>`;
}
