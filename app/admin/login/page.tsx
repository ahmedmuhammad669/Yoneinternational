import { redirect } from "next/navigation";
import { getCurrentUser } from "../../admin-auth";

export default async function AdminLogin({searchParams}:{searchParams:Promise<{returnTo?:string;sent?:string;error?:string}>}){
  const query=await searchParams;
  if(await getCurrentUser())redirect(query.returnTo?.startsWith("/")?query.returnTo:"/admin");
  return <main className="admin-auth"><form action="/api/auth/login" method="post">
    <p className="eyebrow">Protected administration</p>
    <h1>Admin sign in</h1>
    <p>Enter an approved administrator email. Supabase will send a secure one-time sign-in link—there is no website password to share.</p>
    {query.sent&&<p className="notice success">Check your inbox and open the secure link on this device.</p>}
    {query.error&&<p className="notice error">{query.error}</p>}
    <input type="hidden" name="returnTo" value={query.returnTo||"/admin"}/>
    <label>Email address<input name="email" type="email" autoComplete="email" required maxLength={254}/></label>
    <button className="button button-dark" type="submit">Email secure sign-in link</button>
  </form></main>;
}
