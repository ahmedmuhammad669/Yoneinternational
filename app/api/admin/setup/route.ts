import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../admin-auth";
import { audit, bootstrapOwner, ownerCount } from "../../../../lib/admin";
import { assertSameOrigin } from "../../../../lib/security";
import { runtimeEnv } from "../../../../lib/runtime-env";
import { ownerInviteMatches } from "../../../../lib/owner-invite.mjs";

export async function POST(request: Request) {
  try {
    await assertSameOrigin(request);
    if (await ownerCount()) {
      return NextResponse.json({ error: "Owner setup is closed." }, { status: 409 });
    }

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }
    if (!ownerInviteMatches(runtimeEnv().OWNER_INVITE_EMAIL, user.email)) {
      return NextResponse.json({ error: "Invitation does not match." }, { status: 403 });
    }

    if (!await bootstrapOwner(user.email, user.fullName)) {
      return NextResponse.json({ error: "Owner was not created." }, { status: 409 });
    }

    await audit(user.email, "owner.bootstrap", "admin_user", user.email);
    return NextResponse.redirect(new URL("/admin", request.url), 303);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Setup failed." },
      { status: 400 },
    );
  }
}
