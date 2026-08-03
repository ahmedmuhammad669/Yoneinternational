import { NextResponse } from "next/server";
import { lookupAdmin, ownerCount } from "../../../../lib/admin";
import { ownerInviteMatches } from "../../../../lib/owner-invite.mjs";
import { runtimeEnv } from "../../../../lib/runtime-env";
import { assertSameOrigin, email, enforceRateLimit, safeReturnTo } from "../../../../lib/security";
import { supabaseServer } from "../../../../lib/supabase-server";

export async function POST(request:Request){
  try{
    await assertSameOrigin(request);await enforceRateLimit(request,"admin-login",6,900);
    const form=await request.formData();const address=email(form.get("email"));const returnTo=safeReturnTo(form.get("returnTo"),"/admin");
    const existing=await lookupAdmin(address);const firstOwner=(await ownerCount())===0&&ownerInviteMatches(runtimeEnv().OWNER_INVITE_EMAIL,address);
    if(!existing&&!firstOwner)throw new Error("This email is not approved for administration.");
    const origin=new URL(request.url).origin;const callback=`${origin}/auth/callback?returnTo=${encodeURIComponent(returnTo)}`;
    const supabase=await supabaseServer();const{error}=await supabase.auth.signInWithOtp({email:address,options:{emailRedirectTo:callback,shouldCreateUser:firstOwner}});
    if(error)throw error;
    return NextResponse.redirect(new URL(`/admin/login?sent=1&returnTo=${encodeURIComponent(returnTo)}`,request.url),303);
  }catch(error){const message=error instanceof Error?error.message:"Sign-in could not be started.";return NextResponse.redirect(new URL(`/admin/login?error=${encodeURIComponent(message)}`,request.url),303);}
}
