type FunctionStat = {
  name: string;
  invocations: number;
  errors: number;
  avgDuration: number;
  p95Duration: number;
  region?: string;
};

type ServerlessResponse = {
  provider: string;
  windowHours: number;
  updatedAt: string;
  totals: {
    invocations: number;
    errors: number;
    avgDuration: number;
  };
  functions: FunctionStat[];
  live: boolean;
  error?: string;
};

const fallbackMetrics: ServerlessResponse = {
  provider: "vercel",
  windowHours: 24,
  updatedAt: new Date().toISOString(),
  totals: {
    invocations: 1280,
    errors: 2,
    avgDuration: 186,
  },
  functions: [
    {
      name: "api/contact",
      invocations: 320,
      errors: 0,
      avgDuration: 140,
      p95Duration: 210,
      region: "iad1",
    },
    {
      name: "api/og-image",
      invocations: 540,
      errors: 1,
      avgDuration: 220,
      p95Duration: 340,
      region: "cdg1",
    },
    {
      name: "api/auth",
      invocations: 420,
      errors: 1,
      avgDuration: 98,
      p95Duration: 150,
      region: "sin1",
    },
  ],
  live: false,
  error: "SERVERLESS_METRICS_ENDPOINT not configured - showing demo data",
};

export async function getServerlessMetrics(): Promise<ServerlessResponse> {
  const endpoint = process.env.SERVERLESS_METRICS_ENDPOINT;
  const token = process.env.SERVERLESS_METRICS_TOKEN;

  if (!endpoint) {
    return fallbackMetrics;
  }

  try {
    const res = await fetch(endpoint, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "User-Agent": "delowar-portfolio",
      },
    });

    if (!res.ok) {
      throw new Error(`Serverless metrics endpoint returned ${res.status}`);
    }

    const payload = await res.json();
    return {
      provider: payload.provider ?? "custom",
      windowHours: payload.windowHours ?? 24,
      updatedAt: payload.updatedAt ?? new Date().toISOString(),
      totals: payload.totals,
      functions: payload.functions,
      live: true,
    };
  } catch (error: any) {
    return {
      ...fallbackMetrics,
      error: error?.message ?? "Failed to fetch serverless metrics",
      live: false,
      updatedAt: new Date().toISOString(),
    };
  }
}
