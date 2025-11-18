export type Locale = "en" | "bn";

type TranslationTree = {
  nav: Record<string, string>;
  hero: { title: string; subtitle: string };
  cta: { title: string; subtitle: string; action: string; download: string; schedule: string };
  contact: { title: string; subtitle: string };
  newsletter: { title: string; subtitle: string; placeholder: string; cta: string };
  stats: { title: string; subtitle: string; commits: string; years: string; coffee: string; uptime: string };
  bookshelf: { title: string; subtitle: string };
  uses: { title: string; subtitle: string; hardware: string; software: string };
};

export const translations: Record<Locale, TranslationTree> = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      skills: "Skills",
      projects: "Projects",
      blog: "Blog",
      contact: "Contact",
      uses: "Uses",
      timeline: "Timeline",
      achievements: "Achievements",
      stack: "Stack",
      playground: "Playground",
      tasks: "Tasks",
      guestbook: "Guestbook",
    },
    hero: {
      title: "Building expressive products that feel magical and measurable.",
      subtitle:
        "I craft AI workflows, web apps, and business OS tooling for founders who care about detail, speed, and stories.",
    },
    cta: {
      title: "Ready to start your project?",
      subtitle: "I partner with startups and agencies on fast-moving launches, audits, and R&D spikes.",
      action: "Get in touch",
      download: "Download resume",
      schedule: "Schedule call",
    },
    contact: {
      title: "Let's work together",
      subtitle: "Have a project in mind? Tell me about the problem space and ideal outcome.",
    },
    newsletter: {
      title: "Stay in the loop",
      subtitle: "Monthly note on systems, design engineering, and experiments before they hit Twitter.",
      placeholder: "you@email.com",
      cta: "Join newsletter",
    },
    stats: {
      title: "Live pulse",
      subtitle: "Signals pulled from GitHub + silly counters for a dash of personality.",
      commits: "Commits this year",
      years: "Years shipping",
      coffee: "Coffees consumed",
      uptime: "Days online",
    },
    bookshelf: {
      title: "Digital bookshelf",
      subtitle: "What I'm reading to stay dangerous across design, systems, and leadership.",
    },
    uses: {
      title: "Tools of the trade",
      subtitle: "Gear + software powering my daily build routine.",
      hardware: "Hardware",
      software: "Software",
    },
  },
  bn: {
    nav: {
      home: "হোম",
      about: "আমার সম্পর্কে",
      skills: "স্কিলস",
      projects: "প্রজেক্ট",
      blog: "ব্লগ",
      contact: "যোগাযোগ",
      uses: "আমি যা ব্যবহার করি",
      timeline: "টাইমলাইন",
      achievements: "উপলব্ধি",
      stack: "টেক স্ট্যাক",
      playground: "প্লেগ্রাউন্ড",
      tasks: "টাস্কস",
      guestbook: "গেস্টবুক",
    },
    hero: {
      title: "ম্যাজিক আর মেট্রিক্স—দুইয়ের মিশেলে প্রোডাক্ট বানাই।",
      subtitle:
        "এআই ওয়ার্কফ্লো, ওয়েব অ্যাপ এবং বিজনেস টুল ডিজাইন করি যেগুলোতে স্পিড, গল্প আর কেয়ার থাকে।",
    },
    cta: {
      title: "প্রজেক্ট শুরু করতে প্রস্তুত?",
      subtitle: "লঞ্চ, অডিট কিংবা আরঅ্যান্ডডি—দ্রুত এগোতে চাইলে আমি আপনার পাশে।",
      action: "মেসেজ করুন",
      download: "রেজুমে ডাউনলোড",
      schedule: "কল শিডিউল",
    },
    contact: {
      title: "চলুন একসাথে কাজ করি",
      subtitle: "আপনার আইডিয়া বা সমস্যার কথা জানান, সলিউশন ডিজাইন করি।",
    },
    newsletter: {
      title: "মাসিক আপডেট",
      subtitle: "নতুন শেখা টুল, টিপস আর পর্দার আড়ালের গল্প ইনবক্সে পৌছাবে।",
      placeholder: "আপনার ইমেইল",
      cta: "সাবস্ক্রাইব",
    },
    stats: {
      title: "লাইভ মেট্রিক্স",
      subtitle: "GitHub এর ডেটা + কিছু মজার কাউন্টার।",
      commits: "এই বছরের কমিট",
      years: "অভিজ্ঞতার বছর",
      coffee: "কফি গোনা",
      uptime: "অনলাইনে",
    },
    bookshelf: {
      title: "ডিজিটাল বুকশেলফ",
      subtitle: "যে বই আর কোর্সগুলো আমাকে আপডেট রাখছে।",
    },
    uses: {
      title: "আমি যা ব্যবহার করি",
      subtitle: "দৈনিক কাজের হার্ডওয়্যার + সফটওয়্যার সেটআপ।",
      hardware: "হার্ডওয়্যার",
      software: "সফটওয়্যার",
    },
  },
};

export function translate(locale: Locale, path: string): string {
  const parts = path.split(".");
  let current: any = translations[locale];
  for (const part of parts) {
    current = current?.[part];
    if (current === undefined || current === null) {
      const fallbackParts = path.split(".");
      let fallback: any = translations.en;
      for (const fb of fallbackParts) {
        fallback = fallback?.[fb];
        if (fallback === undefined || fallback === null) break;
      }
      return typeof fallback === "string" ? fallback : path;
    }
  }
  return typeof current === "string" ? current : path;
}
