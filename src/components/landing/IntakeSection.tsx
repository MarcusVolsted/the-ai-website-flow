"use client";

import { ConversationIntake } from "@/components/intake/ConversationIntake";

export function IntakeSection() {
  return (
    <section className="relative overflow-visible">
      {/* Orange glow behind the form */}
      <div className="pointer-events-none absolute inset-0 -top-20 -bottom-20 flex items-center justify-center">
        <div
          className="absolute w-[900px] h-[700px] rounded-full opacity-[0.10] blur-[140px]"
          style={{
            background:
              "radial-gradient(circle, #F25623 0%, rgba(242, 86, 35, 0.4) 40%, transparent 70%)",
          }}
        />
        <div
          className="absolute w-[500px] h-[400px] rounded-full opacity-[0.06] blur-[80px] translate-y-20"
          style={{
            background:
              "radial-gradient(circle, #ff7a50 0%, transparent 60%)",
          }}
        />
      </div>
      <ConversationIntake embedded />
    </section>
  );
}
