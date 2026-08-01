import { type AnySQLiteColumn, index, integer, primaryKey, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

const lifecycle = {
  status: text("status").notNull().default("draft"),
  publishedAt: integer("published_at"),
  archivedAt: integer("archived_at"),
  deletedAt: integer("deleted_at"),
  createdBy: text("created_by"),
  updatedBy: text("updated_by"),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
};

export const siteSettings = sqliteTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  isPrivate: integer("is_private", { mode: "boolean" }).notNull().default(false),
  updatedBy: text("updated_by"),
  updatedAt: integer("updated_at").notNull(),
});

export const adminUsers = sqliteTable("admin_users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  displayName: text("display_name"),
  role: text("role").notNull().default("editor"),
  status: text("status").notNull().default("active"),
  invitedBy: text("invited_by"),
  lastLoginAt: integer("last_login_at"),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
}, (t) => [uniqueIndex("admin_users_email_uq").on(t.email), index("admin_users_role_idx").on(t.role, t.status)]);

export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  parentId: text("parent_id").references((): AnySQLiteColumn => categories.id, { onDelete: "restrict" }),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  sortOrder: integer("sort_order").notNull().default(0),
  ...lifecycle,
}, (t) => [uniqueIndex("categories_slug_uq").on(t.slug), index("categories_parent_idx").on(t.parentId, t.sortOrder)]);

export const mediaAssets = sqliteTable("media_assets", {
  id: text("id").primaryKey(),
  kind: text("kind").notNull(),
  visibility: text("visibility").notNull().default("private"),
  objectKey: text("object_key").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  altText: text("alt_text"),
  caption: text("caption"),
  status: text("status").notNull().default("draft"),
  uploadedBy: text("uploaded_by"),
  deletedAt: integer("deleted_at"),
  createdAt: integer("created_at").notNull(),
});

export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  categoryId: text("category_id").notNull().references(() => categories.id, { onDelete: "restrict" }),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  sku: text("sku"),
  shortDescription: text("short_description"),
  overview: text("overview"),
  features: text("features"),
  applications: text("applications"),
  intendedUse: text("intended_use"),
  packaging: text("packaging"),
  customization: text("customization"),
  disclaimer: text("disclaimer"),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  ...lifecycle,
}, (t) => [uniqueIndex("products_slug_uq").on(t.slug), uniqueIndex("products_sku_uq").on(t.sku), index("products_public_idx").on(t.status, t.categoryId, t.publishedAt)]);

export const productSpecifications = sqliteTable("product_specifications", {
  id: text("id").primaryKey(),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  value: text("value").notNull(),
  verified: integer("verified", { mode: "boolean" }).notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: integer("created_at").notNull(),
});

