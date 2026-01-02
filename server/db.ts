import { eq, desc, and, like, inArray, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  categories, InsertCategory, Category,
  tags, InsertTag, Tag,
  articles, InsertArticle, Article,
  articleTags, InsertArticleTag,
  newsletterSubscribers, InsertNewsletterSubscriber,
  contactMessages, InsertContactMessage, ContactMessage,
  articleViews, InsertArticleView, ArticleView,
  articleLikes, InsertArticleLike, ArticleLike
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ==================== USER QUERIES ====================

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ==================== CATEGORY QUERIES ====================

export async function getAllCategories() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(categories).orderBy(categories.name);
}

export async function getCategoryBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createCategory(data: InsertCategory) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(categories).values(data);
  return getCategoryBySlug(data.slug);
}

export async function updateCategory(id: number, data: Partial<InsertCategory>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(categories).set(data).where(eq(categories.id, id));
  const result = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function deleteCategory(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(categories).where(eq(categories.id, id));
}

// ==================== TAG QUERIES ====================

export async function getAllTags() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(tags).orderBy(tags.name);
}

export async function getTagBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(tags).where(eq(tags.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createTag(data: InsertTag) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(tags).values(data);
  return getTagBySlug(data.slug);
}

export async function getOrCreateTag(name: string) {
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const existing = await getTagBySlug(slug);
  if (existing) return existing;
  return createTag({ name, slug });
}

export async function deleteTag(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(articleTags).where(eq(articleTags.tagId, id));
  await db.delete(tags).where(eq(tags.id, id));
}

// ==================== ARTICLE QUERIES ====================

export async function getPublishedArticles(options?: {
  categoryId?: number;
  search?: string;
  tagId?: number;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [eq(articles.status, 'published')];
  
  if (options?.categoryId) {
    conditions.push(eq(articles.categoryId, options.categoryId));
  }
  
  if (options?.search) {
    conditions.push(like(articles.title, `%${options.search}%`));
  }

  let query = db.select().from(articles)
    .where(and(...conditions))
    .orderBy(desc(articles.publishedAt));

  if (options?.limit) {
    query = query.limit(options.limit) as typeof query;
  }
  if (options?.offset) {
    query = query.offset(options.offset) as typeof query;
  }

  return query;
}

export async function getFeaturedArticles(limit = 3) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(articles)
    .where(and(eq(articles.status, 'published'), eq(articles.featured, true)))
    .orderBy(desc(articles.publishedAt))
    .limit(limit);
}

export async function getArticleBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(articles).where(eq(articles.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getArticleById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllArticles(options?: { status?: 'draft' | 'published' | 'archived' }) {
  const db = await getDb();
  if (!db) return [];
  
  if (options?.status) {
    return db.select().from(articles)
      .where(eq(articles.status, options.status))
      .orderBy(desc(articles.createdAt));
  }
  
  return db.select().from(articles).orderBy(desc(articles.createdAt));
}

export async function createArticle(data: InsertArticle) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(articles).values(data);
  const insertId = result[0].insertId;
  return getArticleById(insertId);
}

export async function updateArticle(id: number, data: Partial<InsertArticle>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(articles).set(data).where(eq(articles.id, id));
  return getArticleById(id);
}

export async function deleteArticle(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(articleTags).where(eq(articleTags.articleId, id));
  await db.delete(articles).where(eq(articles.id, id));
}

// ==================== ARTICLE-TAG QUERIES ====================

export async function getArticleTags(articleId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select({
    tag: tags
  }).from(articleTags)
    .innerJoin(tags, eq(articleTags.tagId, tags.id))
    .where(eq(articleTags.articleId, articleId));
  
  return result.map(r => r.tag);
}

export async function setArticleTags(articleId: number, tagIds: number[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(articleTags).where(eq(articleTags.articleId, articleId));
  
  if (tagIds.length > 0) {
    await db.insert(articleTags).values(
      tagIds.map(tagId => ({ articleId, tagId }))
    );
  }
}

export async function getArticlesByTag(tagId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const articleIds = await db.select({ articleId: articleTags.articleId })
    .from(articleTags)
    .where(eq(articleTags.tagId, tagId));
  
  if (articleIds.length === 0) return [];
  
  return db.select().from(articles)
    .where(and(
      eq(articles.status, 'published'),
      inArray(articles.id, articleIds.map(a => a.articleId))
    ))
    .orderBy(desc(articles.publishedAt));
}

// ==================== NEWSLETTER QUERIES ====================

export async function subscribeToNewsletter(email: string, name?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await db.select().from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.email, email)).limit(1);
  
  if (existing.length > 0) {
    if (!existing[0].isActive) {
      await db.update(newsletterSubscribers)
        .set({ isActive: true, unsubscribedAt: null })
        .where(eq(newsletterSubscribers.email, email));
    }
    return existing[0];
  }
  
  await db.insert(newsletterSubscribers).values({ email, name });
  const result = await db.select().from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.email, email)).limit(1);
  return result[0];
}

