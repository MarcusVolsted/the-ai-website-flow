interface NotifyOwnerParams {
  submissionId: string;
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  currentWebsiteUrl?: string;
  siteType: string;
  pageCount: number;
  features: string[];
  primaryGoal: string;
  stylePreference: string;
  toneOfVoice: string;
  targetAudience: string;
  mainCta: string;
}

export async function notifyOwner(data: NotifyOwnerParams) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn("Telegram not configured — skipping notification.");
    return;
  }

  const message = [
    `<b>New Lead</b>`,
    ``,
    `<b>Name:</b> ${escapeHtml(data.fullName)}`,
    `<b>Email:</b> ${escapeHtml(data.email)}`,
    `<b>Phone:</b> ${escapeHtml(data.phone)}`,
    `<b>Company:</b> ${escapeHtml(data.companyName)}`,
    `<b>Website:</b> ${data.currentWebsiteUrl ? escapeHtml(data.currentWebsiteUrl) : "None"}`,
    ``,
    `<b>Type:</b> ${escapeHtml(data.siteType)}`,
    `<b>Pages:</b> ${data.pageCount}`,
    `<b>Features:</b> ${escapeHtml(data.features.join(", "))}`,
    `<b>Goal:</b> ${escapeHtml(data.primaryGoal)}`,
    ``,
    `<b>Style:</b> ${escapeHtml(data.stylePreference)}`,
    `<b>Tone:</b> ${escapeHtml(data.toneOfVoice)}`,
    `<b>CTA:</b> ${escapeHtml(data.mainCta)}`,
    `<b>Audience:</b> ${escapeHtml(data.targetAudience)}`,
  ].join("\n");

  const res = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              { text: "Approve", callback_data: `approve:${data.submissionId}` },
              { text: "Reject", callback_data: `reject:${data.submissionId}` },
            ],
          ],
        },
      }),
    },
  );

  if (!res.ok) {
    const body = await res.text();
    console.error("Telegram send failed:", res.status, body);
  }
}

export async function sendTelegramMessage(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
  });
}

// Notification for the new conversation-based intake
interface NotifyConversationParams {
  submissionId: string;
  summary: string;
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  companyLocation?: string;
}

export async function notifyOwnerConversation(data: NotifyConversationParams) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn("Telegram not configured — skipping notification.");
    return;
  }

  const message = [
    `<b>New Lead (AI Chat)</b>`,
    ``,
    `<b>Name:</b> ${escapeHtml(data.fullName)}`,
    `<b>Email:</b> ${escapeHtml(data.email)}`,
    `<b>Phone:</b> ${escapeHtml(data.phone)}`,
    `<b>Company:</b> ${escapeHtml(data.companyName)}`,
    data.companyLocation ? `<b>Location:</b> ${escapeHtml(data.companyLocation)}` : "",
    ``,
    `<b>Summary:</b>`,
    escapeHtml(data.summary),
  ].join("\n");

  const res = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              { text: "Approve", callback_data: `approve:${data.submissionId}` },
              { text: "Reject", callback_data: `reject:${data.submissionId}` },
            ],
          ],
        },
      }),
    },
  );

  if (!res.ok) {
    const body = await res.text();
    console.error("Telegram send failed:", res.status, body);
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
