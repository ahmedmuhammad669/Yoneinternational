import { NextResponse } from "next/server";
import { supabaseServer } from "../../../lib/supabase-server";

export async function GET(request:Request){const url=new URL(request.url);const raw=url.searchParams.get("returnTo")||"/";const returnTo=raw.startsWith("/")&&!raw.startsWith("//")?raw:"/";const supabase=await supabaseServer();await supabase.auth.signOut();return NextResponse.redirect(new URL(returnTo,url.origin));}