export const productVariants = sqliteTable("product_variants", {
  id: text("id").primaryKey(),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  sku: text("sku"),
  details: text("details"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: integer("created_at").notNull(),
});

export const productMedia = sqliteTable("product_media", {
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  mediaId: text("media_id").notNull().references(() => mediaAssets.id, { onDelete: "restrict" }),
  sortOrder: integer("sort_order").notNull().default(0),
  isPrimary: integer("is_primary", { mode: "boolean" }).notNull().default(false),
}, (t) => [primaryKey({ columns: [t.productId, t.mediaId] })]);

export const relatedProducts = sqliteTable("related_products", {
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  relatedProductId: text("related_product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  sortOrder: integer("sort_order").notNull().default(0),
}, (t) => [primaryKey({ columns: [t.productId, t.relatedProductId] })]);

export const authors = sqliteTable("authors", {
  id: text("id").primaryKey(), name: text("name").notNull(), bio: text("bio"), createdAt: integer("created_at").notNull(),
});
export const blogCategories = sqliteTable("blog_categories", {
  id: text("id").primaryKey(), name: text("name").notNull(), slug: text("slug").notNull().unique(), createdAt: integer("created_at").notNull(),
});
export const blogPosts = sqliteTable("blog_posts", {
  id: text("id").primaryKey(),
  authorId: text("author_id").references(() => authors.id),
  categoryId: text("category_id").references(() => blogCategories.id),
  heroMediaId: text("hero_media_id").references(() => mediaAssets.id),
  title: text("title").notNull(), slug: text("slug").notNull().unique(), excerpt: text("excerpt"), body: text("body"),
  sources: text("sources"), updatedDate: integer("updated_date"), ...lifecycle,
});

export const galleryAlbums = sqliteTable("gallery_albums", {
  id: text("id").primaryKey(), name: text("name").notNull(), slug: text("slug").notNull().unique(),
  description: text("description"), eventDate: integer("event_date"), ...lifecycle,
});
export const galleryImages = sqliteTable("gallery_images", {
  id: text("id").primaryKey(),
  albumId: text("album_id").notNull().references(() => galleryAlbums.id, { onDelete: "cascade" }),
  mediaId: text("media_id").notNull().references(() => mediaAssets.id, { onDelete: "restrict" }),
  caption: text("caption"), altText: text("alt_text"), imageDate: integer("image_date"),
  sortOrder: integer("sort_order").notNull().default(0), createdAt: integer("created_at").notNull(),
});

export const jobs = sqliteTable("jobs", {
  id: text("id").primaryKey(), title: text("title").notNull(), slug: text("slug").notNull().unique(),
  department: text("department"), location: text("location"), employmentType: text("employment_type"),
  description: text("description"), requirements: text("requirements"), applicationInstructions: text("application_instructions"),
  closingDate: integer("closing_date"), ...lifecycle,
});
export const jobApplications = sqliteTable("job_applications", {
  id: text("id").primaryKey(), reference: text("reference").notNull().unique(),
  jobId: text("job_id").notNull().references(() => jobs.id, { onDelete: "restrict" }),
  fullName: text("full_name").notNull(), email: text("email").notNull(), phone: text("phone"), coverNote: text("cover_note"),
  resumeMediaId: text("resume_media_id").references(() => mediaAssets.id), consentAt: integer("consent_at").notNull(),
  status: text("status").notNull().default("new"), assignedTo: text("assigned_to"), deletedAt: integer("deleted_at"),
  createdAt: integer("created_at").notNull(), updatedAt: integer("updated_at").notNull(),
});

export const rfqs = sqliteTable("rfqs", {
  id: text("id").primaryKey(), reference: text("reference").notNull().unique(),
  fullName: text("full_name").notNull(), email: text("email").notNull(), company: text("company").notNull(),
  country: text("country").notNull(), phone: text("phone"), targetMarket: text("target_market"),
  requiredStandard: text("required_standard"), privateLabel: text("private_label"), packaging: text("packaging"),
  desiredDate: text("desired_date"), productsText: text("products_text"), message: text("message").notNull(), attachmentMediaId: text("attachment_media_id").references(() => mediaAssets.id),
  consentAt: integer("consent_at").notNull(), status: text("status").notNull().default("new"), assignedTo: text("assigned_to"),
  deletedAt: integer("deleted_at"), createdAt: integer("created_at").notNull(), updatedAt: integer("updated_at").notNull(),
});
export const rfqItems = sqliteTable("rfq_items", {
  id: text("id").primaryKey(), rfqId: text("rfq_id").notNull().references(() => rfqs.id, { onDelete: "cascade" }),
  productId: text("product_id").references(() => products.id), productName: text("product_name").notNull(),
  sku: text("sku"), quantity: integer("quantity").notNull(), notes: text("notes"), createdAt: integer("created_at").notNull(),
});
export const contactInquiries = sqliteTable("contact_inquiries", {
  id: text("id").primaryKey(), reference: text("reference").notNull().unique(),
  fullName: text("full_name").notNull(), email: text("email").notNull(), company: text("company"), country: text("country"),
  phone: text("phone"), subject: text("subject"), message: text("message").notNull(), consentAt: integer("consent_at").notNull(),
  status: text("status").notNull().default("new"), assignedTo: text("assigned_to"), deletedAt: integer("deleted_at"),
  createdAt: integer("created_at").notNull(), updatedAt: integer("updated_at").notNull(),
});

export const rfqBaskets = sqliteTable("rfq_baskets", {
  id: text("id").primaryKey(), expiresAt: integer("expires_at").notNull(), createdAt: integer("created_at").notNull(), updatedAt: integer("updated_at").notNull(),
});
export const rfqBasketItems = sqliteTable("rfq_basket_items", {
  id: text("id").primaryKey(), basketId: text("basket_id").notNull().references(() => rfqBaskets.id, { onDelete: "cascade" }),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull().default(1), notes: text("notes"), createdAt: integer("created_at").notNull(),
}, (t) => [uniqueIndex("rfq_basket_product_uq").on(t.basketId, t.productId)]);

export const verifiedTestimonials = sqliteTable("verified_testimonials", {
  id: text("id").primaryKey(), customerName: text("customer_name").notNull(), roleCompany: text("role_company"),
  country: text("country"), reviewText: text("review_text").notNull(), reviewDate: integer("review_date"),
  permissionStatus: text("permission_status").notNull().default("pending"),
  verificationStatus: text("verification_status").notNull().default("pending"),
  mediaId: text("media_id").references(() => mediaAssets.id), ...lifecycle,
});
export const certifications = sqliteTable("certifications", {
  id: text("id").primaryKey(), name: text("name").notNull(), issuer: text("issuer"), scope: text("scope"),
  certificateNumber: text("certificate_number"), validFrom: integer("valid_from"), validUntil: integer("valid_until"),
  evidenceMediaId: text("evidence_media_id").references(() => mediaAssets.id),
  verified: integer("verified", { mode: "boolean" }).notNull().default(false), ...lifecycle,
});

export const inquiryNotes = sqliteTable("inquiry_notes", {
  id: text("id").primaryKey(), inquiryType: text("inquiry_type").notNull(), inquiryId: text("inquiry_id").notNull(),
  note: text("note").notNull(), createdBy: text("created_by").notNull(), createdAt: integer("created_at").notNull(),
});
export const notificationOutbox = sqliteTable("notification_outbox", {
  id: text("id").primaryKey(), channel: text("channel").notNull(), recipient: text("recipient").notNull(),
  subject: text("subject").notNull(), payload: text("payload").notNull(), status: text("status").notNull().default("pending"),
  attempts: integer("attempts").notNull().default(0), lastError: text("last_error"), createdAt: integer("created_at").notNull(), sentAt: integer("sent_at"),
});
export const analyticsEvents = sqliteTable("analytics_events", {
  id: text("id").primaryKey(), eventName: text("event_name").notNull(), path: text("path").notNull(),
  anonymousId: text("anonymous_id"), referrerDomain: text("referrer_domain"), utmSource: text("utm_source"),
  utmMedium: text("utm_medium"), utmCampaign: text("utm_campaign"), country: text("country"), city: text("city"),
  deviceClass: text("device_class"), consentMode: text("consent_mode").notNull().default("cookieless"),
  isBot: integer("is_bot", { mode: "boolean" }).notNull().default(false), occurredAt: integer("occurred_at").notNull(),
}, (t) => [index("analytics_time_idx").on(t.occurredAt, t.eventName)]);
export const rateLimits = sqliteTable("rate_limits", {
  bucket: text("bucket").primaryKey(), count: integer("count").notNull(), resetAt: integer("reset_at").notNull(), updatedAt: integer("updated_at").notNull(),
});
export const retentionPolicies = sqliteTable("retention_policies", {
  recordType: text("record_type").primaryKey(), retentionDays: integer("retention_days").notNull(), mode: text("mode").notNull().default("disabled"), updatedAt: integer("updated_at").notNull(),
});
export const redirects = sqliteTable("redirects", {
  id: text("id").primaryKey(), sourcePath: text("source_path").notNull().unique(), destinationPath: text("destination_path").notNull(),
  statusCode: integer("status_code").notNull().default(301), active: integer("active", { mode: "boolean" }).notNull().default(true),
  createdBy: text("created_by"), createdAt: integer("created_at").notNull(),
});
export const seoMetadata = sqliteTable("seo_metadata", {
  id: text("id").primaryKey(), pagePath: text("page_path").notNull().unique(), title: text("title").notNull(),
  description: text("description").notNull(), ogTitle: text("og_title"), ogDescription: text("og_description"),
  ogMediaId: text("og_media_id").references(() => mediaAssets.id), noindex: integer("noindex", { mode: "boolean" }).notNull().default(false),
  ...lifecycle,
});
export const auditLogs = sqliteTable("audit_logs", {
  id: text("id").primaryKey(), actorEmail: text("actor_email").notNull(), action: text("action").notNull(),
  targetType: text("target_type").notNull(), targetId: text("target_id"), metadata: text("metadata"), createdAt: integer("created_at").notNull(),
}, (t) => [index("audit_time_idx").on(t.createdAt, t.actorEmail)]);
