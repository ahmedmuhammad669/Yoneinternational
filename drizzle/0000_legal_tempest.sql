CREATE TABLE `admin_users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`display_name` text,
	`role` text DEFAULT 'editor' NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`invited_by` text,
	`last_login_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `admin_users_email_uq` ON `admin_users` (`email`);--> statement-breakpoint
CREATE INDEX `admin_users_role_idx` ON `admin_users` (`role`,`status`);--> statement-breakpoint
CREATE TABLE `analytics_events` (
	`id` text PRIMARY KEY NOT NULL,
	`event_name` text NOT NULL,
	`path` text NOT NULL,
	`anonymous_id` text,
	`referrer_domain` text,
	`utm_source` text,
	`utm_medium` text,
	`utm_campaign` text,
	`country` text,
	`city` text,
	`device_class` text,
	`consent_mode` text DEFAULT 'cookieless' NOT NULL,
	`is_bot` integer DEFAULT false NOT NULL,
	`occurred_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `analytics_time_idx` ON `analytics_events` (`occurred_at`,`event_name`);--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`actor_email` text NOT NULL,
	`action` text NOT NULL,
	`target_type` text NOT NULL,
	`target_id` text,
	`metadata` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `audit_time_idx` ON `audit_logs` (`created_at`,`actor_email`);--> statement-breakpoint
CREATE TABLE `authors` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`bio` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `blog_categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `blog_categories_slug_unique` ON `blog_categories` (`slug`);--> statement-breakpoint
CREATE TABLE `blog_posts` (
	`id` text PRIMARY KEY NOT NULL,
	`author_id` text,
	`category_id` text,
	`hero_media_id` text,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`excerpt` text,
	`body` text,
	`sources` text,
	`updated_date` integer,
	`status` text DEFAULT 'draft' NOT NULL,
	`published_at` integer,
	`archived_at` integer,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`author_id`) REFERENCES `authors`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`category_id`) REFERENCES `blog_categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`hero_media_id`) REFERENCES `media_assets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `blog_posts_slug_unique` ON `blog_posts` (`slug`);--> statement-breakpoint
CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`parent_id` text,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`published_at` integer,
	`archived_at` integer,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`parent_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_slug_uq` ON `categories` (`slug`);--> statement-breakpoint
CREATE INDEX `categories_parent_idx` ON `categories` (`parent_id`,`sort_order`);--> statement-breakpoint
CREATE TABLE `certifications` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`issuer` text,
	`scope` text,
	`certificate_number` text,
	`valid_from` integer,
	`valid_until` integer,
	`evidence_media_id` text,
	`verified` integer DEFAULT false NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`published_at` integer,
	`archived_at` integer,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`evidence_media_id`) REFERENCES `media_assets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `contact_inquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`reference` text NOT NULL,
	`full_name` text NOT NULL,
	`email` text NOT NULL,
	`company` text,
	`country` text,
	`phone` text,
	`subject` text,
	`message` text NOT NULL,
	`consent_at` integer NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`assigned_to` text,
	`deleted_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `contact_inquiries_reference_unique` ON `contact_inquiries` (`reference`);--> statement-breakpoint
CREATE TABLE `gallery_albums` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`event_date` integer,
	`status` text DEFAULT 'draft' NOT NULL,
	`published_at` integer,
	`archived_at` integer,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `gallery_albums_slug_unique` ON `gallery_albums` (`slug`);--> statement-breakpoint
CREATE TABLE `gallery_images` (
	`id` text PRIMARY KEY NOT NULL,
	`album_id` text NOT NULL,
	`media_id` text NOT NULL,
	`caption` text,
	`alt_text` text,
	`image_date` integer,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`album_id`) REFERENCES `gallery_albums`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`media_id`) REFERENCES `media_assets`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `inquiry_notes` (
	`id` text PRIMARY KEY NOT NULL,
	`inquiry_type` text NOT NULL,
	`inquiry_id` text NOT NULL,
	`note` text NOT NULL,
	`created_by` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `job_applications` (
	`id` text PRIMARY KEY NOT NULL,
	`reference` text NOT NULL,
	`job_id` text NOT NULL,
	`full_name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`cover_note` text,
	`resume_media_id` text,
	`consent_at` integer NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`assigned_to` text,
	`deleted_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`job_id`) REFERENCES `jobs`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`resume_media_id`) REFERENCES `media_assets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `job_applications_reference_unique` ON `job_applications` (`reference`);--> statement-breakpoint