export async function unsubscribeFromNewsletter(email: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(newsletterSubscribers)
    .set({ isActive: false, unsubscribedAt: new Date() })
    .where(eq(newsletterSubscribers.email, email));
}

export async function getAllSubscribers(activeOnly = true) {
  const db = await getDb();
  if (!db) return [];
  
  if (activeOnly) {
    return db.select().from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.isActive, true))
      .orderBy(desc(newsletterSubscribers.subscribedAt));
  }
  
  return db.select().from(newsletterSubscribers)
    .orderBy(desc(newsletterSubscribers.subscribedAt));
}

export async function getSubscriberCount() {
  const db = await getDb();
  if (!db) return 0;
  
  const result = await db.select({ count: sql<number>`count(*)` })
    .from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.isActive, true));
  
  return result[0]?.count ?? 0;
}

// ==================== CONTACT MESSAGE QUERIES ====================

export async function createContactMessage(data: InsertContactMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(contactMessages).values(data);
  const insertId = result[0].insertId;
  const message = await db.select().from(contactMessages).where(eq(contactMessages.id, insertId)).limit(1);
  return message[0];
}

export async function getAllContactMessages(options?: { status?: 'nouveau' | 'lu' | 'repondu' | 'archive' }) {
  const db = await getDb();
  if (!db) return [];
  
  if (options?.status) {
    return db.select().from(contactMessages)
      .where(eq(contactMessages.status, options.status))
      .orderBy(desc(contactMessages.createdAt));
  }
  
  return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
}

export async function updateContactMessageStatus(id: number, status: 'nouveau' | 'lu' | 'repondu' | 'archive') {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(contactMessages).set({ status }).where(eq(contactMessages.id, id));
}

export async function getNewContactMessagesCount() {
  const db = await getDb();
  if (!db) return 0;
  
  const result = await db.select({ count: sql<number>`count(*)` })
    .from(contactMessages)
    .where(eq(contactMessages.status, 'nouveau'));
  
  return result[0]?.count ?? 0;
}

// ==================== ARTICLE ANALYTICS QUERIES ====================

export async function recordArticleView(data: InsertArticleView) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Insert view record
  await db.insert(articleViews).values(data);
  
  // Increment view count on article
  await db.update(articles)
    .set({ viewCount: sql`${articles.viewCount} + 1` })
    .where(eq(articles.id, data.articleId));
}

export async function getArticleViewCount(articleId: number) {
  const db = await getDb();
  if (!db) return 0;
  
  const result = await db.select({ count: sql<number>`count(*)` })
    .from(articleViews)
    .where(eq(articleViews.articleId, articleId));
  
  return result[0]?.count ?? 0;
}

