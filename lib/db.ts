import { runtimeEnv } from "./runtime-env";

export function d1() {
  const env=runtimeEnv();
  if (!env.DB) throw new Error("Database binding is unavailable.");
  return env.DB;
}
export function bucket() {
  const env=runtimeEnv();
  if (!env.BUCKET) throw new Error("Object-storage binding is unavailable.");
  return env.BUCKET;
}
export async function first<T>(sql: string, ...values: unknown[]) { return d1().prepare(sql).bind(...values).first<T>(); }
export async function all<T>(sql: string, ...values: unknown[]) { return (await d1().prepare(sql).bind(...values).all<T>()).results || []; }
export async function run(sql: string, ...values: unknown[]) { return d1().prepare(sql).bind(...values).run(); }
export async function safeAll<T>(sql: string, ...values: unknown[]) { try { return await all<T>(sql, ...values); } catch { return []; } }
export async function safeFirst<T>(sql: string, ...values: unknown[]) { try { return await first<T>(sql, ...values); } catch { return null; } }
export const unix = () => Math.floor(Date.now() / 1000);
export const id = (prefix: string) => `${prefix}${prefix ? "_" : ""}${crypto.randomUUID().replaceAll("-", "")}`;
