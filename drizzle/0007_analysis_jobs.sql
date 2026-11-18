CREATE TABLE `analysis_jobs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`patient_id` text NOT NULL,
	`requested_by` integer,
	`engine` text NOT NULL,
	`status` text NOT NULL,
	`started_at` text NOT NULL,
	`expected_duration_ms` integer NOT NULL,
	`finished_at` text,
	`error` text,
	`result` text,
	FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`requested_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `analysis_jobs_patient_idx` ON `analysis_jobs` (`patient_id`);--> statement-breakpoint
CREATE INDEX `analysis_jobs_status_idx` ON `analysis_jobs` (`status`);