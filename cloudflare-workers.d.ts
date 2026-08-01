interface D1Result<T = unknown> { results?: T[]; success: boolean; meta: { changes: number; [key: string]: unknown }; error?: string; }
interface Fetcher { fetch(request: Request): Promise<Response>; }
interface D1PreparedStatement { bind(...values: unknown[]): D1PreparedStatement; first<T = Record<string, unknown>>(): Promise<T | null>; all<T = Record<string, unknown>>(): Promise<D1Result<T>>; run<T = Record<string, unknown>>(): Promise<D1Result<T>>; }
interface D1Database { prepare(query: string): D1PreparedStatement; batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>; }
interface R2ObjectBody { body: ReadableStream; size: number; httpMetadata?: { contentType?: string }; }
interface R2Bucket { put(key: string, value: ArrayBuffer | ReadableStream | string, options?: { httpMetadata?: { contentType?: string; contentDisposition?: string }; customMetadata?: Record<string, string> }): Promise<unknown>; get(key: string): Promise<R2ObjectBody | null>; delete(key: string | string[]): Promise<void>; }
declare module "cloudflare:workers" {
  export const env: {
    DB?: D1Database; BUCKET?: R2Bucket;
    IMAGES?: { input(stream: ReadableStream): { transform(options: Record<string, unknown>): { output(options: { format: string; quality: number }): Promise<{ response(): Response }> } } };
    OWNER_INVITE_EMAIL?: string; RATE_LIMIT_SALT?: string; ANALYTICS_HMAC_SECRET?: string;
    RESEND_API_KEY?: string; MAIL_FROM?: string; NOTIFICATION_EMAIL?: string;
  };
}
