export type YoneRuntimeEnv = {
  DB?: D1Database;
  BUCKET?: R2Bucket;
  OWNER_INVITE_EMAIL?: string;
  RATE_LIMIT_SALT?: string;
  RESEND_API_KEY?: string;
  MAIL_FROM?: string;
  NOTIFICATION_EMAIL?: string;
};

declare global {
  var __YONE_RUNTIME_ENV__: YoneRuntimeEnv | undefined;
}

export function setRuntimeEnv(value:YoneRuntimeEnv){globalThis.__YONE_RUNTIME_ENV__=value;}
export function runtimeEnv(){return globalThis.__YONE_RUNTIME_ENV__||{};}
