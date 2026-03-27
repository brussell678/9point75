"use client";

import { useActionState } from "react";
import { signInOwner, type SignInState } from "@/app/sign-in/actions";

const initialState: SignInState = {};

type SignInFormProps = {
  next: string;
};

export function SignInForm({ next }: SignInFormProps) {
  const [state, formAction, pending] = useActionState(signInOwner, initialState);

  return (
    <form className="sign-in-form" action={formAction}>
      <input type="hidden" name="next" value={next} />

      <label>
        Admin email
        <input type="email" name="email" autoComplete="email" required placeholder="owner@example.com" />
      </label>

      <label>
        Password
        <input type="password" name="password" autoComplete="current-password" required />
      </label>

      {state.error ? <p className="form-error">{state.error}</p> : null}

      <button type="submit" className="button button--primary" disabled={pending}>
        {pending ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
