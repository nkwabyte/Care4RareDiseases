CREATE TABLE `audit_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`at` text NOT NULL,
	`user_id` integer,
	`action` text NOT NULL,
	`patient_id` text,
	`outcome` text NOT NULL,
	`detail` text,
	`ip` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `audit_at_idx` ON `audit_events` (`at`);--> statement-breakpoint
CREATE INDEX `audit_user_idx` ON `audit_events` (`user_id`);--> statement-breakpoint
CREATE INDEX `audit_patient_idx` ON `audit_events` (`patient_id`);