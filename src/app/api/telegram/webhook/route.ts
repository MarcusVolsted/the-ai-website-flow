import { NextRequest, NextResponse } from "next/server";
import { createServerClient, isSupabaseConfigured } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Handle callback queries from inline buttons
  const callback = body.callback_query;
  if (!callback?.data) {
    return NextResponse.json({ ok: true });
  }

  const [action, submissionId] = callback.data.split(":");
  if (!action || !submissionId) {
    return NextResponse.json({ ok: true });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    return NextResponse.json({ ok: true });
  }

  // Update status in Supabase
  let statusText = "";
  if (action === "approve") {
    statusText = "approved";
  } else if (action === "reject") {
    statusText = "rejected";
  } else {
    return NextResponse.json({ ok: true });
  }

  if (isSupabaseConfigured()) {
    const supabase = createServerClient();
    await supabase
      .from("intake_submissions")
      .update({ status: statusText })
      .eq("id", submissionId);
  }

  // Answer the callback query (removes loading state on button)
  await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      callback_query_id: callback.id,
      text: `Lead ${statusText}!`,
    }),
  });

  // Edit the original message to show the decision
  const shortId = submissionId.slice(0, 8).toUpperCase();
  await fetch(`https://api.telegram.org/bot${token}/editMessageReplyMarkup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: callback.message.chat.id,
      message_id: callback.message.message_id,
      reply_markup: {
        inline_keyboard: [
          [{ text: `${statusText === "approved" ? "Approved" : "Rejected"} (${shortId})`, callback_data: "noop" }],
        ],
      },
    }),
  });

  return NextResponse.json({ ok: true });
}
