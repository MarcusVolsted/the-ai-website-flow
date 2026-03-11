"use client";

import { IntakeProvider, useIntakeState } from "./IntakeContext";
import { ChatThread } from "./ChatThread";
import { ChatMessage } from "./ChatMessage";
import { StepRenderer } from "./StepRenderer";
import { ProgressIndicator } from "./ProgressIndicator";
import { GradientOrb } from "@/components/ui/GradientOrb";

function IntakeWizardInner() {
  const state = useIntakeState();
  const { messages, currentStep } = state;

  return (
    <div className="relative flex min-h-screen flex-col items-center overflow-hidden bg-surface-base">
      {/* Background decoration */}
      <GradientOrb
        className="-top-64 -right-64"
        color="rgba(242, 86, 35, 0.06)"
        size="800px"
      />
      <GradientOrb
        className="-bottom-32 -left-48"
        color="rgba(242, 86, 35, 0.04)"
        size="600px"
      />

      {/* Main container */}
      <div className="relative z-10 flex w-full max-w-2xl flex-1 flex-col">
        {/* Header */}
        <div className="flex flex-col items-center gap-1 px-4 pt-8 pb-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-brand" />
            <h1
              className="text-lg font-bold tracking-tight text-text-primary"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Get Started
            </h1>
          </div>
          <ProgressIndicator currentStep={currentStep} />
        </div>

        {/* Chat thread */}
        <ChatThread>
          {/* Past messages (completed steps) */}
          {messages.slice(0, -1).map((msg) => (
            <ChatMessage key={msg.id} role={msg.role} animate={false}>
              <p className="whitespace-pre-line text-sm leading-relaxed">
                {msg.content}
              </p>
            </ChatMessage>
          ))}

          {/* Current step */}
          {currentStep === "success" ? (
            <StepRenderer />
          ) : (
            messages.length > 0 && (
              <ChatMessage
                key={messages[messages.length - 1].id}
                role="assistant"
              >
                <p className="whitespace-pre-line text-sm leading-relaxed mb-1">
                  {messages[messages.length - 1].content}
                </p>
                <StepRenderer />
              </ChatMessage>
            )
          )}
        </ChatThread>
      </div>
    </div>
  );
}

export function IntakeWizard() {
  return (
    <IntakeProvider>
      <IntakeWizardInner />
    </IntakeProvider>
  );
}
