DROP TABLE `doctors`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_doctor_patient_assignments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`doctor_id` integer NOT NULL,
	`patient_id` text NOT NULL,
	`assigned_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`doctor_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_doctor_patient_assignments`("id", "doctor_id", "patient_id", "assigned_at") SELECT "id", "doctor_id", "patient_id", "assigned_at" FROM `doctor_patient_assignments`;--> statement-breakpoint
DROP TABLE `doctor_patient_assignments`;--> statement-breakpoint
ALTER TABLE `__new_doctor_patient_assignments` RENAME TO `doctor_patient_assignments`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `assignment_clinician_patient_uq` ON `doctor_patient_assignments` (`doctor_id`,`patient_id`);--> statement-breakpoint
CREATE TABLE `__new_sessions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`token_hash` text NOT NULL,
	`expires_at` text NOT NULL,
	`last_seen_at` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_sessions`("id", "user_id", "token_hash", "expires_at", "last_seen_at", "created_at") SELECT "id", "user_id", "token_hash", "expires_at", "last_seen_at", "created_at" FROM `sessions`;--> statement-breakpoint
DROP TABLE `sessions`;--> statement-breakpoint
ALTER TABLE `__new_sessions` RENAME TO `sessions`;--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_token_hash_unique` ON `sessions` (`token_hash`);--> statement-breakpoint
CREATE INDEX `sessions_user_idx` ON `sessions` (`user_id`);