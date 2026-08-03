import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function supabaseServer(){const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;if(!url||!key)throw new Error("Supabase authentication is not configured.");const store=await cookies();return createServerClient(url,key,{cookies:{getAll:()=>store.getAll(),setAll:(updates)=>{try{updates.forEach(({name,value,options})=>store.set(name,value,options));}catch{}}}});}
