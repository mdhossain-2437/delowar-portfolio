import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const importLog = async () => {
  vi.resetModules();
  return import("../../server/vite");
};

describe("server log helper", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("does not emit in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const spy = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const { log } = await importLog();
    log("hidden", "test");
    expect(spy).not.toHaveBeenCalled();
  });

  it("emits in development", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const spy = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const { log } = await importLog();
    log("visible", "test");
    expect(spy).toHaveBeenCalledOnce();
    const message = spy.mock.calls[0]?.[0] as string;
    expect(message).toMatch(/test/);
  });
});
