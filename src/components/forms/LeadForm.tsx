"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import { site } from "@/content/site";
import { EASE } from "@/lib/motion";

import MagneticButton from "@/components/ui/MagneticButton";
import { ArrowDown, ArrowRight, Check } from "@/components/ui/icons";

import {
  isValidField,
  validateLead,
  type LeadErrors,
  type LeadField,
  type LeadValues,
} from "./validation";

const { form } = site.contact;

type FormStatus = "idle" | "sending" | "success";

const BUDGETS = form.budgets;
const DEFAULT_BUDGET = BUDGETS[BUDGETS.length - 1];

const ERROR_COPY: Record<LeadField, string | undefined> = {
  name: form.errorName,
  company: undefined,
  contact: form.errorContact,
  budget: undefined,
  message: form.errorMessage,
};

function emptyValues(): LeadValues {
  return {
    name: "",
    company: "",
    contact: "",
    budget: DEFAULT_BUDGET,
    message: "",
  };
}

const inputBase =
  "w-full rounded-sm border bg-bg-deep px-3.5 text-[0.9375rem] text-fg transition-colors duration-150 placeholder:text-muted";

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="flex items-center gap-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-muted"
    >
      {children}
    </label>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p
      id={`${id}-error`}
      aria-live="polite"
      className="text-[0.8125rem] leading-[1.45] text-danger"
    >
      {message}
    </p>
  );
}

