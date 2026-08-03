import webpush from "web-push";
import { all, run } from "./db";
import { runtimeEnv } from "./runtime-env";

type PushRow={id:string;endpoint:string;p256dh:string;auth:string};
export async function sendAdminPush(title:string,body:string,url="/admin/rfqs"){
  const env=runtimeEnv();if(!env.NEXT_PUBLIC_VAPID_PUBLIC_KEY||!env.VAPID_PRIVATE_KEY||!env.VAPID_SUBJECT)return;
  webpush.setVapidDetails(env.VAPID_SUBJECT,env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,env.VAPID_PRIVATE_KEY);
  const subscriptions=await all<PushRow>("SELECT id,endpoint,p256dh,auth FROM push_subscriptions WHERE active=1").catch(()=>[]);
  await Promise.all(subscriptions.map(async(item)=>{try{await webpush.sendNotification({endpoint:item.endpoint,keys:{p256dh:item.p256dh,auth:item.auth}},JSON.stringify({title,body,url}),{TTL:3600});await run("UPDATE push_subscriptions SET last_used_at=? WHERE id=?",Math.floor(Date.now()/1000),item.id);}catch(error){const status=typeof error==="object"&&error&&"statusCode" in error?Number((error as {statusCode?:number}).statusCode):0;if(status===404||status===410)await run("UPDATE push_subscriptions SET active=0 WHERE id=?",item.id);}}));
}
