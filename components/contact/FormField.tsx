import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type BaseProps = {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
};

type InputFieldProps = BaseProps & {
  as?: "input";
} & InputHTMLAttributes<HTMLInputElement>;

type TextareaFieldProps = BaseProps & {
  as: "textarea";
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export function FormField(props: InputFieldProps | TextareaFieldProps) {
  const { id, label, error, required, as = "input", ...rest } = props;
  const errorId = `${id}-error`;

  const sharedClassName =
    "w-full rounded-xl border bg-ink px-4 py-3 text-sm text-paper placeholder:text-paper-mute focus:outline-none focus:ring-2 focus:ring-teal " +
    (error ? "border-coral" : "border-border focus:border-teal");

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-paper">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>

      {as === "textarea" ? (
        <textarea
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`${sharedClassName} min-h-36 resize-y`}
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={sharedClassName}
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}

      {error && (
        <p id={errorId} role="alert" className="mt-2 text-sm text-coral-soft">
          {error}
        </p>
      )}
    </div>
  );
}
