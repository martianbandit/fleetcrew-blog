import { describe, expect, it } from "vitest";
import { ENV } from "./_core/env";

describe("API Key Configuration", () => {
  it("should have SCHEDULED_TASK_API_KEY configured", () => {
    expect(ENV.scheduledTaskApiKey).toBeDefined();
    expect(ENV.scheduledTaskApiKey).not.toBe("");
    expect(ENV.scheduledTaskApiKey.length).toBeGreaterThan(10);
  });

  it("should use SCHEDULED_TASK_API_KEY over JWT_SECRET when available", () => {
    // If SCHEDULED_TASK_API_KEY is set, it should be used
    if (process.env.SCHEDULED_TASK_API_KEY) {
      expect(ENV.scheduledTaskApiKey).toBe(process.env.SCHEDULED_TASK_API_KEY);
    }
  });
});
