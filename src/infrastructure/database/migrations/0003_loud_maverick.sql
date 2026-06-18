CREATE TABLE `anime_ratings` (
	`user_id` text NOT NULL,
	`anime_id` text NOT NULL,
	`rating` integer NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	PRIMARY KEY(`user_id`, `anime_id`),
	FOREIGN KEY (`user_id`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`anime_id`) REFERENCES `anime`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `anime` ADD `bayesian_rating` real DEFAULT 0;--> statement-breakpoint
ALTER TABLE `anime` ADD `trending_score` real DEFAULT 0;--> statement-breakpoint
ALTER TABLE `anime` ADD `voter_count` integer DEFAULT 0;