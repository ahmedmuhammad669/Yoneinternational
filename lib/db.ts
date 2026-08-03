import postgres, { type Sql } from "postgres";

export type Statement={sql:string;values?:unknown[]};
type Executor=Pick<Sql,"unsafe">;
let client:Sql|undefined;

function database(){if(client)return client;const url=process.env.DATABASE_URL;if(!url)throw new Error("DATABASE_URL is not configured.");client=postgres(url,{max:3,prepare:false,idle_timeout:20,connect_timeout:15,ssl:"require"});return client;}
function bind(sql:string){let index=0;return sql.replace(/\?/g,()=>`$${++index}`);}
async function query<T>(executor:Executor,sql:string,values:unknown[]){return executor.unsafe<T[]>(bind(sql),values as never[]);}
export async function first<T>(sql:string,...values:unknown[]){const rows=await query<T>(database(),sql,values);return rows[0]??null;}
export async function all<T>(sql:string,...values:unknown[]){return Array.from(await query<T>(database(),sql,values));}
export async function run(sql:string,...values:unknown[]){const result=await query<Record<string,unknown>>(database(),sql,values);return{meta:{changes:result.count??0}};}
export async function batch(statements:Statement[]){return database().begin(async(tx)=>{for(const statement of statements)await query(tx,statement.sql,statement.values??[]);});}
export async function safeAll<T>(sql:string,...values:unknown[]){try{return await all<T>(sql,...values);}catch{return[];}}
export async function safeFirst<T>(sql:string,...values:unknown[]){try{return await first<T>(sql,...values);}catch{return null;}}
export const unix=()=>Math.floor(Date.now()/1000);
export const id=(prefix:string)=>`${prefix}${prefix?"_":""}${crypto.randomUUID().replaceAll("-","")}`;
