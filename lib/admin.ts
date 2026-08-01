import { redirect } from "next/navigation";
import { getChatGPTUser, requireChatGPTUser } from "../app/chatgpt-auth";
import { first, id, run, unix } from "./db";
export type AdminRole = "owner" | "editor";
export type AdminIdentity = { id:string; email:string; displayName:string|null; role:AdminRole };
export class AdminError extends Error { constructor(message:string, public status:number){super(message);} }
export async function lookupAdmin(email:string){return first<AdminIdentity>("SELECT id,email,display_name AS displayName,role FROM admin_users WHERE lower(email)=lower(?) AND status='active'",email);}
export async function requireAdmin(returnTo="/admin",ownerOnly=false){const user=await requireChatGPTUser(returnTo);const admin=await lookupAdmin(user.email);if(!admin||(ownerOnly&&admin.role!=="owner"))redirect("/admin/access-denied");await run("UPDATE admin_users SET last_login_at=?,updated_at=? WHERE id=?",unix(),unix(),admin.id);return admin;}
export async function requireAdminApi(ownerOnly=false){const user=await getChatGPTUser();if(!user)throw new AdminError("Authentication required.",401);const admin=await lookupAdmin(user.email);if(!admin)throw new AdminError("Administrator access required.",403);if(ownerOnly&&admin.role!=="owner")throw new AdminError("Owner permission required.",403);return admin;}
export async function audit(actor:string,action:string,targetType:string,targetId?:string,metadata?:Record<string,unknown>){await run("INSERT INTO audit_logs(id,actor_email,action,target_type,target_id,metadata,created_at) VALUES(?,?,?,?,?,?,?)",id("aud"),actor,action,targetType,targetId||null,metadata?JSON.stringify(metadata).slice(0,2000):null,unix());}
export async function ownerCount(){return (await first<{total:number}>("SELECT count(*) AS total FROM admin_users WHERE role='owner' AND status='active'"))?.total||0;}
export async function bootstrapOwner(email:string,name?:string|null){const now=unix();const result=await run("INSERT INTO admin_users(id,email,display_name,role,status,created_at,updated_at) SELECT ?,lower(?),?,'owner','active',?,? WHERE NOT EXISTS(SELECT 1 FROM admin_users)",id("usr"),email,name||null,now,now);return result.meta.changes===1;}
