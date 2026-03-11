import { ConversationIntake } from "@/components/intake/ConversationIntake";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Started | Chat With Us",
  description:
    "Have a quick 2-minute conversation with our AI and we'll have everything we need to build your website.",
};

export default function IntakePage() {
  return <ConversationIntake />;
}
