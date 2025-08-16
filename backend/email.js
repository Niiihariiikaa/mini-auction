import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendMail({ to, subject, text, html, attachments }) {
  const msg = { from: process.env.MAIL_FROM, to, subject, text, html, attachments };
  return sgMail.send(msg);
}