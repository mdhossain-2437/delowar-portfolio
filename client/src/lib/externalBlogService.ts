export interface ExternalBlogArticle {
  id: number;
  title: string;
  slug: string;
  url: string;
  description: string;
  coverImage: string | null;
  publishedAt: string;
  readTime: number;
  tags: string[];
  reactions: number;
  comments: number;
  author: {
    name: string;
    username: string;
    profileImage: string | null;
  };
}

const DEV_TO_ENDPOINT = "https://dev.to/api/articles";

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal, headers: { Accept: "application/json" } });
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function fetchExternalBlogArticles(options?: {
  tag?: string;
  perPage?: number;
  signal?: AbortSignal;
}): Promise<ExternalBlogArticle[]> {
  const { tag = "webdev", perPage = 6, signal } = options ?? {};
  const searchParams = new URLSearchParams({
    tag,
    per_page: perPage.toString(),
  });

  type DevToArticle = {
    id: number;
    title: string;
    slug: string;
    url: string;
    description: string;
    cover_image: string | null;
    published_timestamp: string;
    reading_time_minutes: number;
    tag_list: string[];
    comments_count: number;
    public_reactions_count: number;
    user: {
      name: string;
      username: string;
      profile_image: string | null;
    };
  };

  const data = await fetchJson<DevToArticle[]>(
    `${DEV_TO_ENDPOINT}?${searchParams.toString()}`,
    signal,
  );

  return data.map((article) => ({
    id: article.id,
    title: article.title,
    slug: article.slug,
    url: article.url,
    description: article.description,
    coverImage: article.cover_image,
    publishedAt: article.published_timestamp,
    readTime: article.reading_time_minutes,
    tags: Array.isArray(article.tag_list)
      ? article.tag_list
      : String(article.tag_list)
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
    reactions: article.public_reactions_count,
    comments: article.comments_count,
    author: {
      name: article.user?.name ?? article.user?.username ?? "Unknown",
      username: article.user?.username ?? "guest",
      profileImage: article.user?.profile_image ?? null,
    },
  }));
}
