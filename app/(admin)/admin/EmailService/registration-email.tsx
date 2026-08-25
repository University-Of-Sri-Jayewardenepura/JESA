import {
	CSDS_BASE64,
	JESA_ICON_BASE64,
	USJP_BASE64,
} from "./email-images";

type RegistrationAward = {
	label: string;
	registrationNumber: string;
	whatsappUrl: string;
};

type RegistrationEmailProps = {
	recipientName: string;
	applicationReferenceNumber: string;
	awards: RegistrationAward[];
};

/** Escapes dynamic values before placing them in the email HTML. */
function escapeHtml(value: string) {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#039;");
}

/** Builds a registration email with one number and WhatsApp link per award. */
export default function RegistrationEmail({
	recipientName,
	applicationReferenceNumber,
	awards,
}: RegistrationEmailProps) {
	const awardRows = awards
		.map(
			(award) => `
				<tr>
					<td style="padding:24px 0;border-bottom:1px solid #2a2a4a;">
						<table role="presentation" cellpadding="0" cellspacing="0" width="100%">
							<tr>
								<td style="padding-right:16px;vertical-align:top;">
									<p style="color:#d4af37;font-size:11px;font-weight:700;letter-spacing:1.5px;margin:0 0 6px;text-transform:uppercase;">Award Category</p>
									<p style="color:#ffffff;font-size:16px;font-weight:600;margin:0 0 12px;">${escapeHtml(award.label)}</p>
									<p style="color:#d4af37;font-size:11px;font-weight:700;letter-spacing:1.5px;margin:0 0 6px;text-transform:uppercase;">Registration Number</p>
									<p style="color:#ffffff;font-size:22px;font-weight:700;letter-spacing:1px;margin:0 0 16px;font-family:'Courier New',monospace;">${escapeHtml(award.registrationNumber)}</p>
								</td>
								<td style="vertical-align:top;text-align:right;">
									<a href="${escapeHtml(award.whatsappUrl)}" style="display:inline-block;background-color:#25d366;color:#ffffff;font-size:13px;font-weight:700;padding:12px 20px;border-radius:8px;text-decoration:none;text-align:center;">Join WhatsApp Group</a>
								</td>
							</tr>
						</table>
					</td>
				</tr>`,
		)
		.join("");

	return `<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="x-apple-disable-message-reformatting" />
		<meta name="format-detection" content="telephone=no, date=no, address=no, email=no, url=no" />
		<title>Registration Confirmation - JESA/BESA 2026</title>
		<!--[if mso]>
		<noscript>
			<xml>
				<o:OfficeDocumentSettings>
					<o:AllowPNG/>
					<o:PixelsPerInch>96</o:PixelsPerInch>
				</o:OfficeDocumentSettings>
			</xml>
		</noscript>
		<![endif]-->
		<style>
			* { box-sizing: border-box; }
			body { margin: 0; padding: 0; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
			table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
			img { border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
			p { margin: 0; }
			a { text-decoration: none; }
			@media only screen and (max-width: 600px) {
				.email-container { width: 100% !important; max-width: 100% !important; }
				.fluid { max-width: 100% !important; height: auto !important; }
				.stack-column { display: block !important; width: 100% !important; max-width: 100% !important; }
				.center-on-narrow { text-align: center !important; display: block !important; margin-left: auto !important; margin-right: auto !important; float: none !important; }
				table.center-on-narrow { display: inline-block !important; }
				.mobile-padding { padding: 20px !important; }
			}
		</style>
	</head>
	<body style="margin:0;padding:0;background-color:#1a1a2e;font-family:Arial,Helvetica,sans-serif;">
		<div style="display:none;font-size:1px;color:#1a1a2e;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
			Your JESA/BESA 2026 registration is confirmed. Your registration numbers are ready.
			${"&#847;".repeat(30)}
		</div>

		<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#1a1a2e;">
			<tr>
				<td align="center" style="padding:40px 16px;">
					<!--[if mso]>
					<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" align="center">
					<tr>
					<td>
					<![endif]-->
					<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:600px;" class="email-container">

						<!-- HEADER -->
						<tr>
							<td style="background-color:#16213e;padding:32px 40px 24px;text-align:center;border-radius:16px 16px 0 0;" class="mobile-padding">
								<img src="${JESA_ICON_BASE64}" width="56" height="56" alt="JESA" style="display:block;margin:0 auto 16px;border-radius:12px;" />
								<p style="color:#d4af37;font-size:12px;font-weight:700;letter-spacing:3px;margin:0 0 8px;text-transform:uppercase;">JESA / BESA 2026</p>
								<h1 style="color:#ffffff;font-size:28px;font-weight:700;line-height:1.3;margin:0;">Registration Confirmed</h1>
							</td>
						</tr>

						<!-- GOLD ACCENT LINE -->
						<tr>
							<td style="background-color:#d4af37;height:4px;font-size:0;line-height:0;">&nbsp;</td>
						</tr>

						<!-- BODY -->
						<tr>
							<td style="background-color:#0f3460;padding:40px;" class="mobile-padding">
								<p style="color:#b8b8d0;font-size:16px;line-height:1.7;margin:0 0 20px;">Dear <strong style="color:#ffffff;">${escapeHtml(recipientName)}</strong>,</p>

								<p style="color:#b8b8d0;font-size:15px;line-height:1.7;margin:0 0 32px;">Your JESA/BESA 2026 application has been successfully registered. Please save the application reference and award registration numbers below for all future communication.</p>

								<!-- APPLICATION REFERENCE BOX -->
								<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:32px;">
									<tr>
										<td style="background-color:#16213e;border:1px solid #2a2a4a;border-radius:12px;padding:24px;text-align:center;">
											<p style="color:#d4af37;font-size:11px;font-weight:700;letter-spacing:2px;margin:0 0 10px;text-transform:uppercase;">Application Reference</p>
											<p style="color:#ffffff;font-size:26px;font-weight:700;letter-spacing:2px;margin:0;font-family:'Courier New',monospace;">${escapeHtml(applicationReferenceNumber)}</p>
										</td>
									</tr>
								</table>

								<!-- AWARDS SECTION -->
								<h2 style="color:#d4af37;font-size:14px;font-weight:700;letter-spacing:2px;margin:0 0 20px;text-transform:uppercase;">Your Registered Award Categories</h2>
								<p style="color:#b8b8d0;font-size:14px;line-height:1.6;margin:0 0 24px;">Each award has a separate registration number. Join the relevant WhatsApp groups to receive important updates.</p>

								<table role="presentation" cellpadding="0" cellspacing="0" width="100%">${awardRows}</table>

								<!-- SECURITY NOTICE -->
								<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-top:24px;">
									<tr>
										<td style="background-color:#16213e;border-left:4px solid #d4af37;border-radius:0 8px 8px 0;padding:16px 20px;">
											<p style="color:#b8b8d0;font-size:13px;line-height:1.6;margin:0;">Do not share these WhatsApp group links publicly. They are intended only for registered applicants.</p>
										</td>
									</tr>
								</table>

								<!-- SIGN-OFF -->
								<p style="color:#b8b8d0;font-size:15px;line-height:1.7;margin:32px 0 0;">Regards,<br /><strong style="color:#ffffff;">JESA/BESA 2026 Organizing Committee</strong></p>
							</td>
						</tr>

						<!-- FOOTER -->
						<tr>
							<td style="background-color:#16213e;padding:32px 40px;border-radius:0 0 16px 16px;" class="mobile-padding">
								<!-- LOGOS -->
								<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:20px;">
									<tr>
										<td width="50%" style="text-align:center;vertical-align:middle;">
											<img src="${USJP_BASE64}" alt="University of Sri Jayewardenepura" width="120" style="display:inline-block;max-width:120px;height:auto;border-radius:4px;" />
										</td>
										<td width="50%" style="text-align:center;vertical-align:middle;">
											<img src="${CSDS_BASE64}" alt="Career Skills Development Society" width="120" style="display:inline-block;max-width:120px;height:auto;border-radius:4px;" />
										</td>
									</tr>
								</table>
								<p style="color:#6b6b8d;font-size:12px;line-height:1.5;text-align:center;margin:0 0 8px;">This is an automated registration message. Please do not reply directly to this email.</p>
								<p style="color:#6b6b8d;font-size:11px;text-align:center;margin:0;">JESA/BESA 2026 &bull; Organizing Committee</p>
							</td>
						</tr>

					</table>
					<!--[if mso]>
					</td>
					</tr>
					</table>
					<![endif]-->
				</td>
			</tr>
		</table>
	</body>
</html>`;
}
