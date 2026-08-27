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

const JESA_ICON_URL =
	"https://res.cloudinary.com/dgpiqnweu/image/upload/v1787688326/jesa-min.png";
const USJP_LOGO_URL =
	"https://res.cloudinary.com/dgpiqnweu/image/upload/v1787688311/usjp.png";
const CSDS_LOGO_URL =
	"https://res.cloudinary.com/dgpiqnweu/image/upload/v1787688314/csds.png";

/** Builds a registration email with one number and WhatsApp link per award. */
export default function RegistrationEmail({
	recipientName,
	applicationReferenceNumber,
	awards,
}: RegistrationEmailProps) {
	const awardRows = awards
		.map(
			(award) => `
            <!-- Award -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:12px;">
              <tr><td class="award-pad" style="padding:18px 20px;background:#170c20;border:1px solid #392b47;border-radius:12px;">
                <p style="margin:0 0 7px;color:#e5c064;font-size:10px;font-weight:700;letter-spacing:1.3px;text-transform:uppercase;">Award Category</p>
                <p style="margin:0 0 12px;color:#f7f2fa;font-size:15px;font-weight:700;line-height:1.45;">${escapeHtml(award.label)}</p>
                <p style="margin:0 0 13px;color:#a996b2;font-size:12px;">Registration No. <strong style="color:#ffffff;">${escapeHtml(award.registrationNumber)}</strong></p>
                <a href="${escapeHtml(award.whatsappUrl)}" target="_blank" style="display:inline-block;padding:10px 15px;background:#e5c064;border-radius:7px;color:#17101d;text-decoration:none;font-size:11px;font-weight:700;letter-spacing:.2px;">Join WhatsApp Group&nbsp;&rarr;</a>
              </td></tr>
            </table>`,
		)
		.join("");

	return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>Registration Confirmed — JESA/BESA 2026</title>
<!--[if mso]><style>table{border-collapse:collapse!important}td{font-family:Arial,Helvetica,sans-serif!important}</style><![endif]-->
<style>
  @media screen and (max-width:620px) {
    .shell{width:100%!important;border-radius:0!important}
    .pad{padding-left:22px!important;padding-right:22px!important}
    .hero{padding:32px 22px 28px!important}
    .header{padding:16px 20px!important}
    .brand-copy{font-size:13px!important}
    .title{font-size:27px!important;line-height:1.2!important}
    .ref-code{font-size:22px!important}
    .award-pad{padding:16px!important}
    .footer-stack{display:block!important;width:100%!important}
    .footer-logo-cell{padding:0 0 18px!important;text-align:center!important}
    .footer-copy{padding:0!important;text-align:center!important}
  }
</style>
</head>
<body style="margin:0;padding:0;background:#1c1029;color:#f7f2fa;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#1c1029;">
    <tr><td align="center" style="padding:28px 14px 40px;">
      <table role="presentation" class="shell" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background:#130b1a;border:1px solid #33243f;border-radius:18px;overflow:hidden;">
        <!-- HEADER -->
        <tr>
          <td class="header" style="padding:18px 26px;background:#0d0714;border-bottom:1px solid #31213e;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td valign="middle" style="width:72px;">
                  <img src="${JESA_ICON_URL}" alt="JESA 2026" width="60" style="display:block;width:60px;height:auto;border:0;" />
                </td>
                <td valign="middle" style="padding-left:14px;">
                  <p class="brand-copy" style="margin:0;color:#f4e9f7;font-size:14px;font-weight:700;letter-spacing:.2px;">J'pura Employability Skills Awards</p>
                  <p style="margin:4px 0 0;color:#8f7c9d;font-size:11px;letter-spacing:1.3px;text-transform:uppercase;">JESA 2026</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- HERO -->
        <tr>
          <td class="hero" align="center" style="padding:42px 32px 36px;background:#12091a;border-bottom:1px solid #e5c064;">
            <p style="margin:18px 0 9px;color:#e5c064;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Registration Successful</p>
            <h1 class="title" style="margin:0;color:#ffffff;font-family:Georgia,'Times New Roman',serif;font-size:30px;font-weight:700;line-height:1.25;">Registration Confirmed</h1>
            <p style="margin:10px 0 0;color:#ae9eb9;font-size:14px;line-height:1.6;">Your JESA/BESA 2026 application has been successfully registered.</p>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td class="pad" style="padding:30px 32px 10px;">
            <p style="margin:0 0 14px;color:#f7f2fa;font-size:16px;line-height:1.7;">Dear <strong>${escapeHtml(recipientName)}</strong>,</p>
            <p style="margin:0;color:#b9a9c2;font-size:14px;line-height:1.8;">Thank you for registering for the J'pura Employability Skills Awards. Please keep the reference numbers below for future communication and award-related updates.</p>

            <!-- Reference -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0 28px;">
              <tr><td align="center" style="padding:20px;background:#0b0711;border:1px solid #e5c064;border-radius:12px;">
                <p style="margin:0 0 8px;color:#d8bd65;font-size:10px;font-weight:700;letter-spacing:1.7px;text-transform:uppercase;">Application Reference</p>
                <p class="ref-code" style="margin:0;color:#ffffff;font-family:Georgia,'Times New Roman',serif;font-size:25px;font-weight:700;letter-spacing:1px;">${escapeHtml(applicationReferenceNumber)}</p>
                <p style="margin:7px 0 0;color:#776580;font-size:11px;">Keep this number for all future correspondence.</p>
              </td></tr>
            </table>

            <p style="margin:0;color:#ffffff;font-family:Georgia,'Times New Roman',serif;font-size:19px;font-weight:700;">Your Registered Award Categories</p>
            <p style="margin:7px 0 18px;color:#8f7c9d;font-size:12px;line-height:1.7;">Each selected award has its own registration number. Join the relevant WhatsApp group to receive official updates.</p>

            <!-- Awards -->
            ${awardRows}

            <!-- Privacy -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:22px;">
              <tr><td style="padding:13px 15px;background:#0d0714;border-left:3px solid #e5c064;border-radius:8px;color:#a996b2;font-size:12px;line-height:1.65;">
                <strong style="color:#d8c6de;">Privacy notice:</strong> Do not share the WhatsApp group links publicly. They are intended only for registered applicants.
              </td></tr>
            </table>

            <p style="margin:0 0 28px;color:#d9ccdf;font-size:14px;line-height:1.7;">Regards,<br><strong style="color:#e5c064;">JESA/BESA 2026 Organizing Committee</strong></p>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="padding:24px 28px 28px;background:#0d0714;border-top:1px solid #31213e;">
            <p style="margin:0 0 16px;color:#6f5d7b;font-size:10px;font-weight:700;letter-spacing:1.8px;text-align:center;text-transform:uppercase;">Organized By</p>
            <table role="presentation" class="footer-stack" align="center" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td class="footer-logo-cell" align="center" valign="middle" style="padding:0 12px;">
                  <img src="${USJP_LOGO_URL}" alt="University of Sri Jayewardenepura" width="48" style="display:block;width:48px;height:auto;border:0;" />
                </td>
                <td class="footer-logo-cell" align="center" valign="middle" style="padding:0 12px;">
                  <img src="${CSDS_LOGO_URL}" alt="Career Skills Development Society" width="48" style="display:block;width:48px;height:auto;border:0;" />
                </td>
                <td class="footer-copy" valign="middle" style="padding:0 0 0 16px;">
                  <p style="margin:0;color:#d5c8db;font-size:12px;font-weight:700;line-height:1.5;">University of Sri Jayewardenepura</p>
                  <p style="margin:2px 0 0;color:#86738f;font-size:11px;line-height:1.5;">in collaboration with the Career Skills Development Society (CSDS)</p>
                </td>
              </tr>
            </table>
            <div style="height:1px;background:#281b33;margin:20px 0 16px;"></div>
            <p style="margin:0 0 6px;color:#6f5d7b;font-size:11px;line-height:1.6;text-align:center;">This is an automated registration message from J'pura Employability Skills Awards.</p>
            <p style="margin:0;color:#6f5d7b;font-size:11px;line-height:1.6;text-align:center;">Questions? Contact <a href="mailto:jesa@sjp.ac.lk" style="color:#e5c064;text-decoration:none;">jesa@sjp.ac.lk</a></p>
          </td>
        </tr>
      </table>
      <p style="margin:14px 0 0;color:#4f4159;font-size:10px;text-align:center;">JESA 2026 &bull; Official Registration Communication</p>
    </td></tr>
  </table>
</body>
</html>`;
}
