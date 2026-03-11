import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendConfirmationParams {
  to: string;
  fullName: string;
  companyName: string;
}

export async function sendConfirmationEmail({
  to,
  fullName,
  companyName,
}: SendConfirmationParams) {
  const firstName = fullName.split(" ")[0];

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
    to,
    subject: `${firstName}, we received your submission`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 20px; color: #DEDEDE; background: #0d0d0d;">
        <div style="margin-bottom: 32px;">
          <div style="width: 40px; height: 40px; background: rgba(242,86,35,0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px;">
            <span style="color: #F25623; font-size: 20px;">&#9889;</span>
          </div>
          <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 8px; color: #DEDEDE; letter-spacing: -0.03em;">
            We're on it, ${firstName}!
          </h1>
          <p style="font-size: 14px; color: #9a9a9a; margin: 0; line-height: 1.7;">
            We've received your intake form for <strong style="color: #DEDEDE;">${companyName}</strong>.
          </p>
        </div>

        <div style="background: #171717; border: 1px solid #2a2a2a; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <p style="font-size: 14px; color: #DEDEDE; margin: 0 0 12px; font-weight: 600;">What happens next</p>
          <div style="font-size: 13px; color: #9a9a9a; line-height: 1.8;">
            <div style="margin-bottom: 4px;"><span style="color: #F25623; font-weight: 700;">1.</span> We review your brand &amp; project details</div>
            <div style="margin-bottom: 4px;"><span style="color: #F25623; font-weight: 700;">2.</span> Our team crafts your website</div>
            <div style="margin-bottom: 4px;"><span style="color: #F25623; font-weight: 700;">3.</span> You receive a live preview link</div>
            <div><span style="color: #F25623; font-weight: 700;">4.</span> Love it? We finalize and launch</div>
          </div>
        </div>

        <p style="font-size: 13px; color: #4D4D4D; margin: 24px 0 0; line-height: 1.6;">
          We'll get back to you within 24 hours.
          <br />If you have any questions, just reply to this email.
        </p>
      </div>
    `,
  });

  if (error) {
    console.error("Failed to send confirmation email:", error);
    throw error;
  }
}
