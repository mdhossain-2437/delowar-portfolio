import Header from "./Header";
import { Outlet } from "react-router-dom";
import { lazy, Suspense } from "react";

const LazyFooter = lazy(() => import("@/components/Footer"));

interface MainLayoutProps {
  children?: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        {children ?? <Outlet />}
      </main>
      <Suspense fallback={<div className="w-full h-32 bg-white/5" />}>
        <LazyFooter />
      </Suspense>
    </div>
  );
}
