import { isAuthorizedAdmin } from "@/lib/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function getAuthorizedAdminEmail(request: Request) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
  const supabase = getSupabaseAdminClient();

  if (!token || !supabase) {
    return null;
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !isAuthorizedAdmin(user?.email)) {
    return null;
  }

  return user.email ?? null;
}
