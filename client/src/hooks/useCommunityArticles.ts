import { useQuery } from "@tanstack/react-query";
import {
  ExternalBlogArticle,
  fetchExternalBlogArticles,
} from "@/lib/externalBlogService";

export function useCommunityArticles(tag = "webdev") {
  return useQuery<ExternalBlogArticle[], Error>({
    queryKey: ["community-articles", tag],
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    queryFn: ({ signal }) => fetchExternalBlogArticles({ tag, signal }),
  });
}