CREATE TABLE `jobs` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`department` text,
	`location` text,
	`employment_type` text,
	`description` text,
	`requirements` text,
	`application_instructions` text,
	`closing_date` integer,
	`status` text DEFAULT 'draft' NOT NULL,
	`published_at` integer,
	`archived_at` integer,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `jobs_slug_unique` ON `jobs` (`slug`);--> statement-breakpoint
CREATE TABLE `media_assets` (
	`id` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`visibility` text DEFAULT 'private' NOT NULL,
	`object_key` text NOT NULL,
	`original_name` text NOT NULL,
	`mime_type` text NOT NULL,
	`size_bytes` integer NOT NULL,
	`alt_text` text,
	`caption` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`uploaded_by` text,
	`deleted_at` integer,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `notification_outbox` (
	`id` text PRIMARY KEY NOT NULL,
	`channel` text NOT NULL,
	`recipient` text NOT NULL,
	`subject` text NOT NULL,
	`payload` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL,
	`last_error` text,
	`created_at` integer NOT NULL,
	`sent_at` integer
);
--> statement-breakpoint
CREATE TABLE `product_media` (
	`product_id` text NOT NULL,
	`media_id` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`is_primary` integer DEFAULT false NOT NULL,
	PRIMARY KEY(`product_id`, `media_id`),
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`media_id`) REFERENCES `media_assets`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `product_specifications` (
	`id` text PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`label` text NOT NULL,
	`value` text NOT NULL,
	`verified` integer DEFAULT false NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `product_variants` (
	`id` text PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`name` text NOT NULL,
	`sku` text,
	`details` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`category_id` text NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`sku` text,
	`short_description` text,
	`overview` text,
	`features` text,
	`applications` text,
	`intended_use` text,
	`packaging` text,
	`customization` text,
	`disclaimer` text,
	`featured` integer DEFAULT false NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`published_at` integer,
	`archived_at` integer,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE UNIQUE INDEX `products_slug_uq` ON `products` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `products_sku_uq` ON `products` (`sku`);--> statement-breakpoint
CREATE INDEX `products_public_idx` ON `products` (`status`,`category_id`,`published_at`);--> statement-breakpoint
CREATE TABLE `rate_limits` (
	`bucket` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL,
	`reset_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `redirects` (
	`id` text PRIMARY KEY NOT NULL,
	`source_path` text NOT NULL,
	`destination_path` text NOT NULL,
	`status_code` integer DEFAULT 301 NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`created_by` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `redirects_source_path_unique` ON `redirects` (`source_path`);--> statement-breakpoint
CREATE TABLE `related_products` (
	`product_id` text NOT NULL,
	`related_product_id` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`product_id`, `related_product_id`),
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`related_product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `retention_policies` (
	`record_type` text PRIMARY KEY NOT NULL,
	`retention_days` integer NOT NULL,
	`mode` text DEFAULT 'disabled' NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `rfq_basket_items` (
	`id` text PRIMARY KEY NOT NULL,
	`basket_id` text NOT NULL,
	`product_id` text NOT NULL,
	`quantity` integer DEFAULT 1 NOT NULL,
	`notes` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`basket_id`) REFERENCES `rfq_baskets`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `rfq_basket_product_uq` ON `rfq_basket_items` (`basket_id`,`product_id`);--> statement-breakpoint
CREATE TABLE `rfq_baskets` (
	`id` text PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `rfq_items` (
	`id` text PRIMARY KEY NOT NULL,
	`rfq_id` text NOT NULL,
	`product_id` text,
	`product_name` text NOT NULL,
	`sku` text,
	`quantity` integer NOT NULL,
	`notes` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`rfq_id`) REFERENCES `rfqs`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `rfqs` (
	`id` text PRIMARY KEY NOT NULL,
	`reference` text NOT NULL,
	`full_name` text NOT NULL,
	`email` text NOT NULL,
	`company` text NOT NULL,
	`country` text NOT NULL,
	`phone` text,
	`target_market` text,
	`required_standard` text,
	`private_label` text,
	`packaging` text,
	`desired_date` text,
	`message` text NOT NULL,
	`attachment_media_id` text,
	`consent_at` integer NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`assigned_to` text,
	`deleted_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`attachment_media_id`) REFERENCES `media_assets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `rfqs_reference_unique` ON `rfqs` (`reference`);--> statement-breakpoint
CREATE TABLE `site_settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`is_private` integer DEFAULT false NOT NULL,
	`updated_by` text,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `verified_testimonials` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_name` text NOT NULL,
	`role_company` text,
	`country` text,
	`review_text` text NOT NULL,
	`review_date` integer,
	`permission_status` text DEFAULT 'pending' NOT NULL,
	`verification_status` text DEFAULT 'pending' NOT NULL,
	`media_id` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`published_at` integer,
	`archived_at` integer,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`media_id`) REFERENCES `media_assets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `categories` (`id`,`parent_id`,`name`,`slug`,`description`,`sort_order`,`status`,`published_at`,`created_by`,`updated_by`,`created_at`,`updated_at`) VALUES
('cat_dental',NULL,'Dental Instruments','dental','Precision instruments for dental examination, treatment and specialist requirements.',10,'published',unixepoch(),'system-seed','system-seed',unixepoch(),unixepoch()),
('cat_beauty',NULL,'Beauty Instruments','beauty','Professional beauty and salon instruments for controlled, repeatable handling.',20,'published',unixepoch(),'system-seed','system-seed',unixepoch(),unixepoch()),
('cat_surgical',NULL,'Surgical Instruments','surgical','Surgical and general precision instrument manufacturing categories.',30,'published',unixepoch(),'system-seed','system-seed',unixepoch(),unixepoch()),
('cat_other',NULL,'Other Instruments','other','Administrator-created and future precision instrument ranges.',40,'published',unixepoch(),'system-seed','system-seed',unixepoch(),unixepoch());
--> statement-breakpoint
INSERT INTO `site_settings` (`key`,`value`,`is_private`,`updated_by`,`updated_at`) VALUES
('email','yoneinternational@gmail.com',0,'system-seed',unixepoch()),
('phone_display','+92 317 7374411',0,'system-seed',unixepoch()),
('phone_href','tel:+923177374411',0,'system-seed',unixepoch()),
('whatsapp_display','+92 344 8416718',0,'system-seed',unixepoch()),
('whatsapp_href','https://wa.me/923448416718',0,'system-seed',unixepoch()),
('address','Head Marala Road, Machi Khokhar, Sialkot, Pakistan',0,'system-seed',unixepoch()),
('instagram','https://www.instagram.com/yoneinternational/',0,'system-seed',unixepoch()),
('linkedin','https://www.linkedin.com/company/yoneinternational/',0,'system-seed',unixepoch()),
('facebook','https://www.facebook.com/share/1EfGmSE4T1/',0,'system-seed',unixepoch()),
('notification_email','yoneinternational@gmail.com',1,'system-seed',unixepoch());
--> statement-breakpoint
INSERT INTO `authors` (`id`,`name`,`bio`,`created_at`) VALUES ('author_yone','Yone International Editorial Team',NULL,unixepoch());
--> statement-breakpoint
INSERT INTO `blog_categories` (`id`,`name`,`slug`,`created_at`) VALUES ('blog_company','Company Updates','company-updates',unixepoch());
--> statement-breakpoint
INSERT INTO `certifications` (`id`,`name`,`verified`,`status`,`created_by`,`updated_by`,`created_at`,`updated_at`) VALUES
('cert_iso13485_draft','ISO 13485',0,'draft','system-seed','system-seed',unixepoch(),unixepoch()),
('cert_ce_draft','CE documentation',0,'draft','system-seed','system-seed',unixepoch(),unixepoch());
--> statement-breakpoint
INSERT INTO `retention_policies` (`record_type`,`retention_days`,`mode`,`updated_at`) VALUES
('rfqs',730,'disabled',unixepoch()),('contacts',730,'disabled',unixepoch()),('applications',365,'disabled',unixepoch()),('analytics',395,'disabled',unixepoch());
