import { redirect } from "next/navigation";
import { supabaseServer } from "../lib/supabase-server";

export type AdminUser={displayName:string;email:string;fullName:string|null};
export async function getCurrentUser():Promise<AdminUser|null>{const supabase=await supabaseServer();const{data,error}=await supabase.auth.getUser();const email=data.user?.email;if(error||!email)return null;const metadata=data.user?.user_metadata??{};const fullName=typeof metadata.full_name==="string"?metadata.full_name:typeof metadata.name==="string"?metadata.name:null;return{displayName:fullName??email,email,fullName};}
export async function requireCurrentUser(returnTo:string){const user=await getCurrentUser();if(user)return user;redirect(signInPath(returnTo));}
export function signInPath(returnTo:string){return`/admin/login?returnTo=${encodeURIComponent(safePath(returnTo))}`;}
export function signOutPath(returnTo="/"){return`/auth/signout?returnTo=${encodeURIComponent(safePath(returnTo))}`;}
function safePath(value:string){if(!value.startsWith("/")||value.startsWith("//")||value.includes("\\"))return"/";try{const url=new URL(value,"https://app.local");if(url.origin!=="https://app.local"||["/auth/callback","/auth/signout"].includes(url.pathname))return"/";return`${url.pathname}${url.search}${url.hash}`;}catch{return"/";}}
