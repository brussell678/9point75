"use server";

import { redirect } from "next/navigation";
import { isAuthorizedAdmin } from "@/lib/auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type SignInState = {
  error?: string;
};

function getTextValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function signInOwner(
  _previousState: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const email = getTextValue(formData, "email");
  const password = getTextValue(formData, "password");
  const next = getTextValue(formData, "next");

  if (!email || !password) {
    return {
      error: "Email and password are required.",
    };
  }

  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return {
      error: "Supabase environment variables are missing.",
    };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      error: error.message,
    };
  }

  if (!isAuthorizedAdmin(data.user.email)) {
    await supabase.auth.signOut();
    return {
      error: "This account is not authorized for the owner dashboard.",
    };
  }

  redirect(next || "/admin");
}

export async function signOutOwner() {
  const supabase = await getSupabaseServerClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  redirect("/sign-in");
}
