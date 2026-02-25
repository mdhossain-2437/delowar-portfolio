import { onCLS, onLCP, onINP, onTTFB, onFCP, type Metric } from "web-vitals";

type BudgetName = "CLS" | "LCP" | "INP" | "TTFB" | "FCP";

type PerfRecord = {
  name: BudgetName;
  value: number;
  passed: boolean;
  budget: number;
  at: number;
};

const budgets: Record<BudgetName, number> = {
  CLS: 0.12,
  LCP: 2500,
  INP: 200,
  TTFB: 600,
  FCP: 1800,
};

declare global {
  interface Window {
    __PERF_METRICS__?: PerfRecord[];
  }
}

function record(metric: Metric) {
  const name = metric.name as BudgetName;
  if (!budgets[name]) return;

  const passed = metric.value <= budgets[name];
  const entry: PerfRecord = {
    name,
    value: metric.value,
    passed,
    budget: budgets[name],
    at: Date.now(),
  };

  if (!window.__PERF_METRICS__) {
    window.__PERF_METRICS__ = [];
  }
  window.__PERF_METRICS__.push(entry);

  if (!passed && import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.warn(
      `[Performance budget] ${name} exceeded: ${metric.value.toFixed(
        2
      )} (budget ${budgets[name]})`
    );
  }
}

export function startPerformanceMonitoring(options?: { idleTimeout?: number }) {
  if (typeof window === "undefined") return;

  const schedule =
    (window as any).requestIdleCallback ||
    ((cb: () => void, opts?: { timeout?: number }) =>
      window.setTimeout(cb, opts?.timeout ?? 500));

  const cancel =
    (window as any).cancelIdleCallback ||
    ((id: number) => window.clearTimeout(id));

  const idleTimeout = options?.idleTimeout ?? 800;

  const id = schedule(
    () => {
      onCLS(record);
      onLCP(record);
      onINP(record);
      onTTFB(record);
      onFCP(record);
    },
    { timeout: idleTimeout }
  );

  return () => cancel(id as number);
}
