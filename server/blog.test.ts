import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock database functions
vi.mock("./db", () => ({
  getAllCategories: vi.fn().mockResolvedValue([
    { id: 1, name: "Mécanique & Maintenance", slug: "mecanique-maintenance", description: "Test", icon: "Wrench", color: "#3b82f6", createdAt: new Date() },
    { id: 2, name: "Technologies & Innovation", slug: "technologies-innovation", description: "Test", icon: "Cpu", color: "#8b5cf6", createdAt: new Date() },
  ]),
  getCategoryBySlug: vi.fn().mockImplementation((slug: string) => {
    if (slug === "mecanique-maintenance") {
      return Promise.resolve({ id: 1, name: "Mécanique & Maintenance", slug: "mecanique-maintenance" });
    }
    return Promise.resolve(undefined);
  }),
  getAllTags: vi.fn().mockResolvedValue([
    { id: 1, name: "SAAQ", slug: "saaq", createdAt: new Date() },
    { id: 2, name: "Maintenance", slug: "maintenance", createdAt: new Date() },
  ]),
  getTagBySlug: vi.fn().mockImplementation((slug: string) => {
    if (slug === "saaq") {
      return Promise.resolve({ id: 1, name: "SAAQ", slug: "saaq" });
    }
    return Promise.resolve(undefined);
  }),
  getPublishedArticles: vi.fn().mockResolvedValue([
    { id: 1, title: "Test Article", slug: "test-article", excerpt: "Test excerpt", content: "Test content", categoryId: 1, authorId: 1, status: "published", featured: false, readTime: 5, publishedAt: new Date(), createdAt: new Date(), updatedAt: new Date() },
  ]),
  getFeaturedArticles: vi.fn().mockResolvedValue([
    { id: 1, title: "Featured Article", slug: "featured-article", excerpt: "Featured excerpt", content: "Featured content", categoryId: 1, authorId: 1, status: "published", featured: true, readTime: 5, publishedAt: new Date(), createdAt: new Date(), updatedAt: new Date() },
  ]),
  getArticleBySlug: vi.fn().mockImplementation((slug: string) => {
    if (slug === "test-article") {
      return Promise.resolve({ id: 1, title: "Test Article", slug: "test-article", excerpt: "Test excerpt", content: "Test content", categoryId: 1, authorId: 1, status: "published", featured: false, readTime: 5, publishedAt: new Date(), createdAt: new Date(), updatedAt: new Date() });
    }
    return Promise.resolve(undefined);
  }),
  getArticleTags: vi.fn().mockResolvedValue([{ id: 1, name: "SAAQ", slug: "saaq" }]),
  getUserById: vi.fn().mockResolvedValue({ id: 1, name: "Test Author" }),
  subscribeToNewsletter: vi.fn().mockResolvedValue({ id: 1, email: "test@example.com", isActive: true }),
  unsubscribeFromNewsletter: vi.fn().mockResolvedValue(undefined),
  getSubscriberCount: vi.fn().mockResolvedValue(10),
  getAllSubscribers: vi.fn().mockResolvedValue([{ id: 1, email: "test@example.com", isActive: true }]),
  getAllArticles: vi.fn().mockResolvedValue([
    { id: 1, title: "Test Article", slug: "test-article", excerpt: "Test excerpt", content: "Test content", categoryId: 1, authorId: 1, status: "published", featured: false, readTime: 5, publishedAt: new Date(), createdAt: new Date(), updatedAt: new Date() },
    { id: 2, title: "Draft Article", slug: "draft-article", excerpt: "Draft excerpt", content: "Draft content", categoryId: 1, authorId: 1, status: "draft", featured: false, readTime: 3, publishedAt: null, createdAt: new Date(), updatedAt: new Date() },
  ]),
}));

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createUserContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "regular-user",
    email: "user@example.com",
    name: "Regular User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("categories router", () => {
  it("lists all categories (public)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.categories.list();

    expect(result).toHaveLength(2);
    expect(result[0].name).toBe("Mécanique & Maintenance");
  });

  it("gets category by slug (public)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.categories.getBySlug({ slug: "mecanique-maintenance" });

    expect(result).toBeDefined();
    expect(result?.name).toBe("Mécanique & Maintenance");
  });

  it("returns undefined for non-existent category", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.categories.getBySlug({ slug: "non-existent" });

    expect(result).toBeUndefined();
  });
});

describe("tags router", () => {
  it("lists all tags (public)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.tags.list();

    expect(result).toHaveLength(2);
    expect(result[0].name).toBe("SAAQ");
  });

  it("gets tag by slug (public)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.tags.getBySlug({ slug: "saaq" });

    expect(result).toBeDefined();
    expect(result?.name).toBe("SAAQ");
  });
});

describe("articles router", () => {
  it("lists published articles (public)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.articles.list();

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Test Article");
  });

  it("gets featured articles (public)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.articles.featured();

    expect(result).toHaveLength(1);
    expect(result[0].featured).toBe(true);
  });

  it("gets article by slug with related data (public)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.articles.getBySlug({ slug: "test-article" });

    expect(result).toBeDefined();
    expect(result?.title).toBe("Test Article");
    expect(result?.tags).toHaveLength(1);
    expect(result?.author?.name).toBe("Test Author");
  });

  it("returns null for non-existent article", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.articles.getBySlug({ slug: "non-existent" });

    expect(result).toBeNull();
  });
});

describe("newsletter router", () => {
  it("allows public subscription", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.newsletter.subscribe({ email: "test@example.com" });

    expect(result.success).toBe(true);
    expect(result.message).toBe("Inscription réussie!");
  });

  it("allows public unsubscription", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.newsletter.unsubscribe({ email: "test@example.com" });

    expect(result.success).toBe(true);
  });

  it("admin can get subscriber count", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.newsletter.count();

    expect(result).toBe(10);
  });

  it("admin can list subscribers", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.newsletter.listSubscribers();

    expect(result).toHaveLength(1);
    expect(result[0].email).toBe("test@example.com");
  });

  it("non-admin cannot get subscriber count", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.newsletter.count()).rejects.toThrow("Admin access required");
  });
});

describe("admin access control", () => {
  it("non-admin cannot list all articles", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.articles.listAll()).rejects.toThrow("Admin access required");
  });

  it("admin can list all articles", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // This should not throw
    const result = await caller.articles.listAll();
    expect(result).toBeDefined();
  });

  it("unauthenticated user cannot access admin routes", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.articles.listAll()).rejects.toThrow();
  });
});
