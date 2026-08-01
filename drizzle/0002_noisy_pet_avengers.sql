CREATE TABLE `seo_metadata` (
	`id` text PRIMARY KEY NOT NULL,
	`page_path` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`og_title` text,
	`og_description` text,
	`og_media_id` text,
	`noindex` integer DEFAULT false NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`published_at` integer,
	`archived_at` integer,
	`deleted_at` integer,
	`created_by` text,
	`updated_by` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`og_media_id`) REFERENCES `media_assets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `seo_metadata_page_path_unique` ON `seo_metadata` (`page_path`);