export async function getArticleStats(articleId: number) {
  const db = await getDb();
  if (!db) return { views: 0, avgReadTime: 0, avgScrollDepth: 0 };
  
  const result = await db.select({
    views: sql<number>`count(*)`,
    avgReadTime: sql<number>`COALESCE(AVG(${articleViews.readTime}), 0)`,
    avgScrollDepth: sql<number>`COALESCE(AVG(${articleViews.scrollDepth}), 0)`,
  }).from(articleViews)
    .where(eq(articleViews.articleId, articleId));
  
  return {
    views: result[0]?.views ?? 0,
    avgReadTime: Math.round(result[0]?.avgReadTime ?? 0),
    avgScrollDepth: Math.round(result[0]?.avgScrollDepth ?? 0),
  };
}

export async function updateArticleReadProgress(viewId: number, readTime: number, scrollDepth: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(articleViews)
    .set({ readTime, scrollDepth })
    .where(eq(articleViews.id, viewId));
}

export async function toggleArticleLike(articleId: number, visitorId: string, userId?: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Check if already liked
  const existing = await db.select().from(articleLikes)
    .where(and(
      eq(articleLikes.articleId, articleId),
      eq(articleLikes.visitorId, visitorId)
    )).limit(1);
  
  if (existing.length > 0) {
    // Unlike
    await db.delete(articleLikes).where(eq(articleLikes.id, existing[0].id));
    await db.update(articles)
      .set({ likeCount: sql`GREATEST(${articles.likeCount} - 1, 0)` })
      .where(eq(articles.id, articleId));
    return { liked: false };
  } else {
    // Like
    await db.insert(articleLikes).values({ articleId, visitorId, userId });
    await db.update(articles)
      .set({ likeCount: sql`${articles.likeCount} + 1` })
      .where(eq(articles.id, articleId));
    return { liked: true };
  }
}

export async function hasUserLikedArticle(articleId: number, visitorId: string) {
  const db = await getDb();
  if (!db) return false;
  
  const result = await db.select().from(articleLikes)
    .where(and(
      eq(articleLikes.articleId, articleId),
      eq(articleLikes.visitorId, visitorId)
    )).limit(1);
  
  return result.length > 0;
}

export async function getPopularArticles(limit = 5) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(articles)
    .where(eq(articles.status, 'published'))
    .orderBy(desc(articles.viewCount))
    .limit(limit);
}

export async function getGlobalStats() {
  const db = await getDb();
  if (!db) return { totalViews: 0, totalLikes: 0, totalArticles: 0, totalSubscribers: 0 };
  
  const [viewsResult, likesResult, articlesResult, subscribersResult] = await Promise.all([
    db.select({ total: sql<number>`COALESCE(SUM(${articles.viewCount}), 0)` }).from(articles),
    db.select({ total: sql<number>`COALESCE(SUM(${articles.likeCount}), 0)` }).from(articles),
    db.select({ total: sql<number>`count(*)` }).from(articles).where(eq(articles.status, 'published')),
    db.select({ total: sql<number>`count(*)` }).from(newsletterSubscribers).where(eq(newsletterSubscribers.isActive, true)),
  ]);
  
  return {
    totalViews: viewsResult[0]?.total ?? 0,
    totalLikes: likesResult[0]?.total ?? 0,
    totalArticles: articlesResult[0]?.total ?? 0,
    totalSubscribers: subscribersResult[0]?.total ?? 0,
  };
}

export async function getViewsOverTime(days = 30) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select({
    date: sql<string>`DATE(${articleViews.viewedAt})`,
    views: sql<number>`count(*)`,
  }).from(articleViews)
    .where(sql`${articleViews.viewedAt} >= DATE_SUB(NOW(), INTERVAL ${days} DAY)`)
    .groupBy(sql`DATE(${articleViews.viewedAt})`)
    .orderBy(sql`DATE(${articleViews.viewedAt})`);
  
  return result;
}

// ==================== RSS FEED QUERIES ====================

export async function getArticlesForRSS(limit = 20) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select({
    id: articles.id,
    title: articles.title,
    slug: articles.slug,
    excerpt: articles.excerpt,
    content: articles.content,
    publishedAt: articles.publishedAt,
    authorId: articles.authorId,
  }).from(articles)
    .where(eq(articles.status, 'published'))
    .orderBy(desc(articles.publishedAt))
    .limit(limit);
}
