import { createClient } from "@supabase/supabase-js";

let adminClient:ReturnType<typeof createClient>|undefined;
function storage(){if(adminClient)return adminClient;const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!url||!key)throw new Error("Supabase storage is not configured.");adminClient=createClient(url,key,{auth:{autoRefreshToken:false,persistSession:false}});return adminClient;}
function bucket(){return process.env.SUPABASE_STORAGE_BUCKET||"yone-media";}
export function storageBucket(){return bucket();}
export async function createSignedUpload(key:string){const{data,error}=await storage().storage.from(bucket()).createSignedUploadUrl(key,{upsert:false});if(error||!data)throw new Error(`Signed upload could not be created: ${error?.message||"unknown error"}`);return data;}
export async function putObject(key:string,bytes:ArrayBuffer,mime:string){const{error}=await storage().storage.from(bucket()).upload(key,new Uint8Array(bytes),{contentType:mime,cacheControl:"3600",upsert:false});if(error)throw new Error(`Storage upload failed: ${error.message}`);}
export async function getObject(key:string){const{data,error}=await storage().storage.from(bucket()).download(key);if(error||!data)return null;return{body:await data.arrayBuffer(),size:data.size,type:data.type||"application/octet-stream"};}
export async function deleteObject(key:string){const{error}=await storage().storage.from(bucket()).remove([key]);if(error)throw new Error(`Storage deletion failed: ${error.message}`);}
export async function deleteObjects(keys:string[]){if(!keys.length)return;const{error}=await storage().storage.from(bucket()).remove(keys);if(error)throw new Error(`Storage deletion failed: ${error.message}`);}
