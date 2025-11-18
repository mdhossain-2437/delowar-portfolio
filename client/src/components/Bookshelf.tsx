import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";

const books = [
  {
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    cover: "https://images-na.ssl-images-amazon.com/images/I/81kqrwS1nNL.jpg",
    rating: 5,
    note: "Re-read sections on event streams to architect async automations.",
  },
  {
    title: "Refactoring UI",
    author: "Adam Wathan & Steve Schoger",
    cover: "https://refactoringui.com/book-cover.jpg",
    rating: 4,
    note: "Applied the visual hierarchy patterns to the mission control dashboard.",
  },
  {
    title: "The Manager's Path",
    author: "Camille Fournier",
    cover: "https://m.media-amazon.com/images/I/61R0YwPwV-L._SL1200_.jpg",
    rating: 4,
    note: "Using the leadership chapters to mentor a small async engineering crew.",
  },
];

export default function Bookshelf() {
  const t = useTranslation();

  return (
    <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">
            {t("bookshelf.title")}
          </p>
          <p className="text-muted-foreground">{t("bookshelf.subtitle")}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {books.map((book, index) => (
            <motion.article
              key={book.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur space-y-4"
            >
              <img
                src={book.cover}
                alt={`${book.title} cover`}
                className="w-full h-48 object-cover rounded-2xl border border-white/10"
              />
              <div>
                <h3 className="text-xl font-semibold text-white">{book.title}</h3>
                <p className="text-sm text-muted-foreground">{book.author}</p>
              </div>
              <div className="flex items-center gap-1 text-amber-400 text-sm">
                {"★".repeat(book.rating)}
              </div>
              <p className="text-sm text-muted-foreground">{book.note}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
