import { NextResponse } from "next/server";
import { supabaseServer } from "../../../lib/supabase-server";

export async function GET(request:Request){const url=new URL(request.url);const code=url.searchParams.get("code");const raw=url.searchParams.get("returnTo")||"/admin";const returnTo=raw.startsWith("/")&&!raw.startsWith("//")?raw:"/admin";if(code){const supabase=await supabaseServer();const{error}=await supabase.auth.exchangeCodeForSession(code);if(!error)return NextResponse.redirect(new URL(returnTo,url.origin));}return NextResponse.redirect(new URL("/admin/login?error=Secure%20link%20is%20invalid%20or%20expired.",url.origin));}
