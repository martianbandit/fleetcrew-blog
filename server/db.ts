import { eq, desc, and, like, inArray, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  categories, InsertCategory, Category,
  tags, InsertTag, Tag,
  articles, InsertArticle, Article,
  articleTags, InsertArticleTag,
  newsletterSubscribers, InsertNewsletterSubscriber
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
