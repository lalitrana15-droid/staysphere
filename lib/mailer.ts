/**
 * Outgoing email. Uses our own mail server over SMTP when SMTP_* is configured
 * (mail is sent as support@staysvacation.com), otherwise falls back to Resend.
 * Server-side only.
 */
export type MailInput = {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
};

export const MAIL_FROM_ADDRESS = process.env.SMTP_FROM || process.env.SMTP_USER || "support@staysvacation.com";
const FROM = `StaysVacation <${MAIL_FROM_ADDRESS}>`;

export async function sendMail(m: MailInput): Promise<boolean> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    try {
      const nodemailer = (await import("nodemailer")).default;
      const port = Number(SMTP_PORT || 587);
      const transport = nodemailer.createTransport({
        host: SMTP_HOST,
        port,
        secure: port === 465,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
      });
      await transport.sendMail({ from: FROM, to: m.to, subject: m.subject, html: m.html, replyTo: m.replyTo });
      return true;
    } catch (e) {
      console.error("SMTP mail error:", e);
      return false;
    }
  }
  if (process.env.RESEND_API_KEY) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({ from: FROM, to: m.to, subject: m.subject, html: m.html, replyTo: m.replyTo });
      return true;
    } catch (e) {
      console.error("Resend error:", e);
      return false;
    }
  }
  return false;
}

export const escapeHtml = (s: string) =>
  s.replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c]!));
