CREATE TABLE `contactMessages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`email` varchar(320) NOT NULL,
	`subject` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`type` enum('avis','commentaire','demande','autre') NOT NULL DEFAULT 'autre',
	`status` enum('nouveau','lu','repondu','archive') NOT NULL DEFAULT 'nouveau',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contactMessages_id` PRIMARY KEY(`id`)
);
