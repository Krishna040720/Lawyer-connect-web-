// Sends transactional emails via EmailJS (https://emailjs.com), using their
// REST API from the backend (not the browser SDK - keeps keys out of the
// frontend). Requires EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID,
// EMAILJS_PUBLIC_KEY and EMAILJS_PRIVATE_KEY in env vars.
//
// Emails are sent "fire and forget" from the routes that call this -
// a failed email should never block or fail a signup/login request.

async function sendEmail({ toEmail, name, subject, message }) {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (!serviceId || !templateId || !publicKey || !privateKey) {
    console.log('[email] EmailJS env vars not fully set, skipping email:', subject);
    return;
  }

  try {
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        accessToken: privateKey,
        template_params: {
          to_email: toEmail,
          name,
          email: toEmail,
          subject,
          message,
          time: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        },
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error('[email] EmailJS error:', res.status, body);
    } else {
      console.log('[email] Sent:', subject, '->', toEmail);
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
    toEmail: user.email,
    name: user.name,
    subject: 'Welcome to LawyerConnect',
    message: `Your ${user.role} account on LawyerConnect has been created successfully. ${roleLine}`,
  });
}

function loginAlertEmail(user) {
  return sendEmail({
    toEmail: user.email,
    name: user.name,
    subject: 'New login to your LawyerConnect account',
    message: 'Your LawyerConnect account was just logged into. If this was you, no action is needed. If you don\'t recognize this login, consider updating your password.',
  });
}

module.exports = { sendEmail, welcomeEmail, loginAlertEmail };
