"use client";

type ConfirmButtonProps = {
  message: string;
  className?: string;
  children: React.ReactNode;
};

/**
 * Submit button that asks "are you sure?" before letting the form submit.
 * Used for anything destructive so one stray tap can't delete real work.
 */
export function ConfirmButton({ message, className, children }: ConfirmButtonProps) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(event) => {
        if (!window.confirm(message)) {
          event.preventDefault();
        }
      }}
    >
      {children}
    </button>
  );
}
