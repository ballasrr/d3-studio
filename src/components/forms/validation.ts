/**
 * Lead form validation — pure, copy-free rules.
 * Error messages live in `content/site.ts` and are mapped by the form component.
 */

export type LeadValues = {
  name: string;
  company: string;
  contact: string;
  budget: string;
  message: string;
};

export type LeadField = keyof LeadValues;

export type LeadErrors = Partial<Record<LeadField, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const TELEGRAM = /^@[a-z0-9_]{4,32}$/i;

export const LIMITS = {
  name: 2,
  message: 10,
} as const;

/** Accepts an email address or a Telegram handle (`@username`). */
export function isValidContact(value: string): boolean {
  const contact = value.trim();
  return EMAIL.test(contact) || TELEGRAM.test(contact);
}

export function isValidField(field: LeadField, values: LeadValues): boolean {
  switch (field) {
    case "name":
      return values.name.trim().length >= LIMITS.name;
    case "contact":
      return isValidContact(values.contact);
    case "message":
      return values.message.trim().length >= LIMITS.message;
    default:
      return true;
  }
}

/** Returns the required fields that are still invalid, in visual order. */
export function validateLead(values: LeadValues): LeadField[] {
  return (["name", "contact", "message"] as const).filter(
    (field) => !isValidField(field, values),
  );
}
