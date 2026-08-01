import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";
import { DatabaseSync } from "node:sqlite";
import {
  canonicalOwnerEmail,
  ownerInviteMatches,
} from "../lib/owner-invite.mjs";
import { parseCsv } from "../lib/csv.mjs";

const root=new URL("../",import.meta.url);
const read=(path)=>readFileSync(new URL(path,root),"utf8");

test("migrations create the normalized persistent schema and safe seeds",()=>{
  const db=new DatabaseSync(":memory:");
  db.exec("PRAGMA foreign_keys=ON");
  for(const file of readdirSync(new URL("../drizzle/",import.meta.url)).filter((name)=>name.endsWith(".sql")).sort()){
    db.exec(read(`drizzle/${file}`).replaceAll("--> statement-breakpoint",""));
  }
  const tables=db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map((row)=>row.name);
  for(const table of ["admin_users","categories","products","product_specifications","media_assets","blog_posts","gallery_albums","jobs","job_applications","rfqs","rfq_items","contact_inquiries","verified_testimonials","certifications","analytics_events","audit_logs","notification_outbox"])assert.ok(tables.includes(table),`${table} must exist`);
  assert.equal(db.prepare("SELECT count(*) n FROM categories WHERE status='published'").get().n,4);
  assert.equal(db.prepare("SELECT count(*) n FROM products").get().n,0);
  assert.equal(db.prepare("SELECT count(*) n FROM verified_testimonials").get().n,0);
  assert.equal(db.prepare("SELECT count(*) n FROM jobs").get().n,0);
  assert.equal(db.prepare("SELECT count(*) n FROM certifications WHERE status!='draft' OR verified!=0").get().n,0);
  db.exec("INSERT INTO admin_users(id,email,role,status,created_at,updated_at) VALUES('u1','owner@example.test','owner','active',1,1)");
  assert.equal(db.prepare("SELECT role FROM admin_users WHERE email=?").get("owner@example.test").role,"owner");
});

