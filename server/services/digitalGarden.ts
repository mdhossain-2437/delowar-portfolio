const NOTION_BASE_URL = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

export type GardenEntry = {
  id: string;
  title: string;
  summary: string;
  url?: string;
  tags: string[];
  lastSynced: string;
};

const fallbackGarden: GardenEntry[] = [
  {
    id: "mock-automation",
    title: "Automation Blueprints",
    summary:
      "Notes from building multi-surface automation between Notion, Linear, and GitHub Actions to keep client workspaces in sync.",
    tags: ["automation", "systems thinking"],
    url: "https://www.notion.so/",
    lastSynced: new Date().toISOString(),
  },
  {
    id: "mock-ux-writing",
    title: "UX Story Beats",
    summary:
      "Progress log on weaving storytelling into scroll experiences. Covers GSAP timelines, progressive disclosure, and measuring engagement.",
    tags: ["ux", "motion"],
    url: "https://www.notion.so/",
    lastSynced: new Date().toISOString(),
  },
];

type NotionRichText = { plain_text: string }[];

const parseRichText = (richText: NotionRichText | undefined) =>
  richText?.map((t) => t.plain_text).join("") ?? "";

const parseTitle = (title: any) => parseRichText(title?.[0]?.plain_text ? [title[0]] : title);

export async function fetchGardenEntries(): Promise<GardenEntry[]> {
  const token = process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!token || !databaseId) {
    return fallbackGarden;
  }

  try {
    const response = await fetch(`${NOTION_BASE_URL}/databases/${databaseId}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        page_size: 10,
        sorts: [{ property: "Last updated", direction: "descending" }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Notion API error: ${response.status}`);
    }

    const data = (await response.json()) as any;
    return data.results.map((page: any) => {
      const properties = page.properties ?? {};
      const titleProp = properties.Name ?? properties.title;

      const tags = (properties.Tags?.multi_select ?? []).map((tag: any) => tag.name);

      return {
        id: page.id,
        title: parseTitle(titleProp?.title ?? []),
        summary: parseRichText(properties.Summary?.rich_text ?? []),
        url: page.url,
        tags,
        lastSynced: page.last_edited_time,
      } satisfies GardenEntry;
    });
  } catch (error) {
    console.warn("Notion fetch failed, falling back to mock entries:", error);
    return fallbackGarden;
  }
}
