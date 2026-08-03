"use client";
import { FormEvent, useState } from "react";
import { createClient } from "@supabase/supabase-js";

type UploadTicket={objectKey:string;token:string;fileName:string};
const MB=1024*1024;

export function AdminMediaBulkUpload(){
  const[message,setMessage]=useState("");const[busy,setBusy]=useState(false);
  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();setMessage("");const form=event.currentTarget;const data=new FormData(form);const files=data.getAll("files").filter((value):value is File=>value instanceof File&&value.size>0);const kind=String(data.get("kind")||"");const visibility=String(data.get("visibility")||"");const altPrefix=String(data.get("alt_text")||"").trim();
    try{
      if(!files.length||files.length>20)throw new Error("Choose between 1 and 20 files.");
      if(files.reduce((total,file)=>total+file.size,0)>50*MB)throw new Error("The combined upload must be 50 MB or smaller.");
      setBusy(true);setMessage("Preparing secure uploads…");
      const ticketResponse=await fetch("/api/admin/media/presign",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({kind,visibility,files:files.map((file)=>({name:file.name,size:file.size,type:file.type}))})});
      const ticketBody=await ticketResponse.json() as {batchId?:string;bucket?:string;uploads?:UploadTicket[];error?:string};if(!ticketResponse.ok||!ticketBody.batchId||!ticketBody.bucket||!ticketBody.uploads)throw new Error(ticketBody.error||"Secure upload could not be prepared.");
      const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;if(!url||!key)throw new Error("Supabase browser configuration is missing.");const supabase=createClient(url,key);
      try{
        for(let index=0;index<files.length;index+=1){setMessage(`Uploading ${index+1} of ${files.length}…`);const ticket=ticketBody.uploads[index];const{error}=await supabase.storage.from(ticketBody.bucket).uploadToSignedUrl(ticket.objectKey,ticket.token,files[index],{contentType:files[index].type||undefined});if(error)throw error;}
        setMessage("Validating uploaded files…");const complete=await fetch("/api/admin/media/finalize",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({batchId:ticketBody.batchId,altPrefix})});const result=await complete.json() as {count?:number;error?:string};if(!complete.ok)throw new Error(result.error||"Uploaded files could not be finalized.");window.location.assign(`/admin/media?ok=${encodeURIComponent(`${result.count||files.length} files uploaded successfully.`)}`);
      }catch(error){await fetch("/api/admin/media/cancel",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({batchId:ticketBody.batchId})}).catch(()=>undefined);throw error;}
    }catch(error){setMessage(error instanceof Error?error.message:"Upload failed.");setBusy(false);}
  }
  return <section className="admin-panel"><h2>Bulk upload media or catalogs</h2><p>Select up to 20 files (50 MB combined). Files upload directly to private Supabase Storage, then the server verifies their signatures before publishing records.</p><form className="admin-form compact" onSubmit={submit}><label><span>Files (PDF, JPEG, PNG, WebP)</span><input required multiple type="file" name="files" accept=".pdf,.jpg,.jpeg,.png,.webp" disabled={busy}/></label><label><span>Kind</span><select name="kind" disabled={busy}><option value="image">Images</option><option value="catalog">Downloadable catalogs</option><option value="datasheet">Datasheets</option></select></label><label><span>Visibility</span><select name="visibility" disabled={busy}><option value="private">Private draft</option><option value="public">Public</option></select></label><label><span>Shared alt-text prefix (optional)</span><input name="alt_text" placeholder="Product instruments" disabled={busy}/></label><button className="button button-dark" type="submit" disabled={busy}>{busy?"Uploading…":"Upload selected files"}</button>{message&&<p className={message.includes("failed")||message.includes("missing")||message.includes("smaller")?"form-error":"form-success"} role="status">{message}</p>}</form></section>;
}
