// Sends transactional emails via Resend (https://resend.com).
// Requires RESEND_API_KEY in env vars. EMAIL_FROM defaults to Resend's
// shared testing address, which works immediately with no domain setup.
//
// Emails are sent "fire and forget" from the routes that call this -
// a failed email should never block or fail a signup/login request.

async function sendEmail({ to, subject, html }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log('[email] RESEND_API_KEY not set, skipping email:', subject);
    return;
  }

  const from = process.env.EMAIL_FROM || 'LawyerConnect <onboarding@resend.dev>';

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to, subject, html }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error('[email] Resend error:', res.status, body);
    }
  } catch (err) {
    console.error('[email] Failed to send:', err.message);
  }
}

function welcomeEmail(user) {
  const roleLine = user.role === 'lawyer'
    ? 'Your lawyer profile is now live. Add your specialization, experience, and bio from your dashboard so clients can find you.'
    : 'You can now browse verified lawyers by specialization, state, and experience, and message them directly.';

  return sendEmail({
    to: user.email,
    subject: 'Welcome to LawyerConnect',
    html: `
      <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #14213d;">Welcome, ${user.name.split(' ')[0]}</h2>
        <p style="color: #444; line-height: 1.6;">
          Your ${user.role} account on <strong>LawyerConnect</strong> has been created successfully.
        </p>
        <p style="color: #444; line-height: 1.6;">${roleLine}</p>
        <p style="color: #999; font-size: 12.5px; margin-top: 30px;">
          If you didn't create this account, please ignore this email.
        </p>
      </div>
    `,
  });
}

function loginAlertEmail(user) {
  const time = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  return sendEmail({
    to: user.email,
    subject: 'New login to your LawyerConnect account',
    html: `
      <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #14213d;">New login detected</h2>
        <p style="color: #444; line-height: 1.6;">
          Hi ${user.name.split(' ')[0]}, your LawyerConnect account was just logged into at
          <strong>${time} IST</strong>.
        </p>
        <p style="color: #444; line-height: 1.6;">
          If this was you, no action is needed. If you don't recognize this login,
          consider updating your password.
        </p>
      </div>
    `,
  });
}

module.exports = { sendEmail, welcomeEmail, loginAlertEmail };
