let storage: any;
let storageBackend = "mock";

if (process.env.DATABASE_URL) {
  const dbModule = await import("./dbStorage");
  storage = dbModule.storage;
  storageBackend = "database";
} else {
  const mockModule = await import("./mockStorage");
  storage = mockModule.storage;
  storageBackend = "mock";
  console.warn(
    "[storage] DATABASE_URL not set – falling back to in-memory mock storage. Data will not persist between runs.",
  );
}

export { storage, storageBackend };
