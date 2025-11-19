const fallbackRuns = [
  {
    id: "offline-1",
    name: "Deploy main",
    status: "completed",
    conclusion: "success",
    commit: "30005f0",
    url: "https://github.com/mdhossain-2437/delowar-portfolio/actions",
    startedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    durationSeconds: 86,
  },
  {
    id: "offline-2",
    name: "API smoke tests",
    status: "completed",
    conclusion: "success",
    commit: "2d1f6a0",
    url: "https://github.com/mdhossain-2437/delowar-portfolio/actions",
    startedAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    durationSeconds: 41,
  },
  {
    id: "offline-3",
    name: "Preview deploy",
    status: "completed",
    conclusion: "failure",
    commit: "a8a4efc",
    url: "https://github.com/mdhossain-2437/delowar-portfolio/actions",
    startedAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    durationSeconds: 55,
  },
];

type WorkflowRun = (typeof fallbackRuns)[number];

type WorkflowResponse = {
  provider: "github";
  repo: string;
  branch: string;
  runs: WorkflowRun[];
  live: boolean;
  fetchedAt: string;
  error?: string;
};

export async function getWorkflowRuns(): Promise<WorkflowResponse> {
  const repo = process.env.CI_REPO || "mdhossain-2437/delowar-portfolio";
  const branch = process.env.CI_BRANCH || "main";
  const token = process.env.GITHUB_ACTIONS_TOKEN;
  const url = `https://api.github.com/repos/${repo}/actions/runs?per_page=5&branch=${branch}`;

  if (!token) {
    return {
      provider: "github",
      repo,
      branch,
      runs: fallbackRuns,
      live: false,
      fetchedAt: new Date().toISOString(),
      error: "GITHUB_ACTIONS_TOKEN missing - using fallback log",
    };
  }

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "delowar-portfolio",
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}`);
    }

    const json = await response.json();
    const runs: WorkflowRun[] = json.workflow_runs.slice(0, 4).map((run: any) => ({
      id: String(run.id),
      name: run.name ?? run.display_title ?? "Workflow run",
      status: run.status,
      conclusion: run.conclusion,
      commit: run.head_commit?.id?.slice(0, 7) ?? "unknown",
      url: run.html_url,
      startedAt: run.run_started_at ?? run.created_at,
      durationSeconds: run.run_started_at
        ? Math.max(
            1,
            Math.round(
              (new Date(run.updated_at).getTime() -
                new Date(run.run_started_at).getTime()) /
                1000,
            ),
          )
        : 0,
    }));

    return {
      provider: "github",
      repo,
      branch,
      runs,
      live: true,
      fetchedAt: new Date().toISOString(),
    };
  } catch (error: any) {
    return {
      provider: "github",
      repo,
      branch,
      runs: fallbackRuns,
      live: false,
      fetchedAt: new Date().toISOString(),
      error: error?.message ?? "Failed to fetch GitHub workflow runs",
    };
  }
}
