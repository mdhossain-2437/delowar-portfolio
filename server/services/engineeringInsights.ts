type HeatmapDay = {
  date: string;
  comments: number;
  approvals: number;
};

type BranchNode = {
  name: string;
  type: "feature" | "hotfix" | "release";
  mergedInto?: string;
  aheadBy: number;
  lastCommit: string;
};

const heatmapData: HeatmapDay[] = Array.from({ length: 28 }).map((_, index) => {
  const date = new Date();
  date.setDate(date.getDate() - (27 - index));
  return {
    date: date.toISOString().split("T")[0],
    comments: Math.floor(Math.random() * 6),
    approvals: Math.floor(Math.random() * 3),
  };
});

const branchData: BranchNode[] = [
  { name: "main", type: "release", aheadBy: 0, lastCommit: "30005f0" },
  { name: "feature/edge-personalization", type: "feature", mergedInto: "main", aheadBy: 0, lastCommit: "2d1f6a0" },
  { name: "feature/gamification", type: "feature", aheadBy: 5, lastCommit: "a2b1f1c" },
  { name: "hotfix/csp", type: "hotfix", mergedInto: "main", aheadBy: 0, lastCommit: "9d0c111" },
];

export function getCodeReviewHeatmap() {
  return {
    days: heatmapData,
    summary: {
      comments: heatmapData.reduce((sum, day) => sum + day.comments, 0),
      approvals: heatmapData.reduce((sum, day) => sum + day.approvals, 0),
    },
  };
}

export function getBranchGraph() {
  return {
    updatedAt: new Date().toISOString(),
    nodes: branchData,
  };
}
