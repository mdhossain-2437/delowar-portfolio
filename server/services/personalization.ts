import type { Request } from "express";

const localeConfig = [
  {
    countries: ["BD", "IN"],
    language: "bn",
    greeting: "স্বাগতম! স্থানীয় ট্রাফিককে অগ্রাধিকার দেওয়া হয়েছে।",
    message: "Bangladesh visitors see Bengali copy and Dhaka-centric case studies first.",
  },
  {
    countries: ["US", "CA", "GB", "AU"],
    language: "en",
    greeting: "Hello from the edge!",
    message: "US visitors get fast routes via CDG and IAD regions with English hero copy.",
  },
];

export function resolveEdgeProfile(req: Request) {
  const headerCountry =
    (req.headers["cf-ipcountry"] as string) ||
    (req.headers["x-vercel-ip-country"] as string) ||
    (req.headers["x-country"] as string) ||
    (req.headers["x-geo-country"] as string);

  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim();

  const matched =
    localeConfig.find((profile) =>
      profile.countries.includes((headerCountry ?? "").toUpperCase()),
    ) ?? localeConfig[1];

  return {
    country: headerCountry ?? "US",
    ip,
    primaryLanguage: matched.language,
    greeting: matched.greeting,
    message: matched.message,
    regions: headerCountry?.toUpperCase() === "BD" ? ["SIN1", "MUM1"] : ["CDG1", "IAD1"],
  };
}
