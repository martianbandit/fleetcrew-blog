import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Categories for blog articles
 */
export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  icon: varchar("icon", { length: 50 }),
  color: varchar("color", { length: 20 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

/**
 * Tags for article discovery
 */
export const tags = mysqlTable("tags", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  slug: varchar("slug", { length: 50 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Tag = typeof tags.$inferSelect;
export type InsertTag = typeof tags.$inferInsert;

/**
 * Blog articles
 */
export const articles = mysqlTable("articles", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  coverImage: varchar("coverImage", { length: 500 }),
  categoryId: int("categoryId").notNull(),
  authorId: int("authorId").notNull(),
  status: mysqlEnum("status", ["draft", "published", "archived"]).default("draft").notNull(),
  featured: boolean("featured").default(false).notNull(),
  readTime: int("readTime").default(5),
  viewCount: int("viewCount").default(0).notNull(),
  likeCount: int("likeCount").default(0).notNull(),
  publishedAt: timestamp("publishedAt"),
  scheduledAt: timestamp("scheduledAt"), // For scheduled publishing
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Article = typeof articles.$inferSelect;
export type InsertArticle = typeof articles.$inferInsert;

/**
 * Article-Tag relationship (many-to-many)
 */
export const articleTags = mysqlTable("articleTags", {
  id: int("id").autoincrement().primaryKey(),
  articleId: int("articleId").notNull(),
  tagId: int("tagId").notNull(),
});

export type ArticleTag = typeof articleTags.$inferSelect;
export type InsertArticleTag = typeof articleTags.$inferInsert;

/**
 * Newsletter subscribers
 */
export const newsletterSubscribers = mysqlTable("newsletterSubscribers", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 100 }),
  isActive: boolean("isActive").default(true).notNull(),
  subscribedAt: timestamp("subscribedAt").defaultNow().notNull(),
  unsubscribedAt: timestamp("unsubscribedAt"),
});

export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type InsertNewsletterSubscriber = typeof newsletterSubscribers.$inferInsert;

/**
 * Contact messages from visitors
 */
export const contactMessages = mysqlTable("contactMessages", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  type: mysqlEnum("type", ["avis", "commentaire", "demande", "autre"]).default("autre").notNull(),
  status: mysqlEnum("status", ["nouveau", "lu", "repondu", "archive"]).default("nouveau").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = typeof contactMessages.$inferInsert;

/**
 * Article views tracking for analytics
 */
export const articleViews = mysqlTable("articleViews", {
  id: int("id").autoincrement().primaryKey(),
  articleId: int("articleId").notNull(),
  visitorId: varchar("visitorId", { length: 64 }), // Anonymous visitor ID
  userId: int("userId"), // Logged in user (optional)
  ipHash: varchar("ipHash", { length: 64 }), // Hashed IP for uniqueness
  userAgent: varchar("userAgent", { length: 500 }),
  referrer: varchar("referrer", { length: 500 }),
  readTime: int("readTime").default(0), // Time spent reading in seconds
  scrollDepth: int("scrollDepth").default(0), // Percentage scrolled (0-100)
  viewedAt: timestamp("viewedAt").defaultNow().notNull(),
});

export type ArticleView = typeof articleViews.$inferSelect;
export type InsertArticleView = typeof articleViews.$inferInsert;

/**
 * Article likes
 */
export const articleLikes = mysqlTable("articleLikes", {
  id: int("id").autoincrement().primaryKey(),
  articleId: int("articleId").notNull(),
  visitorId: varchar("visitorId", { length: 64 }),
  userId: int("userId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ArticleLike = typeof articleLikes.$inferSelect;
export type InsertArticleLike = typeof articleLikes.$inferInsert;
