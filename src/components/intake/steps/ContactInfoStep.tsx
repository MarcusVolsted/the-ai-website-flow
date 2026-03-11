"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactInfoSchema, type ContactInfoData } from "@/lib/schemas";
import { useIntakeState, useIntakeDispatch } from "../IntakeContext";
import { TextInput } from "../fields/TextInput";
import { Button } from "@/components/ui/Button";

export function ContactInfoStep() {
  const state = useIntakeState();
  const dispatch = useIntakeDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactInfoData>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: state.contactInfoData || {
      fullName: "",
      email: "",
      phone: "",
      companyName: "",
      currentWebsiteUrl: "",
    },
  });

  function onSubmit(data: ContactInfoData) {
    dispatch({ type: "COMPLETE_CONTACT_INFO", payload: data });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-4">
      <TextInput
        label="Full Name"
        placeholder="John Doe"
        error={errors.fullName?.message}
        {...register("fullName")}
      />
      <TextInput
        label="Email Address"
        type="email"
        placeholder="john@company.com"
        error={errors.email?.message}
        {...register("email")}
      />
      <TextInput
        label="Phone Number"
        type="tel"
        placeholder="+45 12 34 56 78"
        error={errors.phone?.message}
        {...register("phone")}
      />
      <TextInput
        label="Company Name"
        placeholder="Acme Inc."
        error={errors.companyName?.message}
        {...register("companyName")}
      />
      <TextInput
        label="Current Website"
        placeholder="https://yourcompany.com"
        helperText="Leave blank if you don't have one yet"
        error={errors.currentWebsiteUrl?.message}
        {...register("currentWebsiteUrl")}
      />

      <div className="mt-2">
        <Button type="submit">
          Continue
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="ml-1">
            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Button>
      </div>
    </form>
  );
}
