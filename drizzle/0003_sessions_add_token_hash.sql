ALTER TABLE `sessions` ADD `token_hash` text NOT NULL;--> statement-breakpoint
ALTER TABLE `sessions` ADD `last_seen_at` text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_token_hash_unique` ON `sessions` (`token_hash`);