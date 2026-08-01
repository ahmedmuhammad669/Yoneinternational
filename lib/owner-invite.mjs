/**
 * Canonicalize an email only where the provider documents alias equivalence.
 * Other providers remain exact (apart from case and surrounding whitespace).
 *
 * @param {string} value
 */
export function canonicalOwnerEmail(value) {
  const normalized = value.trim().toLowerCase();
  const separator = normalized.lastIndexOf("@");
  if (separator <= 0) return normalized;

  let localPart = normalized.slice(0, separator);
  let domain = normalized.slice(separator + 1);

  if (domain === "googlemail.com") domain = "gmail.com";
  if (domain === "gmail.com") {
    localPart = localPart.split("+", 1)[0].replaceAll(".", "");
  }

  return `${localPart}@${domain}`;
}

/**
 * OWNER_INVITE_EMAIL may contain a comma-separated allowlist. This keeps
 * first-Owner registration closed to everyone except explicitly approved
 * identities while accepting equivalent Gmail aliases.
 *
 * @param {string | undefined} configuredEmails
 * @param {string} signedInEmail
 */
export function ownerInviteMatches(configuredEmails, signedInEmail) {
  if (!configuredEmails || !signedInEmail) return false;
  const signedInIdentity = canonicalOwnerEmail(signedInEmail);

  return configuredEmails
    .split(",")
    .map(canonicalOwnerEmail)
    .filter(Boolean)
    .includes(signedInIdentity);
}

/**
 * @param {string} email
 */
export function maskEmail(email) {
  const separator = email.lastIndexOf("@");
  if (separator <= 1) return "your signed-in account";
  const localPart = email.slice(0, separator);
  const domain = email.slice(separator + 1);
  return `${localPart.slice(0, 2)}•••@${domain}`;
}