test("admin authorization, lifecycle gates and audit trail are server-side",()=>{
  const admin=read("lib/admin.ts");
  const lifecycle=read("app/api/admin/lifecycle/route.ts");
  const content=read("app/api/admin/content/route.ts");
  const rfqDetail=read("app/admin/rfqs/[id]/page.tsx");
  assert.match(admin,/requireAdminApi/);
  assert.match(admin,/role!=="owner"/);
  assert.match(lifecycle,/permission_status/);
  assert.match(lifecycle,/evidence_media_id/);
  assert.match(lifecycle,/approved public product image/);
  assert.match(content,/audit\(/);
  assert.doesNotMatch(content,/localStorage|sessionStorage/);
  assert.match(rfqDetail,/requireAdmin\(`/);
  for(const field of ["target_market","required_standard","private_label","packaging","desired_date","products_text","message","attachment_media_id"]){
    assert.match(rfqDetail,new RegExp(field));
  }
  assert.match(rfqDetail,/FROM rfq_items/);
  assert.match(rfqDetail,/FROM inquiry_notes/);
});

test("forms persist, validate origin, rate-limit and store opaque RFQ baskets",()=>{
  const rfq=read("app/api/rfq/route.ts");
  const contact=read("app/api/contact/route.ts");
  const basket=read("app/api/rfq/basket/route.ts");
  const submitButton=read("components/submit-button.tsx");
  for(const source of [rfq,contact]){assert.match(source,/assertSameOrigin/);assert.match(source,/enforceRateLimit/);assert.match(source,/consent/);}
  assert.match(rfq,/INSERT INTO rfqs/);
  assert.match(contact,/INSERT INTO contact_inquiries/);
  assert.match(basket,/httpOnly:true/);
  assert.match(basket,/sameSite:"lax"/);
  assert.match(submitButton,/window\.setTimeout\(\(\) => setSubmitting\(true\), 0\)/);
  assert.match(submitButton,/form\?\.checkValidity\(\)/);
  assert.doesNotMatch(submitButton,/(?:^|\s)disabled=\{submitting\}/m);
  assert.doesNotMatch([rfq,contact,basket].join("\n"),/localStorage/);
});

test("uploads use signature validation and private storage controls",()=>{
  const security=read("lib/security.ts");
  const media=read("app/api/admin/media/route.ts");
  const mediaRead=read("app/api/media/[id]/route.ts");
  assert.match(security,/%PDF-/);
  assert.match(security,/bytes\[0\]===0xff/);
  assert.match(media,/bucket\(\)\.put/);
  assert.match(mediaRead,/requireAdminApi/);
  assert.match(mediaRead,/private, no-store/);
});

test("bulk media upload validates limits and cleans up failed storage writes",()=>{
  const media=read("app/api/admin/media/route.ts");
  const adminPage=read("app/admin/[section]/page.tsx");
  assert.match(media,/form\.getAll\("files"\)/);
  assert.match(media,/files\.length>20/);
  assert.match(media,/50\*1024\*1024/);
  assert.match(media,/Promise\.all\(files\.map/);
  assert.match(media,/d1\(\)\.batch/);
  assert.match(media,/uploadedKeys\.length=0/);
  assert.match(media,/bucket\(\)\.delete\(uploadedKeys\)/);
  assert.match(adminPage,/multiple type="file" name="files"/);
  assert.match(adminPage,/query\.ok&&<p className="form-success"/);
});

test("bulk blog CSV parser and protected draft importer handle quoted content",()=>{
  const rows=parseCsv('title,body\n"Article, one","Line 1\nLine 2 with ""quotes"""\n');
  assert.deepEqual(rows,[["title","body"],["Article, one",'Line 1\nLine 2 with "quotes"']]);
  const importer=read("app/api/admin/blog/bulk/route.ts");
  const adminPage=read("app/admin/[section]/page.tsx");
  assert.match(importer,/requireAdminApi/);
  assert.match(importer,/assertSameOrigin/);
  assert.match(importer,/dataRows\.length>100/);
  assert.match(importer,/CSV contains duplicate slugs/);
  assert.match(importer,/d1\(\)\.batch/);
  assert.match(importer,/'draft',NULL/);
  assert.match(adminPage,/\/api\/admin\/blog\/bulk/);
  assert.match(adminPage,/blog-import-template\.csv/);
});

test("security, SEO and public crawlability contracts exist",()=>{
  const worker=read("worker/index.ts");
  const sitemap=read("app/sitemap.ts");
  const robots=read("app/robots.ts");
  assert.match(worker,/Content-Security-Policy/);
  assert.match(worker,/Strict-Transport-Security/);
  assert.match(worker,/X-Content-Type-Options/);
  assert.match(worker,/sec-gpc/);
  assert.match(sitemap,/blog_posts/);
  assert.match(sitemap,/gallery_albums/);
  assert.match(sitemap,/products/);
  assert.match(robots,/\/admin/);
});

test("multilingual routes preserve public pages and Arabic direction",()=>{
  const i18n=read("lib/i18n.ts");
  const middleware=read("proxy.ts");
  const switcher=read("components/language-switcher.tsx");
  const sitemap=read("app/sitemap.ts");
  for(const locale of ['"en-US"','"ar"','"de"','"it"','"zh-CN"','"ja"','"ko"']){
    assert.match(i18n,new RegExp(locale.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")));
  }
  assert.match(i18n,/locale === "ar" \? "rtl" : "ltr"/);
  assert.match(middleware,/x-yone-locale/);
  assert.match(middleware,/x-yone-public-path/);
  assert.match(switcher,/switchLocalePath/);
  assert.match(sitemap,/locales\.map/);
});

test("no embedded password or privileged credential is committed",()=>{
  const packageText=read("package.json");
  const envExample=read(".env.example");
  const all=[packageText,envExample,read("lib/notifications.ts"),read("app/chatgpt-auth.ts")].join("\n");
  assert.doesNotMatch(all,/gmail.{0,30}password|service[_-]?role.{0,10}(key|secret)\s*[:=]\s*["'][^"']+/i);
  assert.match(envExample,/OWNER_INVITE_EMAIL=/);
  assert.match(envExample,/RESEND_API_KEY=/);
});

test("Owner invitation accepts only configured identities and equivalent Gmail aliases",()=>{
  const allowlist="yoneinternational@gmail.com,loganmarkson418124+fyralix52@gmail.com";
  assert.equal(canonicalOwnerEmail("Logan.Markson418124+fyralix52@googlemail.com"),"loganmarkson418124@gmail.com");
  assert.equal(ownerInviteMatches(allowlist,"loganmarkson418124@gmail.com"),true);
  assert.equal(ownerInviteMatches(allowlist,"yoneinternational@gmail.com"),true);
  assert.equal(ownerInviteMatches(allowlist,"attacker@example.com"),false);
  assert.equal(ownerInviteMatches(undefined,"yoneinternational@gmail.com"),false);
});

test("Owner mismatch screen provides a secure account-switch path",()=>{
  const setup=read("app/admin/setup/page.tsx");
  assert.match(setup,/chatGPTSignOutPath\("\/admin\/setup"\)/);
  assert.match(setup,/Sign out &amp; switch account/);
  assert.match(setup,/user\.email/);
});
