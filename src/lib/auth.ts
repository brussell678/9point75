export function getAdminEmail() {
  return process.env.ADMIN_EMAIL?.trim().toLowerCase() ?? "";
}

export function isAuthorizedAdmin(email?: string | null) {
  const adminEmail = getAdminEmail();

  if (!adminEmail) {
    return false;
  }

  return (email ?? "").trim().toLowerCase() === adminEmail;
}
