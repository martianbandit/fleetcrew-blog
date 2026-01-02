import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database functions
vi.mock("./db", () => ({
  createContactMessage: vi.fn().mockResolvedValue({
    id: 1,
    name: "Test User",
    email: "test@example.com",
    subject: "Test Subject",
    message: "This is a test message for the contact form.",
    type: "demande",
    status: "nouveau",
    createdAt: new Date(),
  }),
  getAllContactMessages: vi.fn().mockResolvedValue([
    {
      id: 1,
      name: "Test User",
      email: "test@example.com",
      subject: "Test Subject",
      message: "This is a test message.",
      type: "demande",
      status: "nouveau",
      createdAt: new Date(),
    },
  ]),
  updateContactMessageStatus: vi.fn().mockResolvedValue(undefined),
  getNewContactMessagesCount: vi.fn().mockResolvedValue(5),
  getArticlesForRSS: vi.fn().mockResolvedValue([
    {
      id: 1,
      title: "Test Article",
      slug: "test-article",
      excerpt: "This is a test article excerpt.",
      content: "Full content of the test article.",
      publishedAt: new Date(),
      authorId: 1,
    },
  ]),
  // Include other mocked functions that might be called
  getAllCategories: vi.fn().mockResolvedValue([]),
  getAllTags: vi.fn().mockResolvedValue([]),
  getPublishedArticles: vi.fn().mockResolvedValue([]),
  getFeaturedArticles: vi.fn().mockResolvedValue([]),
  getAllArticles: vi.fn().mockResolvedValue([]),
  getAllSubscribers: vi.fn().mockResolvedValue([]),
  getSubscriberCount: vi.fn().mockResolvedValue(0),
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

describe("contact.submit", () => {
  it("allows public users to submit contact messages", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.submit({
      name: "Test User",
      email: "test@example.com",
      subject: "Test Subject",
      message: "This is a test message for the contact form.",
      type: "demande",
    });

    expect(result).toEqual({
      success: true,
      message: "Message envoyé avec succès!",
    });
  });

  it("validates email format", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.contact.submit({
        name: "Test User",
        email: "invalid-email",
        subject: "Test Subject",
        message: "This is a test message for the contact form.",
        type: "demande",
      })
    ).rejects.toThrow();
  });

  it("requires minimum message length", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.contact.submit({
        name: "Test User",
        email: "test@example.com",
        subject: "Test Subject",
        message: "Short",
        type: "demande",
      })
    ).rejects.toThrow();
  });
});

describe("contact.list (admin only)", () => {
  it("allows admin to list contact messages", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.list();

    expect(Array.isArray(result)).toBe(true);
  });

  it("denies regular users access to contact list", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.contact.list()).rejects.toThrow("Admin access required");
  });

  it("denies public users access to contact list", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.contact.list()).rejects.toThrow("Please login");
  });
});

describe("contact.updateStatus (admin only)", () => {
  it("allows admin to update message status", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.updateStatus({
      id: 1,
      status: "lu",
    });

    expect(result).toEqual({ success: true });
  });

  it("denies regular users from updating status", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.contact.updateStatus({
        id: 1,
        status: "lu",
      })
    ).rejects.toThrow("Admin access required");
  });
});

describe("contact.newCount (admin only)", () => {
  it("allows admin to get new messages count", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.newCount();

    expect(typeof result).toBe("number");
    expect(result).toBe(5);
  });

  it("denies regular users access to new count", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.contact.newCount()).rejects.toThrow("Admin access required");
  });
});

describe("rss.feed", () => {
  it("returns articles for RSS feed (public access)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.rss.feed();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty("title");
    expect(result[0]).toHaveProperty("slug");
    expect(result[0]).toHaveProperty("excerpt");
  });
});