export default function LeadForm() {
  const [values, setValues] = useState<LeadValues>(emptyValues);
  const [errors, setErrors] = useState<LeadErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [resetCount, setResetCount] = useState(0);

  const timers = useRef<number[]>([]);
  const fieldRefs = useRef<
    Partial<Record<LeadField, HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null>>
  >({});
  const successRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const sending = status === "sending";

  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  useEffect(() => {
    if (resetCount > 0) fieldRefs.current.name?.focus();
  }, [resetCount]);

  const describedBy = (field: LeadField) =>
    errors[field] ? `lead-${field}-error` : undefined;

  const updateField = (field: LeadField, value: string) => {
    const next = { ...values, [field]: value } as LeadValues;
    setValues(next);
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: isValidField(field, next) ? undefined : ERROR_COPY[field],
      }));
    }
  };

  const touchField = (field: LeadField) => {
    setErrors((prev) => ({
      ...prev,
      [field]: isValidField(field, values) ? undefined : ERROR_COPY[field],
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;

    const invalid = validateLead(values);
    if (invalid.length > 0) {
      const next: LeadErrors = {};
      invalid.forEach((field) => {
        next[field] = ERROR_COPY[field];
      });
      setErrors(next);
      fieldRefs.current[invalid[0]]?.focus();
      return;
    }

    setErrors({});
    setStatus("sending");
    const timer = window.setTimeout(() => setStatus("success"), 700);
    timers.current.push(timer);
  };

  const reset = () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
    setValues(emptyValues());
    setErrors({});
    setStatus("idle");
    setResetCount((count) => count + 1);
  };

  if (status === "success") {
    return (
      <motion.div
        ref={successRef}
        tabIndex={-1}
        role="status"
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE.outQuart }}
        className="flex min-h-[420px] flex-col items-start justify-center gap-7 focus:outline-none"
      >
        <span className="grid size-14 place-items-center rounded-full border border-accent/40 bg-accent/10 text-danger">
          <Check className="size-6" />
        </span>
        <div className="flex flex-col gap-3">
          <h3 className="font-display text-[1.5rem] font-medium leading-[1.15] tracking-[-0.025em] text-fg">
            {form.successTitle}
          </h3>
          <p className="max-w-[42ch] text-pretty text-[0.9375rem] leading-[1.6] text-muted">
            {form.successText}
          </p>
        </div>
        <MagneticButton variant="outline" size="md" onClick={reset}>
          {form.successReset}
        </MagneticButton>
      </motion.div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      aria-busy={sending}
      className="flex flex-col gap-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <FieldLabel htmlFor="lead-name">
            {form.name}
            <span aria-hidden className="text-danger">
              *
            </span>
          </FieldLabel>
          <input
            ref={(node) => {
              fieldRefs.current.name = node;
            }}
            id="lead-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder={form.namePlaceholder}
            value={values.name}
            onChange={(event) => updateField("name", event.target.value)}
            onBlur={() => touchField("name")}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describedBy("name")}
            className={`${inputBase} h-12 ${errors.name ? "border-danger/70" : "border-line hover:border-line-strong"}`}
          />
          <FieldError id="lead-name" message={errors.name} />
        </div>

        <div className="flex flex-col gap-2">
          <FieldLabel htmlFor="lead-company">{form.company}</FieldLabel>
          <input
            ref={(node) => {
              fieldRefs.current.company = node;
            }}
            id="lead-company"
            name="company"
            type="text"
            autoComplete="organization"
            placeholder={form.companyPlaceholder}
            value={values.company}
            onChange={(event) => updateField("company", event.target.value)}
            className={`${inputBase} h-12 border-line hover:border-line-strong`}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <div className="flex flex-col gap-2">
          <FieldLabel htmlFor="lead-contact">
            {form.contact}
            <span aria-hidden className="text-danger">
              *
            </span>
          </FieldLabel>
          <input
            ref={(node) => {
              fieldRefs.current.contact = node;
            }}
            id="lead-contact"
            name="contact"
            type="text"
            inputMode="email"
            required
            autoComplete="email"
            spellCheck={false}
            placeholder={form.contactPlaceholder}
            value={values.contact}
            onChange={(event) => updateField("contact", event.target.value)}
            onBlur={() => touchField("contact")}
            aria-invalid={Boolean(errors.contact)}
            aria-describedby={describedBy("contact")}
            className={`${inputBase} h-12 ${errors.contact ? "border-danger/70" : "border-line hover:border-line-strong"}`}
          />
          <FieldError id="lead-contact" message={errors.contact} />
        </div>

        <div className="flex flex-col gap-2">
          <FieldLabel htmlFor="lead-budget">{form.budget}</FieldLabel>
          <div className="relative">
            <select
              ref={(node) => {
                fieldRefs.current.budget = node;
              }}
              id="lead-budget"
              name="budget"
              value={values.budget}
              onChange={(event) => updateField("budget", event.target.value)}
              className={`${inputBase} h-12 cursor-pointer appearance-none border-line pr-10 hover:border-line-strong`}
            >
              {BUDGETS.map((budget) => (
                <option key={budget} value={budget} className="bg-bg-deep text-fg">
                  {budget}
                </option>
              ))}
            </select>
            <ArrowDown
              aria-hidden
              className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-faint"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor="lead-message">
          {form.message}
          <span aria-hidden className="text-danger">
            *
          </span>
        </FieldLabel>
        <textarea
          ref={(node) => {
            fieldRefs.current.message = node;
          }}
          id="lead-message"
          name="message"
          required
          rows={4}
          placeholder={form.messagePlaceholder}
          value={values.message}
          onChange={(event) => updateField("message", event.target.value)}
          onBlur={() => touchField("message")}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={describedBy("message")}
          className={`${inputBase} min-h-[8.5rem] resize-none py-3 leading-[1.6] ${errors.message ? "border-danger/70" : "border-line hover:border-line-strong"}`}
        />
        <FieldError id="lead-message" message={errors.message} />
      </div>

      <div className="mt-1 flex flex-col gap-3">
        <MagneticButton
          type="submit"
          size="md"
          disabled={sending}
          className="w-full sm:w-auto"
          icon={
            sending ? (
              <span
                aria-hidden
                className="block size-4 animate-spin rounded-full border-2 border-accent-ink/30 border-t-accent-ink"
              />
            ) : (
              <ArrowRight className="size-4" />
            )
          }
        >
          {sending ? form.sending : form.submit}
        </MagneticButton>
        <p className="max-w-[52ch] text-[0.75rem] leading-[1.5] text-muted">{form.privacy}</p>
      </div>
    </form>
  );
}
