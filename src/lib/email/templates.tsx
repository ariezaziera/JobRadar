export function reminderEmailHtml({
  candidateName,
  type,
  position,
  company,
  message,
  appUrl,
}: {
  candidateName: string
  type: string
  position: string
  company: string
  message: string | null
  appUrl: string
}) {
  const SUBJECT_MAP: Record<string, string> = {
    follow_up: `Time to follow up on your ${position} application`,
    interview:  `Interview reminder — ${position} at ${company}`,
    deadline:   `Deadline reminder — ${position} at ${company}`,
    custom:     `Qestly reminder — ${position} at ${company}`,
  }

  const ICON_MAP: Record<string, string> = {
    follow_up: '📬',
    interview:  '🎯',
    deadline:   '⏰',
    custom:     '🔔',
  }

  const icon = ICON_MAP[type] ?? '🔔'
  const typeLabel = type.replace('_', ' ')

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${SUBJECT_MAP[type]}</title>
</head>
<body style="margin:0;padding:0;background:#0F0F13;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0F0F13;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Logo -->
          <tr>
            <td style="padding-bottom:32px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#6366F1;border-radius:10px;width:36px;height:36px;text-align:center;vertical-align:middle;">
                    <span style="color:white;font-size:18px;line-height:36px;">◎</span>
                  </td>
                  <td style="padding-left:10px;color:#F1F1F5;font-size:18px;font-weight:700;vertical-align:middle;">
                    Qestly
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#1A1A24;border-radius:16px;border:1px solid #2A2A36;padding:36px;">

              <!-- Icon + type -->
              <p style="margin:0 0 8px 0;font-size:32px;">${icon}</p>
              <p style="margin:0 0 4px 0;color:#6B7280;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;">
                ${typeLabel}
              </p>

              <!-- Heading -->
              <h1 style="margin:0 0 24px 0;color:#F1F1F5;font-size:22px;font-weight:700;line-height:1.3;">
                ${SUBJECT_MAP[type]}
              </h1>

              <!-- Divider -->
              <hr style="border:none;border-top:1px solid #2A2A36;margin:0 0 24px 0;" />

              <!-- Job details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="padding-bottom:12px;">
                    <p style="margin:0;color:#6B7280;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px;">Position</p>
                    <p style="margin:0;color:#F1F1F5;font-size:15px;font-weight:600;">${position}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:12px;">
                    <p style="margin:0;color:#6B7280;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px;">Company</p>
                    <p style="margin:0;color:#F1F1F5;font-size:15px;font-weight:600;">${company}</p>
                  </td>
                </tr>
              </table>

              <!-- Custom message -->
              ${message ? `
              <div style="background:#0F0F13;border-radius:10px;border:1px solid #2A2A36;padding:16px;margin-bottom:24px;">
                <p style="margin:0;color:#6B7280;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px;">Note</p>
                <p style="margin:0;color:#D1D1D8;font-size:14px;line-height:1.6;">${message}</p>
              </div>` : ''}

              <!-- CTA -->
              <a href="${appUrl}"
                style="display:inline-block;background:#6366F1;color:white;text-decoration:none;padding:14px 28px;border-radius:12px;font-size:14px;font-weight:600;">
                View Application →
              </a>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:24px;text-align:center;">
              <p style="margin:0;color:#4B4B5A;font-size:12px;">
                Sent by Qestly · Track Every Application, Land Every Opportunity
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export function getEmailSubject({
  type,
  position,
  company,
}: {
  type: string
  position: string
  company: string
}) {
  const map: Record<string, string> = {
    follow_up: `📬 Follow up on your ${position} application at ${company}`,
    interview:  `🎯 Interview reminder — ${position} at ${company}`,
    deadline:   `⏰ Deadline reminder — ${position} at ${company}`,
    custom:     `🔔 Reminder — ${position} at ${company}`,
  }
  return map[type] ?? `Qestly reminder — ${position} at ${company}`
}