import Link from "next/link";
import {
  getCurrentUser,
  signInPath,
  signOutPath,
} from "../../admin-auth";
import { ownerCount } from "../../../lib/admin";
import { runtimeEnv } from "../../../lib/runtime-env";
import { ownerInviteMatches } from "../../../lib/owner-invite.mjs";

export default async function Setup() {
  const [user, count] = await Promise.all([getCurrentUser(), ownerCount()]);

  if (count > 0) {
    return (
      <main className="admin-auth">
        <div>
          <h1>Owner setup is closed.</h1>
          <Link className="button button-dark" href="/admin">Open admin</Link>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="admin-auth">
        <div>
          <h1>Secure Owner setup</h1>
          <p>Sign in with the invited Owner email using a secure email link. No password is stored by this website.</p>
          <a className="button button-dark" href={signInPath("/admin/setup")}>
            Email secure sign-in link
          </a>
        </div>
      </main>
    );
  }

  if (!ownerInviteMatches(runtimeEnv().OWNER_INVITE_EMAIL, user.email)) {
    return (
      <main className="admin-auth">
        <div>
          <h1>Invitation does not match.</h1>
          <p>
            You are currently signed in as <strong>{user.email}</strong>. This
            address is not on the approved Owner invitation list.
          </p>
          <p>
            Please use the email configured in <strong>OWNER_INVITE_EMAIL</strong>.
          </p>
          <a
            className="button button-dark"
            href={signOutPath("/admin/setup")}
          >
            Sign out &amp; switch account
          </a>
          <p><small>Supabase secure Owner setup</small></p>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-auth">
      <form action="/api/admin/setup" method="post">
        <p className="eyebrow">One-time invitation</p>
        <h1>Create the first Owner</h1>
        <p>{user.email}</p>
        <button className="button button-dark" type="submit">Activate Owner access</button>
      </form>
    </main>
  );
}
