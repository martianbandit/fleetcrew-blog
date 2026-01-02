import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import * as db from "./db";

// Admin procedure - only allows admin users
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // Categories router
  categories: router({
    list: publicProcedure.query(async () => {
      return db.getAllCategories();
    }),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return db.getCategoryBySlug(input.slug);
      }),
    
    create: adminProcedure
      .input(z.object({
        name: z.string().min(1).max(100),
        slug: z.string().min(1).max(100),
        description: z.string().optional(),
        icon: z.string().optional(),
        color: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.createCategory(input);
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().min(1).max(100).optional(),
        description: z.string().optional(),
        icon: z.string().optional(),
        color: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateCategory(id, data);
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteCategory(input.id);
        return { success: true };
      }),
  }),

  // Tags router
  tags: router({
    list: publicProcedure.query(async () => {
      return db.getAllTags();
    }),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return db.getTagBySlug(input.slug);
      }),
    
    create: adminProcedure
      .input(z.object({
        name: z.string().min(1).max(50),
        slug: z.string().min(1).max(50),
      }))
      .mutation(async ({ input }) => {
        return db.createTag(input);
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteTag(input.id);
        return { success: true };
      }),
  }),

  // Articles router
  articles: router({
    list: publicProcedure
      .input(z.object({
        categoryId: z.number().optional(),
        search: z.string().optional(),
        tagId: z.number().optional(),
        limit: z.number().min(1).max(50).default(10),
        offset: z.number().min(0).default(0),
      }).optional())
      .query(async ({ input }) => {
        return db.getPublishedArticles(input);
      }),
    
    featured: publicProcedure
      .input(z.object({ limit: z.number().min(1).max(10).default(3) }).optional())
      .query(async ({ input }) => {
        return db.getFeaturedArticles(input?.limit ?? 3);
      }),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const article = await db.getArticleBySlug(input.slug);
        if (!article) return null;
        
        const articleTags = await db.getArticleTags(article.id);
        const category = await db.getCategoryBySlug(
          (await db.getAllCategories()).find(c => c.id === article.categoryId)?.slug ?? ''
        );
        const author = await db.getUserById(article.authorId);
        
        return {
          ...article,
          tags: articleTags,
          category,
          author: author ? { id: author.id, name: author.name } : null,
        };
      }),
    
    getByTag: publicProcedure
      .input(z.object({ tagId: z.number() }))
      .query(async ({ input }) => {
        return db.getArticlesByTag(input.tagId);
      }),
    
    // Admin routes
    listAll: adminProcedure
      .input(z.object({ status: z.enum(['draft', 'published', 'archived']).optional() }).optional())
      .query(async ({ input }) => {
        return db.getAllArticles(input);
      }),
    
    getById: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const article = await db.getArticleById(input.id);
        if (!article) return null;
        
        const articleTags = await db.getArticleTags(article.id);
        return { ...article, tags: articleTags };
      }),
    
    create: adminProcedure
      .input(z.object({
        title: z.string().min(1).max(255),
        slug: z.string().min(1).max(255),
        excerpt: z.string().optional(),
        content: z.string().min(1),
        coverImage: z.string().optional(),
        categoryId: z.number(),
        status: z.enum(['draft', 'published', 'archived']).default('draft'),
        featured: z.boolean().default(false),
        readTime: z.number().optional(),
        tagIds: z.array(z.number()).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { tagIds, ...articleData } = input;
        
        const article = await db.createArticle({
          ...articleData,
          authorId: ctx.user.id,
          publishedAt: input.status === 'published' ? new Date() : null,
        });
        
        if (article && tagIds && tagIds.length > 0) {
          await db.setArticleTags(article.id, tagIds);
        }
        
        return article;
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1).max(255).optional(),
        slug: z.string().min(1).max(255).optional(),
        excerpt: z.string().optional(),
        content: z.string().optional(),
        coverImage: z.string().optional(),
        categoryId: z.number().optional(),
        status: z.enum(['draft', 'published', 'archived']).optional(),
        featured: z.boolean().optional(),
        readTime: z.number().optional(),
        tagIds: z.array(z.number()).optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, tagIds, ...data } = input;
        
        // If publishing for the first time, set publishedAt
        if (data.status === 'published') {
          const existing = await db.getArticleById(id);
          if (existing && !existing.publishedAt) {
            (data as any).publishedAt = new Date();
          }
        }
        
        const article = await db.updateArticle(id, data);
        
        if (tagIds !== undefined) {
          await db.setArticleTags(id, tagIds);
        }
        
        return article;
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteArticle(input.id);
        return { success: true };
      }),
  }),

  // Newsletter router
  newsletter: router({
    subscribe: publicProcedure
      .input(z.object({
        email: z.string().email(),
        name: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.subscribeToNewsletter(input.email, input.name);
        return { success: true, message: 'Inscription réussie!' };
      }),
    
    unsubscribe: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input }) => {
        await db.unsubscribeFromNewsletter(input.email);
        return { success: true, message: 'Désinscription réussie.' };
      }),
    
    // Admin routes
    listSubscribers: adminProcedure
      .input(z.object({ activeOnly: z.boolean().default(true) }).optional())
      .query(async ({ input }) => {
        return db.getAllSubscribers(input?.activeOnly ?? true);
      }),
    
    count: adminProcedure.query(async () => {
      return db.getSubscriberCount();
    }),
  }),
});

export type AppRouter = typeof appRouter;
