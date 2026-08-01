"use client";
import { useState } from "react";

export function SubmitButton({
  children,
  pending = "Submitting…",
  className = "button button-dark",
}: {
  children: React.ReactNode;
  pending?: string;
  className?: string;
}) {
  const [submitting, setSubmitting] = useState(false);

  return (
    <button
      className={className}
      type="submit"
      aria-disabled={submitting}
      aria-busy={submitting}
      onClick={(event) => {
        if (submitting) {
          event.preventDefault();
          return;
        }

        const form = event.currentTarget.form;
        if (!form?.checkValidity()) return;

        // Let the browser complete its native submit action before changing
        // the label. Do not set the disabled attribute: Chrome can cancel an
        // in-flight native POST when its submitter becomes disabled.
        window.setTimeout(() => setSubmitting(true), 0);
      }}
    >
      {submitting ? pending : children}
    </button>
  );
}
