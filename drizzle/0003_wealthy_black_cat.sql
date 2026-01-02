CREATE TABLE `articleLikes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`articleId` int NOT NULL,
	`visitorId` varchar(64),
	`userId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `articleLikes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `articleViews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`articleId` int NOT NULL,
	`visitorId` varchar(64),
	`userId` int,
	`ipHash` varchar(64),
	`userAgent` varchar(500),
	`referrer` varchar(500),
	`readTime` int DEFAULT 0,
	`scrollDepth` int DEFAULT 0,
	`viewedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `articleViews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `articles` ADD `viewCount` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `articles` ADD `likeCount` int DEFAULT 0 NOT NULL;